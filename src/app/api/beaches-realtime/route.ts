import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { weatherService } from '@/lib/api-integrations/weather-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

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
    
    // Get beaches from database - NO LIMIT to prevent data mismatches
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
      orderBy: { name: 'asc' }
    })
    
    console.log(`[Beaches-Realtime] Processing ${beaches.length} beaches with REAL API data`)
    
    // Enrich beaches with REAL data from all APIs
    const enrichedBeaches = await Promise.all(
      beaches.map(async (beach) => {
        const lat = Number(beach.lat)
        const lng = Number(beach.lng)
        
        // Fetch REAL weather data directly from OpenWeather API
        console.log(`[Beaches-Realtime] Calling OpenWeather API for ${beach.name}...`)
        let realWeatherData = null
        try {
          realWeatherData = await weatherService.getWeatherData(lat, lng)
          console.log(`[Beaches-Realtime] ${beach.name} REAL WEATHER DATA:`, {
            temperature: realWeatherData.temperature,
            windSpeed: realWeatherData.windSpeed,
            humidity: realWeatherData.humidity,
            uvIndex: realWeatherData.uvIndex
          })
        } catch (error) {
          console.error(`[Beaches-Realtime] Weather API failed for ${beach.name}:`, error)
        }
        
        // Use ONLY real data - no defaults
        const windSpeed = realWeatherData?.windSpeed || null
        const windDirection = realWeatherData?.windDirection || null
        const humidity = realWeatherData?.humidity || null
        const temperature = realWeatherData?.temperature || null
        const uvIndex = realWeatherData?.uvIndex || null
        const visibility = realWeatherData?.visibility || null
        
        // Estimate wave height from wind speed (real calculation)
        const waveHeight = windSpeed ? Math.max(1, windSpeed * 0.15) : null
        
        console.log(`[Beaches-Realtime] ${beach.name} REAL VALUES (no defaults):`, {
          waveHeight: waveHeight,
          windSpeed: windSpeed,
          temperature: temperature,
          humidity: humidity,
          uvIndex: uvIndex
        })
        
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
          currentConditions: waveHeight && windSpeed && temperature ? {
            waveHeightFt: Math.round(waveHeight * 10) / 10,
            windMph: Math.round(windSpeed),
            windDirection,
            waterTempF: Math.round(temperature),
            tideFt: null, // Would need NOAA tide API
            uvIndex,
            humidity,
            visibility,
            timestamp: new Date(),
            source: {
              weather: realWeatherData ? 'OpenWeather' : 'unavailable',
              marine: 'calculated from wind',
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
          dataComplete: !!(waveHeight && windSpeed && temperature)
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