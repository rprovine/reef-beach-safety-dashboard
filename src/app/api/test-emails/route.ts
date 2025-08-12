import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'

// Test endpoint for verifying email functionality
// In production, protect this with admin authentication

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email address required' },
        { status: 400 }
      )
    }
    
    const testName = 'Test User'
    let emailTemplate: any
    let description: string
    
    switch (type) {
      case 'welcome':
        emailTemplate = emailTemplates.welcomeWithTrial(testName, 14)
        description = 'Welcome email with 14-day trial'
        break
        
      case 'trial-expiring':
        emailTemplate = emailTemplates.trialExpiring(testName, 3)
        description = 'Trial expiring in 3 days'
        break
        
      case 'trial-expired':
        emailTemplate = emailTemplates.trialExpired(testName)
        description = 'Trial expired notification'
        break
        
      case 'subscription-confirmed':
        emailTemplate = emailTemplates.subscriptionConfirmed(testName, 'monthly', '$4.99/month')
        description = 'Subscription confirmation'
        break
        
      case 'subscription-canceled':
        emailTemplate = emailTemplates.subscriptionCanceled(testName, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString())
        description = 'Subscription cancellation'
        break
        
      case 'password-reset':
        emailTemplate = emailTemplates.passwordReset(testName, `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=test-token-12345`)
        description = 'Password reset'
        break
        
      case 'all':
        // Send all email types
        const results = []
        const allTypes = ['welcome', 'trial-expiring', 'trial-expired', 'subscription-confirmed', 'subscription-canceled', 'password-reset']
        
        for (const emailType of allTypes) {
          await new Promise(resolve => setTimeout(resolve, 1000)) // Delay between emails
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/test-emails`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, type: emailType })
          })
          
          const result = await response.json()
          results.push({ type: emailType, ...result })
        }
        
        return NextResponse.json({
          success: true,
          message: 'All test emails queued',
          results
        })
        
      default:
        return NextResponse.json(
          { error: 'Invalid email type. Use: welcome, trial-expiring, trial-expired, subscription-confirmed, subscription-canceled, password-reset, or all' },
          { status: 400 }
        )
    }
    
    // Send the email
    const result = await sendEmail({
      to: email,
      subject: `[TEST] ${emailTemplate.subject}`,
      html: emailTemplate.html,
      text: emailTemplate.text
    })
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent: ${description}`,
        emailType: type,
        recipient: email
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        message: `Failed to send test email: ${description}`
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email', details: error },
      { status: 500 }
    )
  }
}

// GET endpoint to show available test types
export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint',
    usage: 'POST /api/test-emails with { email: "user@example.com", type: "welcome" }',
    availableTypes: [
      'welcome - Welcome email with 14-day trial info',
      'trial-expiring - Trial expiring reminder (3 days)',
      'trial-expired - Trial expired notification',
      'subscription-confirmed - Payment confirmation',
      'subscription-canceled - Cancellation confirmation',
      'password-reset - Password reset link',
      'all - Send all email types (with delays)'
    ],
    note: 'Emails will be prefixed with [TEST] in subject line'
  })
}