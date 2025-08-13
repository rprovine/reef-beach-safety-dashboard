import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting (use Redis in production)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 200 // 200 requests per minute
const API_RATE_LIMIT = 100 // 100 API requests per minute
const BEACHES_API_LIMIT = 50 // 50 beaches API requests per minute (increased for testing)

function getRateLimitKey(request: NextRequest): string {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  return `${ip}:${request.nextUrl.pathname}`
}

function checkRateLimit(key: string, maxRequests: number = RATE_LIMIT_MAX_REQUESTS): boolean {
  const now = Date.now()
  const limit = rateLimit.get(key)

  if (!limit || now > limit.resetTime) {
    rateLimit.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return true
  }

  if (limit.count >= maxRequests) {
    return false
  }

  limit.count++
  return true
}

export function middleware(request: NextRequest) {
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const rateLimitKey = getRateLimitKey(request)
    
    // Special handling for beaches API (most expensive)
    if (request.nextUrl.pathname === '/api/beaches') {
      if (!checkRateLimit(rateLimitKey, BEACHES_API_LIMIT)) {
        return new NextResponse(
          JSON.stringify({
            error: 'Beach API rate limit exceeded',
            message: 'This endpoint fetches live data from multiple external APIs. Limit: 5 requests per minute per IP.',
            retryAfter: 60
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': BEACHES_API_LIMIT.toString(),
              'X-RateLimit-Window': (RATE_LIMIT_WINDOW / 1000).toString(),
              'Retry-After': '60'
            }
          }
        )
      }
    } else {
      // General API rate limiting
      if (!checkRateLimit(rateLimitKey, API_RATE_LIMIT)) {
        return new NextResponse(
          JSON.stringify({
            error: 'API rate limit exceeded',
            message: `Too many API requests. Limit: ${API_RATE_LIMIT} requests per minute.`
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': API_RATE_LIMIT.toString(),
              'X-RateLimit-Window': (RATE_LIMIT_WINDOW / 1000).toString(),
              'Retry-After': '60'
            }
          }
        )
      }
    }
  }

  // Add security headers for API responses
  const response = NextResponse.next()
  
  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    
    // CORS headers for API (adjust origins as needed)
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'https://beachhui.com',
      'https://www.beachhui.com',
      process.env.NEXT_PUBLIC_APP_URL
    ].filter(Boolean)
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Max-Age', '86400')
    }
  }

  // Clean up old rate limit entries periodically
  if (Math.random() < 0.01) { // 1% chance on each request
    const now = Date.now()
    for (const [key, limit] of rateLimit.entries()) {
      if (now > limit.resetTime + RATE_LIMIT_WINDOW) {
        rateLimit.delete(key)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}