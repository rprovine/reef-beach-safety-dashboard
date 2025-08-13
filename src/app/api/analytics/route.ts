import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '7d' // 7d, 30d, all
    
    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch(period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case 'all':
        startDate = new Date(0)
        break
    }
    
    // Get total beaches and current status counts
    const [
      totalBeaches,
      beaches,
      recentReadings,
      activeAdvisories,
      statusHistory,
      apiUsage,
      userCount,
      favoriteStats
    ] = await Promise.all([
      // Total beaches
      prisma.beach.count(),
      
      // All beaches with latest reading
      prisma.beach.findMany({
        include: {
          readings: {
            orderBy: { timestamp: 'desc' },
            take: 1
          },
          advisories: {
            where: { status: 'active' }
          }
        }
      }),
      
      // Recent readings for trends
      prisma.reading.findMany({
        where: {
          timestamp: { gte: startDate }
        },
        include: {
          beach: true
        },
        orderBy: { timestamp: 'desc' }
      }),
      
      // Active advisories
      prisma.advisory.count({
        where: { status: 'active' }
      }),
      
      // Status history for trends
      prisma.statusHistory.findMany({
        where: {
          timestamp: { gte: startDate }
        },
        include: {
          beach: true
        },
        orderBy: { timestamp: 'desc' }
      }),
      
      // API usage stats
      prisma.apiLog.groupBy({
        by: ['endpoint'],
        _count: true,
        where: {
          createdAt: { gte: startDate }
        }
      }),
      
      // User statistics
      prisma.user.count(),
      
      // Favorite beaches
      prisma.beachFavorite.groupBy({
        by: ['beachId'],
        _count: true,
        orderBy: {
          _count: {
            beachId: 'desc'
          }
        },
        take: 10
      })
    ])
    
    // Calculate current status distribution
    const statusCounts = {
      safe: 0,
      caution: 0,
      dangerous: 0,
      unknown: 0
    }
    
    beaches.forEach(beach => {
      const latestReading = beach.readings[0]
      if (!latestReading) {
        statusCounts.unknown++
        return
      }
      
      const waveHeight = Number(latestReading.waveHeightFt) || 0
      const hasAdvisory = beach.advisories.length > 0
      
      if (hasAdvisory || waveHeight > 6) {
        statusCounts.dangerous++
      } else if (waveHeight > 3) {
        statusCounts.caution++
      } else {
        statusCounts.safe++
      }
    })
    
    // Calculate average safety score
    let totalSafetyScore = 0
    let beachesWithScore = 0
    
    beaches.forEach(beach => {
      const latestReading = beach.readings[0]
      if (latestReading) {
        const waveHeight = Number(latestReading.waveHeightFt) || 0
        const windSpeed = Number(latestReading.windMph) || 0
        const advisoryCount = beach.advisories.length
        
        let score = 100
        if (waveHeight > 6) score -= 30
        else if (waveHeight > 4) score -= 20
        else if (waveHeight > 3) score -= 10
        
        if (windSpeed > 25) score -= 20
        else if (windSpeed > 20) score -= 15
        else if (windSpeed > 15) score -= 10
        
        score -= advisoryCount * 15
        score = Math.max(0, Math.min(100, score))
        
        totalSafetyScore += score
        beachesWithScore++
      }
    })
    
    const avgSafetyScore = beachesWithScore > 0 
      ? Math.round(totalSafetyScore / beachesWithScore)
      : 0
    
    // Get top beaches by favorites
    const topBeaches = await Promise.all(
      favoriteStats.slice(0, 5).map(async (fav) => {
        const beach = await prisma.beach.findUnique({
          where: { id: fav.beachId },
          include: {
            readings: {
              orderBy: { timestamp: 'desc' },
              take: 1
            }
          }
        })
        
        if (!beach) return null
        
        const latestReading = beach.readings[0]
        const waveHeight = latestReading ? Number(latestReading.waveHeightFt) || 0 : 0
        const windSpeed = latestReading ? Number(latestReading.windMph) || 0 : 0
        
        // Calculate safety score
        let safetyScore = 100
        if (waveHeight > 6) safetyScore -= 30
        else if (waveHeight > 4) safetyScore -= 20
        else if (waveHeight > 3) safetyScore -= 10
        
        if (windSpeed > 25) safetyScore -= 20
        else if (windSpeed > 20) safetyScore -= 15
        else if (windSpeed > 15) safetyScore -= 10
        
        return {
          name: beach.name,
          favorites: fav._count,
          safety: Math.max(0, Math.min(100, safetyScore)),
          conditions: {
            waveHeight,
            windSpeed,
            waterTemp: latestReading ? Number(latestReading.waterTempF) : null
          }
        }
      })
    )
    
    // Calculate daily trends
    const dailyTrends = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const dayReadings = recentReadings.filter(r => 
        r.timestamp >= date && r.timestamp < nextDate
      )
      
      const dayStatus = statusHistory.filter(s => 
        s.timestamp >= date && s.timestamp < nextDate
      )
      
      let avgSafety = 0
      if (dayStatus.length > 0) {
        const safeCount = dayStatus.filter(s => s.status === 'green').length
        avgSafety = Math.round((safeCount / dayStatus.length) * 100)
      }
      
      dailyTrends.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        safety: avgSafety || avgSafetyScore, // Use overall average if no data
        readings: dayReadings.length,
        beaches: new Set(dayReadings.map(r => r.beachId)).size
      })
    }
    
    // Get recent incidents (high severity advisories)
    const recentIncidents = await prisma.advisory.findMany({
      where: {
        createdAt: { gte: startDate },
        severity: { in: ['high', 'medium'] }
      },
      include: {
        beach: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    
    // API usage breakdown
    const apiStats = {
      totalCalls: apiUsage.reduce((sum, item) => sum + item._count, 0),
      byEndpoint: apiUsage.map(item => ({
        endpoint: item.endpoint,
        calls: item._count
      }))
    }
    
    // Response
    return NextResponse.json({
      overview: {
        totalBeaches,
        statusCounts,
        avgSafetyScore,
        activeAdvisories,
        totalUsers: userCount,
        period
      },
      topBeaches: topBeaches.filter(Boolean),
      dailyTrends,
      recentIncidents: recentIncidents.map(incident => ({
        beach: incident.beach.name,
        type: incident.title,
        severity: incident.severity,
        time: incident.createdAt,
        description: incident.description
      })),
      apiUsage: apiStats,
      lastUpdated: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}