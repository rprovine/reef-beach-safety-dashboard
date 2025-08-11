// Advanced forecasting and tide integration for Hawaii beaches

export interface TideData {
  stationId: string
  stationName: string
  coordinates: {
    lat: number
    lng: number
  }
  predictions: TidePrediction[]
  metadata: {
    timezone: string
    units: 'feet' | 'meters'
    datum: string // Mean Lower Low Water (MLLW), etc.
    lastUpdated: Date
  }
}

export interface TidePrediction {
  time: Date
  height: number
  type: 'high' | 'low'
  quality: 'predicted' | 'preliminary' | 'verified'
}

export interface WeatherForecast {
  beachSlug: string
  timestamp: Date
  temperature: {
    air: number
    water: number
    feelsLike: number
  }
  wind: {
    speed: number
    direction: number
    gusts?: number
    description: string // "Light breeze from NE"
  }
  waves: {
    height: number
    period: number
    direction: number
    quality: 'poor' | 'fair' | 'good' | 'excellent'
  }
  weather: {
    condition: string
    description: string
    icon: string
    visibility: number
    humidity: number
    pressure: number
  }
  uv: {
    index: number
    level: 'low' | 'moderate' | 'high' | 'very_high' | 'extreme'
    recommendation: string
  }
  precipitation: {
    probability: number
    type: 'none' | 'light' | 'moderate' | 'heavy'
    amount?: number
  }
  hourlyDetails?: HourlyForecast[]
}

export interface HourlyForecast {
  time: Date
  temperature: number
  windSpeed: number
  waveHeight: number
  precipitation: number
  uvIndex: number
  cloudCover: number
}

export interface SurfForecast {
  beachSlug: string
  forecast: SurfCondition[]
  swells: SwellComponent[]
  ratings: {
    beginners: 1 | 2 | 3 | 4 | 5
    intermediate: 1 | 2 | 3 | 4 | 5
    advanced: 1 | 2 | 3 | 4 | 5
  }
  bestTimes: string[]
  warnings: string[]
}

export interface SurfCondition {
  time: Date
  waveHeight: {
    min: number
    max: number
    avg: number
  }
  period: number
  direction: number
  quality: 'poor' | 'fair' | 'good' | 'epic'
  crowdLevel: 'empty' | 'light' | 'moderate' | 'crowded' | 'packed'
}

export interface SwellComponent {
  height: number
  period: number
  direction: number
  directionText: string // "NW", "SSE", etc.
  quality: 'wind_swell' | 'mixed' | 'ground_swell'
  energy: number
}

class ForecastingService {
  private hawaiiTideStations = [
    { id: '1612340', name: 'Honolulu', lat: 21.3067, lng: -157.8670, island: 'oahu' },
    { id: '1611400', name: 'Nawiliwili', lat: 21.9544, lng: -159.3561, island: 'kauai' },
    { id: '1615680', name: 'Mokuoloe', lat: 21.4311, lng: -157.7900, island: 'oahu' },
    { id: '1617760', name: 'Maunalua Bay', lat: 21.2881, lng: -157.7075, island: 'oahu' },
    { id: '1619910', name: 'Barbers Point', lat: 21.3089, lng: -158.1250, island: 'oahu' },
    { id: '1621480', name: 'Sand Island', lat: 21.3286, lng: -157.8658, island: 'oahu' },
    { id: '1627412', name: 'Kahului', lat: 20.8950, lng: -156.4772, island: 'maui' },
    { id: '1630000', name: 'Hilo', lat: 19.7300, lng: -155.0600, island: 'hawaii' },
    { id: '1632200', name: 'Kawaihae', lat: 20.0367, lng: -155.8283, island: 'hawaii' }
  ]

  // Get nearest tide station for beach
  getNearestTideStation(lat: number, lng: number): { id: string; name: string; distance: number } | null {
    let nearest = this.hawaiiTideStations[0]
    let minDistance = this.calculateDistance(lat, lng, nearest.lat, nearest.lng)

    for (const station of this.hawaiiTideStations) {
      const distance = this.calculateDistance(lat, lng, station.lat, station.lng)
      if (distance < minDistance) {
        minDistance = distance
        nearest = station
      }
    }

    return {
      id: nearest.id,
      name: nearest.name,
      distance: minDistance
    }
  }

