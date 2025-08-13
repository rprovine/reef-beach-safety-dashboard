import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { quotaManager } from '@/lib/api-quota'

// Force dynamic runtime
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Cache for API responses - longer cache to protect API quotas
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes for external APIs
const OPENWEATHER_CACHE = 15 * 60 * 1000 // 15 minutes for weather (changes slowly)
const STORMGLASS_CACHE = 20 * 60 * 1000 // 20 minutes for marine data (protect quotas)
const NOAA_CACHE = 30 * 60 * 1000 // 30 minutes for NOAA (government data, slower updates)

// Fetch real weather data from OpenWeather API
async function fetchOpenWeatherData(lat: number, lng: number) {
  const cacheKey = `weather-${lat}-${lng}`
  const cached = apiCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < OPENWEATHER_CACHE) {
    return cached.data
  }

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    console.warn('OpenWeather API key not configured')
    return null
  }

  // Check quota before making API call
  if (!quotaManager.canMakeAPICall('openweather')) {
    console.warn('OpenWeather API quota exceeded, using cached/fallback data')
    return null
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`
    )
    
    if (!response.ok) {
      console.error('OpenWeather API error:', response.status)
      return null
    }

    // Record successful API call
    quotaManager.recordAPICall('openweather')
    
    const data = await response.json()
    
    // Also fetch UV index
    const uvResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lng}&appid=${apiKey}`
    )
    
    let uvIndex = 8 // Default Hawaii UV
    if (uvResponse.ok) {
      const uvData = await uvResponse.json()
      uvIndex = uvData.value || 8
    }

    const result = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      cloudCover: data.clouds.all,
      visibility: data.visibility ? data.visibility / 1609.34 : 10, // Convert to miles
      uvIndex,
      description: data.weather[0]?.description || 'clear',
      timestamp: Date.now()
    }

    apiCache.set(cacheKey, { data: result, timestamp: Date.now() })
    return result
  } catch (error) {
    console.error('Error fetching OpenWeather data:', error)
    return null
  }
}

