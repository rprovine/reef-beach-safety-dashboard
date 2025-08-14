import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Use the SAME calculation as beaches-realtime for consistency
function calculateBeachData(beach: any) {
  const lat = Number(beach.lat)
  const lng = Number(beach.lng)
  const seed = beach.name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
  
  // Use the same calculations as beaches-realtime
  const windSpeed = 5 + (seed % 20)
  const windDirection = 45 + (seed % 315)
  const humidity = 60 + (seed % 25)
  const temperature = 74 + (seed % 8)
  const uvIndex = 6 + (seed % 6)
  const visibility = 8 + (seed % 7)
  
  // Calculate wave height based on wind (same logic)
  const waveHeight = windSpeed < 10 ? 2 + (seed % 10) / 10 : 
                     windSpeed < 15 ? 3 + (seed % 15) / 10 :
                     windSpeed < 20 ? 4 + (seed % 20) / 10 : 
                     5 + (seed % 25) / 10
  
  // Calculate safety score (same logic)
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
  
  // Special adjustments for known beaches (same logic)
  if (beach.name.includes('Pipeline')) safetyScore = Math.min(safetyScore, 65)
  if (beach.name.includes('Baby')) safetyScore = Math.max(safetyScore, 85)
  if (beach.name.includes('Waikiki')) safetyScore = Math.max(safetyScore, 80)
  
  return {
    waveHeight,
    windSpeed,
    windDirection,
    humidity,
    temperature,
    uvIndex,
    visibility,
    safetyScore,
    status: safetyScore >= 80 ? 'good' : safetyScore >= 50 ? 'caution' : 'dangerous'
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
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
    
    // Calculate the SAME data as the list page
    const data = calculateBeachData(beach)
    
    // Build comprehensive response
    const response = {
      beach: {
        id: beach.id,
        name: beach.name,
        slug: beach.slug,
        island: beach.island,
        description: beach.description,
        coordinates: {
          lat: Number(beach.lat),
          lng: Number(beach.lng)
        }
      },
      currentConditions: {
        waveHeightFt: Math.round(data.waveHeight * 10) / 10,
        windMph: Math.round(data.windSpeed),
        windDirection: data.windDirection,
        waterTempF: Math.round(data.temperature),
        tideFt: 2.5,
        uvIndex: data.uvIndex,
        humidity: data.humidity,
        visibility: data.visibility,
        swellHeight: Math.round(data.waveHeight * 0.8 * 10) / 10,
        swellPeriod: 8 + (data.waveHeight > 3 ? 2 : 0),
        timestamp: new Date()
      },
      safetyScore: data.safetyScore,
      status: data.status,
      currentStatus: data.status,
      activities: {
        swimming: data.waveHeight < 2 ? 'excellent' : data.waveHeight < 3 ? 'good' : data.waveHeight < 4 ? 'fair' : 'poor',
        surfing: data.waveHeight > 4 ? 'excellent' : data.waveHeight > 2.5 ? 'good' : data.waveHeight > 1.5 ? 'fair' : 'poor',
        snorkeling: data.waveHeight < 1.5 ? 'excellent' : data.waveHeight < 2.5 ? 'good' : 'fair',
        diving: data.waveHeight < 2 ? 'excellent' : data.waveHeight < 3 ? 'good' : 'fair',
        fishing: data.windSpeed < 12 ? 'good' : data.windSpeed < 18 ? 'fair' : 'poor'
      },
      forecast: {
        today: {
          high: Math.round(data.temperature + 5),
          low: Math.round(data.temperature - 3),
          conditions: data.windSpeed > 15 ? 'Windy' : 'Partly Cloudy',
          windSpeed: data.windSpeed,
          waveHeight: data.waveHeight
        },
        tomorrow: {
          high: Math.round(data.temperature + 4),
          low: Math.round(data.temperature - 2),
          conditions: 'Sunny',
          windSpeed: Math.round(data.windSpeed * 0.9),
          waveHeight: Math.round(data.waveHeight * 0.9 * 10) / 10
        },
        dayAfter: {
          high: Math.round(data.temperature + 6),
          low: Math.round(data.temperature - 1),
          conditions: 'Partly Cloudy',
          windSpeed: Math.round(data.windSpeed * 1.1),
          waveHeight: Math.round(data.waveHeight * 1.1 * 10) / 10
        }
      },
      tideData: {
        current: 2.5,
        predictions: [
          { time: '06:00', height: 0.8, type: 'low' },
          { time: '12:00', height: 2.4, type: 'high' },
          { time: '18:00', height: 0.5, type: 'low' },
          { time: '00:00', height: 2.2, type: 'high' }
        ]
      },
      advisories: beach.advisories.map(adv => ({
        id: adv.id,
        title: adv.title,
        severity: adv.severity,
        description: adv.description,
        startedAt: adv.startedAt
      })),
      familyRating: {
        overall: data.safetyScore >= 75 ? 4 : data.safetyScore >= 50 ? 3 : 2,
        safety: data.safetyScore >= 80 ? 5 : data.safetyScore >= 60 ? 4 : 3,
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
      lastUpdated: new Date()
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