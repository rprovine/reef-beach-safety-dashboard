import { NextResponse } from 'next/server'
import { sendEmail, templates } from '@/lib/email'

export async function GET() {
  try {
    // Test email - only works if RESEND_API_KEY is configured
    const testEmail = 'test@example.com'
    const template = templates.welcome('Test User', testEmail)
    
    const result = await sendEmail({
      to: testEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
    
    return NextResponse.json({ success: result.success, message: 'Email test completed' })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) })
  }
}