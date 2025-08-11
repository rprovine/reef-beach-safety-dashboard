/**
 * Family-Friendly Beach Rating System
 * Provides kid-safe ratings and family amenity information
 */

export interface FamilyRating {
  kidSafe: 'excellent' | 'good' | 'fair' | 'poor'
  ageGroups: {
    toddlers: boolean // 0-3 years
    children: boolean // 4-12 years
    teens: boolean    // 13-17 years
  }
  amenities: {
    restrooms: boolean
    showers: boolean
    shade: boolean
    food: boolean
    parking: boolean
    lifeguard: boolean
    playground: boolean
  }
  accessibility: {
    wheelchairAccess: boolean
    stroller: boolean
    walkingPath: boolean
  }
  hazards: string[]
  recommendations: string[]
  bestTimeForFamilies: string
}

export function calculateFamilyRating(beach: any, conditions: any): FamilyRating {
  const { spotType, amenities } = beach
  const { waveHeight, ripCurrentRisk, bacteriaLevel, safetyScore } = conditions

  // Determine kid safety level
  let kidSafe: FamilyRating['kidSafe'] = 'good'
  if (safetyScore >= 80 && waveHeight < 2 && bacteriaLevel === 'safe') {
    kidSafe = 'excellent'
  } else if (waveHeight > 4 || ripCurrentRisk === 'high' || bacteriaLevel === 'unsafe') {
    kidSafe = 'poor'
  } else if (waveHeight > 2 || ripCurrentRisk === 'moderate') {
    kidSafe = 'fair'
  }

  // Age group suitability
  const ageGroups = {
    toddlers: waveHeight < 1.5 && kidSafe !== 'poor',
    children: waveHeight < 3 && kidSafe !== 'poor',
    teens: kidSafe !== 'poor'
  }

  // Amenity mapping
  const beachAmenities = {
    restrooms: amenities?.includes('restrooms') || false,
    showers: amenities?.includes('showers') || false,
    shade: spotType === 'family' || false,
    food: amenities?.includes('food') || false,
    parking: amenities?.includes('parking') || false,
    lifeguard: amenities?.includes('lifeguard') || false,
    playground: false // Would need to be in beach data
  }

  // Accessibility features
  const accessibility = {
    wheelchairAccess: spotType === 'family' && beachAmenities.parking,
    stroller: spotType === 'family',
    walkingPath: beachAmenities.parking
  }

  // Identify hazards
  const hazards = []
  if (waveHeight > 3) hazards.push('Large waves')
  if (ripCurrentRisk === 'high') hazards.push('Strong rip currents')
  if (ripCurrentRisk === 'moderate') hazards.push('Moderate rip currents')
  if (bacteriaLevel === 'unsafe') hazards.push('Poor water quality')
  if (!beachAmenities.lifeguard) hazards.push('No lifeguard on duty')
  if (spotType === 'surf') hazards.push('Popular surf spot - watch for boards')

  // Generate recommendations
  const recommendations = []
  if (ageGroups.toddlers) {
    recommendations.push('Perfect for toddlers - shallow, calm waters')
  }
  if (beachAmenities.lifeguard) {
    recommendations.push('Lifeguarded beach - swim near towers')
  }
  if (beachAmenities.restrooms && beachAmenities.showers) {
    recommendations.push('Full facilities available')
  }
  if (kidSafe === 'excellent') {
    recommendations.push('Ideal family destination')
  }
  if (waveHeight < 2 && spotType === 'tidepool') {
    recommendations.push('Great for exploring tide pools with kids')
  }
  if (!beachAmenities.shade) {
    recommendations.push('Bring umbrella or pop-up tent for shade')
  }

  // Best time for families
  let bestTimeForFamilies = 'Morning hours (8-11 AM)'
  if (kidSafe === 'excellent') {
    bestTimeForFamilies = 'All day suitable'
  } else if (kidSafe === 'poor') {
    bestTimeForFamilies = 'Not recommended for young children'
  }

  return {
    kidSafe,
    ageGroups,
    amenities: beachAmenities,
    accessibility,
    hazards,
    recommendations,
    bestTimeForFamilies
  }
}

// Pre-defined family ratings for specific beaches
export const FAMILY_BEACH_DATABASE: Record<string, Partial<FamilyRating>> = {
  'waikiki-beach': {
    amenities: { shade: true, playground: false },
    accessibility: { wheelchairAccess: true, stroller: true, walkingPath: true },
    recommendations: ['Perfect for first-time beach visitors', 'Gentle waves ideal for learning to swim']
  },
  'kailua-beach': {
    amenities: { shade: false },
    recommendations: ['Bring shade - limited natural cover', 'Amazing for family photos']
  },
  'hanauma-bay': {
    recommendations: ['Educational snorkeling experience', 'Advance reservations required']
  },
  'ko-olina-lagoons': {
    amenities: { shade: true },
    recommendations: ['Man-made lagoons perfect for toddlers', 'Calm, protected waters']
  },
  'lydgate-beach': {
    amenities: { shade: true, playground: true },
    recommendations: ['Has actual playground on beach', 'Protected swimming areas']
  }
}

export function getFamilyFeatures(beachSlug: string): string[] {
  const features = []
  
  // Family-friendly beaches
  const familyBeaches = [
    'waikiki-beach', 'kailua-beach', 'lanikai-beach', 'ko-olina-lagoons',
    'lydgate-beach', 'poipu-beach', 'napili-bay', 'kapalua-bay'
  ]
  
  if (familyBeaches.includes(beachSlug)) {
    features.push('👨‍👩‍👧‍👦 Family Friendly')
  }
  
  // Snorkeling beaches
  const snorkelBeaches = [
    'hanauma-bay', 'napili-bay', 'tunnels-beach', 'molokini-crater'
  ]
  
  if (snorkelBeaches.includes(beachSlug)) {
    features.push('🐠 Kid-Safe Snorkeling')
  }
  
  // Tide pool beaches
  const tidepoolBeaches = [
    'hanauma-bay', 'lydgate-beach', 'sharks-cove'
  ]
  
  if (tidepoolBeaches.includes(beachSlug)) {
    features.push('🦀 Tide Pools')
  }
  
  return features
}