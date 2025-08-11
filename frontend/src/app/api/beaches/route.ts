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
      coordinates: beach.coordinates,
      currentStatus: beach.currentStatus,
      lastUpdated: beach.lastUpdated,
      imageUrl: beach.imageUrl,
      webcamUrl: beach.webcamUrl,
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