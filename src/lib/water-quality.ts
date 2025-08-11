// Water quality and environmental monitoring system for Hawaii beaches

export interface WaterQualityData {
  beachSlug: string
  beachName: string
  lastUpdated: Date
  bacteriaLevels: {
    enterococcus: {
      level: number // MPN/100ml
      status: 'excellent' | 'good' | 'fair' | 'poor'
      exceedsStandards: boolean
    }
    ecoli?: {
      level: number // MPN/100ml  
      status: 'excellent' | 'good' | 'fair' | 'poor'
      exceedsStandards: boolean
    }
  }
  turbidity: {
    ntu: number // Nephelometric Turbidity Units
    status: 'clear' | 'slightly_cloudy' | 'cloudy' | 'very_cloudy'
  }
  temperature: {
    celsius: number
    fahrenheit: number
    trend: 'rising' | 'stable' | 'falling'
  }
  ph: {
    level: number
    status: 'acidic' | 'normal' | 'alkaline'
  }
  dissolvedOxygen: {
    mgPerLiter: number
    saturationPercent: number
    status: 'excellent' | 'good' | 'fair' | 'poor'
  }
  nitrateNitrite: {
    mgPerLiter: number
    status: 'low' | 'moderate' | 'high'
  }
  phosphorus: {
    mgPerLiter: number
    status: 'low' | 'moderate' | 'high' 
  }
  salinity: {
    ppt: number // Parts per thousand
    status: 'normal' | 'low' | 'high'
  }
}

export interface UVIndex {
  beachSlug: string
  current: {
    index: number
    level: 'low' | 'moderate' | 'high' | 'very_high' | 'extreme'
    color: string
    recommendation: string
  }
  forecast: {
    time: Date
    index: number
    level: 'low' | 'moderate' | 'high' | 'very_high' | 'extreme'
  }[]
  peakTime: Date
  sunProtectionTips: string[]
}

export interface EnvironmentalAlert {
  id: string
  type: 'bacteria' | 'algae' | 'runoff' | 'uv' | 'temperature' | 'ph'
  severity: 'advisory' | 'warning' | 'danger'
  title: string
  description: string
  recommendation: string
  beachSlugs: string[]
  issuedDate: Date
  expiryDate?: Date
  source: string
}

class WaterQualityService {
  private qualityData: Map<string, WaterQualityData> = new Map()
  private uvData: Map<string, UVIndex> = new Map()
  private alerts: EnvironmentalAlert[] = []

  // Get water quality for specific beach
  getWaterQuality(beachSlug: string): WaterQualityData | null {
    return this.qualityData.get(beachSlug) || null
  }

  // Get UV index for beach
  getUVIndex(beachSlug: string): UVIndex | null {
    return this.uvData.get(beachSlug) || null
  }

  // Check if beach has water quality warnings
  hasWaterQualityWarning(beachSlug: string): boolean {
    const quality = this.getWaterQuality(beachSlug)
    if (!quality) return false

    return quality.bacteriaLevels.enterococcus.exceedsStandards ||
           (quality.bacteriaLevels.ecoli?.exceedsStandards ?? false) ||
           quality.turbidity.status === 'very_cloudy'
  }

  // Get environmental alerts for beach
  getEnvironmentalAlerts(beachSlug: string): EnvironmentalAlert[] {
    const now = new Date()
    return this.alerts.filter(alert => 
      alert.beachSlugs.includes(beachSlug) &&
      (!alert.expiryDate || alert.expiryDate > now)
    )
  }

