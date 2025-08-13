/**
 * Master Data Aggregation Service
 * Combines data from all sources to provide comprehensive beach information
 */

import { noaaService } from './noaa-service'
import { weatherService } from './weather-service'
import { prisma } from '@/lib/prisma'
import { getBeachWebcams } from '@/lib/hawaii-webcams'
import type { ComprehensiveBeachData } from '@/lib/data-sources'

// Beach coordinate mapping
const BEACH_COORDINATES: { [key: string]: { lat: number; lng: number; stationId: string } } = {
  'waikiki-beach': { lat: 21.2767, lng: -157.8295, stationId: '1612340' },
  'pipeline': { lat: 21.6650, lng: -158.0530, stationId: '1615680' },
  'sunset-beach': { lat: 21.6794, lng: -158.0412, stationId: '1615680' },
  'hanauma-bay': { lat: 21.2690, lng: -157.6938, stationId: '1612340' },
  'sandy-beach': { lat: 21.2853, lng: -157.6719, stationId: '1612340' },
  'lanikai-beach': { lat: 21.3927, lng: -157.7144, stationId: '1612480' },
  'kaanapali-beach': { lat: 20.9244, lng: -156.6950, stationId: '1615680' },
  'wailea-beach': { lat: 20.6919, lng: -156.4419, stationId: '1615680' },
  'poipu-beach': { lat: 21.8713, lng: -159.4576, stationId: '1611400' },
  'hanalei-bay': { lat: 22.2038, lng: -159.5016, stationId: '1611400' },
  'kailua-bay': { lat: 19.6400, lng: -155.9969, stationId: '1617433' },
  'hapuna-beach': { lat: 19.9927, lng: -155.8241, stationId: '1617433' }
}

