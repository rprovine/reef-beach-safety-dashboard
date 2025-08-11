// OpenWeather API integration for Beach Hui
// Real-time weather data for Hawaii beaches

import axios from 'axios'

const API_KEY = process.env.OPENWEATHER_API_KEY || '6e2b2672dc3061a2c1d764c086024c9c'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export interface WeatherData {
  temperature: number // Celsius
  feelsLike: number
  humidity: number
  pressure: number
  windSpeed: number // m/s
  windDirection: number // degrees
  cloudCover: number // percentage
  visibility: number // meters
  uvIndex?: number
  description: string
  icon: string
  sunrise: Date
  sunset: Date
}

export interface MarineWeatherData extends WeatherData {
  waveHeight?: number
  wavePeriod?: number
  waveDirection?: number
  waterTemperature?: number
  swellHeight?: number
  tideLevel?: number
}

// Convert Kelvin to Celsius
function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15
}

// Convert m/s to mph
function mpsToMph(mps: number): number {
  return mps * 2.237
}

// Get wind direction as compass bearing
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                      'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

// Fetch current weather for coordinates
export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric' // Use metric units (Celsius, m/s)
      }
    })

    const data = response.data
    
    return {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      cloudCover: data.clouds.all,
      visibility: data.visibility,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000)
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return null
  }
}

// Fetch UV index for coordinates
export async function getUVIndex(lat: number, lon: number): Promise<number | null> {
  try {
    const response = await axios.get(`${BASE_URL}/uvi`, {
      params: {
        lat,
        lon,
        appid: API_KEY
      }
    })
    
    return response.data.value
  } catch (error) {
    // UV index endpoint might not be available in free tier
    console.warn('UV index not available:', error)
    return null
  }
}

// Fetch marine weather (requires One Call API - may need subscription)
export async function getMarineWeather(lat: number, lon: number): Promise<MarineWeatherData | null> {
  try {
    // Try One Call API 3.0 (requires subscription)
    const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        exclude: 'minutely,hourly,daily,alerts'
      }
    })

    const data = response.data.current
    
    return {
      temperature: data.temp,
      feelsLike: data.feels_like,
      humidity: data.humidity,
      pressure: data.pressure,
      windSpeed: data.wind_speed,
      windDirection: data.wind_deg,
      cloudCover: data.clouds,
      visibility: data.visibility,
      uvIndex: data.uvi,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: new Date(data.sunrise * 1000),
      sunset: new Date(data.sunset * 1000),
      // Marine-specific data would come from a marine API
      waterTemperature: data.temp - 2 // Approximate water temp (usually 2°C cooler than air)
    }
  } catch (error) {
    // Fallback to basic weather if One Call not available
    console.warn('Marine weather not available, using basic weather:', error)
    return await getCurrentWeather(lat, lon) as MarineWeatherData
  }
}

// Get 5-day forecast
export async function getForecast(lat: number, lon: number): Promise<any[]> {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        cnt: 40 // 5 days * 8 (3-hour intervals)
      }
    })

    // Group by day and get daily averages
    const dailyData = new Map()
    
    response.data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString()
      
      if (!dailyData.has(date)) {
        dailyData.set(date, {
          date: new Date(item.dt * 1000),
          temps: [],
          windSpeeds: [],
          conditions: [],
          humidity: [],
          clouds: []
        })
      }
      
      const day = dailyData.get(date)
      day.temps.push(item.main.temp)
      day.windSpeeds.push(item.wind.speed)
      day.conditions.push(item.weather[0].description)
      day.humidity.push(item.main.humidity)
      day.clouds.push(item.clouds.all)
    })

    // Calculate daily averages
    const forecast = Array.from(dailyData.values()).map(day => ({
      date: day.date,
      temperature: {
        avg: day.temps.reduce((a: number, b: number) => a + b, 0) / day.temps.length,
        min: Math.min(...day.temps),
        max: Math.max(...day.temps)
      },
      windSpeed: {
        avg: day.windSpeeds.reduce((a: number, b: number) => a + b, 0) / day.windSpeeds.length,
        min: Math.min(...day.windSpeeds),
        max: Math.max(...day.windSpeeds)
      },
      humidity: day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length,
      cloudCover: day.clouds.reduce((a: number, b: number) => a + b, 0) / day.clouds.length,
      condition: day.conditions[Math.floor(day.conditions.length / 2)] // Most common condition
    }))

    return forecast.slice(0, 7) // Return 7 days
  } catch (error) {
    console.error('Error fetching forecast:', error)
    return []
  }
}

