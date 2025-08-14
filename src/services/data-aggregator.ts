/**
 * Enhanced Data Aggregation Service
 * Fetches and combines data from ALL available APIs
 */

import { DATA_SOURCES, HAWAII_STATIONS, ComprehensiveBeachData } from '@/lib/data-sources'
import { noaaService } from '@/lib/api-integrations/noaa-service'
import { weatherService } from '@/lib/api-integrations/weather-service'
import { dataAggregator as libDataAggregator } from '@/lib/api-integrations/data-aggregator'
import { prisma } from '@/lib/prisma'

export class DataAggregatorService {
  private cache: Map<string, { data: Record<string, unknown>; timestamp: number }> = new Map()

  /**
   * Get comprehensive data for a beach - uses ALL available APIs
   */
  async getBeachData(beachId: string, lat: number, lng: number): Promise<Partial<ComprehensiveBeachData>> {
    // Use our new comprehensive data aggregator
    const beachSlug = await this.getBeachSlug(beachId)
    if (beachSlug) {
      try {
        const comprehensiveData = await libDataAggregator.getComprehensiveBeachData(beachSlug)
        return comprehensiveData
      } catch (error) {
        console.error('Error getting comprehensive data:', error)
      }
    }

    // Fallback to fetching individual sources
    const data: Partial<ComprehensiveBeachData> = {}

    // Fetch from ALL sources in parallel
    const [
      noaaData,
      weatherData,
      marineData,
      waterQuality,
      tideData,
      waveData,
      currentData,
      marineWeather,
      buoyData,
      webcams,
      pacioosData,
      dohData,
      satelliteData
    ] = await Promise.allSettled([
      this.fetchNOAAData(lat, lng),
      this.fetchWeatherData(lat, lng),
      this.fetchMarineData(lat, lng),
      this.fetchWaterQuality(beachId),
      this.fetchTideData(lat, lng),
      this.fetchWaveData(lat, lng),
      this.fetchCurrentData(lat, lng),
      this.fetchMarineWeather(lat, lng),
      this.fetchBuoyData(lat, lng),
      this.fetchWebcams(beachSlug || beachId),
      this.fetchPacIOOSData(lat, lng),
      this.fetchDOHData(beachId),
      this.fetchSatelliteData(lat, lng)
    ])

    // Combine ALL results
    if (noaaData.status === 'fulfilled' && noaaData.value) {
      Object.assign(data, noaaData.value)
    }
    if (weatherData.status === 'fulfilled' && weatherData.value) {
      Object.assign(data, weatherData.value)
    }
    if (marineData.status === 'fulfilled' && marineData.value) {
      Object.assign(data, marineData.value)
    }
    if (waterQuality.status === 'fulfilled' && waterQuality.value) {
      data.bacteriaLevel = waterQuality.value.bacteriaLevel
      data.enterococcus = waterQuality.value.enterococcus
      data.turbidity = waterQuality.value.turbidity
    }
    if (tideData.status === 'fulfilled' && tideData.value) {
      Object.assign(data, tideData.value)
    }
    if (waveData.status === 'fulfilled' && waveData.value) {
      Object.assign(data, waveData.value)
    }
    if (currentData.status === 'fulfilled' && currentData.value) {
      data.currentSpeed = currentData.value.speed
      data.currentDirection = currentData.value.direction
    }
    if (marineWeather.status === 'fulfilled' && marineWeather.value) {
      Object.assign(data, marineWeather.value)
    }
    if (buoyData.status === 'fulfilled' && buoyData.value) {
      Object.assign(data, buoyData.value)
    }
    if (webcams.status === 'fulfilled' && webcams.value) {
      data.webcamUrls = webcams.value.map((cam: any) => cam.url)
    }
    if (pacioosData.status === 'fulfilled' && pacioosData.value) {
      Object.assign(data, pacioosData.value)
    }
    if (dohData.status === 'fulfilled' && dohData.value) {
      data.activeAdvisories = dohData.value.advisories || []
    }
    if (satelliteData.status === 'fulfilled' && satelliteData.value) {
      data.algaePresent = satelliteData.value.algaeBloom || false
    }

    return data
  }

  /**
   * Fetch NOAA comprehensive data
   */
  async fetchNOAAData(lat: number, lng: number) {
    const cacheKey = `noaa-${lat}-${lng}`
    const cached = this.getFromCache(cacheKey, 5 * 60 * 1000) // 5 min cache
    if (cached) return cached

    try {
      const station = this.findNearestStation(lat, lng)
      
      const [tideData, currentData, waterTemp] = await Promise.all([
        noaaService.getTideData(station),
        noaaService.getCurrentData(station),
        noaaService.getWaterTemperature(station)
      ])

      const result = {
        currentTide: tideData.current,
        tideType: tideData.type,
        nextHighTide: tideData.nextHigh.time,
        nextLowTide: tideData.nextLow.time,
        tidalRange: Math.abs(tideData.nextHigh.height - tideData.nextLow.height),
        currentSpeed: currentData.speed,
        currentDirection: this.degreesToCompass(currentData.direction),
        waterTemp: waterTemp
      }

      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('NOAA fetch error:', error)
      return null
    }
  }

