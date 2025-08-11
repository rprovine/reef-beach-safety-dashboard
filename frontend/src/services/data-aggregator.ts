/**
 * Data Aggregation Service
 * Fetches and combines data from multiple APIs
 */

import { DATA_SOURCES, HAWAII_STATIONS, API_KEYS, ComprehensiveBeachData } from '@/lib/data-sources'

export class DataAggregatorService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()

  /**
   * Get comprehensive data for a beach
   */
  async getBeachData(beachId: string, lat: number, lng: number): Promise<Partial<ComprehensiveBeachData>> {
    const data: Partial<ComprehensiveBeachData> = {}

    // Fetch from multiple sources in parallel
    const [
      noaaData,
      weatherData,
      waterQuality,
      uvData,
      tideData,
      stormglassData,
      // Add more as needed
    ] = await Promise.allSettled([
      this.fetchNOAAData(lat, lng),
      this.fetchWeatherData(lat, lng),
      this.fetchWaterQuality(beachId),
      this.fetchUVIndex(lat, lng),
      this.fetchTideData(lat, lng),
      this.fetchStormGlassData(lat, lng),
    ])

    // Combine results
    if (noaaData.status === 'fulfilled' && noaaData.value) {
      Object.assign(data, noaaData.value)
    }
    if (weatherData.status === 'fulfilled' && weatherData.value) {
      Object.assign(data, weatherData.value)
    }
    if (waterQuality.status === 'fulfilled' && waterQuality.value) {
      data.bacteriaLevel = waterQuality.value.bacteriaLevel
      data.enterococcus = waterQuality.value.enterococcus
    }
    if (uvData.status === 'fulfilled' && uvData.value) {
      data.uvIndex = uvData.value.uvIndex
    }
    if (tideData.status === 'fulfilled' && tideData.value) {
      Object.assign(data, tideData.value)
    }
    if (stormglassData.status === 'fulfilled' && stormglassData.value) {
      Object.assign(data, stormglassData.value)
    }

    return data
  }

  /**
   * Fetch NOAA tide and current data
   */
  async fetchNOAAData(lat: number, lng: number) {
    const cacheKey = `noaa-${lat}-${lng}`
    const cached = this.getFromCache(cacheKey, 5 * 60 * 1000) // 5 min cache
    if (cached) return cached

    try {
      // Find nearest station
      const station = this.findNearestStation(lat, lng)
      
      const params = new URLSearchParams({
        product: 'predictions',
        application: 'reef_beach_safety',
        begin_date: new Date().toISOString().split('T')[0].replace(/-/g, ''),
        end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, ''),
        datum: 'MLLW',
        station: station,
        time_zone: 'lst_ldt',
        units: 'english',
        interval: 'hilo',
        format: 'json'
      })

      const response = await fetch(`${DATA_SOURCES.NOAA.TIDES}?${params}`)
      const data = await response.json()

      const result = {
        tides: data.predictions,
        currentTide: this.getCurrentTide(data.predictions),
        nextHighTide: this.getNextHighTide(data.predictions),
        nextLowTide: this.getNextLowTide(data.predictions),
      }

      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('NOAA fetch error:', error)
      return null
    }
  }

  /**
   * Fetch weather data from OpenWeatherMap
   */
  async fetchWeatherData(lat: number, lng: number) {
    if (!API_KEYS.OPENWEATHER) return null

    const cacheKey = `weather-${lat}-${lng}`
    const cached = this.getFromCache(cacheKey, 10 * 60 * 1000) // 10 min cache
    if (cached) return cached

    try {
      const response = await fetch(
        `${DATA_SOURCES.OPENWEATHER.BASE}/weather?lat=${lat}&lon=${lng}&appid=${API_KEYS.OPENWEATHER}&units=imperial`
      )
      
      if (!response.ok) {
        console.error('OpenWeather API error:', response.status)
        return null
      }
      
      const data = await response.json()

      const result = {
        airTemp: data.main?.temp,
        humidity: data.main?.humidity,
        pressure: data.main?.pressure,
        windSpeed: data.wind?.speed,
        windDirection: data.wind?.deg ? this.degreesToDirection(data.wind.deg) : null,
        windGusts: data.wind?.gust || 0,
        cloudCover: data.clouds?.all,
        visibility: data.visibility,
        sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000) : null,
        sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000) : null,
      }

      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('Weather fetch error:', error)
      return null
    }
  }

  /**
   * Fetch UV Index
   */
  async fetchUVIndex(lat: number, lng: number) {
    if (!API_KEYS.OPENWEATHER) return null

    const cacheKey = `uv-${lat}-${lng}`
    const cached = this.getFromCache(cacheKey, 60 * 60 * 1000) // 1 hour cache
    if (cached) return cached

    try {
      const response = await fetch(
        `${DATA_SOURCES.OPENWEATHER.UV}?lat=${lat}&lon=${lng}&appid=${API_KEYS.OPENWEATHER}`
      )
      const data = await response.json()

      const result = {
        uvIndex: Math.round(data.value),
        uvRisk: this.getUVRisk(data.value),
      }

      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('UV fetch error:', error)
      return null
    }
  }

  /**
   * Fetch water quality data (mock for now)
   */
  async fetchWaterQuality(beachId: string) {
    // This would connect to Hawaii DOH API
    // For now, return mock data
    return {
      bacteriaLevel: 'safe' as const,
      enterococcus: Math.random() * 50, // CFU/100ml
      turbidity: Math.random() * 5,
      lastSample: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }
  }

  /**
   * Fetch tide data
   */
  async fetchTideData(lat: number, lng: number) {
    const cacheKey = `tide-${lat}-${lng}`
    const cached = this.getFromCache(cacheKey, 60 * 60 * 1000) // 1 hour cache
    if (cached) return cached

    // Mock tide data for now
    const now = new Date()
    const result = {
      currentTide: 2.5 + Math.sin(now.getHours() / 24 * Math.PI * 2) * 2,
      tidalRange: 4.5,
      nextHighTide: new Date(now.getTime() + 6 * 60 * 60 * 1000),
      nextLowTide: new Date(now.getTime() + 3 * 60 * 60 * 1000),
    }

    this.setCache(cacheKey, result)
    return result
  }

  /**
   * Fetch StormGlass Marine Weather Data
   */
  async fetchStormGlassData(lat: number, lng: number) {
    if (!API_KEYS.STORMGLASS) return null

    const cacheKey = `stormglass-${lat}-${lng}`
    const cached = this.getFromCache(cacheKey, 30 * 60 * 1000) // 30 min cache (preserve API quota)
    if (cached) return cached

    try {
      // StormGlass parameters we want
      const params = [
        'waveHeight',
        'wavePeriod',
        'waveDirection',
        'windSpeed',
        'windDirection',
        'swellHeight',
        'swellPeriod',
        'swellDirection',
        'waterTemperature',
        'currentSpeed',
        'currentDirection',
        'airTemperature',
        'humidity',
        'visibility',
        'seaLevel'
      ].join(',')

      const response = await fetch(
        `${DATA_SOURCES.STORMGLASS.WEATHER}?lat=${lat}&lng=${lng}&params=${params}`,
        {
          headers: {
            'Authorization': API_KEYS.STORMGLASS
          }
        }
      )

      if (!response.ok) {
        console.error('StormGlass API error:', response.status)
        return null
      }

      const data = await response.json()
      
      // Get the first hour's data
      const current = data.hours?.[0]
      if (!current) return null

      // Extract and format the data
      const result = {
        // Wave data
        waveHeight: current.waveHeight?.noaa || current.waveHeight?.sg,
        wavePeriod: current.wavePeriod?.noaa || current.wavePeriod?.sg,
        waveDirection: current.waveDirection?.noaa || current.waveDirection?.sg,
        
        // Swell data
        swellHeight: current.swellHeight?.noaa || current.swellHeight?.sg,
        swellPeriod: current.swellPeriod?.noaa || current.swellPeriod?.sg,
        swellDirection: current.swellDirection?.noaa || current.swellDirection?.sg,
        
        // Wind data
        windSpeed: current.windSpeed?.noaa || current.windSpeed?.sg,
        windDirection: this.degreesToDirection(current.windDirection?.noaa || current.windDirection?.sg),
        
        // Water data
        waterTemp: current.waterTemperature?.noaa || current.waterTemperature?.sg,
        
        // Current data
        currentSpeed: current.currentSpeed?.sg,
        currentDirection: current.currentDirection?.sg ? this.degreesToDirection(current.currentDirection.sg) : null,
        
        // Weather data
        visibility: current.visibility?.noaa || current.visibility?.sg,
        humidity: current.humidity?.noaa || current.humidity?.sg,
        
        // Determine rip current risk based on conditions
        ripCurrentRisk: this.calculateRipCurrentRisk(
          current.waveHeight?.noaa || 0,
          current.wavePeriod?.noaa || 0,
          current.currentSpeed?.sg || 0
        ),
        
        // Water clarity estimate (based on wave height and period)
        waterClarity: this.estimateWaterClarity(
          current.waveHeight?.noaa || 0,
          current.swellHeight?.noaa || 0
        ),
        
        // Source tracking
        dataSource: 'StormGlass',
        lastUpdated: new Date().toISOString()
      }

      this.setCache(cacheKey, result)
      return result
    } catch (error) {
      console.error('StormGlass fetch error:', error)
      return null
    }
  }

  /**
   * Calculate rip current risk based on conditions
   */
  private calculateRipCurrentRisk(waveHeight: number, wavePeriod: number, currentSpeed: number): 'low' | 'moderate' | 'high' {
    // Simple heuristic - would be more sophisticated in production
    if (waveHeight > 6 || currentSpeed > 2) return 'high'
    if (waveHeight > 3 || currentSpeed > 1 || wavePeriod > 10) return 'moderate'
    return 'low'
  }

  /**
   * Estimate water clarity based on conditions
   */
  private estimateWaterClarity(waveHeight: number, swellHeight: number): number {
    // Estimate visibility in feet based on wave action
    const totalWaveAction = waveHeight + swellHeight
    if (totalWaveAction < 2) return 40 // Excellent clarity
    if (totalWaveAction < 4) return 25 // Good clarity
    if (totalWaveAction < 6) return 15 // Fair clarity
    return 5 // Poor clarity
  }

  /**
   * Fetch PacIOOS data for Hawaii-specific conditions
   */
  async fetchPacIOOSData(beachId: string) {
    try {
      // This would connect to PacIOOS ERDDAP server
      // Example: Wave height, period, direction
      const response = await fetch(
        `${DATA_SOURCES.PACIOOS.BASE}/griddap/hmrg_west_swan.json?` +
        `Thgt[(last)][(20.0):(22.0)][(200.0):(203.0)]`
      )
      const data = await response.json()
      
      return {
        waveHeight: data.table.rows[0]?.[3] || 0,
        wavePeriod: data.table.rows[0]?.[4] || 0,
        waveDirection: data.table.rows[0]?.[5] || 0,
      }
    } catch (error) {
      console.error('PacIOOS fetch error:', error)
      return null
    }
  }

  /**
   * Fetch real-time buoy data from NDBC
   */
  async fetchBuoyData(buoyId: string) {
    try {
      const response = await fetch(
        `${DATA_SOURCES.NOAA.WATER_TEMP}/${buoyId}.txt`
      )
      const text = await response.text()
      const lines = text.split('\n')
      const headers = lines[0].split(/\s+/)
      const data = lines[2].split(/\s+/) // Most recent reading

      const result: any = {}
      headers.forEach((header, index) => {
        if (header === 'WTMP') result.waterTemp = parseFloat(data[index])
        if (header === 'WVHT') result.waveHeight = parseFloat(data[index])
        if (header === 'DPD') result.wavePeriod = parseFloat(data[index])
        if (header === 'WSPD') result.windSpeed = parseFloat(data[index])
      })

      return result
    } catch (error) {
      console.error('Buoy data fetch error:', error)
      return null
    }
  }

  /**
   * Get activity recommendations based on conditions
   */
  getActivityRatings(data: Partial<ComprehensiveBeachData>) {
    const ratings = {
      swimming: 'good' as const,
      surfing: 'good' as const,
      snorkeling: 'good' as const,
      diving: 'good' as const,
      fishing: 'good' as const,
    }

    const waveHeight = data.waveHeight || 2
    const wavePeriod = data.wavePeriod || 8
    const waterClarity = data.waterClarity || 20

    // Swimming rating
    if (data.ripCurrentRisk === 'high' || waveHeight > 6) {
      ratings.swimming = 'dangerous'
    } else if (waveHeight > 3 || data.ripCurrentRisk === 'moderate') {
      ratings.swimming = 'fair'
    } else if (waveHeight < 2 && data.bacteriaLevel === 'safe') {
      ratings.swimming = 'excellent'
    }

    // Surfing rating
    if (waveHeight < 2) {
      ratings.surfing = 'flat'
    } else if (waveHeight > 8 && wavePeriod > 12) {
      ratings.surfing = 'excellent'
    } else if (waveHeight > 4) {
      ratings.surfing = 'good'
    }

    // Snorkeling rating
    if (waterClarity > 30 && waveHeight < 2) {
      ratings.snorkeling = 'excellent'
    } else if (waterClarity < 10 || waveHeight > 4) {
      ratings.snorkeling = 'poor'
    }

    return ratings
  }

  // Helper functions
  private findNearestStation(lat: number, lng: number): string {
    // Simple implementation - would be more sophisticated in production
    if (lat > 21.5) return HAWAII_STATIONS.OAHU.HALEIWA // North Shore
    if (lat < 19.5) return HAWAII_STATIONS.HAWAII.HILO // Big Island
    if (lng < -159) return HAWAII_STATIONS.KAUAI.NAWILIWILI // Kauai
    return HAWAII_STATIONS.OAHU.HONOLULU // Default
  }

  private degreesToDirection(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

  private getUVRisk(uvIndex: number): string {
    if (uvIndex <= 2) return 'Low'
    if (uvIndex <= 5) return 'Moderate'
    if (uvIndex <= 7) return 'High'
    if (uvIndex <= 10) return 'Very High'
    return 'Extreme'
  }

  private getCurrentTide(predictions: any[]): number {
    // Implementation would interpolate between tide points
    return 2.5
  }

  private getNextHighTide(predictions: any[]): Date {
    // Find next high tide from predictions
    return new Date(Date.now() + 6 * 60 * 60 * 1000)
  }

  private getNextLowTide(predictions: any[]): Date {
    // Find next low tide from predictions
    return new Date(Date.now() + 3 * 60 * 60 * 1000)
  }

  private getFromCache(key: string, maxAge: number) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < maxAge) {
      return cached.data
    }
    return null
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }
}

// Singleton instance
export const dataAggregator = new DataAggregatorService()