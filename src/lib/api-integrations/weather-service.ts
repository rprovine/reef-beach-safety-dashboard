/**
 * Weather API Integration Service
 * Integrates OpenWeather, StormGlass, and other weather services
 */

interface WeatherConfig {
  openWeatherKey: string | undefined
  stormGlassKey: string | undefined
}

const config: WeatherConfig = {
  openWeatherKey: process.env.OPENWEATHER_API_KEY || '6e2b2672dc3061a2c1d764c086024c9c',
  stormGlassKey: process.env.STORMGLASS_API_KEY
}

export interface WeatherData {
  // Current conditions
  temperature: number
  feelsLike: number
  humidity: number
  pressure: number
  visibility: number
  cloudCover: number
  precipitation: number
  uvIndex: number
  
  // Wind
  windSpeed: number
  windDirection: number
  windGust: number
  
  // Air quality
  airQuality: {
    aqi: number
    pm25: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
  }
  
  // Forecast
  hourlyForecast: Array<{
    time: Date
    temp: number
    precipitation: number
    windSpeed: number
    cloudCover: number
  }>
  
  dailyForecast: Array<{
    date: Date
    tempMin: number
    tempMax: number
    precipitation: number
    windSpeed: number
    description: string
  }>
}

export interface MarineData {
  waveHeight: number
  wavePeriod: number
  waveDirection: number
  swellHeight: number
  swellPeriod: number
  swellDirection: number
  secondarySwellHeight: number
  secondarySwellPeriod: number
  secondarySwellDirection: number
  windWaveHeight: number
  windWavePeriod: number
  windWaveDirection: number
  waterTemperature: number
  currentSpeed: number
  currentDirection: number
  visibility: number
  seaLevel: number
  iceCover: number
}

export class WeatherService {
  // Get comprehensive weather data from OpenWeather
  async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    try {
      const apiKey = config.openWeatherKey
      if (!apiKey) throw new Error('OpenWeather API key not configured')
      
      // Fetch current weather, forecast, and air quality in parallel
      const [current, forecast, airQuality, uv] = await Promise.all([
        this.fetchOpenWeatherCurrent(lat, lon, apiKey),
        this.fetchOpenWeatherForecast(lat, lon, apiKey),
        this.fetchOpenWeatherAirQuality(lat, lon, apiKey),
        this.fetchOpenWeatherUV(lat, lon, apiKey)
      ])
      
      return {
        // Current conditions
        temperature: current.main.temp,
        feelsLike: current.main.feels_like,
        humidity: current.main.humidity,
        pressure: current.main.pressure,
        visibility: current.visibility / 1000, // Convert to km
        cloudCover: current.clouds.all,
        precipitation: current.rain?.['1h'] || 0,
        uvIndex: uv.value,
        
        // Wind
        windSpeed: current.wind.speed * 2.237, // Convert m/s to mph
        windDirection: current.wind.deg,
        windGust: (current.wind.gust || 0) * 2.237,
        
        // Air quality
        airQuality: {
          aqi: airQuality.list[0].main.aqi,
          pm25: airQuality.list[0].components.pm2_5,
          pm10: airQuality.list[0].components.pm10,
          o3: airQuality.list[0].components.o3,
          no2: airQuality.list[0].components.no2,
          so2: airQuality.list[0].components.so2,
          co: airQuality.list[0].components.co
        },
        
        // Hourly forecast (next 48 hours)
        hourlyForecast: forecast.list.slice(0, 16).map((item: any) => ({
          time: new Date(item.dt * 1000),
          temp: item.main.temp,
          precipitation: item.rain?.['3h'] || 0,
          windSpeed: item.wind.speed * 2.237,
          cloudCover: item.clouds.all
        })),
        
        // Daily forecast (next 5 days)
        dailyForecast: this.aggregateDailyForecast(forecast.list)
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
      throw error
    }
  }
  
