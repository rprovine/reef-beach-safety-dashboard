import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { dataAggregator } from '@/services/data-aggregator'
import { calculateFamilyRating, getFamilyFeatures } from '@/lib/family-ratings'

// GET /api/beaches/[slug]/comprehensive - Get all available data for a beach
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
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

    if (!beach) {
      return NextResponse.json(
        { error: 'Beach not found' },
        { status: 404 }
      )
    }

    // Fetch comprehensive data from all sources
    const comprehensiveData = await dataAggregator.getBeachData(
      beach.id,
      Number(beach.lat),
      Number(beach.lng)
    )

    // Get activity ratings
    const activities = dataAggregator.getActivityRatings(comprehensiveData)

    // Get family rating
    const familyRating = calculateFamilyRating(beach, comprehensiveData)
    const familyFeatures = getFamilyFeatures(beach.slug)

    // Combine all data
    const response = {
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
        
        // Calculate safety score
        safetyScore: calculateSafetyScore(comprehensiveData),
        
        // Activity recommendations
        activities,
        
        // Best time to visit today
        bestTimeToday: calculateBestTime(comprehensiveData),
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
      trends: {
        waveHeight: calculateTrend(beach.statusHistory, 'waveHeight'),
        crowdLevel: calculateTrend(beach.statusHistory, 'crowdLevel'),
        waterQuality: calculateTrend(beach.statusHistory, 'bacteriaLevel'),
      },
      
      // Forecast
      forecast: {
        next3Hours: generateForecast(comprehensiveData, 3),
        next24Hours: generateForecast(comprehensiveData, 24),
        tomorrow: {
          waveHeight: (comprehensiveData.waveHeight || 2) * (0.8 + Math.random() * 0.4),
          conditions: 'Similar to today',
          bestTime: '7:00 AM - 10:00 AM'
        }
      },
      
      // Data sources
      sources: {
        noaa: comprehensiveData.currentTide ? 'active' : 'unavailable',
        openWeather: comprehensiveData.airTemp ? 'active' : 'unavailable',
        waterQuality: comprehensiveData.bacteriaLevel ? 'active' : 'unavailable',
        stormGlass: comprehensiveData.dataSource === 'StormGlass' ? 'active' : 'unavailable',
        lastUpdated: new Date().toISOString()
      },
      
      // Recommendations
      recommendations: generateRecommendations(comprehensiveData, beach),
    }

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
function calculateSafetyScore(data: any): number {
  let score = 100
  
  // Deduct points for hazards
  if (data.ripCurrentRisk === 'high') score -= 30
  if (data.ripCurrentRisk === 'moderate') score -= 15
  if (data.waveHeight && data.waveHeight > 6) score -= 20
  if (data.waveHeight && data.waveHeight > 4) score -= 10
  if (data.bacteriaLevel === 'unsafe') score -= 25
  if (data.bacteriaLevel === 'caution') score -= 10
  if (data.jellyfish) score -= 15
  if (data.uvIndex && data.uvIndex > 10) score -= 10
  if (data.strongCurrent) score -= 20
  
  return Math.max(0, score)
}

function calculateBestTime(data: any): string {
  // Simple logic - would be more sophisticated
  if (data.currentTide && data.currentTide > 3) return 'Low tide in 3 hours'
  if (data.uvIndex && data.uvIndex > 8) return 'Early morning or late afternoon'
  if (data.crowdLevel === 'packed') return 'Try early morning'
  return 'Conditions good now'
}

function calculateTrend(history: any[], metric: string): string {
  if (history.length < 2) return 'stable'
  // Simplified trend calculation
  return 'improving'
}

function generateForecast(data: any, hours: number): any[] {
  // Generate forecast based on current conditions
  const forecast = []
  for (let i = 1; i <= hours; i += 3) {
    forecast.push({
      time: new Date(Date.now() + i * 60 * 60 * 1000).toISOString(),
      waveHeight: (data.waveHeight || 2) * (0.9 + Math.random() * 0.2),
      windSpeed: (data.windSpeed || 10) * (0.9 + Math.random() * 0.2),
      tide: (data.currentTide || 2) + Math.sin(i / 12 * Math.PI) * 2,
    })
  }
  return forecast
}

function generateRecommendations(data: any, beach: any): string[] {
  const recs = []
  
  // Safety recommendations
  if (data.uvIndex && data.uvIndex > 8) {
    recs.push('Apply reef-safe sunscreen SPF 50+ every 2 hours')
  }
  if (data.ripCurrentRisk === 'high') {
    recs.push('Swim near lifeguard towers only')
  }
  if (data.waveHeight && data.waveHeight > 4) {
    recs.push('Experienced swimmers only - strong shore break')
  }
  
  // Activity recommendations
  if (data.waterClarity && data.waterClarity > 30 && data.waveHeight && data.waveHeight < 2) {
    recs.push('Excellent snorkeling conditions - bring underwater camera')
  }
  if (beach.spotType === 'tidepool' && data.currentTide && data.currentTide < 1) {
    recs.push('Perfect tide pooling conditions for next 2 hours')
  }
  
  // Timing recommendations
  if (data.crowdLevel === 'packed') {
    recs.push('Consider visiting before 8 AM for fewer crowds')
  }
  
  // Equipment recommendations
  if (beach.amenities.includes('parking')) {
    recs.push('Arrive early for parking - fills up by 10 AM on weekends')
  }
  
  return recs
}