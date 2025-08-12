import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Demo accounts that work without database
const DEMO_ACCOUNTS = {
  'free@beachhui.demo': {
    id: 'demo-free',
    email: 'free@beachhui.demo',
    name: 'Free Demo User',
    tier: 'free',
    subscriptionStatus: 'none',
    password: 'demo123456',
    createdAt: new Date('2025-01-01').toISOString()
  },
  'pro@beachhui.demo': {
    id: 'demo-pro',
    email: 'pro@beachhui.demo',
    name: 'Pro Demo User',
    tier: 'pro',
    subscriptionStatus: 'active',
    password: 'demo123456',
    createdAt: new Date('2025-01-01').toISOString()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)
    
    console.log('Demo login attempt for:', email)
    
    // Check if this is a demo account
    const demoUser = DEMO_ACCOUNTS[email as keyof typeof DEMO_ACCOUNTS]
    
    if (!demoUser) {
      return NextResponse.json(
        { error: 'This endpoint is only for demo accounts. Use /api/auth/login for regular accounts.' },
        { status: 400 }
      )
    }
    
    // Verify password
    if (password !== demoUser.password) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: demoUser.id, email: demoUser.email, tier: demoUser.tier },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    
    console.log('Demo login successful for:', email)
    
    // Return user data (excluding password)
    const { password: _, ...userData } = demoUser
    
    return NextResponse.json({
      token,
      user: userData,
      demo: true,
      message: 'Logged in with demo account'
    })
    
  } catch (error) {
    console.error('Demo login error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Demo login failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}