export class DataAggregator {
  // Get all available data for a beach
  async getComprehensiveBeachData(beachSlug: string): Promise<ComprehensiveBeachData> {
    try {
      // Get beach coordinates
      const coords = BEACH_COORDINATES[beachSlug] || { lat: 21.3099, lng: -157.8581, stationId: '1612340' }
      
      // Fetch all data sources in parallel
      const [
        tideData,
        waveData,
        currentData,
        marineWeather,
        buoyData,
        waterTemp,
        weatherData,
        marineData,
        dbData,
        webcams
      ] = await Promise.all([
        noaaService.getTideData(coords.stationId).catch(err => {
          console.error('Tide data error:', err)
          return null
        }),
        noaaService.getWaveData(coords.lat, coords.lng).catch(err => {
          console.error('Wave data error:', err)
          return null
        }),
        noaaService.getCurrentData(coords.stationId).catch(err => {
          console.error('Current data error:', err)
          return null
        }),
        noaaService.getMarineWeather(coords.lat, coords.lng).catch(err => {
          console.error('Marine weather error:', err)
          return null
        }),
        noaaService.getNearestBuoy(coords.lat, coords.lng).catch(err => {
          console.error('Buoy data error:', err)
          return null
        }),
        noaaService.getWaterTemperature(coords.stationId).catch(err => {
          console.error('Water temp error:', err)
          return 75
        }),
        weatherService.getWeatherData(coords.lat, coords.lng).catch(err => {
          console.error('Weather data error:', err)
          return null
        }),
        weatherService.getMarineData(coords.lat, coords.lng).catch(err => {
          console.error('Marine data error:', err)
          return null
        }),
        this.getBeachFromDatabase(beachSlug).catch(err => {
          console.error('Database error:', err)
          return null
        }),
        getBeachWebcams(beachSlug)
      ])
      
      // Determine rip current risk based on conditions
      const ripCurrentRisk = this.calculateRipCurrentRisk(
        waveData?.height || 0,
        tideData?.type || 'rising',
        currentData?.speed || 0
      )
      
      // Calculate crowd level based on time and day
      const crowdLevel = this.estimateCrowdLevel(new Date())
      
      // Determine safety warnings
      const warnings = this.determineWarnings({
        waveHeight: waveData?.height || marineData?.waveHeight || 0,
        windSpeed: weatherData?.windSpeed || 0,
        uvIndex: weatherData?.uvIndex || 0,
        bacteriaLevel: dbData?.bacteriaLevel || 'safe'
      })
      
      // Calculate activity ratings
      const activities = this.calculateActivityRatings({
        waveHeight: waveData?.height || marineData?.waveHeight || 0,
        windSpeed: weatherData?.windSpeed || 0,
        waterTemp: waterTemp || 75,
        visibility: marineData?.visibility || 10,
        currentSpeed: currentData?.speed || 0
      })
      
      // Compile comprehensive data
      const comprehensiveData: ComprehensiveBeachData = {
        // Ocean Conditions
        waveHeight: waveData?.height || marineData?.waveHeight || 0,
        wavePeriod: waveData?.period || marineData?.wavePeriod || 0,
        waveDirection: this.degreesToCompass(waveData?.direction || marineData?.waveDirection || 0),
        swellHeight: waveData?.swellHeight || marineData?.swellHeight || 0,
        swellPeriod: waveData?.swellPeriod || marineData?.swellPeriod || 0,
        swellDirection: this.degreesToCompass(waveData?.swellDirection || marineData?.swellDirection || 0),
        
        // Wind
        windSpeed: weatherData?.windSpeed || buoyData?.windSpeed || 0,
        windDirection: this.degreesToCompass(weatherData?.windDirection || buoyData?.windDirection || 0),
        windGusts: weatherData?.windGust || buoyData?.windGust || 0,
        
        // Water
        waterTemp: waterTemp || buoyData?.waterTemp || 75,
        waterClarity: marineData?.visibility || 10,
        salinity: 35, // Standard ocean salinity
        pH: 8.2, // Standard ocean pH
        
        // Tides
        currentTide: tideData?.current || 0,
        nextHighTide: tideData?.nextHigh?.time || new Date(),
        nextLowTide: tideData?.nextLow?.time || new Date(),
        tidalRange: Math.abs((tideData?.nextHigh?.height || 0) - (tideData?.nextLow?.height || 0)),
        
        // Currents
        currentSpeed: currentData?.speed || marineData?.currentSpeed || 0,
        currentDirection: this.degreesToCompass(currentData?.direction || marineData?.currentDirection || 0),
        ripCurrentRisk,
        
        // Weather
        airTemp: weatherData?.temperature || buoyData?.airTemp || 80,
        humidity: weatherData?.humidity || 70,
        pressure: weatherData?.pressure || buoyData?.pressure || 1013,
        visibility: weatherData?.visibility || marineData?.visibility || 10,
        precipitation: weatherData?.precipitation || 0,
        cloudCover: weatherData?.cloudCover || 20,
        
        // UV & Sun
        uvIndex: weatherData?.uvIndex || 8,
        sunrise: this.getSunrise(coords.lat, coords.lng),
        sunset: this.getSunset(coords.lat, coords.lng),
        firstLight: this.getFirstLight(coords.lat, coords.lng),
        lastLight: this.getLastLight(coords.lat, coords.lng),
        
        // Water Quality
        bacteriaLevel: dbData?.bacteriaLevel || 'safe',
        enterococcus: dbData?.enterococcus || 10,
        turbidity: dbData?.turbidity || 1,
        algaePresent: dbData?.algaePresent || false,
        
        // Safety Warnings
        highSurf: warnings.highSurf,
        strongCurrent: warnings.strongCurrent,
        jellyfish: warnings.jellyfish,
        sharkSighting: dbData?.sharkSighting || false,
        sealPresent: dbData?.sealPresent || false,
        
        // Environmental
        coralHealth: dbData?.coralHealth || 'good',
        reefCoverage: dbData?.reefCoverage || 30,
        fishDiversity: dbData?.fishDiversity || 'medium',
        
        // Amenities Status
        lifeguardOnDuty: this.isLifeguardOnDuty(new Date()),
        restroomsOpen: true,
        showersAvailable: true,
        parkingSpaces: 100,
        
        // Crowd Level
        crowdLevel,
        estimatedPeople: this.estimatePeopleCount(crowdLevel),
        
        // Webcams
        webcamUrls: webcams.map(cam => cam.url),
        lastWebcamUpdate: new Date(),
        
        // Forecasts
        forecast3Hour: weatherData?.hourlyForecast?.slice(0, 1) || [],
        forecast24Hour: weatherData?.hourlyForecast?.slice(0, 8) || [],
        forecast7Day: weatherData?.dailyForecast || [],
        
        // Advisories
        activeAdvisories: dbData?.advisories || [],
        tsunamiWarning: false,
        hurricaneWarning: false,
        
        // Best For (activities)
        swimming: activities.swimming,
        surfing: activities.surfing,
        snorkeling: activities.snorkeling,
        diving: activities.diving,
        fishing: activities.fishing,
        
        // Recent Reports
        userReports: [],
        officialReports: [],
        
        // Historical Comparison
        vs24HoursAgo: {},
        vs7DaysAgo: {},
        vsMonthlyAverage: {}
      }
      
      // Store the data in database for historical tracking
      await this.storeReading(beachSlug, comprehensiveData)
      
      return comprehensiveData
    } catch (error) {
      console.error('Error aggregating beach data:', error)
      throw error
    }
  }
  
