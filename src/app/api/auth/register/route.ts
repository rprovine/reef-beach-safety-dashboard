import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hubspot } from '@/lib/hubspot'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  phone: z.string().optional(),
  businessName: z.string().optional(),
})

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)
    
    console.log('Registration attempt for:', validatedData.email)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)
    
    // Create user with free tier and trial period
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        phone: validatedData.phone,
        tier: 'free',
        subscriptionStatus: 'trial',
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      }
    })
    
    // Create free subscription
    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: 'free',
        status: 'active',
        billingCycle: 'monthly',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      }
    })
    
    // Sync with HubSpot
    try {
      const contactId = await hubspot.createOrUpdateContact({
        email: user.email,
        firstname: user.name?.split(' ')[0],
        lastname: user.name?.split(' ').slice(1).join(' '),
        phone: user.phone || undefined,
        beach_tier: 'free',
        subscription_status: 'trial',
        trial_end_date: user.trialEndDate?.toISOString(),
      })
      
      // Update user with HubSpot contact ID
      await prisma.user.update({
        where: { id: user.id },
        data: { hubspotContactId: contactId }
      })
    } catch (hubspotError) {
      console.error('HubSpot sync error:', hubspotError)
      // Continue even if HubSpot sync fails
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, tier: user.tier },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    
    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })
    
    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user
    
    console.log('Registration successful for:', validatedData.email)
    
    return NextResponse.json({
      token,
      user: userData,
      message: 'Registration successful! You have a 14-day free trial.'
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    // Check for unique constraint violation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { 
        error: 'Registration failed',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'An error occurred during registration'
      },
      { status: 500 }
    )
  }
}