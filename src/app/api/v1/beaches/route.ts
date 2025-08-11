import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withApiProtection, AuthenticatedRequest } from '@/lib/api-middleware'
import { canAccessHistoricalData } from '@/lib/tier-limits'

// Force dynamic runtime
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/v1/beaches - Public API endpoint for beach data
export async function GET(req: NextRequest) {
  return withApiProtection({ 
    rateLimit: true,
    requiredFeature: 'apiAccess'
  })(
    async (authReq: AuthenticatedRequest) => {
      try {
        const { searchParams } = new URL(authReq.url)
        const island = searchParams.get('island')
        const status = searchParams.get('status')
        const includeConditions = searchParams.get('include_conditions') === 'true'
        const includeForecast = searchParams.get('include_forecast') === 'true'
        const historicalDays = parseInt(searchParams.get('historical_days') || '0')
        
        // Build query filters
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {}
        if (island) {
          where.island = island
        }
        if (status) {
          where.currentStatus = status
        }
        
        // Check historical data access
        if (historicalDays > 0) {
          if (!canAccessHistoricalData(authReq.user!.tier, historicalDays)) {
            return NextResponse.json(
              { 
                error: 'Historical data not available',
                message: `Your tier allows ${authReq.user!.tier === 'free' ? '7' : authReq.user!.tier === 'consumer' ? '30' : authReq.user!.tier === 'business' ? '90' : '365'} days of historical data`
              },
              { status: 403 }
            )
          }
        }
        
        // Check forecast access
        let forecastDays = 0
        if (includeForecast) {
          forecastDays = authReq.user!.tier === 'free' ? 3 : authReq.user!.tier === 'enterprise' ? 14 : 7
        }
        
        // Fetch beaches
        const beaches = await prisma.beach.findMany({
          where,
          include: {
            ...(includeConditions && {
              readings: {
                take: 1,
                orderBy: {
                  timestamp: 'desc'
                }
              },
              advisories: {
                where: {
                  status: 'active'
                }
              }
            }),
            ...(historicalDays > 0 && {
              readings: {
                where: {
                  timestamp: {
                    gte: new Date(Date.now() - historicalDays * 24 * 60 * 60 * 1000)
                  }
                },
                orderBy: {
                  timestamp: 'desc'
                }
              }
            }),
            statusHistory: {
              take: includeForecast ? 50 : 10,
              orderBy: {
                timestamp: 'desc'
              }
            }
          }
        })
        
        // Log API usage
        await prisma.apiLog.update({
          where: {
            id: (await prisma.apiLog.findFirst({
              where: {
                userId: authReq.user!.id,
                endpoint: authReq.url,
                statusCode: 200
              },
              orderBy: {
                createdAt: 'desc'
              }
            }))?.id || ''
          },
          data: {
            responseTime: Date.now(),
            responseSize: JSON.stringify(beaches).length
          }
        }).catch(() => {}) // Ignore if log entry not found
        
        return NextResponse.json({
          beaches,
          count: beaches.length,
          metadata: {
            tier: authReq.user!.tier,
            historicalDays: historicalDays || 0,
            forecastDays: includeForecast ? forecastDays : 0,
            timestamp: new Date().toISOString()
          }
        })
        
      } catch (error) {
        console.error('API beaches error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch beaches' },
          { status: 500 }
        )
      }
    }
  )(req)
}