import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { endOfDay, startOfDay, subDays, subHours } from 'date-fns'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Real analytics data from visitor tracking + beach safety data

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '7d'
    
    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case '24h':
        startDate = subHours(now, 24)
        break
      case '7d':
        startDate = subDays(now, 7)
        break
      case '30d':
        startDate = subDays(now, 30)
        break
      default:
        startDate = subDays(now, 7)
    }
    
    // Get real visitor analytics data
    const [
      totalBeaches,
      uniqueVisitors,
      totalSessions, 
      totalPageViews,
      totalBeachVisits,
      topBeaches,
      topSearches,
      deviceBreakdown,
      visitorTypes,
      islandVisits,
      recentSessions,
      activeAdvisories,
      userCount
    ] = await Promise.all([
      // Beach data
      prisma.beach.count(),
      
      // Visitor metrics
      getUniqueVisitors(startDate, now),
      getTotalSessions(startDate, now),
      getTotalPageViews(startDate, now),
      getTotalBeachVisits(startDate, now),
      getTopBeaches(startDate, now),
      getTopSearches(startDate, now),
      getDeviceBreakdown(startDate, now),
      getVisitorTypes(startDate, now),
      getIslandVisits(startDate, now),
      getRecentSessions(startDate, now, 10),
      
      // Advisory data
      prisma.advisory.count({
        where: { status: 'active' }
      }),
      
      // User statistics
      prisma.user.count()
    ])
    
    // Calculate trends (compare with previous period)
    const previousStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()))
    const [prevVisitors, prevSessions, prevPageViews] = await Promise.all([
      getUniqueVisitors(previousStartDate, startDate),
      getTotalSessions(previousStartDate, startDate),
      getTotalPageViews(previousStartDate, startDate)
    ])
    
    const visitorTrend = calculateTrend(uniqueVisitors, prevVisitors)
    const sessionTrend = calculateTrend(totalSessions, prevSessions)
    const pageViewTrend = calculateTrend(totalPageViews, prevPageViews)
    
    // Calculate average session duration
    const avgSessionDuration = await getAverageSessionDuration(startDate, now)
    
    // Get real incidents from advisories 
    const recentIncidents = await prisma.advisory.findMany({
      where: {
        status: 'active',
        startedAt: {
          gte: startDate,
          lte: now
        }
      },
      include: {
        beach: {
          select: {
            name: true,
            slug: true,
            island: true
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      },
      take: 10
    }).then(advisories => 
      advisories.map(advisory => ({
        beach: advisory.beach.name,
        type: advisory.title,
        severity: advisory.severity,
        time: advisory.startedAt ? new Date(advisory.startedAt).toLocaleDateString() : 'Active',
        timestamp: advisory.startedAt ? new Date(advisory.startedAt) : new Date()
      }))
    )
    
    // Build daily trends from session data
    const dailyTrends = await getDailyTrends(startDate, now)
    
    const response = {
      overview: {
        totalBeaches,
        totalVisitors: uniqueVisitors,
        totalSessions,
        totalPageViews,
        totalBeachVisits,
        avgSessionDuration,
        activeAdvisories,
        totalUsers: userCount,
        period: period,
        trends: {
          visitors: visitorTrend,
          sessions: sessionTrend,
          pageViews: pageViewTrend
        }
      },
      topBeaches,
      topSearches,
      demographics: {
        deviceBreakdown,
        visitorTypes,
        islandVisits
      },
      recentActivity: recentSessions,
      recentIncidents,
      dailyTrends,
      lastUpdated: new Date().toISOString()
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Analytics error:', error)
    
    // Return minimal fallback data on error  
    return NextResponse.json({
      overview: {
        totalBeaches: 0,
        totalVisitors: 0,
        totalSessions: 0,
        totalPageViews: 0,
        totalBeachVisits: 0,
        avgSessionDuration: 0,
        activeAdvisories: 0,
        totalUsers: 0,
        period,
        trends: { visitors: 0, sessions: 0, pageViews: 0 }
      },
      topBeaches: [],
      topSearches: [],
      demographics: {
        deviceBreakdown: {},
        visitorTypes: {},
        islandVisits: {}
      },
      recentActivity: [],
      recentIncidents: [],
      dailyTrends: [],
      lastUpdated: new Date().toISOString()
    })
  }
}

// Helper functions for analytics queries
async function getUniqueVisitors(startDate: Date, endDate: Date): Promise<number> {
  const result = await prisma.visitorSession.groupBy({
    by: ['sessionId'],
    where: {
      startedAt: {
        gte: startDate,
        lte: endDate
      }
    }
  })
  return result.length
}

async function getTotalSessions(startDate: Date, endDate: Date): Promise<number> {
  return await prisma.visitorSession.count({
    where: {
      startedAt: {
        gte: startDate,
        lte: endDate
      }
    }
  })
}

async function getTotalPageViews(startDate: Date, endDate: Date): Promise<number> {
  return await prisma.pageView.count({
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    }
  })
}