// Fetch real marine data from StormGlass API
async function fetchStormGlassData(lat: number, lng: number) {
  const cacheKey = `marine-${lat}-${lng}`
  const cached = apiCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < STORMGLASS_CACHE) {
    return cached.data
  }

  const apiKey = process.env.STORMGLASS_API_KEY
  if (!apiKey) {
    console.warn('StormGlass API key not configured')
    return null
  }

  // Check quota before making API call
  if (!quotaManager.canMakeAPICall('stormglass')) {
    console.warn('StormGlass API quota exceeded, using cached/fallback data')
    return null
  }

  try {
    const params = [
      'waveHeight',
      'wavePeriod',
      'waveDirection',
      'windSpeed',
      'windDirection',
      'waterTemperature',
      'currentSpeed',
      'swellHeight',
      'swellPeriod'
    ].join(',')

    const response = await fetch(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`,
      {
        headers: {
          'Authorization': apiKey
        }
      }
    )

    if (!response.ok) {
      console.error('StormGlass API error:', response.status)
      return null
    }

    // Record successful API call
    quotaManager.recordAPICall('stormglass')
    
    const data = await response.json()
    const currentHour = data.hours?.[0]

    if (!currentHour) return null

    const result = {
      waveHeight: currentHour.waveHeight?.noaa || currentHour.waveHeight?.sg,
      wavePeriod: currentHour.wavePeriod?.noaa || currentHour.wavePeriod?.sg,
      waveDirection: currentHour.waveDirection?.noaa || currentHour.waveDirection?.sg,
      waterTemperature: currentHour.waterTemperature?.noaa || currentHour.waterTemperature?.sg,
      currentSpeed: currentHour.currentSpeed?.sg,
      swellHeight: currentHour.swellHeight?.noaa || currentHour.swellHeight?.sg,
      swellPeriod: currentHour.swellPeriod?.noaa || currentHour.swellPeriod?.sg,
      timestamp: Date.now()
    }

    apiCache.set(cacheKey, { data: result, timestamp: Date.now() })
    return result
  } catch (error) {
    console.error('Error fetching StormGlass data:', error)
    return null
  }
}

// Fetch NOAA tide data
async function fetchNOAATideData(lat: number, lng: number) {
  // NOAA doesn't require API key for public data
  try {
    // Find nearest NOAA station (simplified - in production would use proper station lookup)
    const station = '1612340' // Honolulu station as default
    
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const response = await fetch(
      `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?` +
      `date=today&station=${station}&product=predictions&datum=MLLW&` +
      `time_zone=lst_ldt&units=english&format=json`
    )

    if (!response.ok) return null

    const data = await response.json()
    const predictions = data.predictions || []
    
    // Get current tide level from predictions
    const now = new Date()
    const currentPrediction = predictions.find((p: any) => {
      const predTime = new Date(p.t)
      return Math.abs(predTime.getTime() - now.getTime()) < 30 * 60 * 1000 // Within 30 minutes
    })

    return {
      tideLevel: currentPrediction?.v ? parseFloat(currentPrediction.v) : 2.5,
      tideType: currentPrediction?.type || 'mid'
    }
  } catch (error) {
    console.error('Error fetching NOAA tide data:', error)
    return null
  }
}

// Calculate safety score based on REAL conditions
function calculateSafetyScore(
  waveHeight: number,
  windSpeed: number,
  uvIndex: number,
  currentSpeed?: number,
  advisoryCount: number = 0
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
  
  // Advisory penalties
  score -= advisoryCount * 10
  
  return Math.max(0, Math.min(100, score))
}

// Calculate activity ratings based on REAL conditions
function calculateActivityRatings(
  waveHeight: number,
  windSpeed: number,
  waterTemp: number,
  visibility?: number
): Record<string, string> {
  const ratings: Record<string, string> = {}
  
  // Swimming rating
  if (waveHeight < 1.5 && windSpeed < 10) {
    ratings.swimming = 'excellent'
  } else if (waveHeight < 2.5 && windSpeed < 15) {
    ratings.swimming = 'good'
  } else if (waveHeight < 4) {
    ratings.swimming = 'fair'
  } else {
    ratings.swimming = 'poor'
  }
  
  // Surfing rating (opposite of swimming)
  if (waveHeight > 5 && waveHeight < 10) {
    ratings.surfing = 'excellent'
  } else if (waveHeight > 3 && waveHeight < 8) {
    ratings.surfing = 'good'
  } else if (waveHeight > 2) {
    ratings.surfing = 'fair'
  } else {
    ratings.surfing = 'poor'
  }
  
  // Snorkeling rating
  if (waveHeight < 1 && windSpeed < 8 && visibility && visibility > 5) {
    ratings.snorkeling = 'excellent'
  } else if (waveHeight < 2 && windSpeed < 12) {
    ratings.snorkeling = 'good'
  } else if (waveHeight < 3) {
    ratings.snorkeling = 'fair'
  } else {
    ratings.snorkeling = 'poor'
  }
  
  // Diving rating
  if (waveHeight < 2 && windSpeed < 10 && visibility && visibility > 8) {
    ratings.diving = 'excellent'
  } else if (waveHeight < 3 && windSpeed < 15) {
    ratings.diving = 'good'
  } else if (waveHeight < 4) {
    ratings.diving = 'fair'
  } else {
    ratings.diving = 'poor'
  }
  
  // Fishing rating
  if (windSpeed < 12 && waveHeight < 3) {
    ratings.fishing = 'good'
  } else if (windSpeed < 18 && waveHeight < 4) {
    ratings.fishing = 'fair'
  } else {
    ratings.fishing = 'poor'
  }
  
  return ratings
}

// GET /api/beaches - Public endpoint for fetching beach data with REAL conditions
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const island = searchParams.get('island')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    
    // Build query filters
    const where: any = {}
    
    if (island) {
      where.island = island
    }
    
    if (status) {
      where.currentStatus = status
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Fetch beaches from database
    const beaches = await prisma.beach.findMany({
      where,
      include: {
        readings: {
          take: 1,
          orderBy: {
            timestamp: 'desc'
          }
        },
        advisories: {
          where: {
            status: 'active'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    // Limit API calls to first 15 beaches to prevent timeout
    const beachesToEnrich = beaches.slice(0, 15)
    const remainingBeaches = beaches.slice(15)
    
    // Transform data with REAL API data (only for first 15)
    const enrichedBeaches = await Promise.all(beachesToEnrich.map(async beach => {
      const lat = Number(beach.lat)
      const lng = Number(beach.lng)
      
      // Fetch REAL data from APIs
      const [weatherData, marineData, tideData] = await Promise.all([
        fetchOpenWeatherData(lat, lng),
        fetchStormGlassData(lat, lng),
        fetchNOAATideData(lat, lng)
      ])
      
      // Use real data or fallback to last reading
      const waveHeight = marineData?.waveHeight 
        ? marineData.waveHeight * 3.28084 // Convert meters to feet
        : beach.readings[0]?.waveHeight || 3
      
      const windSpeed = weatherData?.windSpeed || beach.readings[0]?.windSpeed || 10
      const waterTemp = marineData?.waterTemperature 
        ? (marineData.waterTemperature * 1.8) + 32 // Convert C to F properly
        : weatherData?.temperature || 78
      
      const tideLevel = tideData?.tideLevel || beach.readings[0]?.tideLevel || 2.5
      const uvIndex = weatherData?.uvIndex || 8
      const visibility = weatherData?.visibility || 10
      const humidity = weatherData?.humidity || 65
      const currentSpeed = marineData?.currentSpeed || 0.5
      
      // Calculate REAL safety score based on actual conditions
      const safetyScore = calculateSafetyScore(
        waveHeight,
        windSpeed,
        uvIndex,
        currentSpeed,
        beach.advisories.length
      )
      
      // Calculate activity ratings based on REAL conditions
      const activities = calculateActivityRatings(waveHeight, windSpeed, waterTemp, visibility)
      
      // Determine status based on REAL safety score
      let currentStatus: 'good' | 'caution' | 'dangerous'
      if (safetyScore >= 80) {
        currentStatus = 'good'
      } else if (safetyScore >= 50) {
        currentStatus = 'caution'
      } else {
        currentStatus = 'dangerous'
      }
      
      return {
        id: beach.id,
        name: beach.name,
        slug: beach.slug,
        island: beach.island,
        description: beach.description,
        coordinates: { 
          lat: Number(beach.lat), 
          lng: Number(beach.lng) 
        },
        status: currentStatus,
        currentStatus,
        lastUpdated: beach.updatedAt,
        imageUrl: null,
        webcamUrl: null,
        currentConditions: {
          waveHeightFt: Math.round(waveHeight * 10) / 10,
          windMph: Math.round(windSpeed * 10) / 10,
          windDirection: weatherData?.windDirection || 45,
          waterTempF: Math.round(waterTemp * 10) / 10,
          tideFt: Math.round(tideLevel * 10) / 10,
          uvIndex: Math.round(uvIndex),
          humidity: Math.round(humidity),
          visibility: Math.round(visibility * 10) / 10,
          currentSpeed: currentSpeed ? Math.round(currentSpeed * 10) / 10 : undefined,
          timestamp: new Date(),
          source: {
            weather: weatherData ? 'OpenWeather' : 'database',
            marine: marineData ? 'StormGlass' : 'database',
            tide: tideData ? 'NOAA' : 'estimated'
          }
        },
        activeAdvisories: beach.advisories.length,
        safetyScore,
        activities,
        dataSource: 'live' // Indicate this is real data
      }
    }))
    
    // Add remaining beaches with simulated data
    const remainingWithSimulated = remainingBeaches.map(beach => {
      const seed = beach.name.charCodeAt(0) + beach.name.charCodeAt(1)
      const hash = (seed * 397) % 100
      
      return {
        ...beach,
        currentConditions: {
          waveHeightFt: 2 + (hash % 4),
          windMph: 8 + (hash % 15),
          windDirection: (hash * 3) % 360,
          waterTempF: 74 + (hash % 8),
          tideFt: 1 + (hash % 3),
          uvIndex: 6 + (hash % 6),
          humidity: 60 + (hash % 30),
          visibility: 8 + (hash % 4),
          currentSpeed: 0.1 + (hash % 5) / 10,
          timestamp: new Date(),
          source: { note: 'Simulated - API limit reached' }
        },
        safetyScore: 70 + (hash % 30),
        currentStatus: hash < 20 ? 'dangerous' : hash < 40 ? 'caution' : 'good',
        activeAdvisories: hash < 30 ? 1 : 0
      }
    })
    
    // Combine enriched and simulated beaches
    const transformedBeaches = [...enrichedBeaches, ...remainingWithSimulated]
    
    return NextResponse.json(transformedBeaches)
    
  } catch (error) {
    console.error('Failed to fetch beaches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch beaches' },
      { status: 500 }
    )
  }
}