  // Get tide predictions for next 7 days
  async getTidePredictions(stationId: string, days: number = 7): Promise<TideData> {
    try {
      // In production, this would call NOAA CO-OPS API
      // https://api.tidesandcurrents.noaa.gov/api/prod/datagetter
      
      const station = this.hawaiiTideStations.find(s => s.id === stationId)
      if (!station) throw new Error('Station not found')

      // Generate mock tide data for demonstration
      const predictions = this.generateTidePredictions(days)
      
      return {
        stationId,
        stationName: station.name,
        coordinates: { lat: station.lat, lng: station.lng },
        predictions,
        metadata: {
          timezone: 'Pacific/Honolulu',
          units: 'feet',
          datum: 'MLLW',
          lastUpdated: new Date()
        }
      }
    } catch (error) {
      console.error('Tide prediction error:', error)
      throw error
    }
  }

  // Get comprehensive weather forecast
  async getWeatherForecast(beachSlug: string, lat: number, lng: number, hours: number = 168): Promise<WeatherForecast> {
    try {
      // In production, this would integrate with multiple weather APIs:
      // - NOAA Weather Service API
      // - OpenWeatherMap
      // - StormGlass
      // - PacIOOS (Pacific Islands Ocean Observing System)

      const forecast = this.generateWeatherForecast(beachSlug, lat, lng, hours)
      return forecast
    } catch (error) {
      console.error('Weather forecast error:', error)
      throw error
    }
  }

  // Get surf forecast
  async getSurfForecast(beachSlug: string, lat: number, lng: number): Promise<SurfForecast> {
    try {
      // In production, would integrate with:
      // - Surfline API
      // - StormGlass Marine API
      // - CDIP (Coastal Data Information Program)
      
      const swells = this.generateSwellData(lat, lng)
      const forecast = this.generateSurfConditions(swells, 7)
      const ratings = this.calculateSurfRatings(forecast)
      
      return {
        beachSlug,
        forecast,
        swells,
        ratings,
        bestTimes: this.identifyBestSurfTimes(forecast),
        warnings: this.generateSurfWarnings(forecast, swells)
      }
    } catch (error) {
      console.error('Surf forecast error:', error)
      throw error
    }
  }

  // Calculate optimal beach visit times
  calculateOptimalTimes(
    weather: WeatherForecast,
    tides: TideData,
    preferences: {
      activities: string[]
      crowdTolerance: 'low' | 'medium' | 'high'
      temperatureRange: [number, number]
    }
  ): Array<{
    time: Date
    score: number
    reasons: string[]
    activities: string[]
  }> {
    const optimalTimes = []
    const now = new Date()
    
    // Analyze next 48 hours in 2-hour increments
    for (let i = 0; i < 24; i++) {
      const time = new Date(now.getTime() + i * 2 * 60 * 60 * 1000)
      const score = this.calculateTimeScore(time, weather, tides, preferences)
      
      if (score > 6) { // Only recommend times with score > 6/10
        optimalTimes.push({
          time,
          score,
          reasons: this.getTimeReasons(time, weather, tides),
          activities: this.getRecommendedActivities(time, weather, tides)
        })
      }
    }
    
    return optimalTimes.sort((a, b) => b.score - a.score)
  }

  private generateTidePredictions(days: number): TidePrediction[] {
    const predictions = []
    const now = new Date()
    
    // Generate realistic tide predictions with ~12.5 hour periods
    for (let day = 0; day < days; day++) {
      const baseTime = new Date(now.getTime() + day * 24 * 60 * 60 * 1000)
      
      // Hawaii typically has 2 high tides and 2 low tides per day
      const tides = [
        { hours: 1 + Math.random() * 2, type: 'low' as const, height: 0.2 + Math.random() * 0.5 },
        { hours: 7 + Math.random() * 2, type: 'high' as const, height: 1.8 + Math.random() * 0.6 },
        { hours: 13 + Math.random() * 2, type: 'low' as const, height: 0.1 + Math.random() * 0.4 },
        { hours: 19 + Math.random() * 2, type: 'high' as const, height: 2.0 + Math.random() * 0.5 }
      ]
      
      for (const tide of tides) {
        const tideTime = new Date(baseTime)
        tideTime.setHours(Math.floor(tide.hours), (tide.hours % 1) * 60, 0, 0)
        
        predictions.push({
          time: tideTime,
          height: Math.round(tide.height * 10) / 10,
          type: tide.type,
          quality: 'predicted'
        })
      }
    }
    
    return predictions.sort((a, b) => a.time.getTime() - b.time.getTime())
  }