  // Get beach data from database
  private async getBeachFromDatabase(beachSlug: string) {
    const beach = await prisma.beach.findUnique({
      where: { slug: beachSlug },
      include: {
        readings: {
          orderBy: { timestamp: 'desc' },
          take: 1
        },
        advisories: {
          where: { status: 'active' }
        }
      }
    })
    
    if (!beach) return null
    
    const latestReading = beach.readings[0]
    
    return {
      bacteriaLevel: latestReading?.bacteriaLevel || 'safe',
      enterococcus: 10,
      turbidity: 1,
      algaePresent: false,
      sharkSighting: false,
      sealPresent: false,
      coralHealth: 'good' as const,
      reefCoverage: 30,
      fishDiversity: 'medium' as const,
      advisories: beach.advisories.map(a => a.title)
    }
  }
  
  // Store reading in database
  private async storeReading(beachSlug: string, data: ComprehensiveBeachData) {
    try {
      const beach = await prisma.beach.findUnique({
        where: { slug: beachSlug }
      })
      
      if (!beach) return
      
      await prisma.reading.create({
        data: {
          beachId: beach.id,
          timestamp: new Date(),
          waveHeightFt: data.waveHeight,
          windMph: data.windSpeed,
          windDirDeg: this.compassToDegrees(data.windDirection),
          waterTempF: data.waterTemp,
          tideFt: data.currentTide,
          bacteriaLevel: data.bacteriaLevel,
          source: 'api_aggregator',
          rawData: data as any
        }
      })
      
      // Update status history
      const status = this.determineStatus(data)
      await prisma.statusHistory.create({
        data: {
          beachId: beach.id,
          status,
          reason: {
            waveHeight: data.waveHeight,
            windSpeed: data.windSpeed,
            warnings: data.activeAdvisories
          }
        }
      })
    } catch (error) {
      console.error('Error storing reading:', error)
    }
  }
  
  // Helper functions
  private calculateRipCurrentRisk(waveHeight: number, tideType: string, currentSpeed: number): 'low' | 'moderate' | 'high' {
    let risk = 0
    
    if (waveHeight > 6) risk += 3
    else if (waveHeight > 4) risk += 2
    else if (waveHeight > 2) risk += 1
    
    if (tideType === 'falling' || tideType === 'low') risk += 1
    
    if (currentSpeed > 2) risk += 2
    else if (currentSpeed > 1) risk += 1
    
    if (risk >= 5) return 'high'
    if (risk >= 3) return 'moderate'
    return 'low'
  }
  
  private estimateCrowdLevel(date: Date): 'empty' | 'light' | 'moderate' | 'crowded' | 'packed' {
    const hour = date.getHours()
    const day = date.getDay()
    
    // Weekend
    if (day === 0 || day === 6) {
      if (hour >= 10 && hour <= 16) return 'packed'
      if (hour >= 8 && hour <= 18) return 'crowded'
      return 'moderate'
    }
    
    // Weekday
    if (hour >= 11 && hour <= 14) return 'crowded'
    if (hour >= 9 && hour <= 17) return 'moderate'
    if (hour >= 6 && hour <= 19) return 'light'
    return 'empty'
  }
  
  private estimatePeopleCount(crowdLevel: string): number {
    switch (crowdLevel) {
      case 'empty': return 0
      case 'light': return 10
      case 'moderate': return 50
      case 'crowded': return 150
      case 'packed': return 300
      default: return 0
    }
  }
  
  private determineWarnings(conditions: any) {
    return {
      highSurf: conditions.waveHeight > 8,
      strongCurrent: conditions.waveHeight > 6 || conditions.windSpeed > 25,
      jellyfish: Math.random() > 0.9, // Random for now
      uvExtreme: conditions.uvIndex >= 11
    }
  }
  
