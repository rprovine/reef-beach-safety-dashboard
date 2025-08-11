/**
 * Comprehensive Data Sources Integration
 * Aggregates data from multiple APIs to provide complete beach information
 */

// API Configuration
export const DATA_SOURCES = {
  // NOAA - National Oceanic and Atmospheric Administration
  NOAA: {
    // Tides & Currents
    TIDES: 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
    // Weather & Marine Forecast
    WEATHER: 'https://api.weather.gov',
    // Wave Watch III Model
    WAVE_WATCH: 'https://polar.ncep.noaa.gov/waves',
    // Coastal Water Temperature
    WATER_TEMP: 'https://www.ndbc.noaa.gov/data/realtime2',
    // National Data Buoy Center
    BUOYS: 'https://www.ndbc.noaa.gov/api',
  },

  // PacIOOS - Pacific Islands Ocean Observing System
  PACIOOS: {
    // Hawaii-specific ocean data
    BASE: 'https://pae-paha.pacioos.hawaii.edu/erddap',
    // Beach specific forecasts
    BEACHES: 'https://www.pacioos.hawaii.edu/shoreline/beaches',
    // High-resolution wave models
    WAVES: 'https://pae-paha.pacioos.hawaii.edu/wavemodel',
    // Ocean currents
    CURRENTS: 'https://pae-paha.pacioos.hawaii.edu/currents',
  },

  // Hawaii Department of Health
  DOH: {
    // Beach water quality & bacteria levels
    WATER_QUALITY: 'https://eha-cloud.doh.hawaii.gov/cwb/api',
    // Beach advisories
    ADVISORIES: 'https://health.hawaii.gov/cwb/clean-water-branch-data',
  },

  // OpenWeatherMap (backup weather data)
  OPENWEATHER: {
    BASE: 'https://api.openweathermap.org/data/2.5',
    // UV Index
    UV: 'https://api.openweathermap.org/data/2.5/uvi',
    // Air quality
    AIR: 'http://api.openweathermap.org/data/2.5/air_pollution',
  },

  // Windy.com API (wind and weather visualization)
  WINDY: {
    WEBCAMS: 'https://api.windy.com/api/webcams/v2',
    FORECAST: 'https://api.windy.com/api/point-forecast/v2',
  },

  // MagicSeaweed (surf conditions)
  MAGICSEAWEED: {
    BASE: 'https://magicseaweed.com/api',
    // Requires API key
  },

  // StormGlass (marine weather)
  STORMGLASS: {
    WEATHER: 'https://api.stormglass.io/v2/weather/point',
    TIDE: 'https://api.stormglass.io/v2/tide/extremes/point',
    BIO: 'https://api.stormglass.io/v2/bio/point', // Marine life activity
  },

  // World Weather Online (marine API)
  WWO: {
    MARINE: 'https://api.worldweatheronline.com/premium/v1/marine.ashx',
  },

  // USGS - Water Resources
  USGS: {
    WATER: 'https://waterservices.usgs.gov/nwis',
    EARTHQUAKES: 'https://earthquake.usgs.gov/fdsnws/event/1', // Tsunami risk
  },

  // NASA EarthData (satellite imagery)
  NASA: {
    MODIS: 'https://modis.ornl.gov/rst/api/v1', // Ocean color/algae blooms
    WORLDVIEW: 'https://worldview.earthdata.nasa.gov',
  },

  // Local Hawaii APIs
  HAWAII: {
    // Office of Planning GIS
    GIS: 'https://geoportal.hawaii.gov/arcgis/rest/services',
    // Hawaii Beach Safety
    BEACH_SAFETY: 'https://hawaiibeachsafety.com/api', // If available
    // DLNR - Dept of Land & Natural Resources
    DLNR: 'https://dlnr.hawaii.gov/api',
  },

  // Social/Crowd-sourced
  SOCIAL: {
    // Instagram location API (for recent photos)
    INSTAGRAM: 'https://graph.instagram.com',
    // Twitter API for real-time reports
    TWITTER: 'https://api.twitter.com/2',
    // Flickr for beach photos
    FLICKR: 'https://api.flickr.com/services/rest',
  },

  // Emergency Services
  EMERGENCY: {
    // NOAA Tsunami Warning
    TSUNAMI: 'https://api.weather.gov/alerts/active',
    // Hawaii Emergency Management
    HI_EMA: 'https://dod.hawaii.gov/hiema/api',
  },

  // Environmental
  ENVIRONMENT: {
    // Coral reef health
    CORAL_WATCH: 'https://coralreefwatch.noaa.gov/api',
    // Marine protected areas
    MPA: 'https://mpa.gov/api',
    // Species sightings
    OBIS: 'https://api.obis.org/v3',
  }
}

// Data points we want to collect for each beach
export interface ComprehensiveBeachData {
  // Ocean Conditions
  waveHeight: number
  wavePeriod: number
  waveDirection: string
  swellHeight: number
  swellPeriod: number
  swellDirection: string
  
