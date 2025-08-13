/**
 * NOAA API Integration Service
 * Comprehensive integration with all NOAA data endpoints
 */

import { HAWAII_STATIONS } from '../data-sources'

interface NOAAConfig {
  tidesUrl: string
  weatherUrl: string
  waveUrl: string
  buoyUrl: string
  marineUrl: string
}

const NOAA_API: NOAAConfig = {
  tidesUrl: 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
  weatherUrl: 'https://api.weather.gov',
  waveUrl: 'https://polar.ncep.noaa.gov/waves/ensemble/download.htm',
  buoyUrl: 'https://www.ndbc.noaa.gov/data/realtime2',
  marineUrl: 'https://api.weather.gov/gridpoints'
}

export interface TideData {
  current: number
  type: 'high' | 'low' | 'rising' | 'falling'
  nextHigh: { time: Date; height: number }
  nextLow: { time: Date; height: number }
  predictions: Array<{
    time: Date
    height: number
    type: 'H' | 'L'
  }>
}

export interface WaveData {
  height: number // feet
  period: number // seconds
  direction: number // degrees
  swellHeight: number
  swellPeriod: number
  swellDirection: number
  windWaveHeight: number
  windWavePeriod: number
  windWaveDirection: number
  dominantPeriod: number
  averagePeriod: number
  peakDirection: number
  meanWaveDirection: number
  waterDepth: number
}

export interface CurrentData {
  speed: number // knots
  direction: number // degrees
  bin: number
  depth: number
  time: Date
}

export interface MarineWeather {
  waveHeight: number
  wavePeriod: number
  windSpeed: number
  windDirection: number
  windGust: number
  visibility: number
  pressure: number
  airTemp: number
  waterTemp: number
  dewPoint: number
  seas: string // description
  swells: Array<{
    height: number
    period: number
    direction: string
  }>
}

export interface BuoyData {
  stationId: string
  name: string
  lat: number
  lon: number
  waterTemp: number
  waveHeight: number
  dominantWavePeriod: number
  averagePeriod: number
  meanWaveDirection: number
  pressure: number
  airTemp: number
  waterTemp: number
  dewPoint: number
  visibility: number
  pressureTendency: number
  tide: number
  windSpeed: number
  windDirection: number
  windGust: number
  timestamp: Date
}

export class NOAAService {
  // Get comprehensive tide data
  async getTideData(stationId: string, days: number = 2): Promise<TideData> {
    try {
      const now = new Date()
      const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
      
      // Fetch current water level
      const currentUrl = new URL(NOAA_API.tidesUrl)
      currentUrl.searchParams.append('station', stationId)
      currentUrl.searchParams.append('product', 'water_level')
      currentUrl.searchParams.append('datum', 'MLLW')
      currentUrl.searchParams.append('units', 'english')
      currentUrl.searchParams.append('time_zone', 'lst_ldt')
      currentUrl.searchParams.append('format', 'json')
      currentUrl.searchParams.append('date', 'latest')
      
      // Fetch tide predictions
      const predictionsUrl = new URL(NOAA_API.tidesUrl)
      predictionsUrl.searchParams.append('station', stationId)
      predictionsUrl.searchParams.append('product', 'predictions')
      predictionsUrl.searchParams.append('datum', 'MLLW')
      predictionsUrl.searchParams.append('units', 'english')
      predictionsUrl.searchParams.append('time_zone', 'lst_ldt')
      predictionsUrl.searchParams.append('format', 'json')
      predictionsUrl.searchParams.append('begin_date', now.toISOString().slice(0, 10).replace(/-/g, ''))
      predictionsUrl.searchParams.append('end_date', endDate.toISOString().slice(0, 10).replace(/-/g, ''))
      predictionsUrl.searchParams.append('interval', 'hilo')
      
      const [currentResponse, predictionsResponse] = await Promise.all([
        fetch(currentUrl.toString()),
        fetch(predictionsUrl.toString())
      ])
      
      const currentData = await currentResponse.json()
      const predictionsData = await predictionsResponse.json()
      
      // Parse current tide
      const currentTide = currentData.data?.[0]?.v ? parseFloat(currentData.data[0].v) : 0
      
      // Parse predictions
      const predictions = predictionsData.predictions || []
      const highLowTides = predictions.map((p: any) => ({
        time: new Date(p.t),
        height: parseFloat(p.v),
        type: p.type as 'H' | 'L'
      }))
      
      // Find next high and low
      const nextHigh = highLowTides.find((t: any) => t.type === 'H' && t.time > now)
      const nextLow = highLowTides.find((t: any) => t.type === 'L' && t.time > now)
      
      // Determine if tide is rising or falling
      let tideType: 'high' | 'low' | 'rising' | 'falling' = 'rising'
      if (highLowTides.length >= 2) {
        const lastTide = highLowTides[0]
        tideType = lastTide.type === 'H' ? 'falling' : 'rising'
      }
      
      return {
        current: currentTide,
        type: tideType,
        nextHigh: nextHigh || { time: new Date(), height: 0 },
        nextLow: nextLow || { time: new Date(), height: 0 },
        predictions: highLowTides
      }
    } catch (error) {
      console.error('Error fetching NOAA tide data:', error)
      throw error
    }
  }
  
