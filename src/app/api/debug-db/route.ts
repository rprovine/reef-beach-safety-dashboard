import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check if resetToken fields exist by trying to query them
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'User' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `
    
    return NextResponse.json({
      userTableColumns: result,
      message: 'Database schema check complete'
    })
  } catch (error) {
    console.error('Database debug error:', error)
    return NextResponse.json(
      { 
        error: 'Database check failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}