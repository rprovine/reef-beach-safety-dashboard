import { NextResponse } from 'next/server'

export const runtime = 'edge' // Use edge runtime for fastest response
export const dynamic = 'force-dynamic'

// Static analytics data that doesn't require database
export async function GET() {
  const today = new Date()
  
  // Generate weekly trends
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dailyTrends = days.map((day, idx) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - idx))
    const isWeekend = idx >= 5
    const baseVisitors = isWeekend ? 18000 : 12000
    const visitors = baseVisitors + (Math.random() * 4000) - 2000
    const safety = 65 + Math.floor(Math.random() * 30)
    
    return {
      day,
      date: date.toISOString().split('T')[0],
      visitors: Math.round(visitors),
      safety,
      pageViews: Math.round(visitors * 2.5)
    }
  })

  // Top beaches with static data
  const topBeaches = [
    { name: 'Waikiki Beach', visitors: 1523, safety: 85, trend: 'up' },
    { name: 'Lanikai Beach', visitors: 1342, safety: 92, trend: 'up' },
    { name: 'Pipeline', visitors: 1198, safety: 68, trend: 'down' },
    { name: 'Hanauma Bay', visitors: 1089, safety: 88, trend: 'stable' },
    { name: 'Sunset Beach', visitors: 987, safety: 75, trend: 'up' }
  ]

  // Recent incidents
  const recentIncidents = [
    {
      beach: 'Pipeline',
      type: 'High Surf Warning',
      severity: 'high',
      time: 'Today'
    },
    {
      beach: 'Hanauma Bay',
      type: 'Jellyfish Alert',
      severity: 'medium',
      time: 'Yesterday'
    },
    {
      beach: 'Waikiki Beach',
      type: 'Strong Current',
      severity: 'medium',
      time: '2 days ago'
    }
  ]

  const response = {
    overview: {
      totalBeaches: 71,
      totalVisitors: 15234,
      totalSessions: 8421,
      totalPageViews: 42105,
      totalBeachVisits: 3214,
      avgSafetyScore: 74,
      statusCounts: {
        safe: 28,
        caution: 43,
        danger: 0
      },
      avgSessionDuration: 234,
      activeAdvisories: 3,
      totalUsers: 1247,
      period: '7d',
      trends: {
        visitors: 18,
        sessions: 12,
        pageViews: 15
      }
    },
    topBeaches,
    topSearches: [
      { query: 'snorkeling beaches', count: 234 },
      { query: 'surf report', count: 189 },
      { query: 'waikiki', count: 156 },
      { query: 'safety conditions', count: 142 },
      { query: 'tide times', count: 128 }
    ],
    demographics: {
      deviceBreakdown: { mobile: 65, desktop: 30, tablet: 5 },
      visitorTypes: { tourist: 80, local: 15, unknown: 5 },
      islandVisits: { oahu: 45, maui: 30, kauai: 15, hawaii: 10 }
    },
    recentActivity: [],
    recentIncidents,
    dailyTrends,
    lastUpdated: new Date().toISOString()
  }

  return NextResponse.json(response)
}