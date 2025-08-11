// Reef data service for Beach Hui
// Powered by LeniLani Consulting

import { 
  ReefHealth, 
  MarineEcosystem, 
  ReefHazards, 
  ReefEducation, 
  ReefConservation,
  ReefForecast,
  BeachReefData,
  MarineSpecies
} from '@/types/reef'

// Common Hawaiian reef fish
const COMMON_REEF_FISH: MarineSpecies[] = [
  {
    commonName: 'Yellow Tang',
    hawaiianName: 'Lau\'ipala',
    scientificName: 'Zebrasoma flavescens',
    abundance: 'common',
    bestSpots: ['Hanauma Bay', 'Molokini Crater']
  },
  {
    commonName: 'Moorish Idol',
    hawaiianName: 'Kihikihi',
    scientificName: 'Zanclus cornutus',
    abundance: 'common',
    bestSpots: ['Honolua Bay', 'Two Step']
  },
  {
    commonName: 'Parrotfish',
    hawaiianName: 'Uhu',
    scientificName: 'Scarus psittacus',
    abundance: 'abundant',
    bestSpots: ['Most reefs']
  },
  {
    commonName: 'Humuhumunukunukuapua\'a',
    hawaiianName: 'Humuhumu',
    scientificName: 'Rhinecanthus rectangulus',
    abundance: 'common',
    conservationStatus: 'common',
    bestSpots: ['Shallow reefs', 'Tide pools']
  },
  {
    commonName: 'Green Sea Turtle',
    hawaiianName: 'Honu',
    scientificName: 'Chelonia mydas',
    abundance: 'common',
    conservationStatus: 'threatened',
    bestSpots: ['Turtle Bay', 'Laniakea Beach']
  }
]

// Reef etiquette guidelines
const REEF_ETIQUETTE = [
  {
    rule: 'Never stand on or touch coral',
    importance: 'critical' as const,
    icon: '🪸'
  },
  {
    rule: 'Use reef-safe sunscreen only',
    importance: 'critical' as const,
    icon: '🧴'
  },
  {
    rule: 'Keep 10+ feet distance from sea turtles',
    importance: 'critical' as const,
    icon: '🐢'
  },
  {
    rule: 'Keep 150+ feet from Hawaiian monk seals',
    importance: 'critical' as const,
    icon: '🦭'
  },
  {
    rule: 'Don\'t feed fish or wildlife',
    importance: 'important' as const,
    icon: '🐠'
  },
  {
    rule: 'Take only pictures, leave only bubbles',
    importance: 'important' as const,
    icon: '📸'
  },
  {
    rule: 'Enter/exit water carefully to avoid damaging coral',
    importance: 'important' as const,
    icon: '🚶'
  },
  {
    rule: 'Check for jellyfish warnings (8-10 days after full moon)',
    importance: 'important' as const,
    icon: '🪼'
  }
]

// Calculate coral bleaching stress based on temperature
function calculateThermalStress(currentTemp: number, avgTemp: number): string {
  const anomaly = currentTemp - avgTemp
  
  if (anomaly < 0.5) return 'none'
  if (anomaly < 1.0) return 'watch'
  if (anomaly < 1.5) return 'warning'
  if (anomaly < 2.0) return 'alert-1'
  return 'alert-2'
}

// Calculate reef health score
function calculateReefHealthScore(
  coralCoverage: number,
  bleachingPercentage: number,
  turbidity: number,
  pH: number
): number {
  // Base score from coral coverage (40% weight)
  let score = (coralCoverage / 100) * 40
  
  // Deduct for bleaching (30% weight)
  score += ((100 - bleachingPercentage) / 100) * 30
  
  // Water clarity (15% weight) - lower turbidity is better
  const clarityScore = Math.max(0, (50 - turbidity) / 50)
  score += clarityScore * 15
  
  // pH health (15% weight) - optimal pH is 8.0-8.3
  const pHScore = pH >= 8.0 && pH <= 8.3 ? 1 : Math.max(0, 1 - Math.abs(8.15 - pH) / 0.5)
  score += pHScore * 15
  
  return Math.round(Math.min(100, Math.max(0, score)))
}

// Get box jellyfish warning dates (8-10 days after full moon)
function getJellyfishWarningDates(): Date[] {
  const dates: Date[] = []
  const now = new Date()
  
  // Calculate for next 3 months
  for (let month = 0; month < 3; month++) {
    const targetDate = new Date(now)
    targetDate.setMonth(now.getMonth() + month)
    
    // Approximate lunar cycle (this would need a proper lunar calendar library in production)
    const fullMoonDay = 15 // Simplified - around middle of month
    
    for (let day = 8; day <= 10; day++) {
      const warningDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), fullMoonDay + day)
      dates.push(warningDate)
    }
  }
  
  return dates
}

