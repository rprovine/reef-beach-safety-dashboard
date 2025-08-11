// Marine life alert system for Hawaii beaches

import { calculateJellyfishDays, isJellyfishWarningDay } from './hawaiian-culture'

export interface MarineAlert {
  id: string
  type: 'jellyfish' | 'shark' | 'seal' | 'turtle' | 'portugueseman' | 'bluebottle'
  severity: 'info' | 'warning' | 'danger'
  title: string
  description: string
  beachSlugs?: string[] // Specific beaches affected
  islands?: string[]     // All beaches on these islands
  startDate: Date
  endDate?: Date
  source: string
  reportedBy?: string
}

export interface MarineLifeData {
  boxJellyfish: {
    nextWarningDates: Date[]
    currentWarning: boolean
    riskLevel: 'low' | 'moderate' | 'high'
  }
  hawaiianMonkSeals: {
    recentSightings: BeachSighting[]
    guidelines: string[]
  }
  seaTurtles: {
    recentSightings: BeachSighting[]
    nestingSeason: boolean
    guidelines: string[]
  }
  sharks: {
    recentActivity: SharkSighting[]
    riskAssessment: 'low' | 'moderate' | 'elevated'
  }
  portugueseManOWar: {
    currentWarning: boolean
    affectedBeaches: string[]
  }
}

export interface BeachSighting {
  id: string
  beachSlug: string
  beachName: string
  species: string
  count: number
  date: Date
  reportedBy: string
  verified: boolean
  description?: string
}

export interface SharkSighting {
  id: string
  location: string
  species?: string
  size?: string
  behavior: string
  date: Date
  distance: number // meters from shore
  source: 'dlnr' | 'lifeguard' | 'public'
}

class MarineAlertsService {
  private alerts: MarineAlert[] = []

  constructor() {
    this.initializeCurrentAlerts()
  }

  // Get current marine life data for Hawaii
  getCurrentMarineData(): MarineLifeData {
    const jellyfishDays = calculateJellyfishDays()
    const currentJellyfishWarning = isJellyfishWarningDay()

    return {
      boxJellyfish: {
        nextWarningDates: jellyfishDays.slice(0, 3), // Next 3 warning periods
        currentWarning: currentJellyfishWarning,
        riskLevel: currentJellyfishWarning ? 'high' : 'low'
      },
      hawaiianMonkSeals: {
        recentSightings: this.getRecentMonkSealSightings(),
        guidelines: [
          'Stay at least 50 feet (15 meters) away from seals',
          'Never touch, feed, or approach seals',
          'Keep dogs on leash and away from seals',
          'If a seal approaches you, back away slowly',
          'Report injured seals to NOAA: 1-888-256-9840'
        ]
      },
      seaTurtles: {
        recentSightings: this.getRecentTurtleSightings(),
        nestingSeason: this.isTurtleNestingSeason(),
        guidelines: [
          'Do not touch, ride, or harass sea turtles',
          'Stay at least 10 feet away from turtles',
          'Never feed sea turtles - it\'s harmful and illegal',
          'Turn off beachfront lights during nesting season',
          'Report injured turtles to NOAA: 1-888-256-9840'
        ]
      },
      sharks: {
        recentActivity: this.getRecentSharkActivity(),
        riskAssessment: this.calculateSharkRisk()
      },
      portugueseManOWar: {
        currentWarning: this.hasPortugueseManOWarWarning(),
        affectedBeaches: this.getManOWarAffectedBeaches()
      }
    }
  }

  // Check if specific beach has marine alerts
  getBeachMarineAlerts(beachSlug: string): MarineAlert[] {
    return this.alerts.filter(alert => 
      !alert.beachSlugs || alert.beachSlugs.includes(beachSlug)
    ).filter(alert => {
      if (alert.endDate) {
        return new Date() < alert.endDate
      }
      return true
    })
  }

