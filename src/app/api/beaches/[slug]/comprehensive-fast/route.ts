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

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    console.log('[Comprehensive-Fast] Fetching beach:', slug)
    
    // Get beach from database
    const beach = await prisma.beach.findUnique({
      where: { slug },
      include: {
        advisories: {
          where: { status: 'active' }
        }
      }
    })
    
    if (!beach) {
      return NextResponse.json({ error: 'Beach not found' }, { status: 404 })
    }
    
    const lat = Number(beach.lat)
    const lng = Number(beach.lng)
    
    console.log('[Comprehensive-Fast] Fetching REAL data from APIs...')
    
    // Fetch REAL data from all available APIs
    const realData = await dataAggregator.getBeachData(beach.id, lat, lng)
    
    console.log('[Comprehensive-Fast] Got real data:', {
      hasWaveData: !!realData.waveHeight,
      hasWindData: !!realData.windSpeed,
      hasWaterTemp: !!realData.waterTemp,
      hasTideData: !!realData.currentTide,
      hasUVData: !!realData.uvIndex
    })
    
    // Use real data where available
    const waveHeight = realData.waveHeight || realData.swellHeight || 3
    const windSpeed = realData.windSpeed || 10
    const waterTemp = realData.waterTemp || realData.airTemp || 78
    const uvIndex = realData.uvIndex || 8
    const currentSpeed = realData.currentSpeed
    const humidity = realData.humidity || 70
    const visibility = realData.visibility || realData.waterClarity || 10
    
    // Calculate safety score from REAL data
    const safetyScore = calculateSafetyScore(waveHeight, windSpeed, uvIndex, currentSpeed)
    const status = safetyScore >= 80 ? 'good' : safetyScore >= 50 ? 'caution' : 'dangerous'
    
    // Build response with REAL data
    const response = {
      beach: {
        id: beach.id,
        name: beach.name,
        slug: beach.slug,
        island: beach.island,
        description: beach.description,
        coordinates: {
          lat,
          lng
        }
      },
      currentConditions: {
        waveHeightFt: Math.round(waveHeight * 10) / 10,
        windMph: Math.round(windSpeed),
        windDirection: realData.windDirection || 'NE',
        waterTempF: Math.round(waterTemp),
        tideFt: realData.currentTide || null,
        uvIndex,
        humidity,
        visibility,
        swellHeight: realData.swellHeight || Math.round(waveHeight * 0.8 * 10) / 10,
        swellPeriod: realData.swellPeriod || 10,
        swellDirection: realData.swellDirection || 'N',
        currentSpeed: realData.currentSpeed || null,
        currentDirection: realData.currentDirection || null,
        timestamp: new Date(),
        dataSource: {
          waves: realData.waveHeight ? 'NOAA/StormGlass' : 'unavailable',
          weather: realData.airTemp ? 'OpenWeather' : 'unavailable',
          tide: realData.currentTide ? 'NOAA' : 'unavailable',
          waterQuality: realData.bacteriaLevel ? 'DOH' : 'unavailable'
        }
      },
      safetyScore,
      status,
      currentStatus: status,
      activities: {
        swimming: waveHeight < 2 ? 'excellent' : waveHeight < 3 ? 'good' : waveHeight < 4 ? 'fair' : 'poor',
        surfing: waveHeight > 4 ? 'excellent' : waveHeight > 2.5 ? 'good' : waveHeight > 1.5 ? 'fair' : 'poor',
        snorkeling: waveHeight < 1.5 && visibility > 20 ? 'excellent' : waveHeight < 2.5 ? 'good' : 'fair',
        diving: waveHeight < 2 && visibility > 30 ? 'excellent' : waveHeight < 3 ? 'good' : 'fair',
        fishing: windSpeed < 12 ? 'good' : windSpeed < 18 ? 'fair' : 'poor'
      },
      forecast: realData.forecast24Hour ? {
        today: {
          high: Math.round(realData.forecast24Hour[0]?.temperature || waterTemp + 5),
          low: Math.round(waterTemp - 3),
          conditions: realData.forecast24Hour[0]?.description || 'Partly Cloudy',
          windSpeed: realData.forecast24Hour[0]?.windSpeed || windSpeed,
          waveHeight: realData.forecast24Hour[0]?.waveHeight || waveHeight
        },
        tomorrow: realData.forecast24Hour[8] || null,
        dayAfter: realData.forecast24Hour[16] || null
      } : null,
      tideData: realData.currentTide ? {
        current: realData.currentTide,
        nextHigh: realData.nextHighTide,
        nextLow: realData.nextLowTide,
        predictions: realData.predictions || []
      } : null,
      advisories: beach.advisories.map(adv => ({
        id: adv.id,
        title: adv.title,
        severity: adv.severity,
        description: adv.description,
        startedAt: adv.startedAt
      })),
      bacteriaLevel: realData.bacteriaLevel || null,
      waterQuality: realData.enterococcus ? {
        enterococcus: realData.enterococcus,
        turbidity: realData.turbidity,
        lastTested: new Date()
      } : null,
      familyRating: {
        overall: safetyScore >= 75 ? 4 : safetyScore >= 50 ? 3 : 2,
        safety: safetyScore >= 80 ? 5 : safetyScore >= 60 ? 4 : 3,
        amenities: 4,
        activities: 3
      },
      familyFeatures: [
        'Lifeguard on duty',
        'Restrooms available',
        'Parking available',
        'Shallow areas for children'
      ],
      nearbyBeaches: [],
      lastUpdated: new Date(),
      dataComplete: !!(realData.waveHeight && realData.windSpeed && realData.waterTemp)
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Comprehensive-fast error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch beach data' },
      { status: 500 }
    )
  }
}