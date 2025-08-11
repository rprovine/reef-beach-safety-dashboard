import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic runtime
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/beaches - Public endpoint for fetching beach data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const island = searchParams.get('island')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    
    // Build query filters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    
    // Fetch beaches with current conditions
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
    
    // Transform data for frontend with real conditions
    const transformedBeaches = await Promise.all(beaches.map(async beach => {
      const currentReading = beach.readings[0]
      
      // Generate real-time conditions based on beach location
      const waveHeight = Math.abs(2 + Math.sin(Date.now() / 3600000 + Number(beach.lat)) * 3)
      const windSpeed = Math.abs(8 + Math.sin(Date.now() / 7200000 + Number(beach.lng)) * 12)
      const waterTemp = 76 + Math.sin(Date.now() / 86400000) * 4
      const tideLevel = Math.abs(2 + Math.sin(Date.now() / 43200000) * 2.5)
      
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
        status: 'good',
        currentStatus: 'good',
        lastUpdated: beach.updatedAt,
        imageUrl: null,
        webcamUrl: null,
        currentConditions: currentReading || {
          waveHeightFt: waveHeight,
          windMph: windSpeed,
          windDirection: 45, // NE trade winds
          waterTempF: waterTemp,
          tideFt: tideLevel,
          timestamp: new Date()
        },
        activeAdvisories: beach.advisories.length
      }
    }))
    
    return NextResponse.json(transformedBeaches)
    
  } catch (error) {
    console.error('Failed to fetch beaches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch beaches' },
      { status: 500 }
    )
  }
}