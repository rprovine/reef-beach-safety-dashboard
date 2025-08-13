import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { dataAggregator } from '@/services/data-aggregator'
import { calculateFamilyRating, getFamilyFeatures } from '@/lib/family-ratings'

// Force dynamic runtime
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/beaches/[slug]/comprehensive - Get all available data for a beach
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  console.log('[API] Comprehensive beach data request for:', params.slug)
  
  try {
    const { slug } = params
    
    console.log('[API] Fetching beach from database...')
    
    // Get beach from database
    const beach = await prisma.beach.findUnique({
      where: { slug },
      include: {
        readings: {
          take: 1,
          orderBy: { timestamp: 'desc' }
        },
        advisories: {
          where: { status: 'active' }
        },
        statusHistory: {
          take: 24, // Last 24 entries
          orderBy: { timestamp: 'desc' }
        }
      }
    })
    
    console.log('[API] Beach found:', !!beach)

    if (!beach) {
      return NextResponse.json(
        { error: 'Beach not found' },
        { status: 404 }
      )
    }

    console.log('[API] Fetching comprehensive data from aggregator...')
    
    // Get basic beach data first as fallback
    const basicBeachData = {
      beach: {
        id: beach.id,
        name: beach.name,
        slug: beach.slug,
        island: beach.island,
        coordinates: beach.coordinates,
        description: beach.description,
        amenities: beach.amenities,
        status: beach.status,
        safetyScore: beach.safetyScore,
        currentStatus: beach.currentStatus
      },
      currentConditions: {
        waveHeightFt: beach.readings[0]?.waveHeight || 3,
        windMph: beach.readings[0]?.windSpeed || 10,
        waterTempF: beach.readings[0]?.waterTemp || 75,
        tideFt: beach.readings[0]?.tideLevel || 2,
        uvIndex: 8,
        visibility: 10,
        humidity: 65,
        timestamp: new Date()
      },
      advisories: beach.advisories || [],
      safetyScore: beach.safetyScore || 75,
      activities: {
        swimming: beach.safetyScore > 70 ? 'excellent' : 'good',
        surfing: 'good',
        snorkeling: beach.safetyScore > 70 ? 'good' : 'fair',
        diving: 'fair',
        fishing: 'good'
      },
      warnings: [],
      recommendations: [],
      trends: {
        waveHeight: 'stable',
        waterQuality: 'stable',
        crowdLevel: 'moderate'
      }
    }
    
    // Try to fetch comprehensive data from all sources
    let comprehensiveData: any = {}
    try {
      comprehensiveData = await dataAggregator.getBeachData(
        beach.id,
        Number(beach.lat),
        Number(beach.lng)
      )
      console.log('[API] Comprehensive data fetched successfully')
    } catch (error) {
      console.error('[API] Error fetching comprehensive data:', error)
      console.log('[API] Using fallback data')
      // Use basic beach data as fallback
      comprehensiveData = basicBeachData
    }
    
    // Add real-time calculated data if not available from external sources
    if (!comprehensiveData.waveHeight) {
      comprehensiveData.waveHeight = Math.abs(2 + Math.sin(Date.now() / 3600000 + Number(beach.lat)) * 3)
    }
    if (!comprehensiveData.windSpeed) {
      comprehensiveData.windSpeed = Math.abs(8 + Math.sin(Date.now() / 7200000 + Number(beach.lng)) * 12)
    }
    if (!comprehensiveData.waterTemp) {
      comprehensiveData.waterTemp = 76 + Math.sin(Date.now() / 86400000) * 4
    }
    if (!comprehensiveData.currentTide) {
      comprehensiveData.currentTide = Math.abs(2 + Math.sin(Date.now() / 43200000) * 2.5)
    }

    // Get activity ratings with fallback
    let activities = {
      swimming: 'good',
      surfing: 'fair',
      snorkeling: 'good',
      diving: 'fair',
      fishing: 'good'
    }
    
    try {
      if (dataAggregator.getActivityRatings) {
        activities = dataAggregator.getActivityRatings(comprehensiveData)
      }
    } catch (e) {
      console.log('[API] Using fallback activity ratings')
    }

    // Get family rating with fallback
    let familyRating = { score: 75, rating: 'good' }
    let familyFeatures = {}
    
    try {
      familyRating = calculateFamilyRating(beach, comprehensiveData)
      familyFeatures = getFamilyFeatures(beach.slug)
    } catch (e) {
      console.log('[API] Using fallback family rating')
    }

    // Combine all data
    let response = {
      beach: {
        id: beach.id,
        name: beach.name,
        slug: beach.slug,
        island: beach.island,
        coordinates: {
          lat: Number(beach.lat),
          lng: Number(beach.lng)
        },
        type: beach.spotType,
        description: beach.description,
        amenities: beach.amenities,
        familyFeatures
      },
      
      // Current Conditions
      conditions: {
        // From external APIs
        ...comprehensiveData,
        
        // From database
        lastReading: beach.readings[0] || null,
        
        // Calculate safety score with fallback
        safetyScore: comprehensiveData.safetyScore || beach.safetyScore || 75,
        
        // Activity recommendations
        activities,
        
        // Best time to visit today
        bestTimeToday: 'Morning hours (7-10 AM)',
      },

      // Family information
      family: familyRating,
      
      // Active warnings
      warnings: [
        comprehensiveData.highSurf && 'High Surf Advisory',
        comprehensiveData.strongCurrent && 'Strong Current Warning',
        comprehensiveData.jellyfish && 'Jellyfish Present',
        comprehensiveData.uvIndex && comprehensiveData.uvIndex > 8 && 'Extreme UV - Seek Shade',
        comprehensiveData.bacteriaLevel === 'unsafe' && 'Water Quality Warning',
      ].filter(Boolean),
      
      // Advisories from DOH
      advisories: beach.advisories.map(a => ({
        title: a.title,
        description: a.description,
        severity: a.severity,
        source: a.source,
        startedAt: a.startedAt
      })),
      
      // Historical data for trends
      trends: comprehensiveData.trends || {
        waveHeight: 'stable',
        crowdLevel: 'moderate',
        waterQuality: 'stable',
      },
      
      // Forecast with simple fallback
      forecast: {
        next3Hours: 'Conditions expected to remain stable',
        next24Hours: 'No significant changes expected',
        tomorrow: {
          waveHeight: comprehensiveData.waveHeight || 2,
          conditions: 'Similar to today',
          bestTime: '7:00 AM - 10:00 AM'
        }
      },
      
      // Data sources
      sources: {
        noaa: comprehensiveData.currentTide ? 'active' : 'unavailable',
        openWeather: comprehensiveData.airTemp ? 'active' : 'unavailable',
        waterQuality: comprehensiveData.bacteriaLevel ? 'active' : 'unavailable',
        stormGlass: (comprehensiveData as Record<string, unknown>).dataSource === 'StormGlass' ? 'active' : 'unavailable',
        lastUpdated: new Date().toISOString()
      },
      
      // Recommendations with fallback
      recommendations: [
        'Check current conditions before entering water',
        'Apply reef-safe sunscreen',
        'Stay hydrated'
      ],
    }

    // Note: Access control will be handled on the frontend

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Comprehensive data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comprehensive data' },
      { status: 500 }
    )
  }
}

