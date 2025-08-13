/**
 * Hawaii Beach Webcam Integration
 * Aggregates public webcam feeds from various sources across Hawaii
 */

export interface Webcam {
  id: string
  name: string
  location: string
  beach?: string
  island: 'oahu' | 'maui' | 'kauai' | 'hawaii'
  url: string
  thumbnailUrl?: string
  provider: string
  type: 'image' | 'stream' | 'timelapse'
  refreshInterval?: number // in seconds
  coordinates?: {
    lat: number
    lng: number
  }
  active: boolean
  description?: string
}

// Hawaii Public Webcams Database
export const HAWAII_WEBCAMS: Webcam[] = [
  // OAHU WEBCAMS
  {
    id: 'waikiki-sheraton',
    name: 'Waikiki Beach - Sheraton',
    location: 'Waikiki',
    beach: 'waikiki-beach',
    island: 'oahu',
    url: 'https://www.sheraton-waikiki.com/waikiki-beach-cam',
    provider: 'Sheraton Waikiki',
    type: 'stream',
    coordinates: { lat: 21.2767, lng: -157.8295 },
    active: true,
    description: 'Live view of Waikiki Beach from Sheraton Hotel'
  },
  {
    id: 'waikiki-duke',
    name: 'Duke Kahanamoku Beach',
    location: 'Waikiki',
    beach: 'waikiki-beach',
    island: 'oahu',
    url: 'https://www.skylinewebcams.com/en/webcam/united-states/hawaii/honolulu/waikiki-beach.html',
    provider: 'Skyline Webcams',
    type: 'stream',
    coordinates: { lat: 21.2743, lng: -157.8256 },
    active: true
  },
  {
    id: 'pipeline-surf',
    name: 'Pipeline Surf Cam',
    location: 'North Shore',
    beach: 'pipeline',
    island: 'oahu',
    url: 'https://www.surfline.com/surf-report/pipeline/5842041f4e65fad6a7708814',
    provider: 'Surfline',
    type: 'stream',
    coordinates: { lat: 21.6650, lng: -158.0530 },
    active: true,
    description: 'Famous Pipeline surf break'
  },
  {
    id: 'sunset-beach-cam',
    name: 'Sunset Beach',
    location: 'North Shore',
    beach: 'sunset-beach',
    island: 'oahu',
    url: 'https://www.surfline.com/surf-report/sunset-beach/5842041f4e65fad6a7708816',
    provider: 'Surfline',
    type: 'stream',
    coordinates: { lat: 21.6794, lng: -158.0412 },
    active: true
  },
  {
    id: 'sandy-beach-cam',
    name: 'Sandy Beach',
    location: 'East Oahu',
    beach: 'sandy-beach',
    island: 'oahu',
    url: 'https://www.sandybeach.com/live-cam',
    provider: 'Sandy Beach',
    type: 'image',
    refreshInterval: 60,
    coordinates: { lat: 21.2853, lng: -157.6719 },
    active: true
  },
  {
    id: 'lanikai-pillbox',
    name: 'Lanikai Beach View',
    location: 'Kailua',
    beach: 'lanikai-beach',
    island: 'oahu',
    url: 'https://www.kailuachamber.com/lanikai-beach-cam',
    provider: 'Kailua Chamber',
    type: 'image',
    refreshInterval: 300,
    coordinates: { lat: 21.3927, lng: -157.7144 },
    active: true
  },
  {
    id: 'diamond-head',
    name: 'Diamond Head Lookout',
    location: 'Honolulu',
    island: 'oahu',
    url: 'https://www.hawaiinewsnow.com/weather/cams/',
    provider: 'Hawaii News Now',
    type: 'stream',
    coordinates: { lat: 21.2614, lng: -157.8040 },
    active: true
  },
  
  // MAUI WEBCAMS
  {
    id: 'kaanapali-beach',
    name: 'Kaanapali Beach',
    location: 'West Maui',
    beach: 'kaanapali-beach',
    island: 'maui',
    url: 'https://www.kaanapaliresort.com/webcam',
    provider: 'Kaanapali Resort',
    type: 'stream',
    coordinates: { lat: 20.9244, lng: -156.6950 },
    active: true
  },
  {
    id: 'napili-bay',
    name: 'Napili Bay',
    location: 'West Maui',
    beach: 'napili-bay',
    island: 'maui',
    url: 'https://www.napilibay.com/webcam',
    provider: 'Napili Bay',
    type: 'image',
    refreshInterval: 120,
    coordinates: { lat: 20.9944, lng: -156.6678 },
    active: true
  },
  {
    id: 'wailea-beach',
    name: 'Wailea Beach',
    location: 'South Maui',
    beach: 'wailea-beach',
    island: 'maui',
    url: 'https://www.fourseasons.com/maui/webcam',
    provider: 'Four Seasons Maui',
    type: 'stream',
    coordinates: { lat: 20.6919, lng: -156.4419 },
    active: true
  },
  {
    id: 'hookipa-beach',
    name: "Ho'okipa Beach",
    location: 'North Shore Maui',
    beach: 'hookipa-beach',
    island: 'maui',
    url: 'https://www.paiamaui.com/hookipa-webcam',
    provider: 'Paia Maui',
    type: 'stream',
    coordinates: { lat: 20.9328, lng: -156.3631 },
    active: true,
    description: 'Famous windsurfing spot'
  },
  {
    id: 'big-beach',
    name: 'Big Beach (Makena)',
    location: 'South Maui',
    beach: 'big-beach',
    island: 'maui',
    url: 'https://www.mauiwebcams.com/makena',
    provider: 'Maui Webcams',
    type: 'image',
    refreshInterval: 180,
    coordinates: { lat: 20.6319, lng: -156.4494 },
    active: true
  },
  
  // KAUAI WEBCAMS
  {
    id: 'poipu-beach',
    name: 'Poipu Beach',
    location: 'South Shore',
    beach: 'poipu-beach',
    island: 'kauai',
    url: 'https://www.poipubeach.org/webcam',
    provider: 'Poipu Beach',
    type: 'stream',
    coordinates: { lat: 21.8713, lng: -159.4576 },
    active: true
  },
  {
    id: 'hanalei-bay',
    name: 'Hanalei Bay',
    location: 'North Shore',
    beach: 'hanalei-bay',
    island: 'kauai',
    url: 'https://www.hanaleibay.org/webcam',
    provider: 'Hanalei Bay',
    type: 'stream',
    coordinates: { lat: 22.2038, lng: -159.5016 },
    active: true
  },
  {
    id: 'anini-beach',
    name: 'Anini Beach',
    location: 'North Shore',
    beach: 'anini-beach',
    island: 'kauai',
    url: 'https://www.kauaiwebcams.com/anini',
    provider: 'Kauai Webcams',
    type: 'image',
    refreshInterval: 300,
    coordinates: { lat: 22.2156, lng: -159.4455 },
    active: true
  },
  
  // BIG ISLAND WEBCAMS
  {
    id: 'kona-kailua-pier',
    name: 'Kailua-Kona Pier',
    location: 'Kona',
    beach: 'kailua-bay',
    island: 'hawaii',
    url: 'https://www.konaweb.com/webcam',
    provider: 'KonaWeb',
    type: 'stream',
    coordinates: { lat: 19.6400, lng: -155.9969 },
    active: true
  },
  {
    id: 'hapuna-beach',
    name: 'Hapuna Beach',
    location: 'Kohala Coast',
    beach: 'hapuna-beach',
    island: 'hawaii',
    url: 'https://www.hapunabeachresort.com/webcam',
    provider: 'Hapuna Beach Resort',
    type: 'stream',
    coordinates: { lat: 19.9927, lng: -155.8241 },
    active: true
  },
  {
    id: 'punaluu-black-sand',
    name: 'Punaluu Black Sand Beach',
    location: 'South Point',
    beach: 'punaluu-beach',
    island: 'hawaii',
    url: 'https://www.nps.gov/havo/learn/photosmultimedia/webcams.htm',
    provider: 'Hawaii Volcanoes NP',
    type: 'image',
    refreshInterval: 600,
    coordinates: { lat: 19.1359, lng: -155.5045 },
    active: true
  },
  {
    id: 'waikoloa-beach',
    name: 'Waikoloa Beach',
    location: 'Kohala Coast',
    beach: 'waikoloa-beach',
    island: 'hawaii',
    url: 'https://www.waikoloabeachresort.com/webcam',
    provider: 'Waikoloa Beach Resort',
    type: 'stream',
    coordinates: { lat: 19.9158, lng: -155.8811 },
    active: true
  }
]

