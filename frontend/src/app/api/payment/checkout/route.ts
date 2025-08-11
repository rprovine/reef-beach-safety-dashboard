import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth, requireAuth } from '@/lib/auth'
import { hubspot } from '@/lib/hubspot'

const PRICING = {
  consumer_monthly: {
    name: 'Consumer Monthly',
    amount: 4.99,
    tier: 'consumer',
    billingCycle: 'monthly' as const
  },
  consumer_yearly: {
    name: 'Consumer Yearly',
    amount: 49.99,
    tier: 'consumer',
    billingCycle: 'yearly' as const
  },
  business_monthly: {
    name: 'Business Monthly',
    amount: 49,
    tier: 'business',
    billingCycle: 'monthly' as const
  },
  business_yearly: {
    name: 'Business Yearly',
    amount: 499,
    tier: 'business',
    billingCycle: 'yearly' as const
  },
  enterprise_monthly: {
    name: 'Enterprise Monthly',
    amount: 199,
    tier: 'enterprise',
    billingCycle: 'monthly' as const
  },
  enterprise_yearly: {
    name: 'Enterprise Yearly',
    amount: 1999,
    tier: 'enterprise',
    billingCycle: 'yearly' as const
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { planId } = await request.json()

    if (!planId || !PRICING[planId as keyof typeof PRICING]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const plan = PRICING[planId as keyof typeof PRICING]

    // Get user details
    const userDetails = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!userDetails) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create or update HubSpot contact
    const contactId = await hubspot.createOrUpdateContact({
      email: userDetails.email,
      firstname: userDetails.name?.split(' ')[0],
      lastname: userDetails.name?.split(' ').slice(1).join(' '),
      phone: userDetails.phone || undefined,
      beach_tier: plan.tier,
      subscription_status: 'pending'
    })

    // Update user with HubSpot contact ID
    await prisma.user.update({
      where: { id: user.id },
      data: { hubspotContactId: contactId }
    })

    // Create HubSpot deal
    const dealId = await hubspot.createDeal(contactId, {
      dealname: `Beach Safety Dashboard - ${plan.name}`,
      amount: plan.amount.toString(),
      beach_subscription_tier: plan.tier,
      beach_user_id: user.id
    })

    // Generate payment link
    const paymentUrl = await hubspot.generatePaymentLink({
      amount: plan.amount,
      currency: 'USD',
      name: plan.name,
      description: `Beach Safety Dashboard - ${plan.name}`,
      email: userDetails.email,
      contactId,
      dealId
    })

    // Create checkout session
    const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    await prisma.checkoutSession.create({
      data: {
        userId: user.id,
        sessionId,
        planId,
        email: userDetails.email,
        paymentUrl,
        hubspotDealId: dealId,
        metadata: {
          plan,
          contactId,
          dealId
        }
      }
    })

    return NextResponse.json({
      sessionId,
      paymentUrl,
      plan
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Check payment status
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const sessionId = request.nextUrl.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
    }

    const session = await prisma.checkoutSession.findUnique({
      where: { sessionId }
    })

    if (!session || session.userId !== user.id) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check payment status in HubSpot
    if (session.hubspotDealId) {
      const paymentStatus = await hubspot.checkPaymentStatus(session.hubspotDealId)

      if (paymentStatus.status === 'paid' && session.status === 'pending') {
        // Update session
        await prisma.checkoutSession.update({
          where: { id: session.id },
          data: {
            status: 'completed',
            completedAt: new Date()
          }
        })

        // Get plan details
        const plan = PRICING[session.planId as keyof typeof PRICING]

        // Update user tier
        await auth.updateUserTier(user.id, plan.tier)

        // Create payment record
        await prisma.payment.create({
          data: {
            userId: user.id,
            amount: plan.amount,
            currency: 'USD',
            status: 'paid',
            description: plan.name,
            invoiceNumber: `INV-${Date.now()}`,
            hubspotPaymentId: session.hubspotDealId,
            billingPeriodStart: new Date(),
            billingPeriodEnd: new Date(
              Date.now() + (plan.billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
            ),
            paidAt: new Date()
          }
        })

        // Create subscription in HubSpot
        const metadata = session.metadata as { contactId?: string, dealId?: string, plan?: unknown }
        if (metadata?.contactId) {
          await hubspot.createSubscription({
            contactId: metadata.contactId,
            dealId: session.hubspotDealId,
            planId: session.planId,
            amount: plan.amount,
            billingCycle: plan.billingCycle
          })
        }

        return NextResponse.json({
          status: 'completed',
          tier: plan.tier
        })
      }
    }

    return NextResponse.json({
      status: session.status,
      paymentUrl: session.paymentUrl
    })
  } catch (error) {
    console.error('Payment status error:', error)
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}