import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// GET /api/community/reports - Get community reports for a beach
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const beachId = searchParams.get('beachId')
    const reportType = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    if (!beachId) {
      return NextResponse.json(
        { error: 'Beach ID is required' },
        { status: 400 }
      )
    }
    
    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      beachId,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    }
    
    if (reportType) {
      where.reportType = reportType
    }
    
    // For now, return mock data until schema is migrated
    const mockReports = [
      {
        id: '1',
        beachId,
        reportType: 'hazard',
        severity: 'high',
        title: 'Strong Rip Current at North End',
        description: 'Multiple rescues today. Strong rip current forming near the rock outcrop on the north end. Stay in designated swimming areas.',
        upvotes: 24,
        downvotes: 2,
        isVerified: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        user: { name: 'Local Lifeguard' }
      },
      {
        id: '2',
        beachId,
        reportType: 'wildlife',
        severity: 'medium',
        title: 'Portuguese Man o\' War Spotted',
        description: 'Several Portuguese man o\' war jellyfish washed up on shore. Be careful when walking on the beach.',
        upvotes: 18,
        downvotes: 0,
        isVerified: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        user: { name: 'BeachLover92' }
      },
      {
        id: '3',
        beachId,
        reportType: 'conditions',
        severity: 'low',
        title: 'Perfect Snorkeling Conditions',
        description: 'Water is crystal clear today! Visibility at least 50ft. Saw multiple sea turtles near the reef.',
        upvotes: 42,
        downvotes: 1,
        isVerified: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        user: { name: 'SnorkelPro' }
      },
      {
        id: '4',
        beachId,
        reportType: 'crowding',
        severity: 'medium',
        title: 'Parking Lot Full',
        description: 'Main parking lot is completely full. Street parking available about 1/4 mile away.',
        upvotes: 15,
        downvotes: 0,
        isVerified: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        user: { name: 'Anonymous' }
      }
    ]
    
    return NextResponse.json({
      reports: mockReports.slice(0, limit),
      total: mockReports.length
    })
    
  } catch (error) {
    console.error('Failed to fetch community reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

// POST /api/community/reports - Submit a new community report
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { beachId, reportType, severity, title, description } = body
    
    // Optional authentication - allow anonymous reports
    let userId = null
    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        userId = decoded.userId
      } catch {
        // Continue as anonymous
      }
    }
    
    // Validate required fields
    if (!beachId || !reportType || !severity || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // For now, return mock response until schema is migrated
    const mockReport = {
      id: Date.now().toString(),
      beachId,
      userId,
      reportType,
      severity,
      title,
      description,
      upvotes: 0,
      downvotes: 0,
      isVerified: false,
      createdAt: new Date()
    }
    
    return NextResponse.json({
      success: true,
      report: mockReport
    })
    
  } catch (error) {
    console.error('Failed to create report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}