// Generate reef data for a beach
export function generateReefData(beachId: string, beachName: string): BeachReefData {
  const now = new Date()
  
  // Simulate varying conditions based on beach characteristics
  const hasGoodReef = ['hanauma-bay', 'molokini', 'honolua-bay', 'two-step'].includes(beachId)
  const isProtected = ['hanauma-bay', 'molokini', 'honolua-bay'].includes(beachId)
  const hasTidePools = ['makapuu', 'sharks-cove', 'pupukea'].includes(beachId)
  
  // Generate health data
  const coralCoverage = hasGoodReef ? 45 + Math.random() * 30 : 10 + Math.random() * 25
  const bleachingPercentage = hasGoodReef ? Math.random() * 15 : Math.random() * 40
  const turbidity = hasGoodReef ? 2 + Math.random() * 8 : 5 + Math.random() * 20
  const pH = 8.0 + Math.random() * 0.4
  const currentTemp = 25 + Math.random() * 3
  
  const health: ReefHealth = {
    beachId,
    lastUpdated: now,
    overallHealth: coralCoverage > 50 ? 'excellent' : coralCoverage > 30 ? 'good' : coralCoverage > 15 ? 'fair' : 'poor',
    healthScore: calculateReefHealthScore(coralCoverage, bleachingPercentage, turbidity, pH),
    coralCoverage,
    coralBleaching: {
      status: bleachingPercentage < 5 ? 'none' : bleachingPercentage < 15 ? 'mild' : bleachingPercentage < 30 ? 'moderate' : 'severe',
      percentage: bleachingPercentage,
      trend: Math.random() > 0.5 ? 'stable' : Math.random() > 0.3 ? 'improving' : 'worsening'
    },
    waterClarity: {
      turbidity,
      visibility: Math.max(3, 30 - turbidity),
      rating: turbidity < 5 ? 'excellent' : turbidity < 10 ? 'good' : turbidity < 20 ? 'fair' : 'poor'
    },
    oceanAcidification: {
      pH,
      trend: pH > 8.1 ? 'stable' : 'acidifying',
      impactLevel: pH > 8.1 ? 'low' : pH > 7.9 ? 'moderate' : 'high'
    },
    temperature: {
      current: currentTemp,
      average: 26,
      anomaly: currentTemp - 26,
      stressLevel: calculateThermalStress(currentTemp, 26) as any
    },
    pollution: {
      level: isProtected ? 'minimal' : hasGoodReef ? 'low' : 'moderate',
      sources: isProtected ? [] : ['runoff', 'sunscreen'],
      sunscreenImpact: isProtected ? 'low' : 'moderate'
    }
  }
  
  // Generate ecosystem data
  const ecosystem: MarineEcosystem = {
    beachId,
    lastSurvey: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    biodiversityScore: hasGoodReef ? 70 + Math.random() * 25 : 40 + Math.random() * 30,
    speciesCount: hasGoodReef ? Math.floor(80 + Math.random() * 60) : Math.floor(30 + Math.random() * 40),
    fishPopulation: {
      abundance: hasGoodReef ? 'abundant' : 'moderate',
      diversityIndex: hasGoodReef ? 3.5 + Math.random() : 2.0 + Math.random(),
      keySpecies: hasGoodReef ? COMMON_REEF_FISH : COMMON_REEF_FISH.slice(0, 3),
      bestViewingTime: 'Early morning (6-8 AM)'
    },
    protectedSpecies: {
      hawaiianMonkSeals: {
        recentSightings: Math.floor(Math.random() * 5),
        lastSeen: Math.random() > 0.7 ? new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
        pupping: false,
        viewingGuidelines: ['Maintain 150ft distance', 'Do not disturb', 'Call NOAA if injured: 1-888-256-9840']
      },
      seaTurtles: {
        species: ['green', 'hawksbill'],
        nestingSeason: now.getMonth() >= 4 && now.getMonth() <= 8,
        recentSightings: hasGoodReef ? Math.floor(5 + Math.random() * 15) : Math.floor(Math.random() * 8),
        lastSeen: new Date(now.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000)
      },
      dolphins: {
        species: ['Spinner dolphin', 'Bottlenose dolphin'],
        podSize: Math.floor(5 + Math.random() * 25),
        lastSeen: Math.random() > 0.5 ? new Date(now.getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000) : undefined,
        restingArea: ['kealakekua-bay', 'makua-beach'].includes(beachId)
      },
      whales: {
        inSeason: now.getMonth() >= 11 || now.getMonth() <= 4,
        recentSightings: (now.getMonth() >= 11 || now.getMonth() <= 4) ? Math.floor(Math.random() * 10) : 0,
        distance: 0.5 + Math.random() * 3
      }
    },
    invasiveSpecies: {
      present: !isProtected && Math.random() > 0.6,
      species: !isProtected && Math.random() > 0.6 ? ['Roi (peacock grouper)', 'Ta\'ape (bluestripe snapper)'] : [],
      threatLevel: isProtected ? 'low' : 'moderate'
    }
  }
  
  // Generate hazards data
  const hazards: ReefHazards = {
    beachId,
    lastUpdated: now,
    sharpCoral: {
      risk: hasGoodReef ? 'moderate' : 'low',
      areas: hasGoodReef ? ['Reef edge', 'Shallow areas near shore'] : [],
      depth: '0-5 feet at low tide'
    },
    seaUrchin: {
      density: hasGoodReef ? 'moderate' : 'low',
      species: hasGoodReef ? ['wana', 'pencil'] : ['pencil'],
      locations: ['Rocky areas', 'Reef crevices'],
      nightRisk: true
    },
    venomous: {
      fireCoral: {
        present: hasGoodReef && Math.random() > 0.5,
        locations: hasGoodReef ? ['Outer reef edge'] : []
      },
      coneshells: {
        risk: hasGoodReef ? 'moderate' : 'low',
        advisories: ['Never pick up cone shells', 'Handle with thick gloves only']
      },
      portugueseManOWar: {
        recent: Math.random() > 0.7,
        windDriven: true,
        beachings: Math.floor(Math.random() * 5)
      },
      boxJellyfish: {
        warning: false, // Would check actual lunar calendar
        lunarDay: 5,
        nextRisk: getJellyfishWarningDates()[0]
      }
    },
    shallowReef: {
      minDepth: hasGoodReef ? 1 : 3,
      markedChannels: isProtected,
      localKnowledgeRequired: !isProtected && hasGoodReef,
      tidalVariation: 2.5
    },
    currentHazards: {
      ripCurrents: 'moderate',
      surgeDanger: !isProtected,
      waveBreakZone: hasGoodReef ? 'shallow reef break' : 'shore break'
    }
  }
  
  // Generate education data
  const education: ReefEducation = {
    beachId,
    guidelines: REEF_ETIQUETTE,
    interpretiveSigns: isProtected,
    guidedTours: {
      available: isProtected,
      providers: isProtected ? ['Hawaii Nature Center', 'Reef Teach Hawaii'] : [],
      schedule: isProtected ? 'Daily at 9 AM and 2 PM' : undefined
    },
    marineProtectedArea: {
      status: isProtected,
      type: isProtected ? 'MLCD' : undefined,
      regulations: isProtected ? [
        'No fishing or taking of marine life',
        'No feeding fish',
        'Stay on designated paths',
        'Reef-safe sunscreen required'
      ] : [],
      permits: isProtected ? ['Commercial activity permit required'] : undefined
    },
    tidePools: {
      present: hasTidePools,
      quality: hasTidePools ? 'excellent' : 'fair',
      bestTimes: 'Low tide (check tide charts)',
      species: hasTidePools ? ['Hermit crabs', 'Sea cucumbers', 'Small fish', 'Sea urchins'] : [],
      accessibility: hasTidePools ? 'easy' : 'moderate'
    },
    snorkeling: {
      quality: hasGoodReef ? 'excellent' : 'fair',
      visibility: hasGoodReef ? 20 : 10,
      bestConditions: 'Morning with calm seas',
      entryDifficulty: isProtected ? 'easy' : 'moderate',
      highlights: hasGoodReef ? ['Coral gardens', 'Sea turtles', 'Tropical fish'] : ['Sandy bottom', 'Occasional fish']
    }
  }
  
  // Generate conservation data
  const conservation: ReefConservation = {
    beachId,
    restoration: {
      active: isProtected || hasGoodReef,
      projects: (isProtected || hasGoodReef) ? [{
        name: `${beachName} Reef Restoration`,
        organization: 'Hawaii Coral Restoration',
        type: 'coral transplant',
        volunteerOpportunities: true,
        contact: 'volunteer@hawaiicoral.org'
      }] : []
    },
    sunscreenPolicy: {
      required: isProtected,
      bannedIngredients: ['Oxybenzone', 'Octinoxate'],
      vendors: isProtected ? ['Beach entrance kiosk', 'ABC Store'] : [],
      education: [
        'Chemical sunscreens harm coral',
        'Use mineral-based (zinc/titanium) sunscreens',
        'Or wear UV protective clothing'
      ]
    },
    visitorImpact: {
      level: isProtected ? 'moderate' : 'low',
      dailyVisitors: isProtected ? 1000 + Math.floor(Math.random() * 2000) : 100 + Math.floor(Math.random() * 500),
      carryingCapacity: isProtected ? 2000 : 1000,
      management: isProtected ? ['Visitor limits', 'Education required', 'Guided access only'] : []
    },
    community: {
      adoptAReef: hasGoodReef,
      volunteerGroups: hasGoodReef ? ['Reef Check Hawaii', 'Malama Kai Foundation'] : [],
      citizenScience: {
        programs: hasGoodReef ? ['Eyes of the Reef', 'Reef Check'] : [],
        dataCollection: hasGoodReef ? ['Fish counts', 'Coral health monitoring'] : [],
        apps: ['iNaturalist', 'eBird']
      }
    }
  }
  
  // Generate forecast
  const forecast: ReefForecast = {
    beachId,
    date: now,
    snorkelingConditions: health.waterClarity.rating === 'excellent' ? 'excellent' : 
                          health.waterClarity.rating === 'good' ? 'good' : 'fair',
    divingConditions: hasGoodReef ? 'good' : 'fair',
    visibility: health.waterClarity.visibility,
    thermalStress: health.temperature.stressLevel,
    waveStress: 'moderate',
    seasonalEvents: {
      whaleSeason: ecosystem.protectedSpecies.whales.inSeason,
      turtleNesting: ecosystem.protectedSpecies.seaTurtles.nestingSeason,
      jellyfishWarning: hazards.venomous.boxJellyfish.warning
    }
  }
  
  return {
    health,
    ecosystem,
    hazards,
    education,
    conservation,
    forecast
  }
}

