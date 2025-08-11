// Comprehensive beach information for Hawaii beaches

export interface BeachDetails {
  slug: string
  name: string
  nativeName?: string
  pronunciation?: string
  description: string
  highlights: string[]
  amenities: {
    parking: boolean
    restrooms: boolean
    showers: boolean
    lifeguards: boolean
    foodVendors: boolean
    rentals: boolean
    shade: boolean
    picnicTables: boolean
    grills: boolean
    playground: boolean
    wheelchairAccess: boolean
  }
  activities: {
    swimming: 'excellent' | 'good' | 'fair' | 'poor' | 'not-recommended'
    snorkeling: 'excellent' | 'good' | 'fair' | 'poor' | 'not-recommended'
    surfing: 'excellent' | 'good' | 'fair' | 'poor' | 'not-recommended'
    bodyboarding: 'excellent' | 'good' | 'fair' | 'poor' | 'not-recommended'
    fishing: 'excellent' | 'good' | 'fair' | 'poor' | 'not-recommended'
    kayaking: 'excellent' | 'good' | 'fair' | 'poor' | 'not-recommended'
    paddleboarding: 'excellent' | 'good' | 'fair' | 'poor' | 'not-recommended'
    diving: 'excellent' | 'good' | 'fair' | 'poor' | 'not-recommended'
  }
  safetyInfo: {
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
    hazards: string[]
    bestConditions: string
    crowdLevel: 'quiet' | 'moderate' | 'busy' | 'crowded'
    kidFriendly: boolean
  }
  access: {
    difficulty: 'easy' | 'moderate' | 'difficult'
    walkingTime: string
    parkingInfo: string
    publicTransport?: string
    entranceFee?: string
  }
  seasonalInfo: {
    bestMonths: string[]
    considerations: string[]
  }
  wildlife: {
    turtles: boolean
    tropicalFish: boolean
    dolphins: boolean
    rays: boolean
    sharks: boolean
    seals: boolean
    whales: boolean
    coral: boolean
  }
  culturalSignificance?: {
    history: string
    traditions: string[]
    respect: string[]
  }
}

