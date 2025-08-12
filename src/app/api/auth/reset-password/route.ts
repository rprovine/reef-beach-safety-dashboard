import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = resetPasswordSchema.parse(body)
    
    // Find user with valid reset token - try multiple methods
    let user = null
    
    // Method 1: Try user table resetToken fields
    try {
      user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gt: new Date() // Token must not be expired
          }
        }
      })
    } catch (error) {
      console.log('User table resetToken fields not available, trying sessions table')
    }
    
    // Method 2: Try sessions table as fallback
    if (!user) {
      const resetSession = await prisma.session.findFirst({
        where: {
          token: `reset_${token}`,
          expiresAt: {
            gt: new Date() // Token must not be expired
          }
        },
        include: {
          user: true
        }
      })
      
      if (resetSession) {
        user = resetSession.user
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        // Try to clear reset token fields if they exist
        ...(user.resetToken ? { resetToken: null, resetTokenExpiry: null } : {})
      }
    })
    
    // Also clear any reset sessions
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
        token: { startsWith: 'reset_' }
      }
    })
    
    console.log(`Password reset successful for: ${user.email}`)
    
    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.'
    })
    
  } catch (error) {
    console.error('Reset password error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}