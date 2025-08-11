import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hubspot } from '@/lib/hubspot'
import crypto from 'crypto'

// Verify HubSpot webhook signature
function verifyHubSpotSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  return hash === signature
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hubspot-signature') || ''
    const webhookSecret = process.env.HUBSPOT_WEBHOOK_SECRET || ''
    
    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production' && webhookSecret) {
      const isValid = verifyHubSpotSignature(body, signature, webhookSecret)
      if (!isValid) {
        console.error('Invalid HubSpot webhook signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }
    
    const data = JSON.parse(body)
    console.log('HubSpot webhook received:', data)
    
    // Handle different webhook events
    const eventType = data.eventType || data[0]?.subscriptionType
    
    switch (eventType) {
      case 'payment.success':
      case 'deal.propertyChange': // HubSpot deal stage change
        await handlePaymentSuccess(data)
        break
        
      case 'payment.failed':
        await handlePaymentFailed(data)
        break
        
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(data)
        break
        
      default:
        console.log('Unhandled webhook event:', eventType)
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(data: any) {
  try {
    // Extract email and payment details from HubSpot payload
    const email = data.email || data.properties?.email || data[0]?.propertyValue
    const paymentId = data.paymentId || data.objectId || data[0]?.objectId
    const amount = data.amount || data.properties?.amount
    
    if (!email) {
      console.error('No email in payment success webhook')
      return
    }
    
    console.log('Processing payment success for:', email)
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.error('User not found for payment:', email)
      return
    }
    
    // Update user to pro tier
    await prisma.user.update({
      where: { id: user.id },
      data: {
        tier: 'pro',
        subscriptionStatus: 'active',
        trialEndDate: null
      }
    })
    
    // Update or create subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId: user.id }
    })
    
    if (existingSubscription) {
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          tier: 'pro',
          status: 'active',
          paymentMethod: 'hubspot',
          stripeCustomerId: paymentId,
          updatedAt: new Date()
        }
      })
    } else {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          tier: 'pro',
          status: 'active',
          billingCycle: 'monthly',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paymentMethod: 'hubspot',
          stripeCustomerId: paymentId
        }
      })
    }
    
    // Update HubSpot contact
    await hubspot.createOrUpdateContact({
      email: user.email,
      beach_tier: 'pro',
      subscription_status: 'active',
      last_payment_date: new Date().toISOString(),
      last_payment_amount: amount
    })
    
    console.log('Payment success processed for:', email)
    
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(data: any) {
  try {
    const email = data.email || data.properties?.email
    
    if (!email) return
    
    console.log('Processing payment failure for:', email)
    
    // Update HubSpot contact
    await hubspot.createOrUpdateContact({
      email,
      payment_status: 'failed',
      last_payment_failure: new Date().toISOString()
    })
    
    // You might want to send an email notification here
    
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handleSubscriptionCancelled(data: any) {
  try {
    const email = data.email || data.properties?.email
    
    if (!email) return
    
    console.log('Processing subscription cancellation for:', email)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) return
    
    // Downgrade to free tier
    await prisma.user.update({
      where: { id: user.id },
      data: {
        tier: 'free',
        subscriptionStatus: 'cancelled'
      }
    })
    
    // Update subscription status
    await prisma.subscription.updateMany({
      where: { userId: user.id },
      data: {
        status: 'cancelled',
        endDate: new Date()
      }
    })
    
    // Update HubSpot
    await hubspot.createOrUpdateContact({
      email: user.email,
      beach_tier: 'free',
      subscription_status: 'cancelled',
      cancellation_date: new Date().toISOString()
    })
    
    console.log('Subscription cancelled for:', email)
    
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}