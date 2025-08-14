// Integrated analytics service using PostHog + Database tracking
import { trackBeachVisit, trackFeatureUsage, trackBeachSearch } from './posthog'

interface SessionData {
  sessionId: string
  userId?: string
  startTime: number
}

class AnalyticsService {
  private session: SessionData | null = null
  private pageStartTime: number = Date.now()
  private isTrackingEnabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSession()
      this.setupPageTracking()
    }
  }

  private initializeSession() {
    // Generate or get existing session ID
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = this.generateSessionId()
      sessionStorage.setItem('analytics_session_id', sessionId)
    }

    this.session = {
      sessionId,
      startTime: Date.now()
    }

    // Track session start in our database
    this.trackSessionStart()
  }

  private generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  }

  private setupPageTracking() {
    // Track page views
    this.trackPageView()

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.trackPageEnd()
      } else if (document.visibilityState === 'visible') {
        this.pageStartTime = Date.now()
      }
    })

    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd()
    })
  }

  async trackSessionStart() {
    if (!this.session || !this.isTrackingEnabled) return

    const sessionData = {
      type: 'session_start',
      data: {
        sessionId: this.session.sessionId,
        userId: this.getCurrentUserId(),
        posthogId: this.getPostHogId(),
        referrer: document.referrer,
        landingPage: window.location.pathname,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        deviceType: this.getDeviceType(),
        browserName: this.getBrowserName(),
        osName: this.getOSName(),
        userType: 'unknown', // Will be classified by PostHog provider
        classification: this.getAdditionalClassification()
      }
    }

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      })
    } catch (error) {
      console.error('Failed to track session start:', error)
    }
  }

  async trackPageView() {
    if (!this.session || !this.isTrackingEnabled) return

    const pageData = {
      type: 'page_view',
      data: {
        sessionId: this.session.sessionId,
        userId: this.getCurrentUserId(),
        pagePath: window.location.pathname,
        pageTitle: document.title,
        referrer: document.referrer
      }
    }

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData)
      })
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }

  async trackBeachVisitDB(beachSlug: string, metadata: {
    island: string
    accessMethod: string
    safetyScore?: number
    weatherConditions?: any
    interactions?: string[]
  }) {
    if (!this.session || !this.isTrackingEnabled) return

    // Track in PostHog first
    trackBeachVisit(beachSlug, {
      island: metadata.island,
      accessMethod: metadata.accessMethod as any,
      userType: 'unknown',
      deviceType: this.getDeviceType() as any,
      safetyScore: metadata.safetyScore
    })

    // Track in our database
    const visitData = {
      type: 'beach_visit',
      data: {
        sessionId: this.session.sessionId,
        userId: this.getCurrentUserId(),
        beachSlug,
        island: metadata.island,
        accessMethod: metadata.accessMethod,
        safetyScore: metadata.safetyScore,
        weatherConditions: metadata.weatherConditions,
        interactions: metadata.interactions || []
      }
    }

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitData)
      })
    } catch (error) {
      console.error('Failed to track beach visit:', error)
    }
  }

  async trackFeatureUsageDB(featureName: string, metadata: {
    category?: string
    userTier?: string
    success?: boolean
    errorMessage?: string
    additionalData?: any
  }) {
    if (!this.session || !this.isTrackingEnabled) return

    // Track in PostHog first
    trackFeatureUsage(featureName, metadata.userTier as any || 'free', metadata.success !== false)

    // Track in our database
    const usageData = {
      type: 'feature_usage',
      data: {
        sessionId: this.session.sessionId,
        userId: this.getCurrentUserId(),
        featureName,
        featureCategory: metadata.category,
        userTier: metadata.userTier || 'free',
        success: metadata.success !== false,
        errorMessage: metadata.errorMessage,
        metadata: metadata.additionalData
      }
    }

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usageData)
      })
    } catch (error) {
      console.error('Failed to track feature usage:', error)
    }
  }

  async trackSearchDB(query: string, filters: any, resultsCount: number, clickedResults?: string[]) {
    if (!this.session || !this.isTrackingEnabled) return

    // Track in PostHog first
    trackBeachSearch(query, filters, resultsCount)

    // Track in our database
    const searchData = {
      type: 'search_query',
      data: {
        sessionId: this.session.sessionId,
        userId: this.getCurrentUserId(),
        query,
        filters,
        resultsCount,
        clickedResults: clickedResults || [],
        noResults: resultsCount === 0
      }
    }

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData)
      })
    } catch (error) {
      console.error('Failed to track search:', error)
    }
  }

  // Legacy compatibility methods
  trackBeachView = (beachName: string, beachSlug: string) => {
    this.trackBeachVisitDB(beachSlug, {
      island: 'unknown',
      accessMethod: 'direct'
    })
  }

  trackBeachAlert = (beachName: string, alertType: string) => {
    this.trackFeatureUsageDB('beach_alert_set', {
      category: 'alerts',
      additionalData: { beachName, alertType }
    })
  }

  trackConversion = (type: string, value?: number) => {
    this.trackFeatureUsageDB(`conversion_${type}`, {
      category: 'conversions',
      additionalData: { value }
    })
  }

  // Utility functions
  private getCurrentUserId(): string | undefined {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        return JSON.parse(userData)?.id
      }
    } catch (error) {
      // Ignore
    }
    return undefined
  }

  private getPostHogId(): string | undefined {
    try {
      const posthog = (window as any).posthog
      return posthog?.get_distinct_id?.()
    } catch (error) {
      return undefined
    }
  }

  private getDeviceType(): string {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  private getBrowserName(): string {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Other'
  }

  private getOSName(): string {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS'
    if (userAgent.includes('Android')) return 'Android'
    return 'Other'
  }

  private getAdditionalClassification(): any {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const isHawaiiTime = timezone.includes('Hawaii') || timezone.includes('Pacific/Honolulu')
    
    return {
      timezone,
      isLikelyLocal: isHawaiiTime,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      language: navigator.language
    }
  }

  private async trackPageEnd() {
    if (!this.session || !this.isTrackingEnabled) return

    const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000)
    const scrollDepth = this.getScrollDepth()

    const pageData = {
      type: 'page_view',
      data: {
        sessionId: this.session.sessionId,
        userId: this.getCurrentUserId(),
        pagePath: window.location.pathname,
        pageTitle: document.title,
        timeOnPage,
        scrollDepth
      }
    }

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData)
      })
    } catch (error) {
      console.error('Failed to track page end:', error)
    }
  }

  private async trackSessionEnd() {
    if (!this.session || !this.isTrackingEnabled) return

    const duration = Math.round((Date.now() - this.session.startTime) / 1000)

    const sessionData = {
      type: 'session_end',
      data: {
        sessionId: this.session.sessionId,
        duration
      }
    }

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
        keepalive: true
      })
    } catch (error) {
      console.error('Failed to track session end:', error)
    }
  }

  private getScrollDepth(): number {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    return documentHeight > 0 ? Math.round((scrollTop / documentHeight) * 100) : 0
  }
}

// Export singleton instance
export const analytics = new AnalyticsService()

// Legacy exports for compatibility
export const trackBeachView = analytics.trackBeachView
export const trackBeachAlert = analytics.trackBeachAlert  
export const trackConversion = analytics.trackConversion

// Additional legacy exports for older components
export const initGA = () => {} // No-op
export const initMixpanel = () => {} // No-op
export const logPageView = (url: string) => analytics.trackPageView()
export const trackEngagement = (action: string, details?: any) => analytics.trackFeatureUsageDB(action, { category: 'engagement', additionalData: details })

export default analytics