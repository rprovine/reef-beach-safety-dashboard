import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

// Analytics tracking endpoint for collecting visitor data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body
    
    // Get visitor information from headers
    const headersList = headers()
    const userAgent = headersList.get('user-agent') || ''
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIP = headersList.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0] || realIP || 'unknown'
    
    // Hash IP address for privacy
    const hashedIP = Buffer.from(ipAddress).toString('base64').slice(0, 16)
    
    switch (type) {
      case 'session_start':
        return handleSessionStart(data, userAgent, hashedIP)
      
      case 'page_view':
        return handlePageView(data, userAgent)
      
      case 'beach_visit':
        return handleBeachVisit(data)
      
      case 'feature_usage':
        return handleFeatureUsage(data)
      
      case 'search_query':
        return handleSearchQuery(data)
      
      case 'session_end':
        return handleSessionEnd(data)
      
      default:
        return NextResponse.json({ error: 'Invalid tracking type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleSessionStart(data: any, userAgent: string, hashedIP: string) {
  const {
    sessionId,
    userId,
    posthogId,
    referrer,
    landingPage,
    timezone,
    deviceType,
    browserName,
    osName,
    userType,
    classification
  } = data
  
  try {
    const session = await prisma.visitorSession.create({
      data: {
        sessionId,
        userId: userId || null,
        posthogId: posthogId || null,
        ipAddress: hashedIP,
        userAgent,
        referrer: referrer || null,
        landingPage,
        timezone: timezone || null,
        deviceType: deviceType || null,
        browserName: browserName || null,
        osName: osName || null,
        userType: userType || null,
        classification: classification || null,
        startedAt: new Date()
      }
    })
    
    return NextResponse.json({ success: true, sessionId: session.sessionId })
  } catch (error) {
    console.error('Session start error:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

async function handlePageView(data: any, userAgent: string) {
  const {
    sessionId,
    userId,
    pagePath,
    pageTitle,
    referrer,
    timeOnPage,
    scrollDepth
  } = data
  
  try {
    await prisma.pageView.create({
      data: {
        sessionId,
        userId: userId || null,
        pagePath,
        pageTitle: pageTitle || null,
        referrer: referrer || null,
        timeOnPage: timeOnPage || null,
        scrollDepth: scrollDepth || null,
        timestamp: new Date()
      }
    })
    
    // Update session page view count
    await prisma.visitorSession.update({
      where: { sessionId },
      data: {
        pageViewCount: { increment: 1 }
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Page view error:', error)
    return NextResponse.json({ error: 'Failed to track page view' }, { status: 500 })
  }
}

async function handleBeachVisit(data: any) {
  const {
    sessionId,
    userId,
    beachSlug,
    island,
    accessMethod,
    timeOnPage,
    safetyScore,
    weatherConditions,
    interactions
  } = data
  
  try {
    // Get beach ID from slug
    const beach = await prisma.beach.findUnique({
      where: { slug: beachSlug },
      select: { id: true }
    })
    
    if (!beach) {
      return NextResponse.json({ error: 'Beach not found' }, { status: 404 })
    }
    
    await prisma.beachVisit.create({
      data: {
        sessionId,
        userId: userId || null,
        beachId: beach.id,
        beachSlug,
        island,
        accessMethod,
        timeOnPage: timeOnPage || null,
        safetyScore: safetyScore || null,
        weatherConditions: weatherConditions || null,
        interactions: interactions || [],
        timestamp: new Date()
      }
    })
    
    // Update session beaches viewed
    await prisma.visitorSession.update({
      where: { sessionId },
      data: {
        beachesViewed: { push: beachSlug }
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Beach visit error:', error)
    return NextResponse.json({ error: 'Failed to track beach visit' }, { status: 500 })
  }
}

async function handleFeatureUsage(data: any) {
  const {
    sessionId,
    userId,
    featureName,
    featureCategory,
    userTier,
    success,
    errorMessage,
    metadata
  } = data
  
  try {
    await prisma.featureUsage.create({
      data: {
        sessionId: sessionId || null,
        userId: userId || null,
        featureName,
        featureCategory: featureCategory || null,
        userTier: userTier || 'free',
        success: success !== false,
        errorMessage: errorMessage || null,
        metadata: metadata || null,
        timestamp: new Date()
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feature usage error:', error)
    return NextResponse.json({ error: 'Failed to track feature usage' }, { status: 500 })
  }
}

async function handleSearchQuery(data: any) {
  const {
    sessionId,
    userId,
    query,
    filters,
    resultsCount,
    clickedResults,
    noResults
  } = data
  
  try {
    await prisma.searchQuery.create({
      data: {
        sessionId: sessionId || null,
        userId: userId || null,
        query,
        filters: filters || null,
        resultsCount,
        clickedResults: clickedResults || [],
        noResults: noResults || false,
        timestamp: new Date()
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Search query error:', error)
    return NextResponse.json({ error: 'Failed to track search query' }, { status: 500 })
  }
}

async function handleSessionEnd(data: any) {
  const { sessionId, duration } = data
  
  try {
    await prisma.visitorSession.update({
      where: { sessionId },
      data: {
        endedAt: new Date(),
        duration: duration || null
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Session end error:', error)
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 })
  }
}