  private calculateActivityRatings(conditions: any) {
    const ratings: any = {}
    
    // Swimming
    if (conditions.waveHeight < 2 && conditions.windSpeed < 15) {
      ratings.swimming = 'excellent'
    } else if (conditions.waveHeight < 3 && conditions.windSpeed < 20) {
      ratings.swimming = 'good'
    } else if (conditions.waveHeight < 4) {
      ratings.swimming = 'fair'
    } else if (conditions.waveHeight < 6) {
      ratings.swimming = 'poor'
    } else {
      ratings.swimming = 'dangerous'
    }
    
    // Surfing
    if (conditions.waveHeight < 2) {
      ratings.surfing = 'flat'
    } else if (conditions.waveHeight >= 4 && conditions.waveHeight <= 8) {
      ratings.surfing = 'excellent'
    } else if (conditions.waveHeight >= 3 && conditions.waveHeight <= 10) {
      ratings.surfing = 'good'
    } else if (conditions.waveHeight >= 2) {
      ratings.surfing = 'fair'
    } else {
      ratings.surfing = 'poor'
    }
    
    // Snorkeling
    if (conditions.waveHeight < 1.5 && conditions.visibility > 15) {
      ratings.snorkeling = 'excellent'
    } else if (conditions.waveHeight < 2 && conditions.visibility > 10) {
      ratings.snorkeling = 'good'
    } else if (conditions.waveHeight < 3) {
      ratings.snorkeling = 'fair'
    } else {
      ratings.snorkeling = 'poor'
    }
    
    // Diving
    if (conditions.waveHeight < 2 && conditions.currentSpeed < 1 && conditions.visibility > 20) {
      ratings.diving = 'excellent'
    } else if (conditions.waveHeight < 3 && conditions.visibility > 15) {
      ratings.diving = 'good'
    } else if (conditions.waveHeight < 4) {
      ratings.diving = 'fair'
    } else {
      ratings.diving = 'poor'
    }
    
    // Fishing
    if (conditions.windSpeed < 15 && conditions.waveHeight < 3) {
      ratings.fishing = 'excellent'
    } else if (conditions.windSpeed < 20 && conditions.waveHeight < 4) {
      ratings.fishing = 'good'
    } else if (conditions.windSpeed < 25) {
      ratings.fishing = 'fair'
    } else {
      ratings.fishing = 'poor'
    }
    
    return ratings
  }
  
  private determineStatus(data: ComprehensiveBeachData): string {
    if (data.highSurf || data.strongCurrent || data.bacteriaLevel === 'unsafe') {
      return 'red'
    }
    if (data.waveHeight > 4 || data.windSpeed > 20 || data.bacteriaLevel === 'caution') {
      return 'yellow'
    }
    return 'green'
  }
  
  private isLifeguardOnDuty(date: Date): boolean {
    const hour = date.getHours()
    return hour >= 8 && hour <= 17
  }
  
  private degreesToCompass(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }
  
  private compassToDegrees(compass: string): number {
    const directions: { [key: string]: number } = {
      'N': 0, 'NNE': 22.5, 'NE': 45, 'ENE': 67.5,
      'E': 90, 'ESE': 112.5, 'SE': 135, 'SSE': 157.5,
      'S': 180, 'SSW': 202.5, 'SW': 225, 'WSW': 247.5,
      'W': 270, 'WNW': 292.5, 'NW': 315, 'NNW': 337.5
    }
    return directions[compass] || 0
  }
  
  private getSunrise(lat: number, lng: number): Date {
    // Simplified calculation - would use astronomy library in production
    const sunrise = new Date()
    sunrise.setHours(6, 30, 0, 0)
    return sunrise
  }
  
  private getSunset(lat: number, lng: number): Date {
    const sunset = new Date()
    sunset.setHours(18, 30, 0, 0)
    return sunset
  }
  
  private getFirstLight(lat: number, lng: number): Date {
    const firstLight = new Date()
    firstLight.setHours(6, 0, 0, 0)
    return firstLight
  }
  
  private getLastLight(lat: number, lng: number): Date {
    const lastLight = new Date()
    lastLight.setHours(19, 0, 0, 0)
    return lastLight
  }
}

// Export singleton instance
export const dataAggregator = new DataAggregator()