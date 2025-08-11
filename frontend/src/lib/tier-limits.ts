// Tier-based feature limits and restrictions for Reef & Beach Safety Dashboard

export interface TierLimits {
  beachAlertsAllowed: number | null // null = unlimited
  beachAlertsPerDay: number // Daily cap for notifications
  historicalDataDays: number // How many days of historical data
  forecastDays: number // How many days of forecast
  apiRequestsPerHour: number | null // null = unlimited
  apiRequestsPerDay: number // Hard daily cap
  embeddableWidgets: number | null // Number of widgets allowed, null = unlimited
  estimatedMonthlyCost: number // Estimated operational cost
  features: {
    smsNotifications: boolean
    emailNotifications: boolean
    apiAccess: boolean
    widgets: boolean
    priorityData: boolean // Faster refresh rates
    customAlertRules: boolean // Complex alert conditions
    exportData: boolean
    multiUser: boolean
    whiteLabel: boolean
    slaGuarantee: boolean
    roleBasedAccess: 'none' | 'basic' | 'advanced' | 'full'
    dataRefreshRate: number // Minutes between updates
    support: 'email' | 'priority' | 'dedicated' | 'enterprise'
  }
}

export const TIER_LIMITS: Record<string, TierLimits> = {
  free: {
    beachAlertsAllowed: 3,
    beachAlertsPerDay: 10, // Max 10 notifications per day
    historicalDataDays: 7,
    forecastDays: 3,
    apiRequestsPerHour: null, // No API access
    apiRequestsPerDay: 0,
    embeddableWidgets: 0,
    estimatedMonthlyCost: 0,
    features: {
      smsNotifications: false,
      emailNotifications: true,
      apiAccess: false,
      widgets: false,
      priorityData: false,
      customAlertRules: false,
      exportData: false,
      multiUser: false,
      whiteLabel: false,
      slaGuarantee: false,
      roleBasedAccess: 'none',
      dataRefreshRate: 60, // Every hour
      support: 'email'
    }
  },
  consumer: {
    beachAlertsAllowed: 10,
    beachAlertsPerDay: 50,
    historicalDataDays: 30,
    forecastDays: 7,
    apiRequestsPerHour: null, // No API access
    apiRequestsPerDay: 0,
    embeddableWidgets: 0,
    estimatedMonthlyCost: 2, // $4.99 tier, ~$2 cost
    features: {
      smsNotifications: true,
      emailNotifications: true,
      apiAccess: false,
      widgets: false,
      priorityData: false,
      customAlertRules: true,
      exportData: true,
      multiUser: false,
      whiteLabel: false,
      slaGuarantee: false,
      roleBasedAccess: 'none',
      dataRefreshRate: 30, // Every 30 minutes
      support: 'email'
    }
  },
  business: {
    beachAlertsAllowed: null, // Unlimited beaches
    beachAlertsPerDay: 500,
    historicalDataDays: 90,
    forecastDays: 7,
    apiRequestsPerHour: 1000,
    apiRequestsPerDay: 10000,
    embeddableWidgets: 3,
    estimatedMonthlyCost: 20, // $49 tier, ~$20 cost
    features: {
      smsNotifications: true,
      emailNotifications: true,
      apiAccess: true,
      widgets: true,
      priorityData: true,
      customAlertRules: true,
      exportData: true,
      multiUser: true,
      whiteLabel: false,
      slaGuarantee: true,
      roleBasedAccess: 'basic',
      dataRefreshRate: 15, // Every 15 minutes
      support: 'priority'
    }
  },
  enterprise: {
    beachAlertsAllowed: null, // Unlimited
    beachAlertsPerDay: 5000,
    historicalDataDays: 365,
    forecastDays: 14,
    apiRequestsPerHour: null, // Unlimited (rate limited by server)
    apiRequestsPerDay: 100000,
    embeddableWidgets: null, // Unlimited
    estimatedMonthlyCost: 100, // $199 tier, ~$100 cost
    features: {
      smsNotifications: true,
      emailNotifications: true,
      apiAccess: true,
      widgets: true,
      priorityData: true,
      customAlertRules: true,
      exportData: true,
      multiUser: true,
      whiteLabel: true,
      slaGuarantee: true,
      roleBasedAccess: 'full',
      dataRefreshRate: 5, // Every 5 minutes
      support: 'enterprise'
    }
  }
}

// Helper function to check if a feature is available for a tier
export function hasFeature(tier: string, feature: keyof TierLimits['features']): boolean {
  const limits = TIER_LIMITS[tier]
  if (!limits) return false
  return limits.features[feature] === true || 
         (typeof limits.features[feature] === 'string' && limits.features[feature] !== 'none')
}

