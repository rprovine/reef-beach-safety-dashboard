import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'
import crypto from 'crypto'

const forgotPasswordSchema = z.object({
  email: z.string().email()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = forgotPasswordSchema.parse(body)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.'
      })
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    
    // Save reset token using sessions table as fallback
    try {
      // Try to update user table first (if resetToken fields exist)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry
        }
      })
    } catch (updateError) {
      console.log('User table missing resetToken fields, using sessions table as fallback')
      
      // Delete any existing reset sessions for this user
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
          token: { startsWith: 'reset_' }
        }
      })
      
      // Create a reset session
      await prisma.session.create({
        data: {
          userId: user.id,
          token: `reset_${resetToken}`,
          expiresAt: resetTokenExpiry
        }
      })
    }
    
    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://beachhui.com'}/auth/reset-password?token=${resetToken}`
    
    // Send reset email
    try {
      const emailTemplate = emailTemplates.passwordReset(
        user.name || user.email.split('@')[0],
        resetLink
      )
      
      await sendEmail({
        to: user.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })
      
      console.log(`Password reset email sent to: ${user.email}`)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Still return success to prevent enumeration
    }
    
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.'
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}