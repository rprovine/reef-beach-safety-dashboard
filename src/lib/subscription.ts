// Subscription management and user tiers for Hawaii Beach Safety Dashboard

export type SubscriptionTier = 'free' | 'consumer' | 'business' | 'enterprise'

export interface SubscriptionPlan {
  id: SubscriptionTier
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: {
    beaches: number | 'unlimited'
    alerts: number | 'unlimited'
    apiCalls: number | 'unlimited'
    widgets: number | 'unlimited'
    historicalData: string
    support: string
    customBranding: boolean
    whiteLabel: boolean
    advancedAnalytics: boolean
    priorityAlerts: boolean
    phoneSupport: boolean
    customIntegration: boolean
  }
  limits: {
    alertsPerMonth: number | 'unlimited'
    apiCallsPerMonth: number | 'unlimited'
    widgetsActive: number | 'unlimited'
    dataRetentionDays: number | 'unlimited'
  }
  billing: {
    stripeProductId?: string
    stripePriceIdMonthly?: string
    stripePriceIdYearly?: string
  }
}

export interface UserSubscription {
  userId: string
  tier: SubscriptionTier
  status: 'active' | 'past_due' | 'canceled' | 'unpaid'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  usage: {
    alertsSent: number
    apiCallsMade: number
    widgetsActive: number
    lastUsageReset: Date
  }
  features: SubscriptionPlan['features']
}

export interface UsageQuota {
  alerts: { used: number; limit: number | 'unlimited' }
  apiCalls: { used: number; limit: number | 'unlimited' }
  widgets: { used: number; limit: number | 'unlimited' }
}

class SubscriptionService {
  private plans: SubscriptionPlan[] = []

  constructor() {
    this.initializePlans()
  }

  // Get all available subscription plans
  getPlans(): SubscriptionPlan[] {
    return this.plans
  }

  // Get specific plan by tier
  getPlan(tier: SubscriptionTier): SubscriptionPlan | null {
    return this.plans.find(plan => plan.id === tier) || null
  }

  // Calculate savings for yearly billing
  getYearlySavings(tier: SubscriptionTier): number {
    const plan = this.getPlan(tier)
    if (!plan) return 0
    
    const monthlyTotal = plan.price.monthly * 12
    const savings = monthlyTotal - plan.price.yearly
    return Math.round((savings / monthlyTotal) * 100)
  }

  // Check if user can use feature
  canUseFeature(subscription: UserSubscription, feature: keyof SubscriptionPlan['features']): boolean {
    const plan = this.getPlan(subscription.tier)
    if (!plan) return false

    // Check subscription status
    if (subscription.status !== 'active') {
      // Allow basic features for past_due to avoid service interruption
      if (subscription.status === 'past_due' && subscription.tier === 'free') {
        return true
      }
      return false
    }

    return plan.features[feature] as boolean
  }

  // Check usage limits
  checkUsageLimit(subscription: UserSubscription, type: 'alerts' | 'apiCalls' | 'widgets'): {
    canUse: boolean
    used: number
    limit: number | 'unlimited'
    percentUsed: number
  } {
    const plan = this.getPlan(subscription.tier)
    if (!plan) {
      return { canUse: false, used: 0, limit: 0, percentUsed: 100 }
    }

    const limits = plan.limits
    const usage = subscription.usage

    let limit: number | 'unlimited'
    let used: number

    switch (type) {
      case 'alerts':
        limit = limits.alertsPerMonth
        used = usage.alertsSent
        break
      case 'apiCalls':
        limit = limits.apiCallsPerMonth  
        used = usage.apiCallsMade
        break
      case 'widgets':
        limit = limits.widgetsActive
        used = usage.widgetsActive
        break
    }

    if (limit === 'unlimited') {
      return { canUse: true, used, limit, percentUsed: 0 }
    }

    const percentUsed = (used / limit) * 100
    const canUse = used < limit

    return { canUse, used, limit, percentUsed }
  }

