import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hubspot } from '@/lib/hubspot'
import { sendEmail } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'
import crypto from 'crypto'

// HubSpot webhook types
type HubSpotPaymentEvent = {
  eventType: 'payment.success' | 'payment.failed' | 'subscription.created' | 'subscription.updated' | 'subscription.canceled'
  objectId: string
  properties: {
    email?: string
    amount?: string
    currency?: string
    description?: string
    subscription_tier?: string
    billing_cycle?: 'monthly' | 'yearly'
    status?: string
    customer_email?: string
  }
  occurredAt: string
}

// Verify HubSpot webhook signature
function verifyHubSpotSignature(
  request: NextRequest,
  body: string,
  signature: string
): boolean {
  const secret = process.env.HUBSPOT_WEBHOOK_SECRET
  if (!secret) {
    console.warn('HUBSPOT_WEBHOOK_SECRET not configured')
    return true // Allow in development
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  
  return hash === signature
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-hubspot-signature') || ''
    
    // Verify webhook signature
    if (!verifyHubSpotSignature(request, body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const events: HubSpotPaymentEvent[] = JSON.parse(body)
    
    for (const event of events) {
      console.log('Processing HubSpot event:', event.eventType, event.objectId)
      
      switch (event.eventType) {
        case 'payment.success':
          await handlePaymentSuccess(event)
          break
        
        case 'subscription.created':
          await handleSubscriptionCreated(event)
          break
        
        case 'subscription.updated':
          await handleSubscriptionUpdated(event)
          break
        
        case 'subscription.canceled':
          await handleSubscriptionCanceled(event)
          break
        
        default:
          console.log('Unhandled event type:', event.eventType)
      }
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('HubSpot webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSuccess(event: HubSpotPaymentEvent) {
  const email = event.properties.customer_email || event.properties.email
  if (!email) {
    console.error('No email in payment success event')
    return
  }
  
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user) {
    console.error('User not found for email:', email)
    return
  }
  
  // Check if this is a first-time payment (upgrade from trial)
  if (user.tier === 'free' && user.subscriptionStatus === 'trial') {
    // Upgrade user to Pro
    await prisma.user.update({
      where: { id: user.id },
      data: {
        tier: 'pro',
        subscriptionStatus: 'active',
        upgradedAt: new Date()
      }
    })
    
    // Create or update subscription record
    const billingCycle = event.properties.billing_cycle || 
                         (event.properties.description?.includes('yearly') ? 'yearly' : 'monthly')
    
    const amount = parseFloat(event.properties.amount || '0')
    const formattedAmount = billingCycle === 'yearly' ? '$47.88/year' : '$4.99/month'
    
    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        tier: 'pro',
        status: 'active',
        billingCycle,
        startDate: new Date(),
        endDate: billingCycle === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        amount,
        currency: event.properties.currency || 'USD'
      },
      update: {
        status: 'active',
        tier: 'pro',
        billingCycle,
        amount,
        currency: event.properties.currency || 'USD',
        endDate: billingCycle === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    })
    
    // Send subscription confirmation email
    try {
      const emailTemplate = emailTemplates.subscriptionConfirmed(
        user.name || user.email.split('@')[0],
        billingCycle,
        formattedAmount
      )
      
      await sendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })
      
      console.log(`Subscription confirmation email sent to: ${user.email}`)
    } catch (emailError) {
      console.error(`Failed to send subscription confirmation to ${user.email}:`, emailError)
    }
    
    // Update HubSpot contact
    if (user.hubspotContactId) {
      await hubspot.updateContact(user.hubspotContactId, {
        beach_tier: 'pro',
        subscription_status: 'active',
        upgraded_at: new Date().toISOString()
      })
    }
    
    console.log(`User ${email} upgraded to Pro`)
  }
}

async function handleSubscriptionCreated(event: HubSpotPaymentEvent) {
  const email = event.properties.customer_email || event.properties.email
  if (!email) return
  
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user) return
  
  // Update user to Pro tier
  await prisma.user.update({
    where: { id: user.id },
    data: {
      tier: 'pro',
      subscriptionStatus: 'active'
    }
  })
  
  const billingCycle = event.properties.billing_cycle || 'monthly'
  
  // Create subscription record
  await prisma.subscription.create({
    data: {
      userId: user.id,
      tier: 'pro',
      status: 'active',
      billingCycle,
      startDate: new Date(),
      endDate: billingCycle === 'yearly' 
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  })
  
  console.log(`Subscription created for ${email}`)
}

async function handleSubscriptionUpdated(event: HubSpotPaymentEvent) {
  const email = event.properties.customer_email || event.properties.email
  if (!email) return
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { subscriptions: { where: { status: 'active' } } }
  })
  
  if (!user || !user.subscriptions[0]) return
  
  const status = event.properties.status
  
  // Update subscription status
  await prisma.subscription.update({
    where: { id: user.subscriptions[0].id },
    data: {
      status: status === 'canceled' ? 'canceled' : 'active'
    }
  })
  
  // Update user status if canceled
  if (status === 'canceled') {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'canceled'
      }
    })
  }
  
  console.log(`Subscription updated for ${email}: ${status}`)
}

async function handleSubscriptionCanceled(event: HubSpotPaymentEvent) {
  const email = event.properties.customer_email || event.properties.email
  if (!email) return
  
  const user = await prisma.user.findUnique({
    where: { email },
    include: { subscriptions: { where: { status: 'active' } } }
  })
  
  if (!user || !user.subscriptions[0]) return
  
  // Mark subscription as canceled but keep Pro access until end date
  await prisma.subscription.update({
    where: { id: user.subscriptions[0].id },
    data: {
      status: 'canceled',
      canceledAt: new Date()
    }
  })
  
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'canceled'
    }
  })
  
  console.log(`Subscription canceled for ${email}`)
}