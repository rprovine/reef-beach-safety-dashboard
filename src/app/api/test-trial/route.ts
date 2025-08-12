import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Test endpoint to verify trial logic
export async function POST(request: NextRequest) {
  try {
    const { action, email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Find or create test user
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (action === 'create_trial') {
      // Create a new user with trial
      if (user) {
        await prisma.user.delete({ where: { id: user.id } })
      }

      const hashedPassword = await bcrypt.hash('testpassword123', 10)
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Test User',
          tier: 'free',
          subscriptionStatus: 'trial',
          trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        }
      })

      const token = jwt.sign(
        { userId: user.id, email: user.email, tier: user.tier },
        JWT_SECRET,
        { expiresIn: '30d' }
      )

      return NextResponse.json({
        message: 'Trial user created',
        user: {
          email: user.email,
          tier: user.tier,
          subscriptionStatus: user.subscriptionStatus,
          trialEndDate: user.trialEndDate,
          daysRemaining: 14
        },
        token
      })
    }

    if (action === 'expire_trial') {
      // Expire the trial immediately
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          trialEndDate: new Date(Date.now() - 1000), // Set to past
          subscriptionStatus: 'none'
        }
      })

      return NextResponse.json({
        message: 'Trial expired',
        user: {
          email: user.email,
          tier: user.tier,
          subscriptionStatus: user.subscriptionStatus,
          trialEndDate: user.trialEndDate,
          hasProAccess: false
        }
      })
    }

    if (action === 'set_trial_days') {
      // Set trial to specific number of days remaining
      const { days } = await request.json()
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const trialEndDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
      
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          trialEndDate,
          subscriptionStatus: 'trial',
          tier: 'free'
        }
      })

      return NextResponse.json({
        message: `Trial set to ${days} days remaining`,
        user: {
          email: user.email,
          tier: user.tier,
          subscriptionStatus: user.subscriptionStatus,
          trialEndDate: user.trialEndDate,
          daysRemaining: days
        }
      })
    }

    if (action === 'check_status') {
      // Check current trial status
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const now = new Date()
      const trialEndDate = user.trialEndDate ? new Date(user.trialEndDate) : null
      const isInTrial = trialEndDate && trialEndDate > now && user.tier === 'free'
      const daysRemaining = trialEndDate ? 
        Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0

      const hasProAccess = user.tier === 'pro' || user.tier === 'admin' || 
        (user.tier === 'free' && isInTrial)

      return NextResponse.json({
        user: {
          email: user.email,
          tier: user.tier,
          subscriptionStatus: user.subscriptionStatus,
          trialEndDate: user.trialEndDate,
          createdAt: user.createdAt
        },
        trialStatus: {
          isInTrial,
          daysRemaining,
          hasProAccess,
          trialExpired: user.tier === 'free' && !isInTrial && user.subscriptionStatus !== 'active'
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Test trial error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// GET endpoint to see all test users
export async function GET() {
  try {
    const testUsers = await prisma.user.findMany({
      where: {
        email: {
          contains: 'test'
        }
      },
      select: {
        email: true,
        tier: true,
        subscriptionStatus: true,
        trialEndDate: true,
        createdAt: true
      }
    })

    const now = new Date()
    const usersWithStatus = testUsers.map(user => {
      const trialEndDate = user.trialEndDate ? new Date(user.trialEndDate) : null
      const isInTrial = trialEndDate && trialEndDate > now && user.tier === 'free'
      const daysRemaining = trialEndDate ? 
        Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0

      return {
        ...user,
        trialStatus: {
          isInTrial,
          daysRemaining,
          hasProAccess: user.tier === 'pro' || user.tier === 'admin' || (user.tier === 'free' && isInTrial)
        }
      }
    })

    return NextResponse.json({ users: usersWithStatus })
  } catch (error) {
    console.error('Test trial GET error:', error)
    return NextResponse.json(
      { error: 'Failed to get test users' },
      { status: 500 }
    )
  }
}