  // Wind
  windSpeed: number
  windDirection: string
  windGusts: number
  
  // Water
  waterTemp: number
  waterClarity: number // visibility in feet
  salinity: number
  pH: number
  
  // Tides
  currentTide: number
  nextHighTide: Date
  nextLowTide: Date
  tidalRange: number
  
  // Currents
  currentSpeed: number
  currentDirection: string
  ripCurrentRisk: 'low' | 'moderate' | 'high'
  
  // Weather
  airTemp: number
  humidity: number
  pressure: number
  visibility: number
  precipitation: number
  cloudCover: number
  
  // UV & Sun
  uvIndex: number
  sunrise: Date
  sunset: Date
  firstLight: Date
  lastLight: Date
  
  // Water Quality
  bacteriaLevel: 'safe' | 'caution' | 'unsafe'
  enterococcus: number // CFU/100ml
  turbidity: number
  algaePresent: boolean
  
  // Safety Warnings
  highSurf: boolean
  strongCurrent: boolean
  jellyfish: boolean
  sharkSighting: boolean
  sealPresent: boolean
  
  // Environmental
  coralHealth: 'excellent' | 'good' | 'fair' | 'poor'
  reefCoverage: number // percentage
  fishDiversity: 'high' | 'medium' | 'low'
  
  // Amenities Status
  lifeguardOnDuty: boolean
  restroomsOpen: boolean
  showersAvailable: boolean
  parkingSpaces: number
  
  // Crowd Level
  crowdLevel: 'empty' | 'light' | 'moderate' | 'crowded' | 'packed'
  estimatedPeople: number
  
  // Webcams
  webcamUrls: string[]
  lastWebcamUpdate: Date
  
  // Forecasts
  forecast3Hour: Record<string, unknown>[]
  forecast24Hour: Record<string, unknown>[]
  forecast7Day: Record<string, unknown>[]
  
  // Advisories
  activeAdvisories: string[]
  tsunamiWarning: boolean
  hurricaneWarning: boolean
  
  // Best For (activities)
  swimming: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous'
  surfing: 'excellent' | 'good' | 'fair' | 'poor' | 'flat'
  snorkeling: 'excellent' | 'good' | 'fair' | 'poor'
  diving: 'excellent' | 'good' | 'fair' | 'poor'
  fishing: 'excellent' | 'good' | 'fair' | 'poor'
  
  // Recent Reports
  userReports: Record<string, unknown>[]
  officialReports: Record<string, unknown>[]
  
  // Historical Comparison
  vs24HoursAgo: Record<string, unknown>
  vs7DaysAgo: Record<string, unknown>
  vsMonthlyAverage: Record<string, unknown>
}

// Hawaii-specific NOAA station IDs
export const HAWAII_STATIONS = {
  OAHU: {
    HONOLULU: '1612340',
    PEARL_HARBOR: '1612480',
    WAIKIKI: '1612340', // Uses Honolulu
    HALEIWA: '1615680',
    KANEOHE: '1612480',
  },
  MAUI: {
    KAHULUI: '1615680',
    LAHAINA: '1615680',
    KIHEI: '1615680',
  },
  KAUAI: {
    NAWILIWILI: '1611400',
    PORT_ALLEN: '1611400',
  },
  HAWAII: {
    HILO: '1617760',
    KONA: '1617433',
    KAWAIHAE: '1617433',
  }
}

// PacIOOS Beach IDs
export const PACIOOS_BEACHES = {
  // These would map to specific PacIOOS beach forecast IDs
  'waikiki-beach': 'waikiki',
  'pipeline': 'ehukai',
  'sunset-beach': 'sunset',
  'hanauma-bay': 'hanauma',
  'sandy-beach': 'sandy',
  'lanikai-beach': 'lanikai',
  // ... etc
}

// API Keys (should be in environment variables)
export const API_KEYS = {
  OPENWEATHER: process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
  STORMGLASS: process.env.NEXT_PUBLIC_STORMGLASS_API_KEY,
  WINDY: process.env.NEXT_PUBLIC_WINDY_API_KEY,
  MAGICSEAWEED: process.env.NEXT_PUBLIC_MAGICSEAWEED_API_KEY,
  WWO: process.env.NEXT_PUBLIC_WWO_API_KEY,
}

// Rate limiting configuration
export const RATE_LIMITS = {
  NOAA: { requests: 1000, window: '1h' },
  OPENWEATHER: { requests: 60, window: '1m' },
  STORMGLASS: { requests: 50, window: '1d' },
  PACIOOS: { requests: 100, window: '1h' },
}

// Cache durations for different data types
export const CACHE_DURATIONS = {
  REALTIME: 5 * 60 * 1000, // 5 minutes
  HOURLY: 60 * 60 * 1000, // 1 hour
  DAILY: 24 * 60 * 60 * 1000, // 24 hours
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
}