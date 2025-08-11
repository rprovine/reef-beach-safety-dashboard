import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { checkApiRateLimit, checkBeachAlertLimit, hasFeature } from '@/lib/tier-limits'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    tier: string
  }
}

// Verify JWT token and attach user to request
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const token = req.headers.get('authorization')?.replace('Bearer ', '')
      
      if (!token) {
        return NextResponse.json(
          { error: 'No authorization token provided' },
          { status: 401 }
        )
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          tier: true,
          subscriptionStatus: true,
          trialEndDate: true
        }
      })
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        )
      }
      
      // Check subscription status
      if (user.subscriptionStatus === 'cancelled' || user.subscriptionStatus === 'expired') {
        return NextResponse.json(
          { error: 'Subscription expired. Please renew to continue.' },
          { status: 402 }
        )
      }
      
      // Check trial expiration
      if (user.subscriptionStatus === 'trial' && user.trialEndDate) {
        if (new Date() > user.trialEndDate) {
          // Downgrade to free tier
          await prisma.user.update({
            where: { id: user.id },
            data: {
              tier: 'free',
              subscriptionStatus: 'active'
            }
          })
          user.tier = 'free'
        }
      }
      
      // Attach user to request
      (req as AuthenticatedRequest).user = {
        id: user.id,
        email: user.email,
        tier: user.tier
      }
      
      return handler(req as AuthenticatedRequest)
    } catch (error) {
      console.error('Auth middleware error:', error)
      
      const errorName = error instanceof Error ? error.name : ''
      if (errorName === 'JsonWebTokenError') {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        )
      }
      
      if (errorName === 'TokenExpiredError') {
        return NextResponse.json(
          { error: 'Token expired' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}

// Check if user has required tier
export function withTier(requiredTier: string) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      const tiers = ['free', 'consumer', 'business', 'enterprise']
      const userTierIndex = tiers.indexOf(req.user?.tier || 'free')
      const requiredTierIndex = tiers.indexOf(requiredTier)
      
      if (userTierIndex < requiredTierIndex) {
        return NextResponse.json(
          { 
            error: 'Insufficient tier',
            message: `This feature requires ${requiredTier} tier or higher`,
            currentTier: req.user?.tier,
            requiredTier
          },
          { status: 403 }
        )
      }
      
      return handler(req)
    })
  }
}

// Check if user has specific feature
export function withFeature(feature: string) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!hasFeature(req.user?.tier || 'free', feature as any)) {
        return NextResponse.json(
          { 
            error: 'Feature not available',
            message: `The ${feature} feature is not available in your current tier`,
            currentTier: req.user?.tier
          },
          { status: 403 }
        )
      }
      
      return handler(req)
    })
  }
}

// Rate limit API requests based on tier
export function withRateLimit() {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      const rateLimit = await checkApiRateLimit(
        req.user!.id,
        req.user!.tier,
        prisma
      )
      
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            message: 'You have exceeded your API rate limit',
            limit: rateLimit.limit,
            resetAt: rateLimit.resetAt
          },
          { status: 429 }
        )
      }
      
      // Log API request
      await prisma.apiLog.create({
        data: {
          userId: req.user!.id,
          endpoint: req.url,
          method: req.method,
          statusCode: 200, // Will be updated by response
          responseTime: 0 // Will be calculated
        }
      })
      
      // Add rate limit headers to response
      const response = await handler(req)
      response.headers.set('X-RateLimit-Limit', String(rateLimit.limit))
      response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining))
      if (rateLimit.resetAt) {
        response.headers.set('X-RateLimit-Reset', rateLimit.resetAt.toISOString())
      }
      
      return response
    })
  }
}

// Check beach alert limits
export function withAlertLimit() {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      const alertLimit = await checkBeachAlertLimit(
        req.user!.id,
        req.user!.tier,
        prisma
      )
      
      if (!alertLimit.allowed) {
        return NextResponse.json(
          { 
            error: 'Alert limit exceeded',
            message: alertLimit.reason || 'You have reached your beach alert limit',
            limit: alertLimit.limit,
            remaining: 0
          },
          { status: 403 }
        )
      }
      
      return handler(req)
    })
  }
}

// Combined middleware for common patterns
export function withApiProtection(options?: {
  requiredTier?: string
  requiredFeature?: string
  rateLimit?: boolean
  alertLimit?: boolean
}) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    let middleware = handler
    
    // Apply middlewares in reverse order (they wrap each other)
    if (options?.alertLimit) {
      const alertLimitMiddleware = withAlertLimit()
      middleware = alertLimitMiddleware(middleware)
    }
    
    if (options?.rateLimit) {
      const rateLimitMiddleware = withRateLimit()
      middleware = rateLimitMiddleware(middleware)
    }
    
    if (options?.requiredFeature) {
      const featureMiddleware = withFeature(options.requiredFeature)
      middleware = featureMiddleware(middleware)
    }
    
    if (options?.requiredTier) {
      const tierMiddleware = withTier(options.requiredTier)
      middleware = tierMiddleware(middleware)
    }
    
    // Auth is always applied
    return withAuth(middleware)
  }
}