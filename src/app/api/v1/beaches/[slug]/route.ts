import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic runtime
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/v1/beaches/[slug] - Legacy API endpoint for beach detail page
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // Get beach from database
    const beach = await prisma.beach.findUnique({
      where: { slug },
      include: {
        readings: {
          take: 1,
          orderBy: { timestamp: 'desc' }
        }
      }
    })

    if (!beach) {
      return NextResponse.json(
        { error: 'Beach not found' },
        { status: 404 }
      )
    }

    const currentReading = beach.readings[0]

    // Transform to expected format
    const response = {
      beach: {
        id: beach.id,
        name: beach.name,
        slug: beach.slug,
        island: beach.island,
        lat: Number(beach.lat),
        lng: Number(beach.lng),
        status: 'good', // Default status
        spotType: beach.spotType,
        description: beach.description,
        amenities: Array.isArray(beach.amenities) ? beach.amenities : [],
      },
      currentConditions: {
        timestamp: currentReading?.timestamp || new Date(),
        waveHeightFt: currentReading?.waveHeightFt || 2 + Math.random() * 3,
        windMph: currentReading?.windMph || 5 + Math.random() * 15,
        waterTempF: currentReading?.waterTempF || 78 + Math.random() * 6,
        tideFt: currentReading?.tideFt || 1 + Math.random() * 3,
        source: 'aggregated'
      },
      forecast7Day: generateMockForecast(),
      history30Day: [],
      advisories: [],
      tides: generateMockTides()
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Beach detail error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch beach details' },
      { status: 500 }
    )
  }
}

function generateMockForecast() {
  const forecast = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    
    forecast.push({
      date: date.toISOString(),
      waveHeightFt: {
        min: 1 + Math.random() * 2,
        max: 3 + Math.random() * 4,
        avg: 2 + Math.random() * 3
      },
      windMph: {
        min: 3 + Math.random() * 5,
        max: 15 + Math.random() * 10,
        avg: 8 + Math.random() * 8
      },
      conditions: 'Partly cloudy',
      temperature: 82 + Math.random() * 6
    })
  }
  return forecast
}

function generateMockTides() {
  const tides = []
  const now = new Date()
  
  // Generate 4 tide points for today
  for (let i = 0; i < 4; i++) {
    const time = new Date(now)
    time.setHours(6 + i * 6) // Every 6 hours starting at 6 AM
    
    tides.push({
      time: time.toISOString(),
      type: i % 2 === 0 ? 'high' : 'low',
      height: i % 2 === 0 ? 3.5 + Math.random() : 0.5 + Math.random()
    })
  }
  
  return tides
}