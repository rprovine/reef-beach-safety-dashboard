import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { dataAggregator } from '@/services/data-aggregator'

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
    
    // Get beaches from database - LIMIT to prevent timeout with API calls
    const fetchLimit = island || search ? 50 : 15 // Only fetch 15 beaches by default
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
        
        // Fetch REAL data from all available APIs
        console.log(`[Beaches-Realtime] Calling APIs for ${beach.name}...`)
        const realData = await dataAggregator.getBeachData(beach.id, lat, lng)
        
        console.log(`[Beaches-Realtime] ${beach.name} API results:`, {
          hasWaves: !!realData.waveHeight,
          hasWind: !!realData.windSpeed, 
          hasAirTemp: !!realData.airTemp,
          hasWaterTemp: !!realData.waterTemp,
          hasTide: !!realData.currentTide,
          hasUV: !!realData.uvIndex,
          totalFields: Object.keys(realData).length
        })
        
        // Use real data where available, with sensible defaults only as last resort
        const waveHeight = realData.waveHeight || realData.swellHeight || 3
        const windSpeed = realData.windSpeed || 10
        const windDirection = realData.windDirection || 'NE'
        const humidity = realData.humidity || 70
        const temperature = realData.waterTemp || realData.airTemp || 78
        const uvIndex = realData.uvIndex || 8
        const visibility = realData.visibility || realData.waterClarity || 10
        const currentSpeed = realData.currentSpeed
        
        // Calculate safety score from REAL data
        const safetyScore = calculateSafetyScore(waveHeight, windSpeed, uvIndex, currentSpeed)
        
        // Adjust for known dangerous beaches if we have advisories
        const hasAdvisories = beach.advisories.length > 0
        const adjustedScore = hasAdvisories ? Math.min(safetyScore - 10, 70) : safetyScore
        
        const status = adjustedScore >= 80 ? 'good' : adjustedScore >= 50 ? 'caution' : 'dangerous'
        
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
          webcamUrl: realData.webcamUrls?.[0] || null,
          currentConditions: {
            waveHeightFt: Math.round(waveHeight * 10) / 10,
            windMph: Math.round(windSpeed),
            windDirection,
            waterTempF: Math.round(temperature),
            tideFt: realData.currentTide || null,
            uvIndex,
            humidity,
            visibility,
            swellHeight: realData.swellHeight || null,
            swellPeriod: realData.swellPeriod || null,
            swellDirection: realData.swellDirection || null,
            currentSpeed: realData.currentSpeed || null,
            timestamp: new Date(),
            source: {
              weather: realData.airTemp ? 'OpenWeather' : 'unavailable',
              marine: realData.waveHeight ? 'NOAA/StormGlass' : 'unavailable',
              tide: realData.currentTide ? 'NOAA' : 'unavailable',
              waterQuality: realData.bacteriaLevel ? 'DOH' : 'unavailable'
            }
          },
          activeAdvisories: beach.advisories.length,
          safetyScore: adjustedScore,
          activities: {
            swimming: waveHeight < 2 ? 'excellent' : waveHeight < 3 ? 'good' : waveHeight < 4 ? 'fair' : 'poor',
            surfing: waveHeight > 4 ? 'excellent' : waveHeight > 2.5 ? 'good' : waveHeight > 1.5 ? 'fair' : 'poor',
            snorkeling: waveHeight < 1.5 && visibility > 20 ? 'excellent' : waveHeight < 2.5 ? 'good' : 'fair',
            diving: waveHeight < 2 && visibility > 30 ? 'excellent' : waveHeight < 3 ? 'good' : 'fair',
            fishing: windSpeed < 12 ? 'good' : windSpeed < 18 ? 'fair' : 'poor'
          },
          bacteriaLevel: realData.bacteriaLevel || null,
          dataSource: realData.waveHeight || realData.airTemp ? 'realtime' : 'limited',
          dataComplete: !!(realData.waveHeight && realData.windSpeed && realData.waterTemp)
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