import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    // Test environment variables
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
      NODE_ENV: process.env.NODE_ENV
    }
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      environment: envCheck,
      timestamp: new Date().toISOString(),
      queryResult: result
    })
    
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: error instanceof Error ? error.message : String(error),
        database: 'disconnected',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}