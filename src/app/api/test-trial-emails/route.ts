import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'

// Test endpoint to preview and send trial emails
export async function POST(request: NextRequest) {
  try {
    const { emailType, recipientEmail, recipientName } = await request.json()
    
    if (!emailType || !recipientEmail) {
      return NextResponse.json(
        { error: 'emailType and recipientEmail are required' },
        { status: 400 }
      )
    }

    const name = recipientName || recipientEmail.split('@')[0]
    let emailTemplate

    switch (emailType) {
      case 'welcome':
        emailTemplate = emailTemplates.welcomeWithTrial(name, 14)
        break
      
      case 'halfway':
        emailTemplate = emailTemplates.trialHalfway(name, 7)
        break
      
      case 'expiring':
        emailTemplate = emailTemplates.trialExpiring(name, 3)
        break
      
      case 'lastChance':
        emailTemplate = emailTemplates.trialLastChance(name)
        break
      
      case 'expired':
        emailTemplate = emailTemplates.trialExpired(name)
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid emailType. Use: welcome, halfway, expiring, lastChance, or expired' },
          { status: 400 }
        )
    }

    // Send the email
    await sendEmail({
      to: recipientEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    })

    return NextResponse.json({
      success: true,
      message: `${emailType} email sent to ${recipientEmail}`,
      emailDetails: {
        type: emailType,
        recipient: recipientEmail,
        subject: emailTemplate.subject
      }
    })

  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// GET endpoint to preview email templates
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const emailType = searchParams.get('type')
  const format = searchParams.get('format') || 'html'
  
  const templates = {
    welcome: emailTemplates.welcomeWithTrial('John Doe', 14),
    halfway: emailTemplates.trialHalfway('John Doe', 7),
    expiring: emailTemplates.trialExpiring('John Doe', 3),
    lastChance: emailTemplates.trialLastChance('John Doe'),
    expired: emailTemplates.trialExpired('John Doe')
  }

  if (emailType && emailType in templates) {
    const template = templates[emailType as keyof typeof templates]
    
    if (format === 'text') {
      return new NextResponse(template.text, {
        headers: { 'Content-Type': 'text/plain' }
      })
    }
    
    return new NextResponse(template.html, {
      headers: { 'Content-Type': 'text/html' }
    })
  }

  // Return list of available templates
  return NextResponse.json({
    availableTemplates: Object.keys(templates),
    usage: {
      preview: 'GET /api/test-trial-emails?type=welcome&format=html',
      send: 'POST /api/test-trial-emails with body: { emailType, recipientEmail, recipientName }'
    },
    emailSequence: [
      { day: 1, type: 'welcome', description: 'Sent immediately after signup' },
      { day: 7, type: 'halfway', description: 'Halfway through trial reminder' },
      { day: 11, type: 'expiring', description: '3 days before expiration' },
      { day: 13, type: 'lastChance', description: '1 day before expiration with 40% discount' },
      { day: 15, type: 'expired', description: 'Trial has ended' }
    ]
  })
}