// Comprehensive beach safety scoring system for Hawaii

export interface SafetyFactors {
  waveHeight: number | null        // feet
  windSpeed: number | null         // mph  
  waterTemp: number | null         // fahrenheit
  ripCurrentRisk: 'low' | 'moderate' | 'high' | null
  waterQuality: 'excellent' | 'good' | 'fair' | 'poor' | null
  uvIndex: number | null           // 0-11+
  jellyfishWarning: boolean
  marineLifeHazard: 'none' | 'low' | 'moderate' | 'high'
  lifeguardPresent: boolean
  amenities: string[]
  crowdDensity: 'low' | 'moderate' | 'high' | null
  accessibilityScore: number      // 0-10
}

export interface ActivitySafety {
  swimming: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous'
  snorkeling: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous'
  surfing: 'excellent' | 'good' | 'fair' | 'poor' | 'flat'
  diving: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous'
  fishing: 'excellent' | 'good' | 'fair' | 'poor'
  familyFriendly: 'excellent' | 'good' | 'fair' | 'poor'
}

export interface SafetyAlert {
  id: string
  type: 'warning' | 'advisory' | 'emergency'
  category: 'marine-life' | 'water-quality' | 'weather' | 'surf' | 'health'
  title: string
  description: string
  severity: 'low' | 'moderate' | 'high' | 'extreme'
  activeUntil: Date
  affectedBeaches?: string[]
}

