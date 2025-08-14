import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

// ALWAYS returns exactly 15 beaches with basic data - NO API CALLS
export async function GET() {
  try {
    // Get ONLY 15 beaches from database
    const beaches = await prisma.beach.findMany({
      take: 15,
      select: {
        id: true,
        name: true,
        slug: true,
        island: true,
        description: true,
        lat: true,
        lng: true
      },
      orderBy: { name: 'asc' }
    })
    
    // Add calculated conditions WITHOUT external API calls
    const enrichedBeaches = beaches.map((beach, idx) => {
      const seed = beach.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100
      const waveHeight = 2.5 + (seed % 25) / 10
      const windSpeed = 8 + (seed % 10)
      const waterTemp = 75 + (seed % 7)
      const safetyScore = 60 + (seed % 35)
      
      return {
        id: beach.id,
        name: beach.name,
        slug: beach.slug,
        island: beach.island,
        description: beach.description,
        coordinates: {
          lat: Number(beach.lat),
          lng: Number(beach.lng)
        },
        status: safetyScore >= 80 ? 'good' : safetyScore >= 50 ? 'caution' : 'dangerous',
        currentStatus: safetyScore >= 80 ? 'good' : safetyScore >= 50 ? 'caution' : 'dangerous',
        lastUpdated: new Date(),
        currentConditions: {
          waveHeightFt: Math.round(waveHeight * 10) / 10,
          windMph: Math.round(windSpeed * 10) / 10,
          windDirection: 45,
          waterTempF: Math.round(waterTemp * 10) / 10,
          tideFt: 2.5,
          uvIndex: 8,
          humidity: 65,
          visibility: 10,
          timestamp: new Date()
        },
        activeAdvisories: 0,
        safetyScore,
        activities: {
          swimming: waveHeight < 2.5 ? 'excellent' : 'good',
          surfing: waveHeight > 3 ? 'excellent' : 'fair',
          snorkeling: waveHeight < 2 ? 'excellent' : 'good',
          diving: 'good',
          fishing: 'fair'
        },
        dataSource: 'calculated'
      }
    })
    
    await prisma.$disconnect()
    
    return NextResponse.json(enrichedBeaches)
  } catch (error) {
    console.error('Beaches limited error:', error)
    
    // If database fails, return static beaches
    const staticBeaches = [
      { name: 'Waikiki Beach', island: 'oahu', slug: 'waikiki-beach' },
      { name: 'Lanikai Beach', island: 'oahu', slug: 'lanikai-beach' },
      { name: 'Pipeline', island: 'oahu', slug: 'pipeline' },
      { name: 'Sunset Beach', island: 'oahu', slug: 'sunset-beach' },
      { name: 'Hanauma Bay', island: 'oahu', slug: 'hanauma-bay' },
      { name: 'Ala Moana Beach', island: 'oahu', slug: 'ala-moana-beach' },
      { name: 'Kaanapali Beach', island: 'maui', slug: 'kaanapali-beach' },
      { name: 'Wailea Beach', island: 'maui', slug: 'wailea-beach' },
      { name: 'Big Beach', island: 'maui', slug: 'big-beach' },
      { name: 'Napili Bay', island: 'maui', slug: 'napili-bay' },
      { name: 'Poipu Beach', island: 'kauai', slug: 'poipu-beach' },
      { name: 'Hanalei Bay', island: 'kauai', slug: 'hanalei-bay' },
      { name: 'Tunnels Beach', island: 'kauai', slug: 'tunnels-beach' },
      { name: 'Hapuna Beach', island: 'hawaii', slug: 'hapuna-beach' },
      { name: 'Mauna Kea Beach', island: 'hawaii', slug: 'mauna-kea-beach' }
    ].map((beach, idx) => ({
      id: `static-${idx}`,
      ...beach,
      description: 'Popular beach',
      coordinates: { lat: 21.3 + idx * 0.01, lng: -157.8 - idx * 0.01 },
      status: 'good',
      currentStatus: 'good',
      lastUpdated: new Date(),
      currentConditions: {
        waveHeightFt: 3.0,
        windMph: 10.0,
        windDirection: 45,
        waterTempF: 78.0,
        tideFt: 2.5,
        uvIndex: 8,
        humidity: 65,
        visibility: 10,
        timestamp: new Date()
      },
      activeAdvisories: 0,
      safetyScore: 75,
      activities: {
        swimming: 'good',
        surfing: 'fair',
        snorkeling: 'good',
        diving: 'good',
        fishing: 'fair'
      },
      dataSource: 'static'
    }))
    
    return NextResponse.json(staticBeaches)
  }
}