// Get reef safety score (0-100)
export function getReefSafetyScore(hazards: ReefHazards): number {
  let score = 100
  
  // Deduct for sharp hazards
  if (hazards.sharpCoral.risk === 'high') score -= 15
  else if (hazards.sharpCoral.risk === 'moderate') score -= 10
  
  // Deduct for sea urchins
  if (hazards.seaUrchin.density === 'high') score -= 10
  else if (hazards.seaUrchin.density === 'moderate') score -= 5
  
  // Deduct for venomous creatures
  if (hazards.venomous.fireCoral.present) score -= 5
  if (hazards.venomous.portugueseManOWar.recent) score -= 10
  if (hazards.venomous.boxJellyfish.warning) score -= 20
  
  // Deduct for current hazards
  if (hazards.currentHazards.ripCurrents === 'extreme') score -= 25
  else if (hazards.currentHazards.ripCurrents === 'high') score -= 15
  else if (hazards.currentHazards.ripCurrents === 'moderate') score -= 5
  
  if (hazards.currentHazards.surgeDanger) score -= 10
  
  return Math.max(0, score)
}

// Get recommended activities based on conditions
export function getRecommendedActivities(data: BeachReefData): string[] {
  const activities: string[] = []
  
  if (data.education.snorkeling.quality === 'excellent' && data.forecast.visibility > 15) {
    activities.push('Snorkeling')
  }
  
  if (data.education.tidePools.present && data.education.tidePools.quality === 'excellent') {
    activities.push('Tide pool exploration')
  }
  
  if (data.ecosystem.protectedSpecies.seaTurtles.recentSightings > 5) {
    activities.push('Turtle watching')
  }
  
  if (data.ecosystem.protectedSpecies.whales.inSeason && data.ecosystem.protectedSpecies.whales.recentSightings > 0) {
    activities.push('Whale watching')
  }
  
  if (data.conservation.restoration.active && data.conservation.restoration.projects.some(p => p.volunteerOpportunities)) {
    activities.push('Conservation volunteering')
  }
  
  if (data.education.guidedTours.available) {
    activities.push('Guided reef tours')
  }
  
  if (data.health.healthScore > 70 && data.forecast.snorkelingConditions === 'excellent') {
    activities.push('Underwater photography')
  }
  
  return activities
}