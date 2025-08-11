// Reef health and safety types for Beach Hui
// Powered by LeniLani Consulting

export interface ReefHealth {
  beachId: string
  lastUpdated: Date
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  healthScore: number // 0-100
  
  // Coral Health Metrics
  coralCoverage: number // Percentage of reef covered by live coral
  coralBleaching: {
    status: 'none' | 'mild' | 'moderate' | 'severe' | 'critical'
    percentage: number // Percentage of coral bleached
    trend: 'improving' | 'stable' | 'worsening'
    lastEvent?: Date
  }
  
  // Water Quality Affecting Reefs
  waterClarity: {
    turbidity: number // NTU (Nephelometric Turbidity Units)
    visibility: number // Meters
    rating: 'excellent' | 'good' | 'fair' | 'poor'
  }
  
  oceanAcidification: {
    pH: number // pH level (normal ocean is ~8.2)
    trend: 'stable' | 'acidifying' | 'improving'
    impactLevel: 'low' | 'moderate' | 'high'
  }
  
  temperature: {
    current: number // Celsius
    average: number
    anomaly: number // Deviation from normal
    stressLevel: 'none' | 'watch' | 'warning' | 'alert-1' | 'alert-2'
  }
  
  // Pollution & Runoff
  pollution: {
    level: 'minimal' | 'low' | 'moderate' | 'high' | 'severe'
    sources: string[]
    sunscreenImpact: 'low' | 'moderate' | 'high'
  }
}

export interface MarineEcosystem {
  beachId: string
  lastSurvey: Date
  
  // Biodiversity Index
  biodiversityScore: number // 0-100
  speciesCount: number
  
  // Fish Populations
  fishPopulation: {
    abundance: 'abundant' | 'moderate' | 'low' | 'depleted'
    diversityIndex: number
    keySpecies: MarineSpecies[]
    bestViewingTime: string // e.g., "Early morning"
  }
  
  // Protected Species
  protectedSpecies: {
    hawaiianMonkSeals: {
      recentSightings: number
      lastSeen?: Date
      pupping: boolean
      viewingGuidelines: string[]
    }
    seaTurtles: {
      species: ('green' | 'hawksbill' | 'leatherback')[]
      nestingSeason: boolean
      recentSightings: number
      lastSeen?: Date
    }
    dolphins: {
      species: string[]
      podSize?: number
      lastSeen?: Date
      restingArea: boolean
    }
    whales: {
      inSeason: boolean // Dec-May for humpbacks
      recentSightings: number
      distance?: number // Miles from shore
    }
  }
  
  // Invasive Species
  invasiveSpecies: {
    present: boolean
    species: string[]
    threatLevel: 'low' | 'moderate' | 'high'
  }
}

export interface MarineSpecies {
  commonName: string
  hawaiianName?: string
  scientificName: string
  abundance: 'rare' | 'uncommon' | 'common' | 'abundant'
  conservationStatus?: 'endangered' | 'threatened' | 'protected' | 'common'
  bestSpots?: string[]
}

export interface ReefHazards {
  beachId: string
  lastUpdated: Date
  
  // Sharp Hazards
  sharpCoral: {
    risk: 'low' | 'moderate' | 'high'
    areas: string[] // Specific areas with sharp coral
    depth: string // e.g., "0-3 feet at low tide"
  }
  
  seaUrchin: {
    density: 'none' | 'low' | 'moderate' | 'high'
    species: ('wana' | 'hatpin' | 'pencil')[]
    locations: string[]
    nightRisk: boolean // Urchins come out more at night
  }
  
  // Dangerous Marine Life
  venomous: {
    fireCoral: {
      present: boolean
      locations: string[]
    }
    coneshells: {
      risk: 'low' | 'moderate' | 'high'
      advisories: string[]
    }
    portugueseManOWar: {
      recent: boolean
      windDriven: boolean
      beachings: number
    }
    boxJellyfish: {
      warning: boolean
      lunarDay: number // Day in lunar cycle (8-10 days after full moon)
      nextRisk: Date
    }
  }
  
  // Navigation Hazards
  shallowReef: {
    minDepth: number // Feet at low tide
    markedChannels: boolean
    localKnowledgeRequired: boolean
    tidalVariation: number // Feet between high/low
  }
  
  // Conditions
  currentHazards: {
    ripCurrents: 'low' | 'moderate' | 'high' | 'extreme'
    surgeDanger: boolean
    waveBreakZone: string // e.g., "shallow reef break"
  }
}

export interface ReefEducation {
  beachId: string
  
  // Reef Etiquette
  guidelines: {
    rule: string
    importance: 'critical' | 'important' | 'recommended'
    icon?: string
  }[]
  
  // Educational Features
  interpretiveSigns: boolean
  guidedTours: {
    available: boolean
    providers: string[]
    schedule?: string
  }
  
  // Marine Sanctuary Info
  marineProtectedArea: {
    status: boolean
    type?: 'MLCD' | 'FMA' | 'NAR' | 'Wildlife Refuge'
    regulations: string[]
    permits?: string[]
  }
  
  // Tide Pools
  tidePools: {
    present: boolean
    quality: 'excellent' | 'good' | 'fair' | 'poor'
    bestTimes: string // Low tide times
    species: string[]
    accessibility: 'easy' | 'moderate' | 'difficult'
  }
  
  // Snorkeling Quality
  snorkeling: {
    quality: 'excellent' | 'good' | 'fair' | 'poor'
    visibility: number // Meters
    bestConditions: string
    entryDifficulty: 'easy' | 'moderate' | 'difficult'
    highlights: string[]
  }
}

export interface ReefConservation {
  beachId: string
  
  // Restoration Projects
  restoration: {
    active: boolean
    projects: {
      name: string
      organization: string
      type: 'coral transplant' | 'nursery' | 'cleanup' | 'monitoring'
      volunteerOpportunities: boolean
      contact?: string
    }[]
  }
  
  // Reef-Safe Sunscreen
  sunscreenPolicy: {
    required: boolean
    bannedIngredients: string[]
    vendors: string[] // Nearby reef-safe sunscreen vendors
    education: string[]
  }
  
  // Impact Metrics
  visitorImpact: {
    level: 'minimal' | 'low' | 'moderate' | 'high' | 'severe'
    dailyVisitors: number
    carryingCapacity: number
    management: string[]
  }
  
  // Community Involvement
  community: {
    adoptAReef: boolean
    volunteerGroups: string[]
    citizenScience: {
      programs: string[]
      dataCollection: string[]
      apps: string[]
    }
  }
}

export interface CoralSpawning {
  species: string
  predictedDates: Date[]
  moonPhase: string
  timeOfDay: string
  probability: 'high' | 'moderate' | 'low'
}

export interface ReefForecast {
  beachId: string
  date: Date
  
  // Conditions for reef activities
  snorkelingConditions: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous'
  divingConditions: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous'
  visibility: number // Meters
  
  // Environmental stressors
  thermalStress: 'none' | 'watch' | 'warning' | 'alert-1' | 'alert-2'
  waveStress: 'calm' | 'light' | 'moderate' | 'rough' | 'extreme'
  
  // Spawning events
  coralSpawning?: CoralSpawning
  
  // Seasonal events
  seasonalEvents: {
    whaleSeason: boolean
    turtleNesting: boolean
    jellyfishWarning: boolean
  }
}

// Aggregated reef data for a beach
export interface BeachReefData {
  health: ReefHealth
  ecosystem: MarineEcosystem
  hazards: ReefHazards
  education: ReefEducation
  conservation: ReefConservation
  forecast: ReefForecast
}