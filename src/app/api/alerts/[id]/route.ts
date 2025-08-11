import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withApiProtection, AuthenticatedRequest } from '@/lib/api-middleware'
import { hasFeature } from '@/lib/tier-limits'

const updateAlertSchema = z.object({
  name: z.string().optional(),
  channels: z.array(z.enum(['email', 'sms'])).optional(),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
  timezone: z.string().optional(),
  isActive: z.boolean().optional()
})

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/alerts/[id] - Get single alert
export async function GET(req: NextRequest, { params }: RouteParams) {
  return withApiProtection()(
    async (authReq: AuthenticatedRequest) => {
      try {
        const alert = await prisma.alert.findFirst({
          where: {
            id: params.id,
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
              take: 20,
              orderBy: {
                sentAt: 'desc'
              }
            }
          }
        })
        
        if (!alert) {
          return NextResponse.json(
            { error: 'Alert not found' },
            { status: 404 }
          )
        }
        
        return NextResponse.json(alert)
      } catch (error) {
        console.error('Get alert error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch alert' },
          { status: 500 }
        )
      }
    }
  )(req)
}

// PATCH /api/alerts/[id] - Update alert
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return withApiProtection()(
    async (authReq: AuthenticatedRequest) => {
      try {
        const body = await authReq.json()
        const validatedData = updateAlertSchema.parse(body)
        
        // Check if alert exists and belongs to user
        const existingAlert = await prisma.alert.findFirst({
          where: {
            id: params.id,
            userId: authReq.user!.id
          }
        })
        
        if (!existingAlert) {
          return NextResponse.json(
            { error: 'Alert not found' },
            { status: 404 }
          )
        }
        
        // Check SMS permission if changing to SMS
        if (validatedData.channels?.includes('sms')) {
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
        
        // Update alert
        const updatedAlert = await prisma.alert.update({
          where: { id: params.id },
          data: validatedData,
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
          }
        })
        
        return NextResponse.json({
          alert: updatedAlert,
          message: 'Alert updated successfully'
        })
        
      } catch (error) {
        console.error('Update alert error:', error)
        
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            { error: 'Invalid request data', details: error.errors },
            { status: 400 }
          )
        }
        
        return NextResponse.json(
          { error: 'Failed to update alert' },
          { status: 500 }
        )
      }
    }
  )(req)
}

// DELETE /api/alerts/[id] - Delete alert
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return withApiProtection()(
    async (authReq: AuthenticatedRequest) => {
      try {
        // Check if alert exists and belongs to user
        const existingAlert = await prisma.alert.findFirst({
          where: {
            id: params.id,
            userId: authReq.user!.id
          }
        })
        
        if (!existingAlert) {
          return NextResponse.json(
            { error: 'Alert not found' },
            { status: 404 }
          )
        }
        
        // Delete alert (cascade will delete rules and history)
        await prisma.alert.delete({
          where: { id: params.id }
        })
        
        return NextResponse.json({
          message: 'Alert deleted successfully'
        })
        
      } catch (error) {
        console.error('Delete alert error:', error)
        return NextResponse.json(
          { error: 'Failed to delete alert' },
          { status: 500 }
        )
      }
    }
  )(req)
}