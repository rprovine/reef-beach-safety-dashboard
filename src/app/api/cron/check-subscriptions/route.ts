import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hubspot } from '@/lib/hubspot'

// This endpoint should be called periodically (e.g., daily) to check and update subscription statuses
// Can be triggered by Vercel Cron Jobs or external cron services

export async function GET(request: NextRequest) {
  try {
    // Optional: Add authorization check for cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date()
    let updatedTrials = 0
    let updatedSubscriptions = 0

    // 1. Check for expired trials
    const expiredTrialUsers = await prisma.user.findMany({
      where: {
        tier: 'free',
        subscriptionStatus: 'trial',
        trialEndDate: {
          lt: now
        }
      }
    })

    for (const user of expiredTrialUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: 'none'
        }
      })

      // Update HubSpot
      try {
        if (user.hubspotContactId) {
          await hubspot.updateContact(user.hubspotContactId, {
            subscription_status: 'expired_trial',
            trial_expired_at: now.toISOString()
          })
        }
      } catch (err) {
        console.error(`HubSpot sync error for user ${user.id}:`, err)
      }

      updatedTrials++
    }

    // 2. Check for expired canceled subscriptions
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'canceled',
        endDate: {
          lt: now
        }
      },
      include: { user: true }
    })

    for (const subscription of expiredSubscriptions) {
      // Update subscription to expired
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'expired' }
      })

      // Downgrade user to free tier
      await prisma.user.update({
        where: { id: subscription.userId },
        data: {
          tier: 'free',
          subscriptionStatus: 'none'
        }
      })

      // Update HubSpot
      try {
        if (subscription.user.hubspotContactId) {
          await hubspot.updateContact(subscription.user.hubspotContactId, {
            beach_tier: 'free',
            subscription_status: 'expired',
            subscription_expired_at: now.toISOString()
          })
        }
      } catch (err) {
        console.error(`HubSpot sync error for user ${subscription.userId}:`, err)
      }

      updatedSubscriptions++
    }

    // 3. Send reminder emails for trials expiring soon (3 days before)
    const expiringTrialUsers = await prisma.user.findMany({
      where: {
        tier: 'free',
        subscriptionStatus: 'trial',
        trialEndDate: {
          gte: now,
          lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
        }
      }
    })

    // In a real implementation, you would send emails here
    // For now, we'll just log them
    for (const user of expiringTrialUsers) {
      console.log(`Trial expiring soon for user: ${user.email}`)
      // TODO: Send reminder email via your email service
    }

    return NextResponse.json({
      success: true,
      updated: {
        trials: updatedTrials,
        subscriptions: updatedSubscriptions,
        reminders: expiringTrialUsers.length
      },
      message: `Updated ${updatedTrials} expired trials and ${updatedSubscriptions} expired subscriptions`
    })

  } catch (error) {
    console.error('Check subscriptions cron error:', error)
    return NextResponse.json(
      { error: 'Failed to check subscriptions' },
      { status: 500 }
    )
  }
}

// Manual trigger endpoint for testing
export async function POST(request: NextRequest) {
  return GET(request)
}