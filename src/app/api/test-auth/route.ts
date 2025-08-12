import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing authentication system...')
    
    // Test database connection
    const userCount = await prisma.user.count()
    console.log('Total users in database:', userCount)
    
    // Check for demo users
    const demoUsers = await prisma.user.findMany({
      where: {
        email: {
          in: ['free@beachhui.demo', 'pro@beachhui.demo']
        }
      },
      select: {
        id: true,
        email: true,
        tier: true,
        createdAt: true,
        subscriptionStatus: true,
        trialEndDate: true
      }
    })
    
    // Test bcrypt functionality
    const testPassword = 'demo123456'
    const hashedPassword = await bcrypt.hash(testPassword, 10)
    const passwordMatches = await bcrypt.compare(testPassword, hashedPassword)
    
    return NextResponse.json({
      databaseStatus: 'Connected',
      userCount,
      demoUsers: demoUsers.map(user => ({
        email: user.email,
        tier: user.tier,
        subscriptionStatus: user.subscriptionStatus,
        hasTrialEndDate: !!user.trialEndDate,
        createdAt: user.createdAt
      })),
      bcryptTest: {
        passwordMatches,
        testWorking: passwordMatches === true
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json(
      { 
        error: 'Auth test failed',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// Create demo users if they don't exist
export async function POST(request: NextRequest) {
  try {
    const hashedPassword = await bcrypt.hash('demo123456', 10)
    
    // Create free tier demo user
    const freeUser = await prisma.user.upsert({
      where: { email: 'free@beachhui.demo' },
      update: {},
      create: {
        email: 'free@beachhui.demo',
        password: hashedPassword,
        name: 'Free Demo User',
        tier: 'free',
        subscriptionStatus: 'none'
      }
    })
    
    // Create pro tier demo user
    const proUser = await prisma.user.upsert({
      where: { email: 'pro@beachhui.demo' },
      update: {},
      create: {
        email: 'pro@beachhui.demo',
        password: hashedPassword,
        name: 'Pro Demo User',
        tier: 'pro',
        subscriptionStatus: 'active'
      }
    })
    
    return NextResponse.json({
      message: 'Demo users created/updated',
      users: [
        { email: freeUser.email, tier: freeUser.tier },
        { email: proUser.email, tier: proUser.tier }
      ]
    })
    
  } catch (error) {
    console.error('Demo user creation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create demo users',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}