  private generateWeatherForecast(beachSlug: string, lat: number, lng: number, hours: number): WeatherForecast {
    const now = new Date()
    
    // Hawaii weather patterns
    const baseTemp = 78 + Math.sin(lat / 10) * 8 // Temperature varies by latitude
    const tradeWindSpeed = 12 + Math.random() * 8 // Typical trade wind speed
    
    const hourlyDetails = []
    for (let i = 0; i < Math.min(hours, 48); i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000)
      const hour = time.getHours()
      
      // Daily temperature variation
      const tempVariation = Math.sin((hour - 6) / 24 * 2 * Math.PI) * 6
      const temp = baseTemp + tempVariation + (Math.random() - 0.5) * 4
      
      hourlyDetails.push({
        time,
        temperature: Math.round(temp),
        windSpeed: tradeWindSpeed + Math.sin(hour / 24 * 2 * Math.PI) * 4,
        waveHeight: 2 + Math.sin(i / 6 * Math.PI) + Math.random(),
        precipitation: Math.random() * 0.1,
        uvIndex: hour > 6 && hour < 18 ? Math.max(0, 8 + Math.sin((hour - 12) / 6 * Math.PI) * 3) : 0,
        cloudCover: 20 + Math.random() * 40
      })
    }

    const currentHour = hourlyDetails[0]
    
