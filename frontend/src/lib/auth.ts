import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET!
const TOKEN_EXPIRY = '7d'

export interface UserPayload {
  id: string
  email: string
  name: string | null
  tier: string
  subscriptionStatus: string
}

export interface AuthResponse {
  user: UserPayload
  token: string
}

export class AuthService {
  // Generate JWT token
  generateToken(payload: UserPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
  }

  // Verify JWT token
  verifyToken(token: string): UserPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as UserPayload
    } catch (error) {
      return null
    }
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // Register user
  async register(data: {
    email: string
    password: string
    name?: string
    phone?: string
  }): Promise<AuthResponse> {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      })

      if (existingUser) {
        throw new Error('User already exists')
      }

      // Hash password
      const hashedPassword = await this.hashPassword(data.password)

      // Create user with free tier
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          tier: 'free',
          subscriptionStatus: 'active',
          // Set trial for new users
          trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
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
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      })

      const payload: UserPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
        subscriptionStatus: user.subscriptionStatus
      }

      const token = this.generateToken(payload)

      // Create session
      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      })

      return { user: payload, token }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { subscription: true }
      })

      if (!user) {
        throw new Error('Invalid credentials')
      }

      const validPassword = await this.verifyPassword(password, user.password)
      if (!validPassword) {
        throw new Error('Invalid credentials')
      }

      const payload: UserPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
        subscriptionStatus: user.subscriptionStatus
      }

      const token = this.generateToken(payload)

      // Create session
      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      })

      return { user: payload, token }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Logout user
  async logout(token: string): Promise<void> {
    try {
      await prisma.session.delete({
        where: { token }
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Get current user from token
  async getCurrentUser(token: string): Promise<UserPayload | null> {
    try {
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true }
      })

      if (!session || session.expiresAt < new Date()) {
        return null
      }

      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        tier: session.user.tier,
        subscriptionStatus: session.user.subscriptionStatus
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  // Check if user can access feature based on tier
  canAccessFeature(userTier: string, requiredTier: string): boolean {
    const tierHierarchy = {
      free: 0,
      consumer: 1,
      business: 2,
      enterprise: 3
    }

    const userLevel = tierHierarchy[userTier as keyof typeof tierHierarchy] || 0
    const requiredLevel = tierHierarchy[requiredTier as keyof typeof tierHierarchy] || 0

    return userLevel >= requiredLevel
  }

  // Update user tier after payment
  async updateUserTier(userId: string, tier: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { 
          tier,
          subscriptionStatus: 'active'
        }
      })

      await prisma.subscription.update({
        where: { userId },
        data: {
          tier,
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      })
    } catch (error) {
      console.error('Update tier error:', error)
      throw error
    }
  }
}

export const auth = new AuthService()

// Server-side auth check
export async function getServerSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    return auth.getCurrentUser(token)
  } catch (error) {
    console.error('Get server session error:', error)
    return null
  }
}

// Middleware to protect API routes
export async function requireAuth(request: Request): Promise<UserPayload> {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!token) {
    throw new Error('Unauthorized')
  }

  const user = await auth.getCurrentUser(token)
  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

// Tier limits
export const TIER_LIMITS = {
  free: {
    alerts: 1,
    beaches: 3,
    widgets: 0,
    apiCalls: 100,
    emailAlerts: true,
    smsAlerts: false,
    historicalData: 7, // days
    forecastDays: 3
  },
  consumer: {
    alerts: 5,
    beaches: 10,
    widgets: 0,
    apiCalls: 1000,
    emailAlerts: true,
    smsAlerts: true,
    historicalData: 30,
    forecastDays: 7
  },
  business: {
    alerts: 20,
    beaches: -1, // unlimited
    widgets: 3,
    apiCalls: 10000,
    emailAlerts: true,
    smsAlerts: true,
    historicalData: 90,
    forecastDays: 7
  },
  enterprise: {
    alerts: -1, // unlimited
    beaches: -1,
    widgets: -1,
    apiCalls: -1,
    emailAlerts: true,
    smsAlerts: true,
    historicalData: 365,
    forecastDays: 14
  }
}