// Helper function to check beach alert limits
export async function checkBeachAlertLimit(
  userId: string, 
  tier: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any
): Promise<{ allowed: boolean; remaining?: number; limit?: number; reason?: string }> {
  const limits = TIER_LIMITS[tier]
  if (!limits) return { allowed: false, reason: 'Invalid tier' }
  
  // Check DAILY notification limit first
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  
  const todayNotifications = await prisma.alertHistory.count({
    where: {
      userId,
      sentAt: {
        gte: startOfDay
      }
    }
  })
  
  if (todayNotifications >= limits.beachAlertsPerDay) {
    return {
      allowed: false,
      remaining: 0,
      limit: limits.beachAlertsPerDay,
      reason: `Daily notification limit reached (${limits.beachAlertsPerDay}/day). Resets at midnight.`
    }
  }
  
  // Check total beach alerts if applicable
  if (limits.beachAlertsAllowed !== null) {
    const alertCount = await prisma.alert.count({
      where: {
        userId,
        isActive: true
      }
    })
    
    if (alertCount >= limits.beachAlertsAllowed) {
      return {
        allowed: false,
        remaining: 0,
        limit: limits.beachAlertsAllowed,
        reason: `Maximum beach alerts reached (${limits.beachAlertsAllowed} beaches)`
      }
    }
    
    return {
      allowed: true,
      remaining: limits.beachAlertsAllowed - alertCount,
      limit: limits.beachAlertsAllowed
    }
  }
  
  return {
    allowed: true,
    remaining: limits.beachAlertsPerDay - todayNotifications,
    limit: limits.beachAlertsPerDay
  }
}

// Helper function to check API rate limits
export async function checkApiRateLimit(
  userId: string,
  tier: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any
): Promise<{ allowed: boolean; remaining?: number; limit?: number; resetAt?: Date }> {
  const limits = TIER_LIMITS[tier]
  if (!limits) return { allowed: false }
  
  // No API access for this tier
  if (!limits.features.apiAccess) {
    return { allowed: false }
  }
  
  // Check daily limit first
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)
  
  const todayRequests = await prisma.apiLog.count({
    where: {
      userId,
      createdAt: {
        gte: startOfDay
      }
    }
  })
  
  if (todayRequests >= limits.apiRequestsPerDay) {
    const tomorrow = new Date(startOfDay)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return {
      allowed: false,
      remaining: 0,
      limit: limits.apiRequestsPerDay,
      resetAt: tomorrow
    }
  }
  
  // No hourly rate limit for this tier
  if (limits.apiRequestsPerHour === null) {
    return { 
      allowed: true,
      remaining: limits.apiRequestsPerDay - todayRequests,
      limit: limits.apiRequestsPerDay
    }
  }
  
  // Check hourly limit
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  
  const hourRequests = await prisma.apiLog.count({
    where: {
      userId,
      createdAt: {
        gte: oneHourAgo
      }
    }
  })
  
  if (hourRequests >= limits.apiRequestsPerHour) {
    return {
      allowed: false,
      remaining: 0,
      limit: limits.apiRequestsPerHour,
      resetAt: new Date(Date.now() + 60 * 60 * 1000)
    }
  }
  
  return {
    allowed: true,
    remaining: Math.min(
      limits.apiRequestsPerHour - hourRequests,
      limits.apiRequestsPerDay - todayRequests
    ),
    limit: limits.apiRequestsPerHour
  }
}

// Helper function to check widget limits
export async function checkWidgetLimit(
  userId: string,
  tier: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any
): Promise<{ allowed: boolean; remaining?: number; limit?: number }> {
  const limits = TIER_LIMITS[tier]
  if (!limits) return { allowed: false }
  
  // No widgets for this tier
  if (!limits.features.widgets) {
    return { allowed: false }
  }
  
  // Unlimited widgets
  if (limits.embeddableWidgets === null) {
    return { allowed: true }
  }
  
  // Count existing widgets
  const widgetCount = await prisma.widget.count({
    where: { userId }
  })
  
  const remaining = limits.embeddableWidgets !== null ? limits.embeddableWidgets - widgetCount : Number.MAX_SAFE_INTEGER
  
  return {
    allowed: limits.embeddableWidgets === null || widgetCount < limits.embeddableWidgets,
    remaining: Math.max(0, remaining),
    limit: limits.embeddableWidgets
  }
}

// Helper function to check historical data access
export function canAccessHistoricalData(tier: string, daysAgo: number): boolean {
  const limits = TIER_LIMITS[tier]
  if (!limits) return false
  return daysAgo <= limits.historicalDataDays
}

// Helper function to check forecast access
export function canAccessForecast(tier: string, daysAhead: number): boolean {
  const limits = TIER_LIMITS[tier]
  if (!limits) return false
  return daysAhead <= limits.forecastDays
}

// Helper function to get data refresh rate
export function getDataRefreshRate(tier: string): number {
  const limits = TIER_LIMITS[tier]
  if (!limits) return 60 // Default to 1 hour
  return limits.features.dataRefreshRate
}

// Helper function to validate tier upgrade path
export function getNextTier(currentTier: string): string | null {
  const tiers = ['free', 'consumer', 'business', 'enterprise']
  const currentIndex = tiers.indexOf(currentTier)
  
  if (currentIndex === -1 || currentIndex === tiers.length - 1) {
    return null
  }
  
  return tiers[currentIndex + 1]
}

// Helper function to get tier pricing
export function getTierPricing(tier: string): number {
  const pricing: Record<string, number> = {
    free: 0,
    consumer: 4.99,
    business: 49,
    enterprise: 199
  }
  
  return pricing[tier] || 0
}