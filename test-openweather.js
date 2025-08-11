// Test OpenWeather API keys
const axios = require('axios')

const API_KEYS = [
  'b7e68c5b5c8e4f89b8c5d0e1f2a3b4c5',
  'a1b2c3d4e5f6789012345678901234567',
  'd4e5f6789012345678901234567890ab',
  '98765432109876543210987654321098'
]

const LAT = 21.3156 // Honolulu
const LON = -157.8567

async function testApiKey(apiKey) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${apiKey}&units=metric`
    )
    
    if (response.status === 200) {
      console.log(`✅ API Key ${apiKey.substring(0, 8)}... WORKS!`)
      console.log(`   Weather: ${response.data.weather[0].description}`)
      console.log(`   Temp: ${response.data.main.temp}°C`)
      console.log(`   Wind: ${response.data.wind.speed} m/s`)
      return true
    }
  } catch (error) {
    if (error.response?.status === 401) {
      console.log(`❌ API Key ${apiKey.substring(0, 8)}... INVALID (401 Unauthorized)`)
    } else if (error.response?.status === 429) {
      console.log(`⚠️  API Key ${apiKey.substring(0, 8)}... RATE LIMITED`)
    } else {
      console.log(`❌ API Key ${apiKey.substring(0, 8)}... ERROR: ${error.message}`)
    }
    return false
  }
}

async function testAllKeys() {
  console.log('Testing OpenWeather API keys...\n')
  
  for (const key of API_KEYS) {
    await testApiKey(key)
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n✅ Testing complete!')
}

testAllKeys()