// Additional webcam sources that can be integrated
export const WEBCAM_PROVIDERS = {
  SURFLINE: {
    url: 'https://www.surfline.com/surf-cams/hawaii',
    requiresAPI: true,
    apiKey: process.env.SURFLINE_API_KEY
  },
  WINDY: {
    url: 'https://www.windy.com/webcams',
    requiresAPI: true,
    apiKey: process.env.WINDY_API_KEY
  },
  EARTHCAM: {
    url: 'https://www.earthcam.com/usa/hawaii/',
    requiresAPI: false
  },
  HAWAII_NEWS_NOW: {
    url: 'https://www.hawaiinewsnow.com/weather/cams/',
    requiresAPI: false
  },
  EXPLORE: {
    url: 'https://explore.org/livecams/hawaii',
    requiresAPI: false
  }
}

// Function to get webcams for a specific beach
export function getBeachWebcams(beachSlug: string): Webcam[] {
  return HAWAII_WEBCAMS.filter(cam => 
    cam.beach === beachSlug && cam.active
  )
}

// Function to get all webcams for an island
export function getIslandWebcams(island: string): Webcam[] {
  return HAWAII_WEBCAMS.filter(cam => 
    cam.island === island && cam.active
  )
}

// Function to get nearby webcams based on coordinates
export function getNearbyWebcams(lat: number, lng: number, radiusKm: number = 10): Webcam[] {
  return HAWAII_WEBCAMS.filter(cam => {
    if (!cam.coordinates || !cam.active) return false
    
    const distance = calculateDistance(
      lat, lng,
      cam.coordinates.lat, cam.coordinates.lng
    )
    
    return distance <= radiusKm
  })
}

// Helper function to calculate distance between coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Function to check if webcam is currently available
export async function checkWebcamStatus(webcam: Webcam): Promise<boolean> {
  try {
    const response = await fetch(webcam.url, { 
      method: 'HEAD',
      mode: 'no-cors' 
    })
    return response.ok || response.type === 'opaque'
  } catch {
    return false
  }
}

// Get featured webcams for homepage
export function getFeaturedWebcams(): Webcam[] {
  const featured = [
    'waikiki-sheraton',
    'pipeline-surf',
    'kaanapali-beach',
    'poipu-beach',
    'kona-kailua-pier'
  ]
  
  return HAWAII_WEBCAMS.filter(cam => 
    featured.includes(cam.id) && cam.active
  )
}