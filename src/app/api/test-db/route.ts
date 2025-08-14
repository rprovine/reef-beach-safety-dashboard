import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Simple test query
    const beachCount = await prisma.beach.count()
    
    return NextResponse.json({
      success: true,
      beachCount,
      databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
    }, { status: 500 })
  }
}