// Calculate comprehensive safety score (0-100)
export function calculateSafetyScore(factors: SafetyFactors): number {
  let score = 100
  let totalWeight = 0

  // Wave conditions (20% weight)
  if (factors.waveHeight !== null) {
    totalWeight += 20
    if (factors.waveHeight > 8) score -= 25      // Very dangerous
    else if (factors.waveHeight > 5) score -= 15 // Dangerous for most
    else if (factors.waveHeight > 3) score -= 8  // Moderate caution
    else if (factors.waveHeight > 1.5) score -= 3 // Slight caution
    // 0-1.5ft is ideal, no deduction
  }

  // Rip current risk (25% weight)
  if (factors.ripCurrentRisk) {
    totalWeight += 25
    switch (factors.ripCurrentRisk) {
      case 'high': score -= 30; break
      case 'moderate': score -= 15; break
      case 'low': score -= 5; break
    }
  }

  // Water quality (20% weight)
  if (factors.waterQuality) {
    totalWeight += 20
    switch (factors.waterQuality) {
      case 'poor': score -= 35; break
      case 'fair': score -= 20; break
      case 'good': score -= 5; break
      case 'excellent': break // no deduction
    }
  }

  // Wind conditions (10% weight)
  if (factors.windSpeed !== null) {
    totalWeight += 10
    if (factors.windSpeed > 25) score -= 15      // Very windy
    else if (factors.windSpeed > 15) score -= 8  // Windy
    else if (factors.windSpeed > 10) score -= 3  // Breezy
    // 0-10mph is pleasant
  }

  // Marine life hazards (15% weight)
  totalWeight += 15
  switch (factors.marineLifeHazard) {
    case 'high': score -= 25; break
    case 'moderate': score -= 12; break
    case 'low': score -= 5; break
    case 'none': break
  }

  // Jellyfish warning (5% weight)
  totalWeight += 5
  if (factors.jellyfishWarning) score -= 20

  // UV exposure (3% weight) 
  if (factors.uvIndex !== null) {
    totalWeight += 3
    if (factors.uvIndex > 10) score -= 8        // Extreme
    else if (factors.uvIndex > 7) score -= 5    // Very high
    else if (factors.uvIndex > 5) score -= 2    // High
    // 0-5 is manageable
  }

  // Lifeguard presence (+2% bonus)
  if (factors.lifeguardPresent) {
    score += 5
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

// Calculate activity-specific safety ratings
export function calculateActivitySafety(factors: SafetyFactors): ActivitySafety {
  const swimming = getSwimmingSafety(factors)
  const snorkeling = getSnorkelingSafety(factors)
  const surfing = getSurfingSafety(factors)
  const diving = getDivingSafety(factors)
  const fishing = getFishingSafety(factors)
  const familyFriendly = getFamilySafety(factors)

  return {
    swimming,
    snorkeling,
    surfing,
    diving,
    fishing,
    familyFriendly
  }
}

function getSwimmingSafety(factors: SafetyFactors): ActivitySafety['swimming'] {
  // High risk factors
  if (factors.ripCurrentRisk === 'high' || 
      factors.waterQuality === 'poor' ||
      factors.marineLifeHazard === 'high' ||
      (factors.waveHeight && factors.waveHeight > 6)) {
    return 'dangerous'
  }

  // Poor conditions
  if (factors.ripCurrentRisk === 'moderate' ||
      factors.waterQuality === 'fair' ||
      factors.marineLifeHazard === 'moderate' ||
      (factors.waveHeight && factors.waveHeight > 4)) {
    return 'poor'
  }

  // Fair conditions  
  if ((factors.waveHeight && factors.waveHeight > 2.5) ||
      (factors.windSpeed && factors.windSpeed > 20)) {
    return 'fair'
  }

  // Good conditions
  if ((factors.waveHeight && factors.waveHeight > 1.5) ||
      factors.ripCurrentRisk === 'low') {
    return 'good'
  }

  // Excellent conditions
  return 'excellent'
}

function getSnorkelingSafety(factors: SafetyFactors): ActivitySafety['snorkeling'] {
  // Dangerous for snorkeling
  if (factors.waterQuality === 'poor' ||
      (factors.waveHeight && factors.waveHeight > 3) ||
      (factors.windSpeed && factors.windSpeed > 25)) {
    return 'dangerous'
  }

  // Poor visibility/conditions
  if (factors.waterQuality === 'fair' ||
      (factors.waveHeight && factors.waveHeight > 2) ||
      (factors.windSpeed && factors.windSpeed > 15)) {
    return 'poor'
  }

  // Fair conditions
  if ((factors.waveHeight && factors.waveHeight > 1) ||
      factors.marineLifeHazard === 'moderate') {
    return 'fair'
  }

  // Good conditions
  if (factors.waterQuality === 'good' ||
      factors.marineLifeHazard === 'low') {
    return 'good'
  }

  // Excellent - calm, clear water
  return 'excellent'
}

function getSurfingSafety(factors: SafetyFactors): ActivitySafety['surfing'] {
  // No waves
  if (!factors.waveHeight || factors.waveHeight < 1) {
    return 'flat'
  }

  // Dangerous conditions
  if (factors.waveHeight > 15 ||
      factors.marineLifeHazard === 'high' ||
      factors.waterQuality === 'poor') {
    return 'dangerous'
  }

  // Poor conditions
  if (factors.waveHeight > 10 ||
      (factors.windSpeed && factors.windSpeed > 30) ||
      factors.ripCurrentRisk === 'high') {
    return 'poor'
  }

  // Fair conditions
  if (factors.waveHeight > 8 ||
      (factors.windSpeed && factors.windSpeed > 20)) {
    return 'fair'
  }

  // Good conditions
  if (factors.waveHeight > 3 ||
      (factors.windSpeed && factors.windSpeed > 12)) {
    return 'good'
  }

  // Excellent surfing conditions
  return 'excellent'
}

function getDivingSafety(factors: SafetyFactors): ActivitySafety['diving'] {
  // Dangerous for diving
  if (factors.waterQuality === 'poor' ||
      (factors.waveHeight && factors.waveHeight > 4) ||
      factors.ripCurrentRisk === 'high' ||
      (factors.windSpeed && factors.windSpeed > 25)) {
    return 'dangerous'
  }

  // Poor conditions
  if (factors.waterQuality === 'fair' ||
      (factors.waveHeight && factors.waveHeight > 2.5) ||
      (factors.windSpeed && factors.windSpeed > 18)) {
    return 'poor'
  }

  // Fair conditions
  if ((factors.waveHeight && factors.waveHeight > 1.5) ||
      factors.ripCurrentRisk === 'moderate') {
    return 'fair'
  }

  // Good conditions
  if (factors.waterQuality === 'good' &&
      factors.ripCurrentRisk === 'low') {
    return 'good'
  }

  // Excellent diving conditions
  return 'excellent'
}

function getFishingSafety(factors: SafetyFactors): ActivitySafety['fishing'] {
  // Poor fishing conditions
  if ((factors.windSpeed && factors.windSpeed > 30) ||
      (factors.waveHeight && factors.waveHeight > 8)) {
    return 'poor'
  }

  // Fair conditions
  if ((factors.windSpeed && factors.windSpeed > 20) ||
      (factors.waveHeight && factors.waveHeight > 5)) {
    return 'fair'
  }

  // Good conditions
  if ((factors.windSpeed && factors.windSpeed > 12) ||
      (factors.waveHeight && factors.waveHeight > 3)) {
    return 'good'
  }

  // Excellent fishing conditions
  return 'excellent'
}

function getFamilySafety(factors: SafetyFactors): ActivitySafety['familyFriendly'] {
  // Not family friendly
  if (factors.ripCurrentRisk === 'high' ||
      factors.waterQuality === 'poor' ||
      factors.marineLifeHazard === 'high' ||
      (factors.waveHeight && factors.waveHeight > 3) ||
      !factors.lifeguardPresent) {
    return 'poor'
  }

  // Fair for families
  if (factors.ripCurrentRisk === 'moderate' ||
      factors.waterQuality === 'fair' ||
      factors.marineLifeHazard === 'moderate' ||
      (factors.waveHeight && factors.waveHeight > 2)) {
    return 'fair'
  }

  // Good for families
  if ((factors.waveHeight && factors.waveHeight > 1) ||
      factors.ripCurrentRisk === 'low') {
    return 'good'
  }

  // Excellent for families - calm, safe, with amenities
  return 'excellent'
}

// Generate safety recommendations based on conditions
export function generateSafetyRecommendations(factors: SafetyFactors): string[] {
  const recommendations: string[] = []

  if (factors.jellyfishWarning) {
    recommendations.push('🪼 Box jellyfish warning active - avoid water contact')
  }

  if (factors.ripCurrentRisk === 'high') {
    recommendations.push('🌊 High rip current risk - swim near lifeguards only')
  }

  if (factors.waterQuality === 'poor') {
    recommendations.push('💧 Poor water quality - avoid swimming until conditions improve')
  }

  if (factors.uvIndex && factors.uvIndex > 8) {
    recommendations.push('☀️ Extreme UV - use SPF 50+ and seek shade frequently')
  }

  if (factors.waveHeight && factors.waveHeight > 6) {
    recommendations.push('🏄 Large surf - experienced swimmers/surfers only')
  }

  if (factors.marineLifeHazard === 'high') {
    recommendations.push('🦈 Marine life hazard reported - use extra caution')
  }

  if (!factors.lifeguardPresent) {
    recommendations.push('🏖️ No lifeguard on duty - swim with buddy system')
  }

  if (factors.windSpeed && factors.windSpeed > 25) {
    recommendations.push('💨 High winds - secure belongings and use caution')
  }

  // Positive recommendations
  if (recommendations.length === 0) {
    recommendations.push('✅ Excellent conditions for beach activities')
  }

  return recommendations
}

// Current active safety alerts for Hawaii
export const currentSafetyAlerts: SafetyAlert[] = [
  // These would be dynamically updated from various data sources
]