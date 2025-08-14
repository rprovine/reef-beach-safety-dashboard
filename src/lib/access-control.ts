// Access control definitions for Beach Hui

export const ACCESS_LEVELS = {
  // Anonymous users (not logged in)
  anonymous: {
    beaches: {
      viewList: true,           // Can see list of beaches
      viewBasicInfo: true,       // Can see beach names, islands, basic description
      viewCurrentConditions: false, // Cannot see real-time conditions
      viewSafetyScore: false,    // Cannot see safety scores
      viewForecast: false,       // Cannot see forecasts
      viewAlerts: false,         // Cannot see alerts
      viewReefHealth: false,     // Cannot see reef data
      viewHistorical: false,     // Cannot see trends
      maxBeachDetails: 1,        // Can view 1 beach detail per day as preview
    },
    features: {
      search: true,              // Can search beaches
      filters: false,            // Cannot use advanced filters
      map: true,                 // Can see beach locations on map
      community: false,          // Cannot access community features
      alerts: false,             // Cannot set alerts
      export: false,             // Cannot export data
      api: false,                // No API access
    },
    limits: {
      beachPreviewsPerDay: 1,   // Can preview 1 beach per day
      searchesPerDay: 10,        // Limited searches
    }
  },

  // Free tier (logged in, no payment)
  free: {
    beaches: {
      viewList: true,
      viewBasicInfo: true,
      viewCurrentConditions: true,  // Can see current conditions
      viewSafetyScore: true,        // Can see safety scores
      viewForecast: false,          // Cannot see 7-day forecast
      viewAlerts: true,             // Can see basic alerts
      viewReefHealth: true,         // Basic reef health info
      viewHistorical: false,        // Cannot see historical trends
      maxBeachDetails: 10,          // Can view 10 beaches per day
    },
    features: {
      search: true,
      filters: true,                // Basic filters
      map: true,
      community: true,              // Can view community reports
      alerts: true,                 // Can set up to 3 alerts
      export: false,                // Cannot export
      api: false,                   // No API access
    },
    limits: {
      beachAlertsMax: 3,
      beachDetailsPerDay: 10,
      searchesPerDay: 50,
    }
  },

  // Pro tier (trial or paid)
  pro: {
    beaches: {
      viewList: true,
      viewBasicInfo: true,
      viewCurrentConditions: true,
      viewSafetyScore: true,
      viewForecast: true,           // Full 7-day forecast
      viewAlerts: true,             // All alerts
      viewReefHealth: true,         // Detailed reef health
      viewHistorical: true,         // Historical trends
      maxBeachDetails: Infinity,    // Unlimited
    },
    features: {
      search: true,
      filters: true,                // Advanced filters
      map: true,
      community: true,              // Can post reports
      alerts: true,                 // Unlimited alerts
      export: true,                 // CSV/JSON export
      api: true,                    // API access (100/day)
    },
    limits: {
      beachAlertsMax: Infinity,
      beachDetailsPerDay: Infinity,
      searchesPerDay: Infinity,
      apiCallsPerDay: 100,
    }
  },

  // Admin tier
  admin: {
    beaches: {
      viewList: true,
      viewBasicInfo: true,
      viewCurrentConditions: true,
      viewSafetyScore: true,
      viewForecast: true,
      viewAlerts: true,
      viewReefHealth: true,
      viewHistorical: true,
      maxBeachDetails: Infinity,
      editBeachData: true,         // Can edit beach information
    },
    features: {
      search: true,
      filters: true,
      map: true,
      community: true,
      alerts: true,
      export: true,
      api: true,                    // Unlimited API
      adminPanel: true,             // Access admin features
    },
    limits: {
      beachAlertsMax: Infinity,
      beachDetailsPerDay: Infinity,
      searchesPerDay: Infinity,
      apiCallsPerDay: Infinity,
    }
  }
}

export function getUserAccessLevel(user: any) {
  if (!user) return ACCESS_LEVELS.anonymous
  
  if (user.tier === 'admin') return ACCESS_LEVELS.admin
  
  // PAID SUBSCRIBERS - Full access
  if (user.tier === 'pro') {
    console.log('[Access] User is PRO subscriber - FULL ACCESS')
    return ACCESS_LEVELS.pro
  }
  
  // TRIAL USERS - Full access during trial
  const hasValidTrial = user.trialEndDate && new Date() < new Date(user.trialEndDate)
  if (user.tier === 'free' && hasValidTrial) {
    console.log('[Access] User is in TRIAL period - FULL ACCESS')
    return ACCESS_LEVELS.pro
  }
  
  // FREE USERS (no trial or expired trial) - Limited access
  console.log('[Access] User is FREE (no active trial) - LIMITED ACCESS')
  return ACCESS_LEVELS.free
}

export function canAccessFeature(user: any, feature: string): boolean {
  const access = getUserAccessLevel(user)
  const parts = feature.split('.')
  
  let current: any = access
  for (const part of parts) {
    if (current[part] === undefined) return false
    current = current[part]
  }
  
  return current === true || current === Infinity
}

export function getFeatureLimit(user: any, limit: string): number {
  const access = getUserAccessLevel(user)
  const parts = limit.split('.')
  
  let current: any = access
  for (const part of parts) {
    if (current[part] === undefined) return 0
    current = current[part]
  }
  
  return typeof current === 'number' ? current : 0
}