import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    
    // Transform data for frontend
    const transformedBeaches = beaches.map(beach => ({
      id: beach.id,
      name: beach.name,
      slug: beach.slug,
      island: beach.island,
      description: beach.description,
      coordinates: { 
        lat: Number(beach.lat), 
        lng: Number(beach.lng) 
      },
      status: 'good', // Default status - this should match Beach interface
      currentStatus: 'good', // Legacy field
      lastUpdated: beach.updatedAt,
      imageUrl: null, // Beach images would need to be added to schema
      webcamUrl: null, // Webcam URLs would need to be added to schema
      currentConditions: beach.readings[0] || null,
      activeAdvisories: beach.advisories.length
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