import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withApiProtection, AuthenticatedRequest } from '@/lib/api-middleware'
import { hasFeature } from '@/lib/tier-limits'

const createAlertSchema = z.object({
  name: z.string(),
  beachId: z.string(),
  metric: z.enum(['wave_height_ft', 'wind_mph', 'advisory', 'bacteria']),
  operator: z.enum(['gt', 'gte', 'lt', 'lte', 'eq', 'changed', 'is_active']),
  threshold: z.number().optional(),
  channels: z.array(z.enum(['email', 'sms'])).default(['email']),
  quietHoursStart: z.string().optional(), // HH:MM format
  quietHoursEnd: z.string().optional(),
  timezone: z.string().default('Pacific/Honolulu'),
  isActive: z.boolean().default(true)
})

// GET /api/alerts - Get user's alerts
export async function GET(req: NextRequest) {
  return withApiProtection()(
    async (authReq: AuthenticatedRequest) => {
      try {
        const alerts = await prisma.alert.findMany({
          where: {
            userId: authReq.user!.id
          },
          include: {
            rules: {
              include: {
                beach: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    island: true
                  }
                }
              }
            },
            history: {
              take: 5,
              orderBy: {
                sentAt: 'desc'
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
        
        return NextResponse.json({
          alerts,
          tier: authReq.user!.tier,
          features: {
            smsEnabled: hasFeature(authReq.user!.tier, 'smsNotifications'),
            customRulesEnabled: hasFeature(authReq.user!.tier, 'customAlertRules')
          }
        })
      } catch (error) {
        console.error('Get alerts error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch alerts' },
          { status: 500 }
        )
      }
    }
  )(req)
}

// POST /api/alerts - Create new alert with rules
export async function POST(req: NextRequest) {
  return withApiProtection({ alertLimit: true })(
    async (authReq: AuthenticatedRequest) => {
      try {
        const body = await authReq.json()
        const validatedData = createAlertSchema.parse(body)
        
        // Check SMS permission if requested
        if (validatedData.channels.includes('sms')) {
          if (!hasFeature(authReq.user!.tier, 'smsNotifications')) {
            return NextResponse.json(
              { 
                error: 'SMS notifications not available',
                message: 'SMS notifications require Consumer tier or higher'
              },
              { status: 403 }
            )
          }
        }
        
        // Check custom alert rules permission for thresholds
        if (validatedData.threshold !== undefined) {
          if (!hasFeature(authReq.user!.tier, 'customAlertRules')) {
            return NextResponse.json(
              { 
                error: 'Custom alert rules not available',
                message: 'Custom threshold values require Consumer tier or higher'
              },
              { status: 403 }
            )
          }
        }
        
        // Find beach
        const beach = await prisma.beach.findUnique({
          where: { id: validatedData.beachId }
        })
        
        if (!beach) {
          return NextResponse.json(
            { error: 'Beach not found' },
            { status: 404 }
          )
        }
        
        // Check for duplicate alert rule
        const existingAlert = await prisma.alert.findFirst({
          where: {
            userId: authReq.user!.id,
            isActive: true,
            rules: {
              some: {
                beachId: validatedData.beachId,
                metric: validatedData.metric,
                operator: validatedData.operator
              }
            }
          }
        })
        
        if (existingAlert) {
          return NextResponse.json(
            { error: 'Similar alert rule already exists for this beach' },
            { status: 400 }
          )
        }
        
        // Create alert with rule in a transaction
        const alert = await prisma.$transaction(async (tx) => {
          // Create the alert
          const newAlert = await tx.alert.create({
            data: {
              userId: authReq.user!.id,
              name: validatedData.name,
              isActive: validatedData.isActive,
              channels: validatedData.channels,
              quietHoursStart: validatedData.quietHoursStart,
              quietHoursEnd: validatedData.quietHoursEnd,
              timezone: validatedData.timezone
            }
          })
          
          // Create the alert rule
          await tx.alertRule.create({
            data: {
              alertId: newAlert.id,
              beachId: validatedData.beachId,
              metric: validatedData.metric,
              operator: validatedData.operator,
              threshold: validatedData.threshold
            }
          })
          
          // Return alert with rules
          return await tx.alert.findUnique({
            where: { id: newAlert.id },
            include: {
              rules: {
                include: {
                  beach: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                      island: true
                    }
                  }
                }
              }
            }
          })
        })
        
        return NextResponse.json({
          alert,
          message: `Alert created for ${beach.name}`
        }, { status: 201 })
        
      } catch (error) {
        console.error('Create alert error:', error)
        
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            { error: 'Invalid request data', details: error.errors },
            { status: 400 }
          )
        }
        
        return NextResponse.json(
          { error: 'Failed to create alert' },
          { status: 500 }
        )
      }
    }
  )(req)
}