  /**
   * Fetch comprehensive weather data
   */
  async fetchWeatherData(lat: number, lng: number) {
    const cacheKey = `weather-${lat}-${lng}`
    const cached = this.getFromCache(cacheKey, 10 * 60 * 1000) // 10 min cache
    if (cached) return cached

    try {
      const weatherData = await weatherService.getWeatherData(lat, lng)
      
      const result = {
        airTemp: weatherData.temperature,
        humidity: weatherData.humidity,
        pressure: weatherData.pressure,
        visibility: weatherData.visibility,
        cloudCover: weatherData.cloudCover,
        precipitation: weatherData.precipitation,
        uvIndex: weatherData.uvIndex,
        windSpeed: weatherData.windSpeed,
        windDirection: this.degreesToCompass(weatherData.windDirection),
        windGusts: weatherData.windGust,
        forecast3Hour: weatherData.hourlyForecast.slice(0, 1),
        forecast24Hour: weatherData.hourlyForecast.slice(0, 8),
        forecast7Day: weatherData.dailyForecast
      }

      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('Weather fetch error:', error)
      return null
    }
  }

  /**
   * Fetch marine conditions
   */
  async fetchMarineData(lat: number, lng: number) {
    const cacheKey = `marine-${lat}-${lng}`
    const cached = this.getFromCache(cacheKey, 15 * 60 * 1000) // 15 min cache
    if (cached) return cached

    try {
      const marineData = await weatherService.getMarineData(lat, lng)
      
      const result = {
        waveHeight: marineData.waveHeight,
        wavePeriod: marineData.wavePeriod,
        waveDirection: this.degreesToCompass(marineData.waveDirection),
        swellHeight: marineData.swellHeight,
        swellPeriod: marineData.swellPeriod,
        swellDirection: this.degreesToCompass(marineData.swellDirection),
        windWaveHeight: marineData.windWaveHeight,
        windWavePeriod: marineData.windWavePeriod,
        waterClarity: marineData.visibility
      }

      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('Marine data fetch error:', error)
      return null
    }
  }

  /**
   * Fetch wave data from NOAA
   */
  async fetchWaveData(lat: number, lng: number) {
    try {
      const waveData = await noaaService.getWaveData(lat, lng)
      return {
        waveHeight: waveData.height,
        wavePeriod: waveData.period,
        waveDirection: this.degreesToCompass(waveData.direction),
        dominantPeriod: waveData.dominantPeriod,
        peakDirection: this.degreesToCompass(waveData.peakDirection)
      }
    } catch (error) {
      console.error('Wave data fetch error:', error)
      return null
    }
  }

  /**
   * Fetch current data
   */
  async fetchCurrentData(lat: number, lng: number) {
    try {
      const station = this.findNearestStation(lat, lng)
      const currentData = await noaaService.getCurrentData(station)
      return {
        speed: currentData.speed,
        direction: currentData.direction
      }
    } catch (error) {
      console.error('Current data fetch error:', error)
      return null
    }
  }

  /**
   * Fetch marine weather
   */
  async fetchMarineWeather(lat: number, lng: number) {
    try {
      const marineWeather = await noaaService.getMarineWeather(lat, lng)
      return {
        seas: marineWeather.seas,
        swells: marineWeather.swells
      }
    } catch (error) {
      console.error('Marine weather fetch error:', error)
      return null
    }
  }

  /**
   * Fetch buoy data
   */
  async fetchBuoyData(lat: number, lng: number) {
    try {
      const buoyData = await noaaService.getNearestBuoy(lat, lng)
      return {
        buoyName: buoyData.name,
        buoyDistance: this.calculateDistance(lat, lng, buoyData.lat, buoyData.lon),
        waterTemp: buoyData.waterTemp,
        waveHeight: buoyData.waveHeight,
        windSpeed: buoyData.windSpeed,
        pressure: buoyData.pressure
      }
    } catch (error) {
      console.error('Buoy data fetch error:', error)
      return null
    }
  }

  /**
   * Fetch webcams for beach (removed - no longer supported)
   */
  async fetchWebcams(beachSlug: string) {
    return []
  }