  // Calculate overall water quality score (0-100)
  calculateWaterQualityScore(beachSlug: string): number {
    const quality = this.getWaterQuality(beachSlug)
    if (!quality) return 50 // Default neutral score

    let score = 100
    
    // Bacteria levels (most important - 40% weight)
    if (quality.bacteriaLevels.enterococcus.exceedsStandards) {
      score -= 40
    } else {
      switch (quality.bacteriaLevels.enterococcus.status) {
        case 'poor': score -= 30; break
        case 'fair': score -= 15; break
        case 'good': score -= 5; break
        case 'excellent': break
      }
    }

    // Turbidity (20% weight)
    switch (quality.turbidity.status) {
      case 'very_cloudy': score -= 20; break
      case 'cloudy': score -= 12; break
      case 'slightly_cloudy': score -= 5; break
      case 'clear': break
    }

    // pH (15% weight)
    const phOptimal = 8.1 // Typical seawater pH
    const phDeviation = Math.abs(quality.ph.level - phOptimal)
    if (phDeviation > 0.5) score -= 15
    else if (phDeviation > 0.3) score -= 10
    else if (phDeviation > 0.1) score -= 5

    // Dissolved oxygen (15% weight)
    switch (quality.dissolvedOxygen.status) {
      case 'poor': score -= 15; break
      case 'fair': score -= 10; break
      case 'good': score -= 3; break
      case 'excellent': break
    }

    // Nutrients (10% weight)
    if (quality.nitrateNitrite.status === 'high' || quality.phosphorus.status === 'high') {
      score -= 10
    } else if (quality.nitrateNitrite.status === 'moderate' || quality.phosphorus.status === 'moderate') {
      score -= 5
    }

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  // Get water quality status color
  getQualityStatusColor(score: number): string {
    if (score >= 85) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-blue-600 bg-blue-100' 
    if (score >= 50) return 'text-yellow-600 bg-yellow-100'
    if (score >= 30) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  // Get UV protection recommendation
  getUVProtectionAdvice(uvIndex: number): {
    level: string
    color: string
    recommendation: string
  } {
    if (uvIndex <= 2) {
      return {
        level: 'Low',
        color: 'text-green-600',
        recommendation: 'Minimal protection needed. Wear sunglasses on bright days.'
      }
    } else if (uvIndex <= 5) {
      return {
        level: 'Moderate',
        color: 'text-yellow-600', 
        recommendation: 'Wear sunscreen SPF 15+, hat, and sunglasses. Seek shade during midday.'
      }
    } else if (uvIndex <= 7) {
      return {
        level: 'High',
        color: 'text-orange-600',
        recommendation: 'Wear sunscreen SPF 30+, protective clothing, hat, and sunglasses. Seek shade 10am-4pm.'
      }
    } else if (uvIndex <= 10) {
      return {
        level: 'Very High',
        color: 'text-red-600',
        recommendation: 'Extra protection needed. Wear SPF 30+ sunscreen, UV-blocking clothing, wide-brim hat, sunglasses.'
      }
    } else {
      return {
        level: 'Extreme',
        color: 'text-purple-600',
        recommendation: 'Avoid sun exposure 10am-4pm. Wear SPF 50+ sunscreen, full protective clothing, wide hat.'
      }
    }
  }

  // Initialize with Hawaii beach data
  initializeHawaiiData(): void {
    const hawaiianBeaches = [
      'waikiki-beach',
      'lanikai-beach', 
      'hanauma-bay',
      'poipu-beach',
      'napili-bay',
      'tunnels-beach',
      'hapuna-beach'
    ]

    hawaiianBeaches.forEach(beachSlug => {
      // Mock water quality data
      this.qualityData.set(beachSlug, this.generateMockWaterQuality(beachSlug))
      
      // Mock UV data
      this.uvData.set(beachSlug, this.generateMockUVIndex(beachSlug))
    })

    // Add some environmental alerts
    this.initializeEnvironmentalAlerts()
  }

  private generateMockWaterQuality(beachSlug: string): WaterQualityData {
    const baseTemp = 26 // 26°C average for Hawaii
    const temp = baseTemp + (Math.random() - 0.5) * 4 // ±2°C variation
    
    return {
      beachSlug,
      beachName: beachSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      lastUpdated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Within last 24 hours
      bacteriaLevels: {
        enterococcus: {
          level: Math.round(Math.random() * 50), // 0-50 MPN/100ml
          status: Math.random() > 0.8 ? 'fair' : Math.random() > 0.95 ? 'poor' : 'good',
          exceedsStandards: Math.random() < 0.05 // 5% chance of exceeding standards
        }
      },
      turbidity: {
        ntu: Math.round((Math.random() * 10 + 1) * 10) / 10, // 0.1-10.0 NTU
        status: Math.random() > 0.9 ? 'cloudy' : Math.random() > 0.7 ? 'slightly_cloudy' : 'clear'
      },
      temperature: {
        celsius: Math.round(temp * 10) / 10,
        fahrenheit: Math.round((temp * 9/5 + 32) * 10) / 10,
        trend: Math.random() > 0.6 ? 'stable' : Math.random() > 0.3 ? 'rising' : 'falling'
      },
      ph: {
        level: Math.round((8.0 + (Math.random() - 0.5) * 0.4) * 100) / 100, // 7.8-8.2 range
        status: 'normal'
      },
      dissolvedOxygen: {
        mgPerLiter: Math.round((6 + Math.random() * 2) * 10) / 10, // 6-8 mg/L
        saturationPercent: Math.round(85 + Math.random() * 15), // 85-100%
        status: Math.random() > 0.8 ? 'excellent' : 'good'
      },
      nitrateNitrite: {
        mgPerLiter: Math.round(Math.random() * 0.5 * 100) / 100, // 0-0.5 mg/L
        status: Math.random() > 0.9 ? 'moderate' : 'low'
      },
      phosphorus: {
        mgPerLiter: Math.round(Math.random() * 0.1 * 100) / 100, // 0-0.1 mg/L  
        status: Math.random() > 0.9 ? 'moderate' : 'low'
      },
      salinity: {
        ppt: Math.round((34 + (Math.random() - 0.5) * 2) * 10) / 10, // 33-35 ppt
        status: 'normal'
      }
    }
  }

  private generateMockUVIndex(beachSlug: string): UVIndex {
    const hour = new Date().getHours()
    let baseUV = 8 // High UV typical for Hawaii
    
    // Adjust based on time of day
    if (hour < 8 || hour > 18) baseUV = 2
    else if (hour < 10 || hour > 16) baseUV = 5
    else if (hour >= 11 && hour <= 15) baseUV = 10
    
    const currentUV = Math.max(0, baseUV + (Math.random() - 0.5) * 3)
    
    return {
      beachSlug,
      current: {
        index: Math.round(currentUV * 10) / 10,
        level: this.getUVLevel(currentUV),
        color: this.getUVColor(currentUV),
        recommendation: this.getUVProtectionAdvice(currentUV).recommendation
      },
      forecast: this.generateUVForecast(),
      peakTime: new Date(new Date().setHours(13, 0, 0, 0)), // 1 PM
      sunProtectionTips: [
        'Apply broad-spectrum SPF 30+ sunscreen 20 minutes before sun exposure',
        'Reapply sunscreen every 2 hours and after swimming',
        'Wear UV-blocking sunglasses and wide-brimmed hat',
        'Seek shade during peak hours (10 AM - 4 PM)',
        'Wear UPF-rated rash guards while swimming',
        'Stay hydrated - drink water frequently'
      ]
    }
  }

  private getUVLevel(index: number): 'low' | 'moderate' | 'high' | 'very_high' | 'extreme' {
    if (index <= 2) return 'low'
    if (index <= 5) return 'moderate'  
    if (index <= 7) return 'high'
    if (index <= 10) return 'very_high'
    return 'extreme'
  }

  private getUVColor(index: number): string {
    if (index <= 2) return '#289500'
    if (index <= 5) return '#F7D708'
    if (index <= 7) return '#F85900'
    if (index <= 10) return '#E53E3E'
    return '#8B5CF6'
  }

  private generateUVForecast(): { time: Date; index: number; level: 'low' | 'moderate' | 'high' | 'very_high' | 'extreme' }[] {
    const forecast = []
    const now = new Date()
    
    for (let i = 1; i <= 24; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000)
      const hour = time.getHours()
      
      let uvIndex = 0
      if (hour >= 6 && hour <= 18) {
        // Parabolic curve peaking at 1 PM
        const hoursFromSunrise = hour - 6
        const maxHours = 12
        uvIndex = 10 * (1 - Math.pow((hoursFromSunrise - 7) / 7, 2))
        uvIndex = Math.max(0, uvIndex)
      }
      
      forecast.push({
        time,
        index: Math.round(uvIndex * 10) / 10,
        level: this.getUVLevel(uvIndex)
      })
    }
    
    return forecast
  }

  private initializeEnvironmentalAlerts(): void {
    const now = new Date()
    
    // Example bacteria advisory
    if (Math.random() < 0.1) { // 10% chance
      this.alerts.push({
        id: 'bacteria-alert-1',
        type: 'bacteria',
        severity: 'warning',
        title: 'Elevated Bacteria Levels',
        description: 'Recent water quality testing shows elevated enterococcus levels at this beach.',
        recommendation: 'Avoid swimming and water activities. Contact with water may cause illness.',
        beachSlugs: ['hanauma-bay'],
        issuedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        source: 'Hawaii Department of Health'
      })
    }

    // High UV warning
    this.alerts.push({
      id: 'uv-alert-1',
      type: 'uv',
      severity: 'advisory',
      title: 'Very High UV Index Expected',
      description: 'UV index forecast to reach 9-11 during peak hours today.',
      recommendation: 'Use extra sun protection. Apply SPF 30+ sunscreen, wear protective clothing.',
      beachSlugs: ['waikiki-beach', 'lanikai-beach', 'poipu-beach'],
      issuedDate: now,
      expiryDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      source: 'National Weather Service'
    })
  }
}

// Export singleton instance
export const waterQualityService = new WaterQualityService()
waterQualityService.initializeHawaiiData()