// Comprehensive beach database for Hawaii
const beachDetailsData: { [key: string]: BeachDetails } = {
  'ala-moana-beach': {
    slug: 'ala-moana-beach',
    name: 'Ala Moana Beach',
    nativeName: 'Ala Moana',
    pronunciation: 'ah-lah mo-AH-nah',
    description: 'A expansive urban beach park offering calm waters perfect for families, with stunning views of Diamond Head and downtown Honolulu. This man-made beach features a protective reef that creates a large, shallow lagoon ideal for swimming and learning water sports.',
    highlights: [
      'Largest beach park in Honolulu with 76 acres',
      'Protected lagoon with calm, shallow waters',
      'Popular local spot with authentic Hawaiian atmosphere',
      'Excellent views of Diamond Head and Honolulu skyline',
      'Great for sunset picnics and evening walks',
      'Close to Ala Moana Center for shopping and dining'
    ],
    amenities: {
      parking: true,
      restrooms: true,
      showers: true,
      lifeguards: true,
      foodVendors: true,
      rentals: false,
      shade: true,
      picnicTables: true,
      grills: true,
      playground: true,
      wheelchairAccess: true
    },
    activities: {
      swimming: 'excellent',
      snorkeling: 'good',
      surfing: 'poor',
      bodyboarding: 'fair',
      fishing: 'good',
      kayaking: 'excellent',
      paddleboarding: 'excellent',
      diving: 'poor'
    },
    safetyInfo: {
      difficulty: 'beginner',
      hazards: ['Strong currents outside the reef', 'Occasional jellyfish'],
      bestConditions: 'Calm trade wind days with minimal swell',
      crowdLevel: 'busy',
      kidFriendly: true
    },
    access: {
      difficulty: 'easy',
      walkingTime: '2 minutes from parking',
      parkingInfo: 'Large free parking lot, can fill up on weekends',
      publicTransport: 'Multiple bus routes serve Ala Moana Center',
      entranceFee: 'Free'
    },
    seasonalInfo: {
      bestMonths: ['April', 'May', 'September', 'October'],
      considerations: ['Can get crowded on weekends', 'Trade winds provide natural cooling']
    },
    wildlife: {
      turtles: true,
      tropicalFish: true,
      dolphins: false,
      rays: false,
      sharks: false,
      seals: false,
      whales: false,
      coral: true
    }
  },

  'waikiki-beach': {
    slug: 'waikiki-beach',
    name: 'Waikīkī Beach',
    nativeName: 'Waikīkī',
    pronunciation: 'vye-kee-KEE',
    description: 'The world-famous crescent of golden sand that put Hawaii on the global tourism map. Waikiki offers gentle waves perfect for learning to surf, with the iconic Diamond Head crater providing a stunning backdrop. This historic beach has been welcoming visitors for over a century.',
    highlights: [
      'Birthplace of modern surfing and home to legendary beach boys',
      'Iconic Diamond Head crater backdrop',
      'Perfect beginner surf breaks with gentle, consistent waves',
      'Historic Royal Hawaiian and Moana Surfrider hotels',
      'Vibrant nightlife and world-class shopping',
      'Statue of Duke Kahanamoku, the father of modern surfing'
    ],
    amenities: {
      parking: true,
      restrooms: true,
      showers: true,
      lifeguards: true,
      foodVendors: true,
      rentals: true,
      shade: true,
      picnicTables: false,
      grills: false,
      playground: false,
      wheelchairAccess: true
    },
    activities: {
      swimming: 'excellent',
      snorkeling: 'fair',
      surfing: 'excellent',
      bodyboarding: 'good',
      fishing: 'poor',
      kayaking: 'good',
      paddleboarding: 'excellent',
      diving: 'poor'
    },
    safetyInfo: {
      difficulty: 'beginner',
      hazards: ['Crowded conditions', 'Surfboard traffic', 'Strong sun exposure'],
      bestConditions: 'Morning hours before crowds arrive',
      crowdLevel: 'crowded',
      kidFriendly: true
    },
    access: {
      difficulty: 'easy',
      walkingTime: 'Immediate access from hotels and sidewalk',
      parkingInfo: 'Limited and expensive parking, use hotels or public lots',
      publicTransport: 'Excellent bus service and trolley connections',
      entranceFee: 'Free'
    },
    seasonalInfo: {
      bestMonths: ['May', 'June', 'September', 'October'],
      considerations: ['Peak tourist season December-March', 'Summer offers smaller, more manageable crowds']
    },
    wildlife: {
      turtles: true,
      tropicalFish: true,
      dolphins: false,
      rays: false,
      sharks: false,
      seals: false,
      whales: false,
      coral: false
    },
    culturalSignificance: {
      history: 'Once a retreat for Hawaiian royalty, Waikiki was transformed into a resort destination in the early 1900s. The beach is named after the freshwater springs that once flowed here.',
      traditions: ['Traditional Hawaiian surfing techniques', 'Beach boy culture and hospitality', 'Royal Hawaiian history'],
      respect: ['Honor the legacy of Duke Kahanamoku', 'Respect local surfers and beach etiquette', 'Learn about Hawaiian royalty who once lived here']
    }
  },

  'lanikai-beach': {
    slug: 'lanikai-beach',
    name: 'Lanikai Beach',
    nativeName: 'Lānakai',
    pronunciation: 'lah-nah-KAH-ee',
    description: 'Often rated as one of the world\'s best beaches, Lanikai features powdery white sand and crystal-clear turquoise waters. This secluded residential beach offers a pristine tropical paradise experience with views of the offshore Mokulua Islands.',
    highlights: [
      'Consistently rated among world\'s top 10 beaches',
      'Incredibly fine, soft white sand',
      'Crystal-clear turquoise water with excellent visibility',
      'View of the iconic Mokulua Islands (Twin Islands)',
      'Relatively uncrowded despite its fame',
      'Perfect for sunrise photography and peaceful relaxation'
    ],
    amenities: {
      parking: false,
      restrooms: false,
      showers: false,
      lifeguards: false,
      foodVendors: false,
      rentals: false,
      shade: false,
      picnicTables: false,
      grills: false,
      playground: false,
      wheelchairAccess: false
    },
    activities: {
      swimming: 'excellent',
      snorkeling: 'good',
      surfing: 'poor',
      bodyboarding: 'fair',
      fishing: 'fair',
      kayaking: 'excellent',
      paddleboarding: 'excellent',
      diving: 'fair'
    },
    safetyInfo: {
      difficulty: 'beginner',
      hazards: ['No lifeguards', 'Limited access and facilities', 'Strong currents during high surf'],
      bestConditions: 'Early morning for calmest water and best light',
      crowdLevel: 'moderate',
      kidFriendly: true
    },
    access: {
      difficulty: 'moderate',
      walkingTime: '5-10 minutes through residential area',
      parkingInfo: 'Street parking only, respect residential area - no parking signs strictly enforced',
      publicTransport: 'Bus to Kailua, then walk or bike',
      entranceFee: 'Free'
    },
    seasonalInfo: {
      bestMonths: ['April', 'May', 'September', 'October', 'November'],
      considerations: ['Winter months can have larger surf', 'Summer trade winds create perfect conditions']
    },
    wildlife: {
      turtles: true,
      tropicalFish: true,
      dolphins: false,
      rays: true,
      sharks: false,
      seals: false,
      whales: false,
      coral: true
    }
  },

  'hanauma-bay': {
    slug: 'hanauma-bay',
    name: 'Hanauma Bay',
    nativeName: 'Hanauma',
    pronunciation: 'hah-now-mah',
    description: 'A spectacular marine life conservation area formed in an ancient volcanic crater. This crescent-shaped bay offers some of Hawaii\'s best snorkeling with hundreds of tropical fish species in crystal-clear, protected waters.',
    highlights: [
      'Marine Life Conservation District with protected ecosystem',
      'Over 400 species of tropical fish',
      'Formed in ancient volcanic crater creating unique shape',
      'Educational visitor center with marine life exhibits',
      'Coral reef system perfect for snorkeling',
      'Featured in numerous movies and TV shows'
    ],
    amenities: {
      parking: true,
      restrooms: true,
      showers: true,
      lifeguards: true,
      foodVendors: true,
      rentals: true,
      shade: true,
      picnicTables: true,
      grills: false,
      playground: false,
      wheelchairAccess: true
    },
    activities: {
      swimming: 'good',
      snorkeling: 'excellent',
      surfing: 'not-recommended',
      bodyboarding: 'poor',
      fishing: 'not-recommended',
      kayaking: 'not-recommended',
      paddleboarding: 'poor',
      diving: 'good'
    },
    safetyInfo: {
      difficulty: 'intermediate',
      hazards: ['Rocky bottom', 'Waves at bay mouth', 'Crowded conditions'],
      bestConditions: 'Early morning with calm seas and clear water',
      crowdLevel: 'crowded',
      kidFriendly: true
    },
    access: {
      difficulty: 'moderate',
      walkingTime: '10 minutes down paved path, steep return climb',
      parkingInfo: 'Advance reservations required, limited daily visitors',
      entranceFee: '$25 for non-residents, $3 for Hawaii residents'
    },
    seasonalInfo: {
      bestMonths: ['May', 'June', 'September', 'October'],
      considerations: ['Closed Tuesdays for marine life rest', 'Winter months have larger surf']
    },
    wildlife: {
      turtles: true,
      tropicalFish: true,
      dolphins: false,
      rays: true,
      sharks: false,
      seals: false,
      whales: false,
      coral: true
    },
    culturalSignificance: {
      history: 'Sacred site in Hawaiian culture, the bay was formed by volcanic activity thousands of years ago. Ancient Hawaiians used the area for fishing and gathering.',
      traditions: ['Fishing traditions of ancient Hawaiians', 'Conservation practices protecting marine life'],
      respect: ['Follow marine life conservation rules', 'Do not touch or feed fish', 'Stay on designated paths to protect coral']
    }
  },

  'poipu-beach': {
    slug: 'poipu-beach',
    name: 'Poipu Beach',
    nativeName: 'Poipū',
    pronunciation: 'poy-POO',
    description: 'Kauai\'s premier resort beach featuring a crescent of golden sand protected by natural barriers. This family-friendly beach offers calm waters for swimming, excellent snorkeling, and frequent Hawaiian monk seal sightings.',
    highlights: [
      'Family-friendly with naturally protected swimming areas',
      'Regular Hawaiian monk seal sightings',
      'Excellent snorkeling at the reef',
      'Beautiful golden sand beach',
      'Consistent sunshine - one of Hawaii\'s driest spots',
      'Close to luxury resorts and dining options'
    ],
    amenities: {
      parking: true,
      restrooms: true,
      showers: true,
      lifeguards: true,
      foodVendors: false,
      rentals: true,
      shade: true,
      picnicTables: true,
      grills: false,
      playground: true,
      wheelchairAccess: true
    },
    activities: {
      swimming: 'excellent',
      snorkeling: 'excellent',
      surfing: 'good',
      bodyboarding: 'good',
      fishing: 'fair',
      kayaking: 'good',
      paddleboarding: 'excellent',
      diving: 'good'
    },
    safetyInfo: {
      difficulty: 'beginner',
      hazards: ['Respect monk seals - stay 50+ feet away', 'Rocky areas near reefs'],
      bestConditions: 'Year-round excellent conditions due to sunny weather',
      crowdLevel: 'busy',
      kidFriendly: true
    },
    access: {
      difficulty: 'easy',
      walkingTime: '2 minutes from parking',
      parkingInfo: 'Free parking lot, arrives early during peak times',
      entranceFee: 'Free'
    },
    seasonalInfo: {
      bestMonths: ['Year-round destination'],
      considerations: ['One of Hawaii\'s sunniest locations', 'Winter brings larger surf for bodyboarding']
    },
    wildlife: {
      turtles: true,
      tropicalFish: true,
      dolphins: true,
      rays: true,
      sharks: false,
      seals: true,
      whales: true,
      coral: true
    }
  },

  'napili-bay': {
    slug: 'napili-bay',
    name: 'Napili Bay',
    nativeName: 'Nāpili',
    pronunciation: 'nah-PEE-lee',
    description: 'A crescent-shaped bay on Maui\'s northwest shore, featuring calm turquoise waters and pristine white sand. This intimate beach is perfect for swimming, snorkeling, and watching spectacular Hawaiian sunsets.',
    highlights: [
      'Picture-perfect crescent bay with white sand',
      'Calm, clear water ideal for swimming and snorkeling',
      'Spectacular sunset viewing location',
      'Intimate setting surrounded by luxury condos',
      'Excellent beginner snorkeling spot',
      'Regular sea turtle sightings'
    ],
    amenities: {
      parking: true,
      restrooms: true,
      showers: true,
      lifeguards: false,
      foodVendors: false,
      rentals: false,
      shade: true,
      picnicTables: false,
      grills: false,
      playground: false,
      wheelchairAccess: false
    },
    activities: {
      swimming: 'excellent',
      snorkeling: 'excellent',
      surfing: 'poor',
      bodyboarding: 'fair',
      fishing: 'fair',
      kayaking: 'good',
      paddleboarding: 'excellent',
      diving: 'fair'
    },
    safetyInfo: {
      difficulty: 'beginner',
      hazards: ['No lifeguards', 'Can get crowded during peak times'],
      bestConditions: 'Morning hours with calm water and good visibility',
      crowdLevel: 'moderate',
      kidFriendly: true
    },
    access: {
      difficulty: 'easy',
      walkingTime: '1 minute from parking',
      parkingInfo: 'Limited roadside parking, arrive early',
      entranceFee: 'Free'
    },
    seasonalInfo: {
      bestMonths: ['April', 'May', 'September', 'October'],
      considerations: ['Winter months can have larger surf', 'Summer offers calmest conditions']
    },
    wildlife: {
      turtles: true,
      tropicalFish: true,
      dolphins: false,
      rays: true,
      sharks: false,
      seals: false,
      whales: true,
      coral: true
    }
  }
}