  /**
   * Fetch PacIOOS data (Hawaii-specific ocean data)
   */
  async fetchPacIOOSData(lat: number, lng: number) {
    const cacheKey = `pacioos-${lat}-${lng}`
    const cached = this.getFromCache(cacheKey, 30 * 60 * 1000) // 30 min cache
    if (cached) return cached

    try {
      // Fetch from PacIOOS API
      const response = await fetch(
        `${DATA_SOURCES.PACIOOS.BASE}/griddap/hmrg_bathymetry.json?` +
        `latitude,longitude,z&latitude>=${lat-0.1}&latitude<=${lat+0.1}` +
        `&longitude>=${lng-0.1}&longitude<=${lng+0.1}`
      )
      
      if (response.ok) {
        const data = await response.json()
        const result = {
          waterDepth: data.table?.rows?.[0]?.[2] || 0,
          bathymetry: data
        }
        this.setCache(cacheKey, result)
        return result
      }
    } catch (error) {
      console.error('PacIOOS fetch error:', error)
    }
    return null
  }

  /**
   * Fetch DOH water quality data
   */
  async fetchDOHData(beachId: string) {
    const cacheKey = `doh-${beachId}`
    const cached = this.getFromCache(cacheKey, 60 * 60 * 1000) // 1 hour cache
    if (cached) return cached

    try {
      // This would connect to Hawaii DOH API when available
      // For now, fetch from our database
      const beach = await prisma.beach.findUnique({
        where: { id: beachId },
        include: {
          advisories: {
            where: { status: 'active' }
          }
        }
      })

      const result = {
        advisories: beach?.advisories.map(a => a.title) || [],
        bacteriaWarning: beach?.advisories.some(a => a.title.toLowerCase().includes('bacteria'))
      }

      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('DOH data fetch error:', error)
      return null
    }
  }

  /**
   * Fetch satellite data for algae blooms
   */
  async fetchSatelliteData(lat: number, lng: number) {
    const cacheKey = `satellite-${lat}-${lng}`
    const cached = this.getFromCache(cacheKey, 24 * 60 * 60 * 1000) // 24 hour cache
    if (cached) return cached

    try {
      // Return null - satellite data requires real API integration
      return null

      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('Satellite data fetch error:', error)
      return null
    }
  }

  /**
   * Fetch water quality from database
   */
  async fetchWaterQuality(beachId: string) {
    const cacheKey = `water-quality-${beachId}`
    const cached = this.getFromCache(cacheKey, 60 * 60 * 1000) // 1 hour cache
    if (cached) return cached

    try {
      // Fetch from database
      const beach = await prisma.beach.findUnique({
        where: { id: beachId },
        include: {
          readings: {
            orderBy: { timestamp: 'desc' },
            take: 1
          }
        }
      })

      const latestReading = beach?.readings[0]
      
      const result = {
        bacteriaLevel: latestReading?.bacteriaLevel || null,
        enterococcus: null, // Requires real DOH data
        turbidity: null // Requires real sensor data
      }

      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('Water quality fetch error:', error)
      return null
    }
  }

  /**
   * Fetch tide data
   */
  async fetchTideData(lat: number, lng: number) {
    try {
      const station = this.findNearestStation(lat, lng)
      const tideData = await noaaService.getTideData(station)
      
      return {
        currentTide: tideData.current,
        nextHighTide: tideData.nextHigh.time,
        nextLowTide: tideData.nextLow.time,
        predictions: tideData.predictions
      }
    } catch (error) {
      console.error('Tide data fetch error:', error)
      return null
    }
  }

  /**
   * Helper: Get beach slug from ID
   */
  private async getBeachSlug(beachId: string): Promise<string | null> {
    try {
      const beach = await prisma.beach.findUnique({
        where: { id: beachId },
        select: { slug: true }
      })
      return beach?.slug || null
    } catch {
      return null
    }
  }

  /**
   * Helper: Find nearest NOAA station
   */
  private findNearestStation(lat: number, lng: number): string {
    // Determine which island based on coordinates
    if (lat > 21.5 && lng < -157.5) {
      return HAWAII_STATIONS.OAHU.HONOLULU // Oahu North Shore
    } else if (lat > 21 && lat < 21.5 && lng < -157.5) {
      return HAWAII_STATIONS.OAHU.HONOLULU // Oahu South Shore
    } else if (lat > 20.5 && lat < 21 && lng > -157 && lng < -156) {
      return HAWAII_STATIONS.MAUI.KAHULUI // Maui
    } else if (lat > 21.8 && lng < -159) {
      return HAWAII_STATIONS.KAUAI.NAWILIWILI // Kauai
    } else if (lat < 20 && lng < -155) {
      return HAWAII_STATIONS.HAWAII.HILO // Big Island
    }
    
    return HAWAII_STATIONS.OAHU.HONOLULU // Default
  }

  /**
   * Helper: Calculate distance between coordinates
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  /**
   * Helper: Convert degrees to compass direction
   */
  private degreesToCompass(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

  /**
   * Cache helpers
   */
  private getFromCache(key: string, maxAge: number): Record<string, unknown> | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < maxAge) {
      return cached.data
    }
    return null
  }

  private setCache(key: string, data: Record<string, unknown>): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }
}

// Export singleton instance
export const dataAggregatorService = new DataAggregatorService()
export const dataAggregator = dataAggregatorService