// Calculate beach conditions based on weather
export function calculateBeachConditions(weather: WeatherData): {
  swimming: 'excellent' | 'good' | 'fair' | 'poor'
  surfing: 'excellent' | 'good' | 'fair' | 'poor'
  snorkeling: 'excellent' | 'good' | 'fair' | 'poor'
  overall: 'excellent' | 'good' | 'caution' | 'dangerous'
} {
  // Wind-based conditions
  const windSpeedMph = mpsToMph(weather.windSpeed)
  
  // Swimming conditions based on wind
  let swimming: 'excellent' | 'good' | 'fair' | 'poor'
  if (windSpeedMph < 10) swimming = 'excellent'
  else if (windSpeedMph < 15) swimming = 'good'
  else if (windSpeedMph < 20) swimming = 'fair'
  else swimming = 'poor'

  // Surfing prefers more wind/waves
  let surfing: 'excellent' | 'good' | 'fair' | 'poor'
  if (windSpeedMph >= 10 && windSpeedMph <= 20) surfing = 'excellent'
  else if (windSpeedMph >= 8 && windSpeedMph <= 25) surfing = 'good'
  else if (windSpeedMph >= 5 && windSpeedMph <= 30) surfing = 'fair'
  else surfing = 'poor'

  // Snorkeling needs calm, clear conditions
  let snorkeling: 'excellent' | 'good' | 'fair' | 'poor'
  if (windSpeedMph < 8 && weather.visibility > 8000) snorkeling = 'excellent'
  else if (windSpeedMph < 12 && weather.visibility > 5000) snorkeling = 'good'
  else if (windSpeedMph < 18 && weather.visibility > 3000) snorkeling = 'fair'
  else snorkeling = 'poor'

  // Overall safety
  let overall: 'excellent' | 'good' | 'caution' | 'dangerous'
  if (windSpeedMph < 15 && weather.visibility > 5000) overall = 'excellent'
  else if (windSpeedMph < 20 && weather.visibility > 3000) overall = 'good'
  else if (windSpeedMph < 30) overall = 'caution'
  else overall = 'dangerous'

  return { swimming, surfing, snorkeling, overall }
}

// Beach-specific weather fetcher
export async function getBeachWeather(beachSlug: string, lat: number, lon: number) {
  const weather = await getCurrentWeather(lat, lon)
  if (!weather) return null

  const uvIndex = await getUVIndex(lat, lon)
  if (uvIndex) {
    weather.uvIndex = uvIndex
  }

  const conditions = calculateBeachConditions(weather)
  const forecast = await getForecast(lat, lon)

  return {
    current: weather,
    conditions,
    forecast,
    lastUpdated: new Date()
  }
}

// Format weather for display
export function formatWeatherDisplay(weather: WeatherData) {
  return {
    temperature: `${Math.round(weather.temperature)}°C / ${Math.round(weather.temperature * 9/5 + 32)}°F`,
    feelsLike: `${Math.round(weather.feelsLike)}°C / ${Math.round(weather.feelsLike * 9/5 + 32)}°F`,
    wind: `${Math.round(mpsToMph(weather.windSpeed))} mph ${getWindDirection(weather.windDirection)}`,
    humidity: `${weather.humidity}%`,
    visibility: weather.visibility >= 10000 ? 'Clear' : `${(weather.visibility / 1000).toFixed(1)} km`,
    uvIndex: weather.uvIndex ? (
      weather.uvIndex <= 2 ? 'Low' :
      weather.uvIndex <= 5 ? 'Moderate' :
      weather.uvIndex <= 7 ? 'High' :
      weather.uvIndex <= 10 ? 'Very High' :
      'Extreme'
    ) : 'N/A',
    description: weather.description.charAt(0).toUpperCase() + weather.description.slice(1)
  }
}