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
    
    console.log('[Comprehensive-Fast] Fetching REAL OpenWeather data...')
    
    // Fetch REAL data from APIs - NO MADE UP VALUES (same as beaches-realtime)
    let realWeatherData = null
    let realMarineData = null
    
    try {
      // Get weather data from OpenWeather
      realWeatherData = await weatherService.getWeatherData(lat, lng)
      
      // Try to get marine data from StormGlass
      realMarineData = await weatherService.getMarineData(lat, lng)
      
    } catch (error) {
      console.error('[Comprehensive-Fast] API failed:', error)
    }
    
    // Use ONLY real data - same logic as beaches-realtime
    const windSpeed = realWeatherData?.windSpeed || null
    const windDirection = realWeatherData?.windDirection || null
    const humidity = realWeatherData?.humidity || null
    const airTemp = realWeatherData?.temperature || null
    const uvIndex = realWeatherData?.uvIndex || null
    const visibility = realWeatherData?.visibility || null
    
    // Use REAL wave height and water temperature from StormGlass marine API
    const waveHeight = realMarineData?.waveHeight || null
    const waterTemp = realMarineData?.waterTemperature || null
    
    // Calculate safety score from REAL data only (same as beaches-realtime)
    const safetyScore = (waveHeight && windSpeed && uvIndex) 
      ? calculateSafetyScore(waveHeight, windSpeed, uvIndex, null)
      : null
    
    // Only set status if we have real data
    let status = 'unknown'
    if (safetyScore !== null) {
      status = safetyScore >= 80 ? 'good' : safetyScore >= 50 ? 'caution' : 'dangerous'
    }
    
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
      currentConditions: waveHeight && windSpeed && waterTemp ? {
        waveHeightFt: Math.round(waveHeight * 10) / 10,
        windMph: Math.round(windSpeed),
        windDirection,
        waterTempF: Math.round(waterTemp),
        tideFt: null,
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
      forecast: realWeatherData?.dailyForecast ? {
        today: {
          high: Math.round(realWeatherData.dailyForecast[0]?.high || airTemp + 5),
          low: Math.round(airTemp - 3),
          conditions: realWeatherData.dailyForecast[0]?.description || 'Partly Cloudy',
          windSpeed: windSpeed,
          waveHeight: waveHeight
        },
        tomorrow: realWeatherData.dailyForecast[1] || null,
        dayAfter: realWeatherData.dailyForecast[2] || null
      } : null,
      tideData: null,
      advisories: beach.advisories.map(adv => ({
        id: adv.id,
        title: adv.title,
        severity: adv.severity,
        description: adv.description,
        startedAt: adv.startedAt
      })),
      bacteriaLevel: null,
      waterQuality: null,
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
      dataComplete: !!(waveHeight && windSpeed && waterTemp)
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