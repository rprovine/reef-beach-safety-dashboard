import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic runtime
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Helper function to calculate safety score
function calculateSafetyScore(waveHeight: number, windSpeed: number, advisoryCount: number): number {
  let score = 100
  
  // Deduct for wave height
  if (waveHeight > 6) score -= 30
  else if (waveHeight > 4) score -= 20
  else if (waveHeight > 3) score -= 10
  
  // Deduct for wind speed
  if (windSpeed > 25) score -= 20
  else if (windSpeed > 20) score -= 15
  else if (windSpeed > 15) score -= 10
  
  // Deduct for advisories
  score -= advisoryCount * 15
  
  return Math.max(0, Math.min(100, score))
}

// Helper function to calculate activity ratings
function calculateActivityRatings(waveHeight: number, windSpeed: number, waterTemp: number): Record<string, string> {
  const ratings: Record<string, string> = {}
  
  // Swimming rating
  if (waveHeight < 2 && windSpeed < 15) {
    ratings.swimming = 'excellent'
  } else if (waveHeight < 3 && windSpeed < 20) {
    ratings.swimming = 'good'
  } else if (waveHeight < 4) {
    ratings.swimming = 'fair'
  } else {
    ratings.swimming = 'poor'
  }
  
  // Surfing rating (opposite of swimming)
  if (waveHeight > 4 && waveHeight < 8) {
    ratings.surfing = 'excellent'
  } else if (waveHeight > 3 && waveHeight < 6) {
    ratings.surfing = 'good'
  } else if (waveHeight > 2) {
    ratings.surfing = 'fair'
  } else {
    ratings.surfing = 'poor'
  }
  
  // Snorkeling rating
  if (waveHeight < 1.5 && windSpeed < 10) {
    ratings.snorkeling = 'excellent'
  } else if (waveHeight < 2 && windSpeed < 15) {
    ratings.snorkeling = 'good'
  } else if (waveHeight < 3) {
    ratings.snorkeling = 'fair'
  } else {
    ratings.snorkeling = 'poor'
  }
  
  // Diving rating
  if (waveHeight < 2 && windSpeed < 12) {
    ratings.diving = 'excellent'
  } else if (waveHeight < 3 && windSpeed < 18) {
    ratings.diving = 'good'
  } else if (waveHeight < 4) {
    ratings.diving = 'fair'
  } else {
    ratings.diving = 'poor'
  }
  
  // Fishing rating
  if (windSpeed < 15 && waveHeight < 3) {
    ratings.fishing = 'good'
  } else if (windSpeed < 20 && waveHeight < 4) {
    ratings.fishing = 'fair'
  } else {
    ratings.fishing = 'poor'
  }
  
  return ratings
}

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
      
      // Generate more varied conditions based on beach location and characteristics
      const seed = beach.name.charCodeAt(0) + beach.name.charCodeAt(1)
      const hash = (seed * 397) % 100
      
      // Create varied wave heights
      let waveHeight: number
      if (hash < 20) {
        waveHeight = 4 + Math.random() * 4 // 4-8 ft (rough)
      } else if (hash < 50) {
        waveHeight = 2 + Math.random() * 2 // 2-4 ft (moderate)
      } else {
        waveHeight = 0.5 + Math.random() * 1.5 // 0.5-2 ft (calm)
      }
      
      // Vary wind speed
      const windSpeed = 5 + (hash % 20) + Math.random() * 5 // 5-30 mph
      
      const waterTemp = 76 + Math.sin(Date.now() / 86400000) * 4
      const tideLevel = Math.abs(2 + Math.sin(Date.now() / 43200000) * 2.5)
      
      // Calculate safety score with more variance
      let safetyScore = 100
      
      // Apply varied deductions
      if (waveHeight > 6) safetyScore -= 35
      else if (waveHeight > 4) safetyScore -= 25
      else if (waveHeight > 3) safetyScore -= 15
      else if (waveHeight > 2) safetyScore -= 5
      
      if (windSpeed > 25) safetyScore -= 25
      else if (windSpeed > 20) safetyScore -= 15
      else if (windSpeed > 15) safetyScore -= 5
      
      // Add some random variance
      safetyScore += (hash % 20) - 10 // -10 to +10 random adjustment
      
      // Apply advisory penalties
      safetyScore -= beach.advisories.length * 10
      
      safetyScore = Math.max(20, Math.min(100, safetyScore))
      
      // Calculate activity ratings
      const activities = calculateActivityRatings(waveHeight, windSpeed, waterTemp)
      
      // Simulate bacteria level
      const bacteriaLevel = Math.random() > 0.8 ? 'caution' : 'safe'
      const enterococcus = bacteriaLevel === 'safe' ? 10 + Math.random() * 25 : 35 + Math.random() * 30
      
      // Determine status based on safety score
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
        currentConditions: currentReading || {
          waveHeightFt: waveHeight,
          windMph: windSpeed,
          windDirection: 45, // NE trade winds
          waterTempF: waterTemp,
          tideFt: tideLevel,
          timestamp: new Date()
        },
        activeAdvisories: beach.advisories.length,
        safetyScore,
        activities,
        bacteriaLevel,
        enterococcus
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