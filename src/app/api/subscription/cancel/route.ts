import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { hubspot } from '@/lib/hubspot'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
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

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { subscriptions: { where: { status: 'active' } } }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has an active subscription
    const activeSubscription = user.subscriptions[0]
    if (!activeSubscription || user.tier !== 'pro') {
      return NextResponse.json(
        { error: 'No active subscription to cancel' },
        { status: 400 }
      )
    }

    // Update subscription status to canceled
    await prisma.subscription.update({
      where: { id: activeSubscription.id },
      data: {
        status: 'canceled',
        canceledAt: new Date(),
        // User keeps access until end date
        endDate: activeSubscription.endDate
      }
    })

    // Update user subscription status but keep tier as pro until end date
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'canceled',
        // Keep tier as 'pro' until endDate
      }
    })

    // Sync with HubSpot
    try {
      if (user.hubspotContactId) {
        await hubspot.updateContact(user.hubspotContactId, {
          subscription_status: 'canceled',
          canceled_at: new Date().toISOString()
        })
      }
    } catch (hubspotError) {
      console.error('HubSpot sync error:', hubspotError)
      // Continue even if HubSpot sync fails
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription canceled successfully. You will retain Pro access until ' + 
               activeSubscription.endDate.toLocaleDateString(),
      endDate: activeSubscription.endDate
    })

  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}