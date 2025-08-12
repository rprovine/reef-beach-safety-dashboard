import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hubspot } from '@/lib/hubspot'
import { sendEmail } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'

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

      // Send trial expired email
      try {
        const emailTemplate = emailTemplates.trialExpired(
          user.name || user.email.split('@')[0]
        )
        
        await sendEmail({
          to: user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text
        })
        
        console.log(`Trial expired email sent to: ${user.email}`)
      } catch (emailError) {
        console.error(`Failed to send trial expired email to ${user.email}:`, emailError)
      }

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

    // 3. Send reminder emails at strategic points during trial
    let remindersSent = 0
    
    // Day 7 reminder - Halfway through trial
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const sixDaysFromNow = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000)
    
    const halfwayTrialUsers = await prisma.user.findMany({
      where: {
        tier: 'free',
        subscriptionStatus: 'trial',
        trialEndDate: {
          gte: sixDaysFromNow,
          lte: sevenDaysFromNow
        }
      }
    })
    
    for (const user of halfwayTrialUsers) {
      try {
        const emailTemplate = emailTemplates.trialHalfway(
          user.name || user.email.split('@')[0],
          7
        )
        
        await sendEmail({
          to: user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text
        })
        
        remindersSent++
        console.log(`Trial halfway reminder sent to: ${user.email}`)
      } catch (emailError) {
        console.error(`Failed to send halfway reminder to ${user.email}:`, emailError)
      }
    }
    
    // Day 11 reminder - 3 days before expiration
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
    
    const expiringTrialUsers = await prisma.user.findMany({
      where: {
        tier: 'free',
        subscriptionStatus: 'trial',
        trialEndDate: {
          gte: twoDaysFromNow,
          lte: threeDaysFromNow
        }
      }
    })

    for (const user of expiringTrialUsers) {
      const daysRemaining = Math.ceil((user.trialEndDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      try {
        const emailTemplate = emailTemplates.trialExpiring(
          user.name || user.email.split('@')[0],
          daysRemaining
        )
        
        await sendEmail({
          to: user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text
        })
        
        remindersSent++
        console.log(`Trial expiring reminder sent to: ${user.email}`)
      } catch (emailError) {
        console.error(`Failed to send trial reminder to ${user.email}:`, emailError)
      }
    }
    
    // Day 13 reminder - Last chance (1 day before)
    const oneDayFromNow = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000)
    
    const lastChanceUsers = await prisma.user.findMany({
      where: {
        tier: 'free',
        subscriptionStatus: 'trial',
        trialEndDate: {
          gte: twelveHoursFromNow,
          lte: oneDayFromNow
        }
      }
    })
    
    for (const user of lastChanceUsers) {
      try {
        const emailTemplate = emailTemplates.trialLastChance(
          user.name || user.email.split('@')[0]
        )
        
        await sendEmail({
          to: user.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text
        })
        
        remindersSent++
        console.log(`Trial last chance reminder sent to: ${user.email}`)
      } catch (emailError) {
        console.error(`Failed to send last chance reminder to ${user.email}:`, emailError)
      }
    }

    return NextResponse.json({
      success: true,
      updated: {
        trials: updatedTrials,
        subscriptions: updatedSubscriptions,
        reminders: remindersSent
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