// Hawaiian cultural integration and beach stories

export interface HawaiianBeachInfo {
  hawaiianName?: string
  pronunciation?: string
  culturalSignificance?: string
  traditionalUse?: string
  respectGuidelines?: string[]
  localWisdom?: string
}

export const hawaiianBeachInfo: Record<string, HawaiianBeachInfo> = {
  'waikiki-beach': {
    hawaiianName: 'Waikīkī',
    pronunciation: 'why-kee-kee',
    culturalSignificance: 'Waikīkī means "spouting fresh water" in Hawaiian, named after the freshwater springs that once fed the area.',
    traditionalUse: 'Royal playground for Hawaiian ali\'i (chiefs) who surfed these waves for centuries',
    respectGuidelines: [
      'Respect the cultural significance of this historic surfing ground',
      'Be mindful of the area\'s sacred history',
      'Share waves respectfully with locals'
    ],
    localWisdom: 'Best waves are early morning before trade winds pick up'
  },
  
  'hanauma-bay': {
    hawaiianName: 'Hanauma',
    pronunciation: 'hah-now-mah',
    culturalSignificance: 'Hanauma means "curved bay" - a sacred place formed by volcanic activity, considered a living reef system.',
    traditionalUse: 'Traditional fishing grounds for Native Hawaiians, now a marine life conservation area',
    respectGuidelines: [
      'Never touch or stand on coral - it takes decades to grow',
      'Do not feed fish - it disrupts the natural ecosystem',
      'Use reef-safe sunscreen only',
      'Respect the 10-person limit to protect the reef'
    ],
    localWisdom: 'Visit early morning for clearest water and fewer crowds'
  },

  'lanikai-beach': {
    hawaiianName: 'Lanikaʻi',
    pronunciation: 'lah-nee-kah-ee',
    culturalSignificance: 'Lanikaʻi means "heavenly sea" - considered one of the most beautiful beaches in the world.',
    traditionalUse: 'Quiet residential area with strong local community connections',
    respectGuidelines: [
      'Park respectfully - limited parking affects local residents',
      'Pack out all trash - keep this paradise pristine',
      'Be quiet and respectful in this residential neighborhood'
    ],
    localWisdom: 'Sunrise here is magical, but arrive very early for parking'
  },

  'pipeline': {
    hawaiianName: 'Ehukai Beach Park',
    pronunciation: 'eh-hoo-kah-ee',
    culturalSignificance: 'Ehukai means "sea spray" - home to the world-famous Pipeline wave break.',
    traditionalUse: 'Sacred surfing grounds, birthplace of modern professional surfing',
    respectGuidelines: [
      'Respect local surfers - Pipeline is their home break',
      'Only surf if you\'re extremely experienced',
      'Watch from the beach - this wave has seriously injured many',
      'Follow surf etiquette and local protocols'
    ],
    localWisdom: 'Winter swells create the famous barrels, summer is much calmer for swimming'
  },

  'poipu-beach': {
    hawaiianName: 'Poʻipū',
    pronunciation: 'poh-ee-poo',
    culturalSignificance: 'Poʻipū means "crashing" referring to the waves hitting the rocks.',
    traditionalUse: 'Traditional fishing area with important cultural sites nearby',
    respectGuidelines: [
      'Respect Hawaiian monk seals - stay 50+ feet away',
      'Do not disturb sea turtles (honu) - they are sacred',
      'Keep noise levels low to protect wildlife'
    ],
    localWisdom: 'Monk seals often rest on the beach - they have right of way!'
  },

  'hanalei-bay': {
    hawaiianName: 'Hanalei',
    pronunciation: 'hah-nah-lay',
    culturalSignificance: 'Hanalei means "crescent bay" - a culturally significant area with ancient taro fields.',
    traditionalUse: 'Traditional agricultural center with extensive taro cultivation',
    respectGuidelines: [
      'Respect the taro fields and local farming community',
      'Drive slowly and carefully on narrow Hanalei roads',
      'Support local businesses and communities'
    ],
    localWisdom: 'The bay faces north - great for winter surf, calm in summer'
  },

  'hapuna-beach': {
    hawaiianName: 'Hāpuna',
    pronunciation: 'hah-poo-nah',
    culturalSignificance: 'Hāpuna is one of the Big Island\'s most pristine white sand beaches.',
    traditionalUse: 'Traditional gathering place with important archaeological sites nearby',
    respectGuidelines: [
      'Stay on designated paths to protect native vegetation',
      'Respect any archaeological or cultural sites',
      'Use reef-safe sunscreen to protect marine life'
    ],
    localWisdom: 'Strong shore break in winter - better for experienced swimmers'
  },

  'green-sand-beach': {
    hawaiianName: 'Papakōlea',
    pronunciation: 'pah-pah-koh-lay-ah',
    culturalSignificance: 'Papakōlea beach is one of only four green sand beaches in the world, formed by olivine crystals.',
    traditionalUse: 'Sacred area with traditional Hawaiian fishing and gathering practices',
    respectGuidelines: [
      'Do not take sand or rocks - it\'s illegal and culturally disrespectful',
      'Respect this rare geological wonder',
      'Prepare for a long, difficult hike to access'
    ],
    localWisdom: 'Hike is challenging - bring water and start early to avoid heat'
  },

  'punaluu-black-sand-beach': {
    hawaiianName: 'Punalu\'u',
    pronunciation: 'poo-nah-loo-oo',
    culturalSignificance: 'Punalu\'u means "spring dived for" - famous for its black sand created by volcanic activity.',
    traditionalUse: 'Traditional fishing area and important nesting site for sea turtles',
    respectGuidelines: [
      'Never touch or disturb sea turtles (honu) - they are protected',
      'Do not take black sand - it\'s illegal and removes nesting habitat',
      'Observe wildlife from a respectful distance'
    ],
    localWisdom: 'Sea turtles often bask on the warm black sand - bring a camera with zoom'
  },

  'white-sands-beach': {
    hawaiianName: 'Laʻaloa Bay',
    pronunciation: 'lah-ah-loh-ah',
    culturalSignificance: 'Also known as Magic Sands - the sand disappears during high surf and returns seasonally.',
    traditionalUse: 'Popular local beach for families and bodyboarding',
    respectGuidelines: [
      'Respect local families who frequent this beach',
      'Be aware that sand conditions change dramatically with surf',
      'Support nearby local businesses'
    ],
    localWisdom: 'The sand truly does disappear - check current conditions before visiting'
  }
}