  // Get wave data from NOAA Wave Watch III
  async getWaveData(lat: number, lon: number): Promise<WaveData> {
    try {
      // Use nearest buoy for wave data
      const buoyData = await this.getNearestBuoy(lat, lon)
      
      return {
        height: buoyData.waveHeight,
        period: buoyData.dominantWavePeriod,
        direction: buoyData.meanWaveDirection,
        swellHeight: buoyData.waveHeight * 0.7, // Estimate
        swellPeriod: buoyData.dominantWavePeriod,
        swellDirection: buoyData.meanWaveDirection,
        windWaveHeight: buoyData.waveHeight * 0.3, // Estimate
        windWavePeriod: buoyData.averagePeriod,
        windWaveDirection: buoyData.windDirection,
        dominantPeriod: buoyData.dominantWavePeriod,
        averagePeriod: buoyData.averagePeriod,
        peakDirection: buoyData.meanWaveDirection,
        meanWaveDirection: buoyData.meanWaveDirection,
        waterDepth: 0 // Would need bathymetry data
      }
    } catch (error) {
      console.error('Error fetching NOAA wave data:', error)
      throw error
    }
  }
  
  // Get current data
  async getCurrentData(stationId: string): Promise<CurrentData> {
    try {
      const url = new URL(NOAA_API.tidesUrl)
      url.searchParams.append('station', stationId)
      url.searchParams.append('product', 'currents')
      url.searchParams.append('units', 'english')
      url.searchParams.append('time_zone', 'lst_ldt')
      url.searchParams.append('format', 'json')
      url.searchParams.append('date', 'latest')
      
      const response = await fetch(url.toString())
      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        const current = data.data[0]
        return {
          speed: parseFloat(current.s),
          direction: parseFloat(current.d),
          bin: current.b || 1,
          depth: current.depth || 0,
          time: new Date(current.t)
        }
      }
      
      // Return default if no data
      return {
        speed: 0,
        direction: 0,
        bin: 1,
        depth: 0,
        time: new Date()
      }
    } catch (error) {
      console.error('Error fetching NOAA current data:', error)
      throw error
    }
  }
  
  // Get marine weather forecast
  async getMarineWeather(lat: number, lon: number): Promise<MarineWeather> {
    try {
      // First get the grid point
      const pointUrl = `${NOAA_API.weatherUrl}/points/${lat},${lon}`
      const pointResponse = await fetch(pointUrl)
      const pointData = await pointResponse.json()
      
      const { gridX, gridY, gridId } = pointData.properties
      
      // Get marine forecast
      const forecastUrl = `${NOAA_API.weatherUrl}/gridpoints/${gridId}/${gridX},${gridY}`
      const forecastResponse = await fetch(forecastUrl)
      const forecastData = await forecastResponse.json()
      
      const props = forecastData.properties
      
      // Extract marine data
      const latestData = {
        waveHeight: this.extractLatestValue(props.waveHeight),
        wavePeriod: this.extractLatestValue(props.wavePeriod),
        windSpeed: this.extractLatestValue(props.windSpeed),
        windDirection: this.extractLatestValue(props.windDirection),
        windGust: this.extractLatestValue(props.windGust),
        visibility: this.extractLatestValue(props.visibility),
        pressure: this.extractLatestValue(props.pressure),
        airTemp: this.extractLatestValue(props.temperature),
        waterTemp: this.extractLatestValue(props.seaLevelPressure), // Placeholder
        dewPoint: this.extractLatestValue(props.dewpoint),
        seas: props.weather?.values?.[0]?.value?.[0]?.weather || '',
        swells: this.extractSwells(props)
      }
      
      return latestData
    } catch (error) {
      console.error('Error fetching NOAA marine weather:', error)
      throw error
    }
  }
  
  // Get nearest buoy data
  async getNearestBuoy(lat: number, lon: number): Promise<BuoyData> {
    try {
      // Hawaii buoy stations
      const buoys = [
        { id: '51201', name: 'Waimea Bay', lat: 21.67, lon: -158.12 },
        { id: '51202', name: 'Mokapu Point', lat: 21.44, lon: -157.67 },
        { id: '51203', name: 'Kauai', lat: 21.28, lon: -160.57 },
        { id: '51204', name: 'Hilo', lat: 19.53, lon: -154.95 },
        { id: '51205', name: 'Kona', lat: 19.78, lon: -156.04 },
        { id: '51206', name: 'Lanai', lat: 20.79, lon: -157.28 },
        { id: '51207', name: 'Barbers Point', lat: 21.28, lon: -158.12 }
      ]
      
      // Find nearest buoy
      let nearest = buoys[0]
      let minDistance = this.calculateDistance(lat, lon, nearest.lat, nearest.lon)
      
      for (const buoy of buoys) {
        const distance = this.calculateDistance(lat, lon, buoy.lat, buoy.lon)
        if (distance < minDistance) {
          minDistance = distance
          nearest = buoy
        }
      }
      
      // Fetch buoy data
      const url = `${NOAA_API.buoyUrl}/${nearest.id}.txt`
      const response = await fetch(url)
      const text = await response.text()
      
      // Parse the text data (NOAA uses fixed-width format)
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(/\s+/)
      const units = lines[1].split(/\s+/)
      const latestData = lines[2].split(/\s+/)
      
      // Map data to object
      const dataMap: any = {}
      headers.forEach((header, index) => {
        dataMap[header] = latestData[index]
      })
      
      return {
        stationId: nearest.id,
        name: nearest.name,
        lat: nearest.lat,
        lon: nearest.lon,
        waterTemp: parseFloat(dataMap.WTMP) || 0,
        waveHeight: this.metersToFeet(parseFloat(dataMap.WVHT) || 0),
        dominantWavePeriod: parseFloat(dataMap.DPD) || 0,
        averagePeriod: parseFloat(dataMap.APD) || 0,
        meanWaveDirection: parseFloat(dataMap.MWD) || 0,
        pressure: parseFloat(dataMap.PRES) || 0,
        airTemp: this.celsiusToFahrenheit(parseFloat(dataMap.ATMP) || 0),
        dewPoint: this.celsiusToFahrenheit(parseFloat(dataMap.DEWP) || 0),
        visibility: this.metersToMiles(parseFloat(dataMap.VIS) || 0),
        pressureTendency: parseFloat(dataMap.PTDY) || 0,
        tide: parseFloat(dataMap.TIDE) || 0,
        windSpeed: this.metersPerSecToMph(parseFloat(dataMap.WSPD) || 0),
        windDirection: parseFloat(dataMap.WDIR) || 0,
        windGust: this.metersPerSecToMph(parseFloat(dataMap.GST) || 0),
        timestamp: this.parseBuoyDate(dataMap)
      }
    } catch (error) {
      console.error('Error fetching NOAA buoy data:', error)
      throw error
    }
  }
  
  // Get water temperature
  async getWaterTemperature(stationId: string): Promise<number> {
    try {
      const url = new URL(NOAA_API.tidesUrl)
      url.searchParams.append('station', stationId)
      url.searchParams.append('product', 'water_temperature')
      url.searchParams.append('units', 'english')
      url.searchParams.append('time_zone', 'lst_ldt')
      url.searchParams.append('format', 'json')
      url.searchParams.append('date', 'latest')
      
      const response = await fetch(url.toString())
      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return parseFloat(data.data[0].v)
      }
      
      return 75 // Default Hawaii water temp
    } catch (error) {
      console.error('Error fetching water temperature:', error)
      return 75
    }
  }
  
  // Get air gap (for bridges/clearance)
  async getAirGap(stationId: string): Promise<number> {
    try {
      const url = new URL(NOAA_API.tidesUrl)
      url.searchParams.append('station', stationId)
      url.searchParams.append('product', 'air_gap')
      url.searchParams.append('units', 'english')
      url.searchParams.append('time_zone', 'lst_ldt')
      url.searchParams.append('format', 'json')
      url.searchParams.append('date', 'latest')
      
      const response = await fetch(url.toString())
      const data = await response.json()
      
      if (data.data && data.data.length > 0) {
        return parseFloat(data.data[0].v)
      }
      
      return 0
    } catch (error) {
      console.error('Error fetching air gap:', error)
      return 0
    }
  }
  
  // Get meteorological data
  async getMeteorologicalData(stationId: string): Promise<any> {
    try {
      const url = new URL(NOAA_API.tidesUrl)
      url.searchParams.append('station', stationId)
      url.searchParams.append('product', 'wind')
      url.searchParams.append('units', 'english')
      url.searchParams.append('time_zone', 'lst_ldt')
      url.searchParams.append('format', 'json')
      url.searchParams.append('date', 'latest')
      
      const response = await fetch(url.toString())
      const data = await response.json()
      
      // Also get air pressure and temperature
      const pressureUrl = new URL(NOAA_API.tidesUrl)
      pressureUrl.searchParams.append('station', stationId)
      pressureUrl.searchParams.append('product', 'air_pressure')
      pressureUrl.searchParams.append('units', 'english')
      pressureUrl.searchParams.append('time_zone', 'lst_ldt')
      pressureUrl.searchParams.append('format', 'json')
      pressureUrl.searchParams.append('date', 'latest')
      
      const tempUrl = new URL(NOAA_API.tidesUrl)
      tempUrl.searchParams.append('station', stationId)
      tempUrl.searchParams.append('product', 'air_temperature')
      tempUrl.searchParams.append('units', 'english')
      tempUrl.searchParams.append('time_zone', 'lst_ldt')
      tempUrl.searchParams.append('format', 'json')
      tempUrl.searchParams.append('date', 'latest')
      
      const [pressureResponse, tempResponse] = await Promise.all([
        fetch(pressureUrl.toString()),
        fetch(tempUrl.toString())
      ])
      
      const pressureData = await pressureResponse.json()
      const tempData = await tempResponse.json()
      
      return {
        wind: data.data?.[0] || {},
        pressure: pressureData.data?.[0] || {},
        temperature: tempData.data?.[0] || {}
      }
    } catch (error) {
      console.error('Error fetching meteorological data:', error)
      throw error
    }
  }
  
  // Helper functions
  private extractLatestValue(property: any): number {
    if (!property || !property.values) return 0
    const latest = property.values[0]
    return latest ? parseFloat(latest.value) : 0
  }
  
  private extractSwells(properties: any): Array<any> {
    // Parse swell data from forecast properties
    const swells = []
    if (properties.primarySwellHeight && properties.primarySwellDirection) {
      swells.push({
        height: this.extractLatestValue(properties.primarySwellHeight),
        period: this.extractLatestValue(properties.primarySwellPeriod),
        direction: this.extractLatestValue(properties.primarySwellDirection)
      })
    }
    if (properties.secondarySwellHeight) {
      swells.push({
        height: this.extractLatestValue(properties.secondarySwellHeight),
        period: this.extractLatestValue(properties.secondarySwellPeriod),
        direction: this.extractLatestValue(properties.secondarySwellDirection)
      })
    }
    return swells
  }
  
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
  
  private metersToFeet(meters: number): number {
    return meters * 3.28084
  }
  
  private celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9/5) + 32
  }
  
  private metersPerSecToMph(mps: number): number {
    return mps * 2.23694
  }
  
  private metersToMiles(meters: number): number {
    return meters * 0.000621371
  }
  
  private parseBuoyDate(dataMap: any): Date {
    const year = dataMap.YY || new Date().getFullYear()
    const month = dataMap.MM || 1
    const day = dataMap.DD || 1
    const hour = dataMap.hh || 0
    const minute = dataMap.mm || 0
    return new Date(year, month - 1, day, hour, minute)
  }
}

// Export singleton instance
export const noaaService = new NOAAService()