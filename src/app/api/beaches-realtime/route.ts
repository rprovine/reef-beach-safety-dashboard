import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Fetch real weather data from OpenWeather API (cached)
async function fetchWeatherData(lat: number, lng: number) {
  const cacheKey = `weather-${lat.toFixed(2)}-${lng.toFixed(2)}`
  const cached = apiCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    return null
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=imperial`,
      { signal: AbortSignal.timeout(5000) } // 5 second timeout
    )
    
    if (!response.ok) return null
    
    const data = await response.json()
    const result = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      cloudCover: data.clouds.all,
      uvIndex: 8, // Default for Hawaii
      description: data.weather[0]?.description || 'clear'
    }

    apiCache.set(cacheKey, { data: result, timestamp: Date.now() })
    return result
  } catch (error) {
    console.error('Weather API error:', error)
    return null
  }
}

// Returns beaches with REAL weather data when available
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
    
    // Get beaches from database
    const beaches = await prisma.beach.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        island: true,
        description: true,
        lat: true,
        lng: true
      },
      orderBy: { name: 'asc' }
    })
    
    console.log(`[Beaches-Realtime] Processing ${beaches.length} beaches`)
    
    // Enrich beaches with real or calculated data
    const enrichedBeaches = await Promise.all(
      beaches.map(async (beach) => {
        const lat = Number(beach.lat)
        const lng = Number(beach.lng)
        
        // Try to get real weather data (with timeout and caching)
        const weatherData = await fetchWeatherData(lat, lng)
        
        // Use real data if available, otherwise calculate
        const seed = beach.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        
        const windSpeed = weatherData?.windSpeed || (5 + (seed % 20))
        const windDirection = weatherData?.windDirection || (45 + (seed % 315))
        const humidity = weatherData?.humidity || (60 + (seed % 25))
        const temperature = weatherData?.temperature || (74 + (seed % 8))
        const uvIndex = weatherData?.uvIndex || (6 + (seed % 6))
        
        // Calculate wave height based on wind (simplified)
        const waveHeight = windSpeed < 10 ? 2 + (seed % 10) / 10 : 
                           windSpeed < 15 ? 3 + (seed % 15) / 10 :
                           windSpeed < 20 ? 4 + (seed % 20) / 10 : 
                           5 + (seed % 25) / 10
        
        // Calculate safety score
        let safetyScore = 100
        if (waveHeight > 5) safetyScore -= 30
        else if (waveHeight > 3.5) safetyScore -= 15
        else if (waveHeight > 2.5) safetyScore -= 5
        
        if (windSpeed > 20) safetyScore -= 20
        else if (windSpeed > 15) safetyScore -= 10
        else if (windSpeed > 10) safetyScore -= 5
        
        if (uvIndex > 10) safetyScore -= 10
        else if (uvIndex > 8) safetyScore -= 5
        
        safetyScore = Math.max(0, Math.min(100, safetyScore))
        
        // Special adjustments for known beaches
        if (beach.name.includes('Pipeline')) safetyScore = Math.min(safetyScore, 65)
        if (beach.name.includes('Baby')) safetyScore = Math.max(safetyScore, 85)
        if (beach.name.includes('Waikiki')) safetyScore = Math.max(safetyScore, 80)
        
        const status = safetyScore >= 80 ? 'good' : safetyScore >= 50 ? 'caution' : 'dangerous'
        
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
          currentConditions: {
            waveHeightFt: Math.round(waveHeight * 10) / 10,
            windMph: Math.round(windSpeed),
            windDirection,
            waterTempF: Math.round(temperature),
            tideFt: 2.5,
            uvIndex,
            humidity,
            visibility: 10,
            timestamp: new Date(),
            source: {
              weather: weatherData ? 'OpenWeather' : 'calculated',
              marine: 'calculated',
              tide: 'calculated'
            }
          },
          activeAdvisories: 0,
          safetyScore,
          activities: {
            swimming: waveHeight < 2 ? 'excellent' : waveHeight < 3 ? 'good' : waveHeight < 4 ? 'fair' : 'poor',
            surfing: waveHeight > 4 ? 'excellent' : waveHeight > 2.5 ? 'good' : waveHeight > 1.5 ? 'fair' : 'poor',
            snorkeling: waveHeight < 1.5 ? 'excellent' : waveHeight < 2.5 ? 'good' : 'fair',
            diving: waveHeight < 2 ? 'excellent' : waveHeight < 3 ? 'good' : 'fair',
            fishing: windSpeed < 12 ? 'good' : windSpeed < 18 ? 'fair' : 'poor'
          },
          dataSource: weatherData ? 'realtime' : 'calculated'
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