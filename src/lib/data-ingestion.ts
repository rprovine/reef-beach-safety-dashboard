/**
 * Data Ingestion Service
 * Fetches real-time beach conditions from various sources
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simulated data sources (replace with real APIs)
// Note: These are placeholder URLs for future integration
// const DATA_SOURCES = {
//   NOAA: 'https://api.noaa.gov/beach-conditions',
//   PACIOOS: 'https://pacioos.hawaii.edu/api/conditions',
//   DOH: 'https://health.hawaii.gov/api/water-quality'
// }

interface BeachCondition {
  beachId: string
  waveHeightFt?: number
  windMph?: number
  windDirDeg?: number
  waterTempF?: number
  tideFt?: number
  bacteriaLevel?: 'safe' | 'caution' | 'unsafe'
  source: string
}

export class DataIngestionService {
  /**
   * Fetch latest conditions for all beaches
   */
  async fetchAllBeachConditions() {
    console.log('🌊 Starting data ingestion...')
    
    const beaches = await prisma.beach.findMany({
      where: { isActive: true }
    })
    
    let successCount = 0
    let errorCount = 0
    
    for (const beach of beaches) {
      try {
        const conditions = await this.fetchBeachConditions(beach.id)
        
        if (conditions) {
          await this.saveReading(conditions)
          await this.checkAlerts(beach.id, conditions)
          successCount++
        }
      } catch (error) {
        console.error(`Error fetching data for beach ${beach.name}:`, error)
        errorCount++
      }
    }
    
    console.log(`✅ Data ingestion complete: ${successCount} success, ${errorCount} errors`)
    return { successCount, errorCount }
  }
  
  /**
   * Fetch conditions for a specific beach
   */
  async fetchBeachConditions(beachId: string): Promise<BeachCondition | null> {
    // Simulate API call with random data
    // In production, replace with actual API calls
    
    const randomConditions: BeachCondition = {
      beachId,
      waveHeightFt: Math.random() * 10 + 1,
      windMph: Math.random() * 20 + 5,
      windDirDeg: Math.floor(Math.random() * 360),
      waterTempF: Math.random() * 10 + 70,
      tideFt: Math.random() * 3 - 1.5,
      bacteriaLevel: ['safe', 'caution', 'unsafe'][Math.floor(Math.random() * 3)] as 'safe' | 'caution' | 'unsafe',
      source: 'noaa'
    }
    
    return randomConditions
  }
  
  /**
   * Save reading to database
   */
  async saveReading(conditions: BeachCondition) {
    await prisma.reading.create({
      data: {
        beachId: conditions.beachId,
        waveHeightFt: conditions.waveHeightFt,
        windMph: conditions.windMph,
        windDirDeg: conditions.windDirDeg,
        waterTempF: conditions.waterTempF,
        tideFt: conditions.tideFt,
        bacteriaLevel: conditions.bacteriaLevel,
        source: conditions.source,
        timestamp: new Date()
      }
    })
  }
  
  /**
   * Check if conditions trigger any alerts
   */
  async checkAlerts(beachId: string, conditions: BeachCondition) {
    const alertRules = await prisma.alertRule.findMany({
      where: {
        beachId,
        alert: {
          isActive: true
        }
      },
      include: {
        alert: {
          include: {
            user: true
          }
        }
      }
    })
    
    for (const rule of alertRules) {
      const shouldTrigger = this.evaluateRule(rule, conditions)
      
      if (shouldTrigger) {
        await this.sendAlert(rule, conditions)
      }
    }
  }
  
  /**
   * Evaluate if a rule should trigger
   */
  evaluateRule(rule: Record<string, unknown>, conditions: BeachCondition): boolean {
    const metricValue = this.getMetricValue(rule.metric, conditions)
    if (metricValue === null) return false
    
    const threshold = rule.threshold ? parseFloat(rule.threshold) : 0
    
    switch (rule.operator) {
      case 'gt': return metricValue > threshold
      case 'gte': return metricValue >= threshold
      case 'lt': return metricValue < threshold
      case 'lte': return metricValue <= threshold
      case 'eq': return metricValue === threshold
      case 'changed': return true // Always trigger on change
      case 'is_active': return rule.metric === 'bacteria' && conditions.bacteriaLevel !== 'safe'
      default: return false
    }
  }
  
  /**
   * Get metric value from conditions
   */
  getMetricValue(metric: string, conditions: BeachCondition): number | null {
    switch (metric) {
      case 'wave_height_ft': return conditions.waveHeightFt || null
      case 'wind_mph': return conditions.windMph || null
      case 'bacteria': 
        return conditions.bacteriaLevel === 'unsafe' ? 2 : 
               conditions.bacteriaLevel === 'caution' ? 1 : 0
      default: return null
    }
  }
  
  /**
   * Send alert notification
   */
  async sendAlert(rule: Record<string, unknown>, conditions: BeachCondition) {
    const beach = await prisma.beach.findUnique({
      where: { id: conditions.beachId }
    })
    
    if (!beach) return
    
    const message = this.formatAlertMessage(rule, beach.name, conditions)
    
    // Record alert in history
    await prisma.alertHistory.create({
      data: {
        alertId: rule.alert.id,
        userId: rule.alert.userId,
        beachName: beach.name,
        condition: rule.metric,
        message,
        channel: 'email', // Would send via multiple channels in production
        sentAt: new Date()
      }
    })
    
    // In production, send actual email/SMS here
    console.log(`📧 Alert sent to ${rule.alert.user.email}: ${message}`)
  }
  
  /**
   * Format alert message
   */
  formatAlertMessage(rule: Record<string, unknown>, beachName: string, conditions: BeachCondition): string {
    const templates: Record<string, string> = {
      wave_height_ft: `High surf alert at ${beachName}: Waves are ${conditions.waveHeightFt?.toFixed(1)} ft`,
      wind_mph: `Wind alert at ${beachName}: Winds at ${conditions.windMph?.toFixed(0)} mph`,
      bacteria: `Water quality alert at ${beachName}: Bacteria levels are ${conditions.bacteriaLevel}`,
      advisory: `New advisory for ${beachName}: Please check current conditions`
    }
    
    return templates[rule.metric] || `Beach conditions have changed at ${beachName}`
  }
}

// Cron job function to run every 15 minutes
export async function runDataIngestion() {
  const service = new DataIngestionService()
  return await service.fetchAllBeachConditions()
}