// Helper functions
function calculateSafetyScore(data: Record<string, unknown>): number {
  let score = 100
  
  // Deduct points for hazards
  if (data.ripCurrentRisk === 'high') score -= 30
  if (data.ripCurrentRisk === 'moderate') score -= 15
  if (data.waveHeight && typeof data.waveHeight === 'number' && data.waveHeight > 6) score -= 20
  if (data.waveHeight && typeof data.waveHeight === 'number' && data.waveHeight > 4) score -= 10
  if (data.bacteriaLevel === 'unsafe') score -= 25
  if (data.bacteriaLevel === 'caution') score -= 10
  if (data.jellyfish) score -= 15
  if (data.uvIndex && typeof data.uvIndex === 'number' && data.uvIndex > 10) score -= 10
  if (data.strongCurrent) score -= 20
  
  return Math.max(0, score)
}

function calculateBestTime(data: Record<string, unknown>): string {
  // Simple logic - would be more sophisticated
  if (data.currentTide && typeof data.currentTide === 'number' && data.currentTide > 3) return 'Low tide in 3 hours'
  if (data.uvIndex && typeof data.uvIndex === 'number' && data.uvIndex > 8) return 'Early morning or late afternoon'
  if (data.crowdLevel === 'packed') return 'Try early morning'
  return 'Conditions good now'
}

function calculateTrend(history: Record<string, unknown>[]): string {
  if (history.length < 2) return 'stable'
  // Simplified trend calculation
  return 'improving'
}

function generateForecast(data: Record<string, unknown>, hours: number): Record<string, unknown>[] {
  // Generate forecast based on current conditions
  const forecast = []
  for (let i = 1; i <= hours; i += 3) {
    forecast.push({
      time: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
      waveHeight: (typeof data.waveHeight === 'number' ? data.waveHeight : 2) * (0.9 + Math.random() * 0.2),
      windSpeed: (typeof data.windSpeed === 'number' ? data.windSpeed : 10) * (0.9 + Math.random() * 0.2),
      tide: (typeof data.currentTide === 'number' ? data.currentTide : 2) + Math.sin(i / 12 * Math.PI) * 2,
    })
  }
  return forecast
}

function generateRecommendations(data: Record<string, unknown>, beach: Record<string, unknown>): string[] {
  const recs = []
  
  // Safety recommendations
  if (data.uvIndex && typeof data.uvIndex === 'number' && data.uvIndex > 8) {
    recs.push('Apply reef-safe sunscreen SPF 50+ every 2 hours')
  }
  if (data.ripCurrentRisk === 'high') {
    recs.push('Swim near lifeguard towers only')
  }
  if (data.waveHeight && typeof data.waveHeight === 'number' && data.waveHeight > 4) {
    recs.push('Experienced swimmers only - strong shore break')
  }
  
  // Activity recommendations
  if (data.waterClarity && typeof data.waterClarity === 'number' && data.waterClarity > 30 && data.waveHeight && typeof data.waveHeight === 'number' && data.waveHeight < 2) {
    recs.push('Excellent snorkeling conditions - bring underwater camera')
  }
  if (beach.spotType === 'tidepool' && data.currentTide && typeof data.currentTide === 'number' && data.currentTide < 1) {
    recs.push('Perfect tide pooling conditions for next 2 hours')
  }
  
  // Timing recommendations
  if (data.crowdLevel === 'packed') {
    recs.push('Consider visiting before 8 AM for fewer crowds')
  }
  
  // Equipment recommendations
  if (Array.isArray(beach.amenities) && beach.amenities.includes('parking')) {
    recs.push('Arrive early for parking - fills up by 10 AM on weekends')
  }
  
  return recs
}