    return {
      beachSlug,
      timestamp: now,
      temperature: {
        air: currentHour.temperature,
        water: 75 + Math.sin(new Date().getMonth() / 6 * Math.PI) * 5,
        feelsLike: currentHour.temperature + 2
      },
      wind: {
        speed: currentHour.windSpeed,
        direction: 45, // NE trade winds
        description: 'Light trade winds from NE'
      },
      waves: {
        height: currentHour.waveHeight,
        period: 8,
        direction: 315, // NW
        quality: currentHour.waveHeight > 3 ? 'good' : 'fair'
      },
      weather: {
        condition: 'partly_cloudy',
        description: 'Partly cloudy with trade winds',
        icon: 'partly-cloudy',
        visibility: 15,
        humidity: 65,
        pressure: 30.15
      },
      uv: {
        index: currentHour.uvIndex,
        level: this.getUVLevel(currentHour.uvIndex),
        recommendation: this.getUVRecommendation(currentHour.uvIndex)
      },
      precipitation: {
        probability: 15,
        type: 'light',
        amount: 0.01
      },
      hourlyDetails
    }
  }

  private generateSwellData(lat: number, lng: number): SwellComponent[] {
    // Hawaii receives swells from multiple directions
    return [
      {
        height: 2.5 + Math.random() * 2,
        period: 8 + Math.random() * 4,
        direction: 315, // NW
        directionText: 'NW',
        quality: 'ground_swell',
        energy: 75 + Math.random() * 25
      },
      {
        height: 1.5 + Math.random(),
        period: 6 + Math.random() * 2,
        direction: 45, // NE
        directionText: 'NE',
        quality: 'wind_swell',
        energy: 40 + Math.random() * 20
      }
    ]
  }

  private generateSurfConditions(swells: SwellComponent[], days: number): SurfCondition[] {
    const conditions = []
    const now = new Date()
    
    for (let day = 0; day < days; day++) {
      for (let hour = 6; hour < 20; hour += 2) {
        const time = new Date(now.getTime() + day * 24 * 60 * 60 * 1000)
        time.setHours(hour, 0, 0, 0)
        
        // Combine swell components
        const totalHeight = swells.reduce((sum, swell) => sum + swell.height, 0)
        const avgPeriod = swells.reduce((sum, swell) => sum + swell.period, 0) / swells.length
        
        conditions.push({
          time,
          waveHeight: {
            min: totalHeight * 0.7,
            max: totalHeight * 1.3,
            avg: totalHeight
          },
          period: avgPeriod,
          direction: swells[0].direction,
          quality: this.calculateSurfQuality(swells),
          crowdLevel: this.predictCrowdLevel(time)
        })
      }
    }
    
    return conditions
  }

  private calculateSurfRatings(forecast: SurfCondition[]): SurfForecast['ratings'] {
    const avgWaveHeight = forecast.reduce((sum, f) => sum + f.waveHeight.avg, 0) / forecast.length
    
    return {
      beginners: avgWaveHeight < 2 ? 4 : avgWaveHeight < 4 ? 2 : 1,
      intermediate: avgWaveHeight > 2 && avgWaveHeight < 6 ? 4 : 3,
      advanced: avgWaveHeight > 4 ? 5 : avgWaveHeight > 2 ? 3 : 2
    }
  }

  private identifyBestSurfTimes(forecast: SurfCondition[]): string[] {
    return forecast
      .filter(f => f.quality === 'good' || f.quality === 'epic')
      .slice(0, 3)
      .map(f => f.time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        weekday: 'short' 
      }))
  }

  private generateSurfWarnings(forecast: SurfCondition[], swells: SwellComponent[]): string[] {
    const warnings = []
    
    const maxWave = Math.max(...forecast.map(f => f.waveHeight.max))
    if (maxWave > 8) warnings.push('Large surf warning - experienced surfers only')
    if (maxWave > 12) warnings.push('Dangerous surf conditions - avoid water activities')
    
    const hasShortPeriod = swells.some(s => s.period < 6)
    if (hasShortPeriod) warnings.push('Short period swells - choppy conditions expected')
    
    return warnings
  }

  private calculateTimeScore(
    time: Date,
    weather: WeatherForecast,
    tides: TideData,
    preferences: any
  ): number {
    let score = 5 // Base score
    
    // Weather factors
    if (weather.temperature.air >= preferences.temperatureRange[0] && 
        weather.temperature.air <= preferences.temperatureRange[1]) score += 1
    if (weather.precipitation.probability < 20) score += 1
    if (weather.uv.index < 8) score += 0.5
    if (weather.wind.speed < 15) score += 0.5
    
    // Tide factors
    const nearestTide = this.getNearestTide(time, tides.predictions)
    if (nearestTide && nearestTide.type === 'low' && 
        preferences.activities.includes('tidePooling')) score += 2
    
    // Time of day factors
    const hour = time.getHours()
    if (hour >= 7 && hour <= 10) score += 1 // Morning bonus
    if (hour >= 16 && hour <= 18) score += 0.5 // Evening bonus
    
    return Math.min(10, score)
  }

  private getTimeReasons(time: Date, weather: WeatherForecast, tides: TideData): string[] {
    const reasons = []
    const hour = time.getHours()
    
    if (hour >= 7 && hour <= 10) reasons.push('Great morning conditions')
    if (weather.precipitation.probability < 20) reasons.push('Low chance of rain')
    if (weather.uv.index < 6) reasons.push('Moderate UV levels')
    if (weather.wind.speed < 12) reasons.push('Light winds')
    
    return reasons
  }

  private getRecommendedActivities(time: Date, weather: WeatherForecast, tides: TideData): string[] {
    const activities = []
    
    if (weather.waves.height < 3) activities.push('Swimming', 'Snorkeling')
    if (weather.waves.height > 2) activities.push('Surfing', 'Bodyboarding')
    
    const nearestTide = this.getNearestTide(time, tides.predictions)
    if (nearestTide && nearestTide.type === 'low') activities.push('Tide pooling')
    
    if (weather.wind.speed < 10) activities.push('Paddleboarding', 'Kayaking')
    
    return activities
  }

  private getNearestTide(time: Date, predictions: TidePrediction[]): TidePrediction | null {
    let nearest = predictions[0]
    let minDiff = Math.abs(time.getTime() - nearest.time.getTime())
    
    for (const prediction of predictions) {
      const diff = Math.abs(time.getTime() - prediction.time.getTime())
      if (diff < minDiff) {
        minDiff = diff
        nearest = prediction
      }
    }
    
    return minDiff < 3 * 60 * 60 * 1000 ? nearest : null // Within 3 hours
  }

  private calculateSurfQuality(swells: SwellComponent[]): SurfCondition['quality'] {
    const groundSwells = swells.filter(s => s.quality === 'ground_swell')
    if (groundSwells.length > 0 && groundSwells[0].period > 10) return 'epic'
    if (groundSwells.length > 0) return 'good'
    return 'fair'
  }

  private predictCrowdLevel(time: Date): SurfCondition['crowdLevel'] {
    const hour = time.getHours()
    const isWeekend = time.getDay() === 0 || time.getDay() === 6
    
    if (hour < 7 || hour > 18) return 'empty'
    if (isWeekend && hour >= 8 && hour <= 16) return 'crowded'
    if (hour >= 10 && hour <= 15) return 'moderate'
    return 'light'
  }

  private getUVLevel(index: number): WeatherForecast['uv']['level'] {
    if (index <= 2) return 'low'
    if (index <= 5) return 'moderate'
    if (index <= 7) return 'high'
    if (index <= 10) return 'very_high'
    return 'extreme'
  }

  private getUVRecommendation(index: number): string {
    if (index <= 2) return 'Minimal protection needed'
    if (index <= 5) return 'Wear sunscreen and hat'
    if (index <= 7) return 'Wear sunscreen, hat, and sunglasses'
    if (index <= 10) return 'Extra protection needed - seek shade'
    return 'Avoid sun exposure 10am-4pm'
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959 // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
}

// Export service
export const forecastingService = new ForecastingService()