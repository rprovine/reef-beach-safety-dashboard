// Test OpenWeather API with Hawaii beach coordinates
const axios = require('axios')

const API_KEY = '6e2b2672dc3061a2c1d764c086024c9c'

// Popular Hawaii beaches
const beaches = [
  { name: 'Waikiki Beach', lat: 21.2762, lon: -157.8267 },
  { name: 'Lanikai Beach', lat: 21.3925, lon: -157.7144 },
  { name: 'Hanauma Bay', lat: 21.2690, lon: -157.6938 },
  { name: 'Pipeline (Ehukai)', lat: 21.6653, lon: -158.0534 },
  { name: 'Big Beach (Maui)', lat: 20.6320, lon: -156.4482 }
]

async function testBeachWeather(beach) {
  try {
    console.log(`\n🏖️  ${beach.name}`)
    console.log('=' .repeat(40))
    
    // Current weather
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat: beach.lat,
          lon: beach.lon,
          appid: API_KEY,
          units: 'metric'
        }
      }
    )
    
    const weather = weatherResponse.data
    
    console.log(`📍 Location: ${weather.name}, ${weather.sys.country}`)
    console.log(`🌤️  Weather: ${weather.weather[0].description}`)
    console.log(`🌡️  Temperature: ${weather.main.temp}°C (${(weather.main.temp * 9/5 + 32).toFixed(1)}°F)`)
    console.log(`💧 Humidity: ${weather.main.humidity}%`)
    console.log(`💨 Wind: ${(weather.wind.speed * 2.237).toFixed(1)} mph`)
    console.log(`👁️  Visibility: ${(weather.visibility / 1000).toFixed(1)} km`)
    console.log(`☁️  Cloud Cover: ${weather.clouds.all}%`)
    
    // Calculate beach conditions
    const windMph = weather.wind.speed * 2.237
    let conditions = '✅ Excellent'
    if (windMph > 20) conditions = '⚠️  Caution'
    else if (windMph > 15) conditions = '👍 Good'
    
    console.log(`🏊 Beach Conditions: ${conditions}`)
    
    // UV Index (might require different endpoint/subscription)
    try {
      const uvResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/uvi`,
        {
          params: {
            lat: beach.lat,
            lon: beach.lon,
            appid: API_KEY
          }
        }
      )
      console.log(`☀️  UV Index: ${uvResponse.data.value}`)
    } catch (uvError) {
      console.log(`☀️  UV Index: Not available (requires subscription)`)
    }
    
    return true
  } catch (error) {
    console.log(`❌ Error for ${beach.name}: ${error.message}`)
    return false
  }
}

async function testAllBeaches() {
  console.log('🌺 Testing OpenWeather API for Hawaii Beaches')
  console.log('Using API Key:', API_KEY.substring(0, 8) + '...')
  
  for (const beach of beaches) {
    await testBeachWeather(beach)
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n✅ Testing complete!')
}

testAllBeaches()