export function getHawaiianInfo(slug: string): HawaiianBeachInfo | null {
  return hawaiianBeachInfo[slug] || null
}

export function getPronounciationAudio(pronunciation: string): string {
  // Future: integrate with text-to-speech API for Hawaiian pronunciation
  return `/audio/hawaiian/${pronunciation}.mp3`
}

// Moon phase calculator for jellyfish predictions
export function calculateJellyfishDays(): Date[] {
  const jellyfishDays: Date[] = []
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  
  // Box jellyfish typically arrive 9-10 days after full moon
  const fullMoons2025 = [
    new Date(2025, 0, 13), // January 13
    new Date(2025, 1, 12), // February 12  
    new Date(2025, 2, 14), // March 14
    new Date(2025, 3, 13), // April 13
    new Date(2025, 4, 12), // May 12
    new Date(2025, 5, 11), // June 11
    new Date(2025, 6, 10), // July 10
    new Date(2025, 7, 9),  // August 9
    new Date(2025, 8, 7),  // September 7
    new Date(2025, 9, 6),  // October 6
    new Date(2025, 10, 5), // November 5
    new Date(2025, 11, 4)  // December 4
  ]
  
  fullMoons2025.forEach(fullMoon => {
    // Add 9-10 days for box jellyfish arrival
    const jellyfishDate9 = new Date(fullMoon.getTime() + (9 * 24 * 60 * 60 * 1000))
    const jellyfishDate10 = new Date(fullMoon.getTime() + (10 * 24 * 60 * 60 * 1000))
    jellyfishDays.push(jellyfishDate9, jellyfishDate10)
  })
  
  return jellyfishDays.filter(date => date >= currentDate)
}

export function isJellyfishWarningDay(date: Date = new Date()): boolean {
  const jellyfishDays = calculateJellyfishDays()
  return jellyfishDays.some(jDay => 
    jDay.toDateString() === date.toDateString()
  )
}

// Traditional Hawaiian ocean safety wisdom
export const hawaiianOceanWisdom = [
  {
    hawaiian: "Malama i ke kai",
    english: "Take care of the ocean",
    meaning: "The ocean will take care of you if you respect and protect it"
  },
  {
    hawaiian: "E ho'olohe i ka moana",
    english: "Listen to the ocean",
    meaning: "Pay attention to the ocean's signs and warnings"
  },
  {
    hawaiian: "Ke kai ne'e",
    english: "The moving sea",
    meaning: "The ocean is always changing - stay alert and adaptable"
  },
  {
    hawaiian: "Na honu",
    english: "The turtles",
    meaning: "Sea turtles are sacred - observe but never touch"
  }
]