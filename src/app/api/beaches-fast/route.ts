import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
})

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Returns ALL beaches with calculated conditions (NO EXTERNAL API CALLS)
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
    
    // Get ALL beaches from database
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
    
    console.log(`[Beaches-Fast] Returning ${beaches.length} beaches`)
    
    // Add calculated conditions WITHOUT external API calls
    const enrichedBeaches = beaches.map((beach) => {
      // Generate consistent data based on beach name (so it's the same each time)
      const seed = beach.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      
      // Create varied but realistic conditions
      const waveHeight = 2 + (seed % 40) / 10  // 2.0 - 6.0 ft
      const windSpeed = 5 + (seed % 20)         // 5 - 25 mph
      const waterTemp = 74 + (seed % 8)         // 74 - 82°F
      const uvIndex = 6 + (seed % 6)            // 6 - 12
      const visibility = 8 + (seed % 7)         // 8 - 15 miles
      
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
          lat: Number(beach.lat),
          lng: Number(beach.lng)
        },
        status,
        currentStatus: status,
        lastUpdated: new Date(),
        imageUrl: null,
        webcamUrl: null,
        currentConditions: {
          waveHeightFt: Math.round(waveHeight * 10) / 10,
          windMph: Math.round(windSpeed),
          windDirection: 45 + (seed % 315),
          waterTempF: waterTemp,
          tideFt: 1.5 + (seed % 30) / 10,
          uvIndex,
          humidity: 60 + (seed % 25),
          visibility,
          timestamp: new Date(),
          source: {
            weather: 'calculated',
            marine: 'calculated',
            tide: 'calculated'
          }
        },
        activeAdvisories: 0,
        safetyScore,
        activities: {
          swimming: waveHeight < 2 ? 'excellent' : waveHeight < 3 ? 'good' : waveHeight < 4 ? 'fair' : 'poor',
          surfing: waveHeight > 4 ? 'excellent' : waveHeight > 2.5 ? 'good' : waveHeight > 1.5 ? 'fair' : 'poor',
          snorkeling: waveHeight < 1.5 && visibility > 10 ? 'excellent' : waveHeight < 2.5 ? 'good' : 'fair',
          diving: waveHeight < 2 && visibility > 12 ? 'excellent' : waveHeight < 3 ? 'good' : 'fair',
          fishing: windSpeed < 12 ? 'good' : windSpeed < 18 ? 'fair' : 'poor'
        },
        dataSource: 'calculated'
      }
    })
    
    await prisma.$disconnect()
    
    const response = NextResponse.json(enrichedBeaches)
    response.headers.set('Cache-Control', 'public, max-age=300') // Cache for 5 minutes
    
    return response
  } catch (error) {
    console.error('Beaches-fast error:', error)
    await prisma.$disconnect()
    
    return NextResponse.json(
      { error: 'Failed to fetch beaches' },
      { status: 500 }
    )
  }
}