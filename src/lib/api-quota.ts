/**
 * API Quota Management System
 * Prevents exceeding API limits by tracking daily/monthly usage
 */

interface QuotaTracker {
  daily: number
  monthly: number
  lastResetDaily: string
  lastResetMonthly: string
}

// In-memory quota tracking (use database in production)
const quotaStore = new Map<string, QuotaTracker>()

// API Quota limits (adjust based on your plans)
const QUOTA_LIMITS = {
  openweather: {
    daily: 1000,      // OpenWeather free tier: 1,000 calls/day
    monthly: 60000    // About 60K per month
  },
  stormglass: {
    daily: 50,        // StormGlass: adjust based on your plan
    monthly: 1000     // Adjust based on your plan
  },
  noaa: {
    daily: 1000,      // NOAA has no strict limits but be respectful
    monthly: 30000    // Conservative estimate
  }
} as const

export class APIQuotaManager {
  private getToday(): string {
    return new Date().toISOString().split('T')[0]
  }
  
  private getThisMonth(): string {
    const date = new Date()
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }
  
  private getQuotaData(apiName: string): QuotaTracker {
    const existing = quotaStore.get(apiName)
    const today = this.getToday()
    const thisMonth = this.getThisMonth()
    
    if (!existing || existing.lastResetDaily !== today) {
      const quota: QuotaTracker = {
        daily: existing?.lastResetDaily === today ? existing.daily : 0,
        monthly: existing?.lastResetMonthly === thisMonth ? existing.monthly : 0,
        lastResetDaily: today,
        lastResetMonthly: thisMonth
      }
      quotaStore.set(apiName, quota)
      return quota
    }
    
    return existing
  }
  
  /**
   * Check if API call is allowed within quota
   */
  canMakeAPICall(apiName: keyof typeof QUOTA_LIMITS): boolean {
    const quota = this.getQuotaData(apiName)
    const limits = QUOTA_LIMITS[apiName]
    
    // Check daily and monthly limits
    if (quota.daily >= limits.daily) {
      console.warn(`${apiName} daily quota exceeded: ${quota.daily}/${limits.daily}`)
      return false
    }
    
    if (quota.monthly >= limits.monthly) {
      console.warn(`${apiName} monthly quota exceeded: ${quota.monthly}/${limits.monthly}`)
      return false
    }
    
    return true
  }
  
  /**
   * Record an API call
   */
  recordAPICall(apiName: keyof typeof QUOTA_LIMITS): void {
    const quota = this.getQuotaData(apiName)
    quota.daily++
    quota.monthly++
    quotaStore.set(apiName, quota)
    
    // Log usage every 10 calls
    if (quota.daily % 10 === 0) {
      console.log(`${apiName} usage: ${quota.daily}/${QUOTA_LIMITS[apiName].daily} daily, ${quota.monthly}/${QUOTA_LIMITS[apiName].monthly} monthly`)
    }
  }
  
  /**
   * Get current usage stats
   */
  getUsageStats(): Record<string, { daily: number; monthly: number; dailyLimit: number; monthlyLimit: number }> {
    const stats: any = {}
    
    for (const [apiName, limits] of Object.entries(QUOTA_LIMITS)) {
      const quota = this.getQuotaData(apiName)
      stats[apiName] = {
        daily: quota.daily,
        monthly: quota.monthly,
        dailyLimit: limits.daily,
        monthlyLimit: limits.monthly,
        dailyPercentage: Math.round((quota.daily / limits.daily) * 100),
        monthlyPercentage: Math.round((quota.monthly / limits.monthly) * 100)
      }
    }
    
    return stats
  }
  
  /**
   * Check if approaching quota limits (80% threshold)
   */
  isApproachingLimit(apiName: keyof typeof QUOTA_LIMITS): boolean {
    const quota = this.getQuotaData(apiName)
    const limits = QUOTA_LIMITS[apiName]
    
    const dailyPercentage = (quota.daily / limits.daily) * 100
    const monthlyPercentage = (quota.monthly / limits.monthly) * 100
    
    return dailyPercentage >= 80 || monthlyPercentage >= 80
  }
  
  /**
   * Get time until quota resets
   */
  getResetTime(): { daily: string; monthly: string } {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    
    return {
      daily: tomorrow.toISOString(),
      monthly: nextMonth.toISOString()
    }
  }
}

// Export singleton instance
export const quotaManager = new APIQuotaManager()