  // Get upgrade recommendation
  getUpgradeRecommendation(subscription: UserSubscription): {
    shouldUpgrade: boolean
    reason: string
    recommendedTier: SubscriptionTier
  } {
    const alerts = this.checkUsageLimit(subscription, 'alerts')
    const apiCalls = this.checkUsageLimit(subscription, 'apiCalls')
    const widgets = this.checkUsageLimit(subscription, 'widgets')

    // Check if approaching limits (>80%)
    if (alerts.percentUsed > 80 || apiCalls.percentUsed > 80 || widgets.percentUsed > 80) {
      const nextTier = this.getNextTier(subscription.tier)
      return {
        shouldUpgrade: true,
        reason: 'Approaching usage limits',
        recommendedTier: nextTier
      }
    }

    // Check if user would benefit from higher tier features
    if (subscription.tier === 'free') {
      return {
        shouldUpgrade: true,
        reason: 'Unlock unlimited alerts and advanced features',
        recommendedTier: 'consumer'
      }
    }

    if (subscription.tier === 'consumer' && (widgets.used > 1 || apiCalls.used > 1000)) {
      return {
        shouldUpgrade: true,
        reason: 'Get more widgets and API calls for business use',
        recommendedTier: 'business'
      }
    }

    return {
      shouldUpgrade: false,
      reason: '',
      recommendedTier: subscription.tier
    }
  }

  // Get next tier
  private getNextTier(currentTier: SubscriptionTier): SubscriptionTier {
    const tierOrder: SubscriptionTier[] = ['free', 'consumer', 'business', 'enterprise']
    const currentIndex = tierOrder.indexOf(currentTier)
    return tierOrder[Math.min(currentIndex + 1, tierOrder.length - 1)]
  }

  // Initialize subscription plans
  private initializePlans(): void {
    this.plans = [
      {
        id: 'free',
        name: 'Free',
        description: 'Perfect for personal beach planning',
        price: { monthly: 0, yearly: 0 },
        features: {
          beaches: 10,
          alerts: 5,
          apiCalls: 100,
          widgets: 1,
          historicalData: '7 days',
          support: 'Community',
          customBranding: false,
          whiteLabel: false,
          advancedAnalytics: false,
          priorityAlerts: false,
          phoneSupport: false,
          customIntegration: false
        },
        limits: {
          alertsPerMonth: 5,
          apiCallsPerMonth: 100,
          widgetsActive: 1,
          dataRetentionDays: 7
        },
        billing: {}
      },
      {
        id: 'consumer',
        name: 'Consumer',
        description: 'For ocean enthusiasts and regular beach-goers',
        price: { monthly: 9.99, yearly: 99.99 },
        features: {
          beaches: 'unlimited',
          alerts: 'unlimited', 
          apiCalls: 1000,
          widgets: 3,
          historicalData: '90 days',
          support: 'Email',
          customBranding: false,
          whiteLabel: false,
          advancedAnalytics: true,
          priorityAlerts: true,
          phoneSupport: false,
          customIntegration: false
        },
        limits: {
          alertsPerMonth: 'unlimited',
          apiCallsPerMonth: 1000,
          widgetsActive: 3,
          dataRetentionDays: 90
        },
        billing: {
          stripeProductId: 'prod_consumer',
          stripePriceIdMonthly: 'price_consumer_monthly',
          stripePriceIdYearly: 'price_consumer_yearly'
        }
      },
      {
        id: 'business',
        name: 'Business',
        description: 'For tour operators, hotels, and water sports businesses',
        price: { monthly: 49.99, yearly: 499.99 },
        features: {
          beaches: 'unlimited',
          alerts: 'unlimited',
          apiCalls: 10000,
          widgets: 10,
          historicalData: '1 year',
          support: 'Priority email',
          customBranding: true,
          whiteLabel: false,
          advancedAnalytics: true,
          priorityAlerts: true,
          phoneSupport: false,
          customIntegration: true
        },
        limits: {
          alertsPerMonth: 'unlimited',
          apiCallsPerMonth: 10000,
          widgetsActive: 10,
          dataRetentionDays: 365
        },
        billing: {
          stripeProductId: 'prod_business',
          stripePriceIdMonthly: 'price_business_monthly',
          stripePriceIdYearly: 'price_business_yearly'
        }
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large organizations and government agencies',
        price: { monthly: 199.99, yearly: 1999.99 },
        features: {
          beaches: 'unlimited',
          alerts: 'unlimited',
          apiCalls: 'unlimited',
          widgets: 'unlimited',
          historicalData: 'Unlimited',
          support: 'Phone & email',
          customBranding: true,
          whiteLabel: true,
          advancedAnalytics: true,
          priorityAlerts: true,
          phoneSupport: true,
          customIntegration: true
        },
        limits: {
          alertsPerMonth: 'unlimited',
          apiCallsPerMonth: 'unlimited',
          widgetsActive: 'unlimited',
          dataRetentionDays: 'unlimited'
        },
        billing: {
          stripeProductId: 'prod_enterprise',
          stripePriceIdMonthly: 'price_enterprise_monthly',
          stripePriceIdYearly: 'price_enterprise_yearly'
        }
      }
    ]
  }
}