class BeachDetailsService {
  
  // Get comprehensive details for a beach
  getBeachDetails(slug: string): BeachDetails | null {
    return beachDetailsData[slug] || null
  }

  // Get all available beach details
  getAllBeachDetails(): BeachDetails[] {
    return Object.values(beachDetailsData)
  }

  // Search beaches by activity rating
  getBeachesByActivity(activity: keyof BeachDetails['activities'], minRating: 'good' | 'excellent' = 'good'): BeachDetails[] {
    const ratingOrder = { 'not-recommended': 0, 'poor': 1, 'fair': 2, 'good': 3, 'excellent': 4 }
    const minScore = ratingOrder[minRating]
    
    return Object.values(beachDetailsData).filter(beach => 
      ratingOrder[beach.activities[activity]] >= minScore
    )
  }

  // Get family-friendly beaches
  getFamilyFriendlyBeaches(): BeachDetails[] {
    return Object.values(beachDetailsData).filter(beach => beach.safetyInfo.kidFriendly)
  }

  // Get beaches with specific amenities
  getBeachesByAmenity(amenity: keyof BeachDetails['amenities']): BeachDetails[] {
    return Object.values(beachDetailsData).filter(beach => beach.amenities[amenity])
  }

  // Get cultural/historical significance
  getCulturalBeaches(): BeachDetails[] {
    return Object.values(beachDetailsData).filter(beach => beach.culturalSignificance)
  }

