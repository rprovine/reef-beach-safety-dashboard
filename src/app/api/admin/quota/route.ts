import { NextRequest, NextResponse } from 'next/server'
import { quotaManager } from '@/lib/api-quota'

export async function GET(req: NextRequest) {
  try {
    // Basic auth check (replace with proper admin auth)
    const authHeader = req.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const stats = quotaManager.getUsageStats()
    const resetTimes = quotaManager.getResetTime()
    
    return NextResponse.json({
      usage: stats,
      resetTimes,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to get quota stats:', error)
    return NextResponse.json(
      { error: 'Failed to get quota stats' },
      { status: 500 }
    )
  }
}

// Optional: Reset quotas for testing (dangerous - use carefully)
export async function POST(req: NextRequest) {
  try {
    // Admin auth
    const authHeader = req.headers.get('authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { action } = await req.json()
    
    if (action === 'reset-daily') {
      // This would reset daily counters - implement if needed
      return NextResponse.json({ message: 'Daily quotas reset' })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Failed to modify quotas:', error)
    return NextResponse.json(
      { error: 'Failed to modify quotas' },
      { status: 500 }
    )
  }
}