async function getTotalBeachVisits(startDate: Date, endDate: Date): Promise<number> {
  return await prisma.beachVisit.count({
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    }
  })
}

async function getTopBeaches(startDate: Date, endDate: Date) {
  const result = await prisma.beachVisit.groupBy({
    by: ['beachSlug', 'island'],
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    },
    _count: {
      beachSlug: true
    },
    orderBy: {
      _count: {
        beachSlug: 'desc'
      }
    },
    take: 10
  })
  
  return result.map(item => ({
    beach: item.beachSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    island: item.island,
    visits: item._count.beachSlug,
    trend: 'up' // TODO: Calculate actual trend
  }))
}

async function getTopSearches(startDate: Date, endDate: Date) {
  const result = await prisma.searchQuery.groupBy({
    by: ['query'],
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate
      },
      query: {
        not: ''
      }
    },
    _count: {
      query: true
    },
    orderBy: {
      _count: {
        query: 'desc'
      }
    },
    take: 10
  })
  
  return result.map(item => ({
    query: item.query,
    count: item._count.query
  }))
}

async function getDeviceBreakdown(startDate: Date, endDate: Date) {
  const result = await prisma.visitorSession.groupBy({
    by: ['deviceType'],
    where: {
      startedAt: {
        gte: startDate,
        lte: endDate
      },
      deviceType: {
        not: null
      }
    },
    _count: {
      deviceType: true
    }
  })
  
  const total = result.reduce((sum, item) => sum + item._count.deviceType, 0)
  const breakdown: Record<string, number> = {}
  
  result.forEach(item => {
    if (item.deviceType) {
      breakdown[item.deviceType] = Math.round((item._count.deviceType / total) * 100)
    }
  })
  
  return breakdown
}

async function getVisitorTypes(startDate: Date, endDate: Date) {
  const result = await prisma.visitorSession.groupBy({
    by: ['userType'],
    where: {
      startedAt: {
        gte: startDate,
        lte: endDate
      },
      userType: {
        not: null
      }
    },
    _count: {
      userType: true
    }
  })
  
  const total = result.reduce((sum, item) => sum + item._count.userType, 0)
  const breakdown: Record<string, number> = {}
  
  result.forEach(item => {
    if (item.userType) {
      breakdown[item.userType] = Math.round((item._count.userType / total) * 100)
    }
  })
  
  return breakdown
}

async function getIslandVisits(startDate: Date, endDate: Date) {
  const result = await prisma.beachVisit.groupBy({
    by: ['island'],
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    },
    _count: {
      island: true
    }
  })
  
  const total = result.reduce((sum, item) => sum + item._count.island, 0)
  const breakdown: Record<string, number> = {}
  
  result.forEach(item => {
    breakdown[item.island] = Math.round((item._count.island / total) * 100)
  })
  
  return breakdown
}

async function getAverageSessionDuration(startDate: Date, endDate: Date): Promise<number | null> {
  const result = await prisma.visitorSession.aggregate({
    where: {
      startedAt: {
        gte: startDate,
        lte: endDate
      },
      duration: {
        not: null
      }
    },
    _avg: {
      duration: true
    }
  })
  
  return result._avg.duration ? Math.round(result._avg.duration) : null
}

async function getRecentSessions(startDate: Date, endDate: Date, limit: number) {
  return await prisma.visitorSession.findMany({
    where: {
      startedAt: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      sessionId: true,
      deviceType: true,
      userType: true,
      startedAt: true,
      pageViewCount: true,
      beachesViewed: true,
      duration: true
    },
    orderBy: {
      startedAt: 'desc'
    },
    take: limit
  })
}

async function getDailyTrends(startDate: Date, endDate: Date) {
  // Get daily session counts
  const sessions = await prisma.visitorSession.findMany({
    where: {
      startedAt: {
        gte: startDate,
        lte: endDate
      }
    },
    select: {
      startedAt: true
    }
  })
  
  // Group by date
  const dailyCounts: Record<string, number> = {}
  sessions.forEach(session => {
    const date = session.startedAt.toISOString().split('T')[0]
    dailyCounts[date] = (dailyCounts[date] || 0) + 1
  })
  
  // Convert to array format
  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    visitors: count,
    pageViews: count * 2.5 // Rough estimate
  }))
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}