  // Get marine data from StormGlass
  async getMarineData(lat: number, lon: number): Promise<MarineData> {
    try {
      const apiKey = config.stormGlassKey
      if (!apiKey) {
        // Return mock data if no API key
        return this.getMockMarineData()
      }
      
      const params = [
        'waveHeight',
        'wavePeriod',
        'waveDirection',
        'swellHeight',
        'swellPeriod',
        'swellDirection',
        'secondarySwellHeight',
        'secondarySwellPeriod',
        'secondarySwellDirection',
        'windWaveHeight',
        'windWavePeriod',
        'windWaveDirection',
        'waterTemperature',
        'currentSpeed',
        'currentDirection',
        'visibility',
        'seaLevel',
        'iceCover'
      ].join(',')
      
      const response = await fetch(
        `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lon}&params=${params}`,
        {
          headers: {
            'Authorization': apiKey
          }
        }
      )
      
      const data = await response.json()
      const current = data.hours[0]
      
      return {
        waveHeight: this.metersToFeet(current.waveHeight?.noaa || 0),
        wavePeriod: current.wavePeriod?.noaa || 0,
        waveDirection: current.waveDirection?.noaa || 0,
        swellHeight: this.metersToFeet(current.swellHeight?.noaa || 0),
        swellPeriod: current.swellPeriod?.noaa || 0,
        swellDirection: current.swellDirection?.noaa || 0,
        secondarySwellHeight: this.metersToFeet(current.secondarySwellHeight?.noaa || 0),
        secondarySwellPeriod: current.secondarySwellPeriod?.noaa || 0,
        secondarySwellDirection: current.secondarySwellDirection?.noaa || 0,
        windWaveHeight: this.metersToFeet(current.windWaveHeight?.noaa || 0),
        windWavePeriod: current.windWavePeriod?.noaa || 0,
        windWaveDirection: current.windWaveDirection?.noaa || 0,
        waterTemperature: this.celsiusToFahrenheit(current.waterTemperature?.noaa || 25),
        currentSpeed: current.currentSpeed?.sg || 0,
        currentDirection: current.currentDirection?.sg || 0,
        visibility: current.visibility?.noaa || 10,
        seaLevel: current.seaLevel?.sg || 0,
        iceCover: current.iceCover?.noaa || 0
      }
    } catch (error) {
      console.error('Error fetching marine data:', error)
      return this.getMockMarineData()
    }
  }
  
  // Fetch OpenWeather current conditions
  private async fetchOpenWeatherCurrent(lat: number, lon: number, apiKey: string): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    const response = await fetch(url)
    return response.json()
  }
  
  // Fetch OpenWeather forecast
  private async fetchOpenWeatherForecast(lat: number, lon: number, apiKey: string): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    const response = await fetch(url)
    return response.json()
  }
  
  // Fetch OpenWeather air quality
  private async fetchOpenWeatherAirQuality(lat: number, lon: number, apiKey: string): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    const response = await fetch(url)
    return response.json()
  }
  
  // Fetch OpenWeather UV index
  private async fetchOpenWeatherUV(lat: number, lon: number, apiKey: string): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
    const response = await fetch(url)
    return response.json()
  }
  
  // Aggregate hourly forecast into daily
  private aggregateDailyForecast(hourlyData: any[]): any[] {
    const dailyMap = new Map()
    
    hourlyData.forEach(hour => {
      const date = new Date(hour.dt * 1000).toDateString()
      
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          date: new Date(hour.dt * 1000),
          tempMin: hour.main.temp_min,
          tempMax: hour.main.temp_max,
          precipitation: 0,
          windSpeed: 0,
          description: hour.weather[0].description,
          count: 0
        })
      }
      
      const day = dailyMap.get(date)
      day.tempMin = Math.min(day.tempMin, hour.main.temp_min)
      day.tempMax = Math.max(day.tempMax, hour.main.temp_max)
      day.precipitation += hour.rain?.['3h'] || 0
      day.windSpeed += hour.wind.speed
      day.count++
    })
    
    return Array.from(dailyMap.values()).map(day => ({
      date: day.date,
      tempMin: day.tempMin,
      tempMax: day.tempMax,
      precipitation: day.precipitation,
      windSpeed: (day.windSpeed / day.count) * 2.237,
      description: day.description
    })).slice(0, 5)
  }
  
  // Get mock marine data when API is unavailable
  private getMockMarineData(): MarineData {
    return {
      waveHeight: 3 + Math.random() * 4,
      wavePeriod: 8 + Math.random() * 6,
      waveDirection: Math.random() * 360,
      swellHeight: 2 + Math.random() * 3,
      swellPeriod: 10 + Math.random() * 5,
      swellDirection: Math.random() * 360,
      secondarySwellHeight: 1 + Math.random() * 2,
      secondarySwellPeriod: 8 + Math.random() * 4,
      secondarySwellDirection: Math.random() * 360,
      windWaveHeight: 1 + Math.random() * 2,
      windWavePeriod: 4 + Math.random() * 3,
      windWaveDirection: Math.random() * 360,
      waterTemperature: 75 + Math.random() * 5,
      currentSpeed: Math.random() * 2,
      currentDirection: Math.random() * 360,
      visibility: 5 + Math.random() * 10,
      seaLevel: 0,
      iceCover: 0
    }
  }
  
  // Unit conversion helpers
  private metersToFeet(meters: number): number {
    return meters * 3.28084
  }
  
  private celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32
  }
}

// Export singleton instance
export const weatherService = new WeatherService()