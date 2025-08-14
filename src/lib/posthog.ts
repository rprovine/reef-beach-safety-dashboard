import posthog from 'posthog-js'

// PostHog Analytics Configuration for Hawaii Beach Safety Application
export const initPostHog = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      
      // Privacy settings for Hawaii tourism compliance
      opt_out_capturing_by_default: false,
      respect_dnt: true,
      disable_session_recording: false, // Enable for UX insights
      disable_persistence: false,
      cross_subdomain_cookie: false,
      secure_cookie: true,
      
      // Hawaii-specific settings for tourism/local user tracking
      property_blacklist: ['$ip'], // Don't collect IP addresses for privacy
      sanitize_properties: (properties) => {
        // Remove sensitive data while preserving useful analytics
        const sanitized = { ...properties }
        delete sanitized.$current_url // Remove full URLs for privacy
        delete sanitized.$referrer_domain // Limit referrer data
        return sanitized
      },
      
      // Performance optimizations for mobile beach users
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[PostHog] Analytics initialized')
        }
      }
    })
  }
}

// Beach-specific tracking functions
export const trackBeachVisit = (beachSlug: string, metadata: {
  island: string
  accessMethod: 'search' | 'browse' | 'direct' | 'share' | 'list'
  userType: 'tourist' | 'local' | 'unknown'
  deviceType: 'mobile' | 'desktop' | 'tablet'
  safetyScore?: number
}) => {
  if (typeof window !== 'undefined') {
    posthog.capture('beach_visited', {
      beach_slug: beachSlug,
      island: metadata.island,
      access_method: metadata.accessMethod,
      user_type: metadata.userType,
      device_type: metadata.deviceType,
      safety_score: metadata.safetyScore,
      timestamp: new Date().toISOString(),
      page_category: 'beach_detail'
    })
  }
}

// Search behavior tracking for analytics dashboard
export const trackBeachSearch = (query: string, filters: any, results: number) => {
  if (typeof window !== 'undefined') {
    posthog.capture('beach_search', {
      search_query: query,
      applied_filters: filters,
      results_count: results,
      timestamp: new Date().toISOString(),
      page_category: 'search'
    })
  }
}

// Tourism pattern tracking for seasonal analytics
export const trackSeasonalBehavior = (pattern: {
  visitDuration: number
  pagesViewed: number
  beachesViewed: string[]
  planningHorizon: 'same_day' | 'next_day' | 'week' | 'month' | 'future'
  isReturnVisitor: boolean
}) => {
  if (typeof window !== 'undefined') {
    posthog.capture('tourism_pattern', {
      ...pattern,
      session_type: pattern.isReturnVisitor ? 'returning' : 'new',
      timestamp: new Date().toISOString()
    })
  }
}

// Safety alert engagement tracking
export const trackSafetyAlertInteraction = (action: 'view' | 'dismiss' | 'click_details', alertType: string, beachSlug?: string) => {
  if (typeof window !== 'undefined') {
    posthog.capture('safety_alert_interaction', {
      action,
      alert_type: alertType,
      beach_slug: beachSlug,
      timestamp: new Date().toISOString(),
      page_category: 'safety'
    })
  }
}

// User classification based on behavior patterns
export const trackUserClassification = (classification: {
  userType: 'tourist' | 'local' | 'business' | 'researcher'
  confidence: number
  indicators: string[]
}) => {
  if (typeof window !== 'undefined') {
    posthog.identify(undefined, {
      user_classification: classification.userType,
      classification_confidence: classification.confidence,
      classification_indicators: classification.indicators,
      timestamp: new Date().toISOString()
    })
  }
}

// Geographic visitor distribution
export const trackVisitorOrigin = (location: {
  country: string
  state?: string
  timezone: string
  isInternational: boolean
}) => {
  if (typeof window !== 'undefined') {
    const timezoneOffset = calculateTimezoneOffset(location.timezone, 'Pacific/Honolulu')
    
    posthog.capture('visitor_origin', {
      ...location,
      hawaii_timezone_diff: timezoneOffset,
      visit_type: location.isInternational ? 'international' : 'domestic',
      timestamp: new Date().toISOString()
    })
  }
}

// Utility function to calculate timezone differences (important for Hawaii visitors)
const calculateTimezoneOffset = (visitorTimezone: string, hawaiiTimezone: string): number => {
  try {
    const now = new Date()
    const visitorTime = new Date(now.toLocaleString('en-US', { timeZone: visitorTimezone }))
    const hawaiiTime = new Date(now.toLocaleString('en-US', { timeZone: hawaiiTimezone }))
    return (visitorTime.getTime() - hawaiiTime.getTime()) / (1000 * 60 * 60) // Hours difference
  } catch {
    return 0
  }
}

// Feature usage tracking for premium features
export const trackFeatureUsage = (feature: string, plan: 'free' | 'pro' | 'admin', success: boolean) => {
  if (typeof window !== 'undefined') {
    posthog.capture('feature_usage', {
      feature_name: feature,
      user_plan: plan,
      success,
      timestamp: new Date().toISOString()
    })
  }
}

// Mobile-specific tracking (important for beach users)
export const trackMobileExperience = (metrics: {
  loadTime: number
  isOffline: boolean
  connectionType?: string
  viewportSize: { width: number; height: number }
}) => {
  if (typeof window !== 'undefined') {
    posthog.capture('mobile_experience', {
      ...metrics,
      is_mobile: window.innerWidth < 768,
      timestamp: new Date().toISOString()
    })
  }
}

export default posthog