  // Get activity rating icon and color
  getActivityRatingDisplay(rating: BeachDetails['activities'][keyof BeachDetails['activities']]): {
    icon: string
    color: string
    label: string
  } {
    switch (rating) {
      case 'excellent':
        return { icon: '⭐⭐⭐⭐⭐', color: 'text-green-600', label: 'Excellent' }
      case 'good':
        return { icon: '⭐⭐⭐⭐', color: 'text-green-500', label: 'Good' }
      case 'fair':
        return { icon: '⭐⭐⭐', color: 'text-yellow-500', label: 'Fair' }
      case 'poor':
        return { icon: '⭐⭐', color: 'text-orange-500', label: 'Poor' }
      case 'not-recommended':
        return { icon: '⭐', color: 'text-red-500', label: 'Not Recommended' }
    }
  }

  // Format amenities for display
  getAmenityIcon(amenity: keyof BeachDetails['amenities']): string {
    const icons: Record<keyof BeachDetails['amenities'], string> = {
      parking: '🅿️',
      restrooms: '🚻',
      showers: '🚿',
      lifeguards: '🏊‍♂️',
      foodVendors: '🍽️',
      rentals: '🏄‍♂️',
      shade: '🌴',
      picnicTables: '🪑',
      grills: '🔥',
      playground: '🛝',
      wheelchairAccess: '♿'
    }
    return icons[amenity]
  }
}

// Export singleton instance
export const beachDetailsService = new BeachDetailsService()