  // Get jellyfish warning for specific date
  getJellyfishWarning(date: Date = new Date()): {
    warning: boolean
    daysUntilNext: number
    nextWarningDate: Date | null
  } {
    const warning = isJellyfishWarningDay(date)
    const jellyfishDays = calculateJellyfishDays()
    const nextWarning = jellyfishDays.find(d => d > date)
    
    let daysUntilNext = 0
    if (nextWarning) {
      daysUntilNext = Math.ceil((nextWarning.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    }

    return {
      warning,
      daysUntilNext,
      nextWarningDate: nextWarning || null
    }
  }

  // Add new marine alert
  addAlert(alert: Omit<MarineAlert, 'id'>): string {
    const newAlert: MarineAlert = {
      id: `alert-${Date.now()}`,
      ...alert
    }
    this.alerts.push(newAlert)
    return newAlert.id
  }

  // Remove expired alerts
  cleanExpiredAlerts(): void {
    const now = new Date()
    this.alerts = this.alerts.filter(alert => {
      return !alert.endDate || alert.endDate > now
    })
  }

  private initializeCurrentAlerts(): void {
    // Initialize with some common Hawaii marine alerts
    const now = new Date()
    
    // Box jellyfish warning if active
    if (isJellyfishWarningDay()) {
      this.addAlert({
        type: 'jellyfish',
        severity: 'warning',
        title: 'Box Jellyfish Warning',
        description: 'Box jellyfish are likely present at south and leeward facing beaches. These jellyfish can cause painful stings.',
        islands: ['oahu', 'maui', 'kauai', 'hawaii'],
        startDate: now,
        endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
        source: 'Hawaii Ocean Safety'
      })
    }

    // Seasonal Portuguese Man O' War warning
    if (this.isPortugueseManOWarSeason()) {
      this.addAlert({
        type: 'portugueseman',
        severity: 'warning', 
        title: 'Portuguese Man O\' War Present',
        description: 'Strong onshore winds may bring Portuguese Man O\' War to beaches. Look for blue, balloon-like organisms.',
        islands: ['oahu', 'maui', 'kauai', 'hawaii'],
        startDate: now,
        source: 'Hawaii Ocean Safety'
      })
    }
  }

  private getRecentMonkSealSightings(): BeachSighting[] {
    // Mock data - in production this would come from NOAA database
    return [
      {
        id: 'seal-1',
        beachSlug: 'poipu-beach',
        beachName: 'Poipu Beach',
        species: 'Hawaiian Monk Seal',
        count: 1,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        reportedBy: 'Lifeguard Station',
        verified: true,
        description: 'Adult seal resting on east side of beach'
      },
      {
        id: 'seal-2', 
        beachSlug: 'kailua-beach',
        beachName: 'Kailua Beach',
        species: 'Hawaiian Monk Seal',
        count: 1,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        reportedBy: 'Beach visitor',
        verified: true,
        description: 'Juvenile seal seen swimming near shore'
      }
    ]
  }

  private getRecentTurtleSightings(): BeachSighting[] {
    // Mock data - in production this would come from wildlife tracking APIs
    return [
      {
        id: 'turtle-1',
        beachSlug: 'hanauma-bay',
        beachName: 'Hanauma Bay',
        species: 'Green Sea Turtle (Honu)',
        count: 3,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        reportedBy: 'Snorkel tour guide',
        verified: true,
        description: 'Multiple turtles feeding on algae in shallow area'
      },
      {
        id: 'turtle-2',
        beachSlug: 'punaluu-black-sand-beach', 
        beachName: 'Punaluu Black Sand Beach',
        species: 'Hawksbill Sea Turtle',
        count: 2,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        reportedBy: 'Park ranger',
        verified: true,
        description: 'Two turtles basking on the black sand'
      }
    ]
  }

  private isTurtleNestingSeason(): boolean {
    const now = new Date()
    const month = now.getMonth() // 0-11
    // Peak nesting season is May through September
    return month >= 4 && month <= 8
  }

  private getRecentSharkActivity(): SharkSighting[] {
    // Mock data - in production this would come from DLNR shark incident database
    return [
      {
        id: 'shark-1',
        location: 'Off Maui, near Wailea',
        species: 'Tiger Shark',
        size: '10-12 feet',
        behavior: 'Swimming past, no interaction',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        distance: 200,
        source: 'dlnr'
      }
    ]
  }

  private calculateSharkRisk(): 'low' | 'moderate' | 'elevated' {
    const recentActivity = this.getRecentSharkActivity()
    const recentSightings = recentActivity.filter(s => 
      Date.now() - s.date.getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    )

    if (recentSightings.length > 2) return 'elevated'
    if (recentSightings.length > 0) return 'moderate'
    return 'low'
  }

  private hasPortugueseManOWarWarning(): boolean {
    // Check current wind conditions and season
    return this.isPortugueseManOWarSeason() && this.hasStrongOnshoreWinds()
  }

  private isPortugueseManOWarSeason(): boolean {
    const now = new Date()
    const month = now.getMonth()
    // More common during winter months with strong trade winds
    return month >= 10 || month <= 3
  }

  private hasStrongOnshoreWinds(): boolean {
    // Mock - in production would check wind direction and speed
    return Math.random() < 0.3 // 30% chance for demo
  }

  private getManOWarAffectedBeaches(): string[] {
    if (!this.hasPortugueseManOWarWarning()) return []
    
    // Windward beaches more likely to be affected
    return [
      'kailua-beach',
      'lanikai-beach', 
      'bellows-beach',
      'waimanalo-beach'
    ]
  }
}

// Singleton instance
export const marineAlertsService = new MarineAlertsService()

// Utility functions for components
export function getJellyfishCalendar(monthsAhead: number = 3): Array<{
  date: Date
  isWarningDay: boolean
  moonPhase: string
}> {
  const calendar = []
  const startDate = new Date()
  startDate.setDate(1) // Start of current month
  
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + monthsAhead)
  
  const jellyfishDays = calculateJellyfishDays()
  
  for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
    const currentDate = new Date(d)
    const isWarning = jellyfishDays.some(jDay => 
      jDay.toDateString() === currentDate.toDateString()
    )
    
    calendar.push({
      date: new Date(currentDate),
      isWarningDay: isWarning,
      moonPhase: isWarning ? 'Full Moon +9-10 days' : ''
    })
  }
  
  return calendar
}

export function formatMarineAlert(alert: MarineAlert): string {
  const icons = {
    jellyfish: '🪼',
    shark: '🦈', 
    seal: '🦭',
    turtle: '🐢',
    portugueseman: '🎈',
    bluebottle: '💙'
  }
  
  return `${icons[alert.type]} ${alert.title}: ${alert.description}`
}