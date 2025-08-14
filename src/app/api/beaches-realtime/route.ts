import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { weatherService } from '@/lib/api-integrations/weather-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Increased timeout for API calls

// Calculate safety score based on REAL conditions
function calculateSafetyScore(
  waveHeight: number,
  windSpeed: number,
  uvIndex: number,
  currentSpeed?: number
): number {
  let score = 100
  
  // Wave height penalties
  if (waveHeight > 8) score -= 40
  else if (waveHeight > 6) score -= 30
  else if (waveHeight > 4) score -= 20
  else if (waveHeight > 3) score -= 10
  else if (waveHeight > 2) score -= 5
  
  // Wind speed penalties
  if (windSpeed > 25) score -= 25
  else if (windSpeed > 20) score -= 15
  else if (windSpeed > 15) score -= 10
  else if (windSpeed > 10) score -= 5
  
  // UV index penalties
  if (uvIndex > 11) score -= 15
  else if (uvIndex > 8) score -= 10
  else if (uvIndex > 6) score -= 5
  
  // Current speed penalties
  if (currentSpeed && currentSpeed > 2) score -= 15
  else if (currentSpeed && currentSpeed > 1) score -= 10
  
  return Math.max(0, Math.min(100, score))
}

// Returns beaches with REAL data from all available APIs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const island = searchParams.get('island')
    const search = searchParams.get('search')
    
    // Build query filters
    const where: any = {}
    if (island) where.island = island
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Get beaches from database - Reasonable limit to prevent API timeout
    const fetchLimit = island || search ? 71 : 30 // Limit to 30 beaches to prevent timeout
    const beaches = await prisma.beach.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        island: true,
        description: true,
        lat: true,
        lng: true,
        advisories: {
          where: { status: 'active' },
          select: { id: true }
        }
      },
      take: fetchLimit,
      orderBy: { name: 'asc' }
    })
    
    console.log(`[Beaches-Realtime] Processing ${beaches.length} beaches with REAL API data`)
    
    // Enrich beaches with REAL data from all APIs
    const enrichedBeaches = await Promise.all(
      beaches.map(async (beach) => {
        const lat = Number(beach.lat)
        const lng = Number(beach.lng)
        
        // Fetch REAL data from APIs - NO MADE UP VALUES
        let realWeatherData = null
        let realMarineData = null
        
        try {
          // Get weather data from OpenWeather
          realWeatherData = await weatherService.getWeatherData(lat, lng)
          
          // Try to get marine data from StormGlass
          realMarineData = await weatherService.getMarineData(lat, lng)
          
        } catch (error) {
          console.error(`[Beaches-Realtime] API failed for ${beach.name}:`, error)
          // Continue processing other beaches even if one fails
        }
        
        // Use ONLY real data from APIs - if not available, use null
        const windSpeed = realWeatherData?.windSpeed || null
        const windDirection = realWeatherData?.windDirection || null  
        const humidity = realWeatherData?.humidity || null
        const airTemp = realWeatherData?.temperature || null
        const uvIndex = realWeatherData?.uvIndex || null
        const visibility = realWeatherData?.visibility || null
        
        // Use REAL wave height and water temperature from StormGlass marine API
        const waveHeight = realMarineData?.waveHeight || null
        const waterTemp = realMarineData?.waterTemperature || null
        
        // Calculate safety score from REAL data only
        const safetyScore = (waveHeight && windSpeed && uvIndex) 
          ? calculateSafetyScore(waveHeight, windSpeed, uvIndex, null)
          : null
        
        // Only set status if we have real data
        let status = 'unknown'
        if (safetyScore !== null) {
          const hasAdvisories = beach.advisories.length > 0
          const adjustedScore = hasAdvisories ? Math.min(safetyScore - 10, 70) : safetyScore
          status = adjustedScore >= 80 ? 'good' : adjustedScore >= 50 ? 'caution' : 'dangerous'
        }
        
        return {
          id: beach.id,
          name: beach.name,
          slug: beach.slug,
          island: beach.island,
          description: beach.description,
          coordinates: {
            lat,
            lng
          },
          status,
          currentStatus: status,
          lastUpdated: new Date(),
          imageUrl: null,
          webcamUrl: null,
          currentConditions: waveHeight && windSpeed && waterTemp ? {
            waveHeightFt: Math.round(waveHeight * 10) / 10,
            windMph: Math.round(windSpeed),
            windDirection,
            waterTempF: Math.round(waterTemp),
            tideFt: null, // Would need NOAA tide API
            uvIndex,
            humidity,
            visibility,
            timestamp: new Date(),
            source: {
              weather: realWeatherData ? 'OpenWeather' : 'unavailable',
              marine: realMarineData ? 'StormGlass API' : 'unavailable',
              tide: 'unavailable',
              waterQuality: 'unavailable'
            }
          } : null,
          activeAdvisories: beach.advisories.length,
          safetyScore: safetyScore,
          activities: waveHeight && windSpeed ? {
            swimming: waveHeight < 2 ? 'excellent' : waveHeight < 3 ? 'good' : waveHeight < 4 ? 'fair' : 'poor',
            surfing: waveHeight > 4 ? 'excellent' : waveHeight > 2.5 ? 'good' : waveHeight > 1.5 ? 'fair' : 'poor',
            snorkeling: waveHeight < 1.5 ? 'excellent' : waveHeight < 2.5 ? 'good' : 'fair',
            diving: waveHeight < 2 ? 'excellent' : waveHeight < 3 ? 'good' : 'fair',
            fishing: windSpeed < 12 ? 'good' : windSpeed < 18 ? 'fair' : 'poor'
          } : null,
          bacteriaLevel: null,
          dataSource: realWeatherData ? 'OpenWeather API' : 'unavailable',
          dataComplete: !!(waveHeight && windSpeed && waterTemp)
        }
      })
    )
    
    const response = NextResponse.json(enrichedBeaches)
    response.headers.set('Cache-Control', 'public, max-age=300') // Cache for 5 minutes
    
    return response
  } catch (error) {
    console.error('Beaches-realtime error:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch beaches', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}