// User management functionality
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'business' | 'admin'
  subscription: UserSubscription
  preferences: {
    timezone: string
    units: 'imperial' | 'metric'
    language: 'en' | 'haw' // English or Hawaiian
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    favoriteBeaches: string[]
    alertTypes: string[]
  }
  apiKeys: {
    id: string
    name: string
    key: string
    lastUsed: Date | null
    usage: {
      calls: number
      lastReset: Date
    }
  }[]
  createdAt: Date
  lastLoginAt: Date
}

class UserService {
  // Create API key for user
  generateApiKey(userId: string, name: string): string {
    const prefix = 'hbs_' // Hawaii Beach Safety prefix
    const random = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15)
    return `${prefix}${random}`
  }

  // Validate API key format
  isValidApiKeyFormat(key: string): boolean {
    return /^hbs_[a-z0-9]{26}$/.test(key)
  }

  // Get user tier badge
  getTierBadge(tier: SubscriptionTier): {
    label: string
    color: string
    icon: string
  } {
    switch (tier) {
      case 'free':
        return { label: 'Free', color: 'text-gray-600 bg-gray-100', icon: '🏄‍♂️' }
      case 'consumer':
        return { label: 'Consumer', color: 'text-blue-600 bg-blue-100', icon: '🌊' }
      case 'business':
        return { label: 'Business', color: 'text-green-600 bg-green-100', icon: '🏨' }
      case 'enterprise':
        return { label: 'Enterprise', color: 'text-purple-600 bg-purple-100', icon: '🏢' }
    }
  }

  // Format usage display
  formatUsage(used: number, limit: number | 'unlimited'): string {
    if (limit === 'unlimited') return `${used.toLocaleString()} used`
    return `${used.toLocaleString()} / ${limit.toLocaleString()}`
  }

  // Get usage warning level
  getUsageWarningLevel(percentUsed: number): 'none' | 'warning' | 'critical' {
    if (percentUsed >= 90) return 'critical'
    if (percentUsed >= 75) return 'warning'
    return 'none'
  }
}

// Export services
export const subscriptionService = new SubscriptionService()
export const userService = new UserService()

// Utility functions for subscription management
export function canAccessFeature(user: User, feature: keyof SubscriptionPlan['features']): boolean {
  return subscriptionService.canUseFeature(user.subscription, feature)
}

export function getUsageStatus(user: User, type: 'alerts' | 'apiCalls' | 'widgets'): UsageQuota[keyof UsageQuota] {
  const result = subscriptionService.checkUsageLimit(user.subscription, type)
  return { used: result.used, limit: result.limit }
}

export function shouldShowUpgradePrompt(user: User): boolean {
  const recommendation = subscriptionService.getUpgradeRecommendation(user.subscription)
  return recommendation.shouldUpgrade
}