import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hubspot } from '@/lib/hubspot'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const token = authHeader.split(' ')[1]
    
    // Verify JWT token
    let decoded: any
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { paymentId, plan, userId } = body
    
    console.log('Processing subscription confirmation:', { paymentId, plan, userId })
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId || decoded.userId }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Update user tier to pro
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        tier: 'pro',
        subscriptionStatus: 'active',
        trialEndDate: null, // Clear trial
        updatedAt: new Date()
      }
    })
    
    // Create or update subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId: user.id }
    })
    
    if (existingSubscription) {
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          tier: 'pro',
          status: 'active',
          billingCycle: body.billingCycle || 'monthly',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          paymentMethod: 'hubspot',
          stripeCustomerId: paymentId, // Store HubSpot payment ID
          updatedAt: new Date()
        }
      })
    } else {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          tier: 'pro',
          status: 'active',
          billingCycle: body.billingCycle || 'monthly',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paymentMethod: 'hubspot',
          stripeCustomerId: paymentId
        }
      })
    }
    
    // Update HubSpot contact
    try {
      await hubspot.createOrUpdateContact({
        email: user.email,
        beach_tier: 'pro',
        subscription_status: 'active',
        payment_id: paymentId,
        subscription_date: new Date().toISOString()
      })
    } catch (hubspotError) {
      console.error('HubSpot update error:', hubspotError)
      // Continue even if HubSpot fails
    }
    
    // Remove password from response
    const { password, ...userData } = updatedUser
    
    console.log('Subscription confirmed for:', user.email)
    
    return NextResponse.json({
      success: true,
      user: userData,
      message: 'Subscription activated successfully'
    })
    
  } catch (error) {
    console.error('Subscription confirmation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to confirm subscription',
        message: process.env.NODE_ENV === 'development' ? String(error) : 'An error occurred'
      },
      { status: 500 }
    )
  }
}