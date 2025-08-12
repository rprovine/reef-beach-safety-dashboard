import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Test database connection and user lookup
    console.log('Testing password reset for:', email)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Test if resetToken fields exist on User table
    let canUseUserTable = false
    try {
      await prisma.user.findFirst({
        select: {
          id: true,
          resetToken: true,
          resetTokenExpiry: true
        },
        where: { id: user.id }
      })
      canUseUserTable = true
    } catch (error) {
      console.log('resetToken fields not available on User table:', error)
    }
    
    // Test sessions table
    const existingSessions = await prisma.session.findMany({
      where: { userId: user.id }
    })
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      },
      databaseStatus: {
        canUseUserTable,
        existingSessionsCount: existingSessions.length,
        sessionsTableAvailable: true
      },
      testResult: 'Password reset prerequisites check complete'
    })
    
  } catch (error) {
    console.error('Test password reset error:', error)
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/test-password-reset',
    usage: 'POST with { "email": "user@example.com" } to test password reset setup',
    checks: [
      'Database connectivity',
      'User lookup',
      'resetToken fields availability',
      'Sessions table accessibility'
    ]
  })
}