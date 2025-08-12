import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    // Verify JWT token
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user with subscription info
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { 
        subscriptions: { 
          orderBy: { createdAt: 'desc' },
          take: 1 
        } 
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check trial status
    const now = new Date()
    const isInTrial = user.trialEndDate && now < user.trialEndDate && user.tier === 'free'
    const trialDaysRemaining = user.trialEndDate ? 
      Math.max(0, Math.ceil((user.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0

    // Check if trial or subscription has expired and needs downgrade
    if (user.trialEndDate && now > user.trialEndDate && user.tier === 'free' && user.subscriptionStatus === 'trial') {
      // Trial expired, update status
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: 'none'
        }
      })
      user.subscriptionStatus = 'none'
    }

    const activeSubscription = user.subscriptions[0]
    
    // Check if canceled subscription has expired
    if (activeSubscription && 
        activeSubscription.status === 'canceled' && 
        activeSubscription.endDate && 
        now > activeSubscription.endDate) {
      // Downgrade to free
      await prisma.user.update({
        where: { id: user.id },
        data: {
          tier: 'free',
          subscriptionStatus: 'none'
        }
      })
      
      await prisma.subscription.update({
        where: { id: activeSubscription.id },
        data: { status: 'expired' }
      })
      
      user.tier = 'free'
      user.subscriptionStatus = 'none'
    }

    // Determine actual access level
    const hasProAccess = user.tier === 'pro' || user.tier === 'admin' || isInTrial

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        tier: user.tier,
        createdAt: user.createdAt,
        subscriptionStatus: user.subscriptionStatus,
        isInTrial,
        trialEndsAt: user.trialEndDate,
        trialDaysRemaining,
        hasProAccess
      },
      subscription: activeSubscription ? {
        id: activeSubscription.id,
        status: activeSubscription.status,
        tier: activeSubscription.tier,
        billingCycle: activeSubscription.billingCycle,
        startDate: activeSubscription.startDate,
        endDate: activeSubscription.endDate,
        canceledAt: activeSubscription.canceledAt,
        nextBillingDate: activeSubscription.status === 'active' ? 
          new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) : null
      } : null
    })

  } catch (error) {
    console.error('Get subscription status error:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be used to check and auto-downgrade expired trials/subscriptions
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: { where: { status: 'active' } } }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const now = new Date()
    let updated = false

    // Check if trial expired
    if (user.trialEndDate && now > user.trialEndDate && user.tier === 'free') {
      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionStatus: 'none' }
      })
      updated = true
    }

    // Check if canceled subscription expired
    const subscription = user.subscriptions[0]
    if (subscription && 
        subscription.status === 'canceled' && 
        subscription.endDate &&
        now > subscription.endDate) {
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          tier: 'free',
          subscriptionStatus: 'none'
        }
      })
      
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'expired' }
      })
      
      updated = true
    }

    return NextResponse.json({
      success: true,
      updated,
      message: updated ? 'Subscription status updated' : 'No updates needed'
    })

  } catch (error) {
    console.error('Update subscription status error:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription status' },
      { status: 500 }
    )
  }
}