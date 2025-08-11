'use client'

import { 
  Thermometer, Droplets, Wind, Eye, Cloud, 
  Sun, Sunrise, Sunset, AlertTriangle, Waves,
  Gauge, Navigation, TrendingUp, TrendingDown
} from 'lucide-react'
import { formatWeatherDisplay } from '@/lib/openweather'

interface WeatherDisplayProps {
  weather: any
  activities?: {
    swimming: string
    surfing: string
    snorkeling: string
  }
  forecast?: any[]
}

export function WeatherDisplay({ weather, activities, forecast }: WeatherDisplayProps) {
  if (!weather) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-500">
          <Cloud className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Weather data unavailable</p>
        </div>
      </div>
    )
  }

  const display = formatWeatherDisplay(weather)
  
  // UV Index color and warning
  const getUVColor = (index: number) => {
    if (index <= 2) return 'text-green-600 bg-green-50'
    if (index <= 5) return 'text-yellow-600 bg-yellow-50'
    if (index <= 7) return 'text-orange-600 bg-orange-50'
    if (index <= 10) return 'text-red-600 bg-red-50'
    return 'text-purple-600 bg-purple-50'
  }

  const getUVWarning = (index: number) => {
    if (index <= 2) return 'Minimal protection needed'
    if (index <= 5) return 'Hat and sunscreen recommended'
    if (index <= 7) return 'Protection required - hat, sunscreen, seek shade'
    if (index <= 10) return 'Extra protection needed - avoid midday sun'
    return 'EXTREME - Avoid sun exposure 10am-4pm!'
  }

  return (
    <div className="space-y-6">
      {/* Current Conditions Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-ocean-500 to-ocean-600 p-6">
          <h2 className="text-xl font-bold text-white mb-2">Current Conditions</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white">
                {Math.round(weather.temperature)}°C
              </div>
              <div className="text-ocean-100">
                Feels like {Math.round(weather.feelsLike)}°C
              </div>
              <div className="text-ocean-100 mt-1 capitalize">
                {weather.description}
              </div>
            </div>
            <div className="text-right">
              <img 
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                className="h-20 w-20"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Wind className="h-4 w-4" />
                Wind
              </div>
              <div className="font-semibold text-gray-900">
                {Math.round(weather.windSpeed * 2.237)} mph
              </div>
              <div className="text-xs text-gray-500">
                {weather.windDirection}° 
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Droplets className="h-4 w-4" />
                Humidity
              </div>
              <div className="font-semibold text-gray-900">
                {weather.humidity}%
              </div>
              <div className="text-xs text-gray-500">
                {weather.humidity > 70 ? 'High' : weather.humidity > 40 ? 'Moderate' : 'Low'}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Eye className="h-4 w-4" />
                Visibility
              </div>
              <div className="font-semibold text-gray-900">
                {(weather.visibility / 1000).toFixed(1)} km
              </div>
              <div className="text-xs text-gray-500">
                {weather.visibility >= 10000 ? 'Excellent' : weather.visibility >= 5000 ? 'Good' : 'Limited'}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Gauge className="h-4 w-4" />
                Pressure
              </div>
              <div className="font-semibold text-gray-900">
                {weather.pressure} mb
              </div>
              <div className="text-xs text-gray-500">
                {weather.pressure > 1020 ? 'High' : weather.pressure > 1010 ? 'Normal' : 'Low'}
              </div>
            </div>
          </div>

          {/* UV Index Alert */}
          {weather.uvIndex !== undefined && (
            <div className={`rounded-lg p-4 mb-6 ${getUVColor(weather.uvIndex)}`}>
              <div className="flex items-start gap-3">
                <Sun className="h-6 w-6 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">UV Index</span>
                    <span className="text-2xl font-bold">{weather.uvIndex}</span>
                  </div>
                  <div className="text-sm font-medium mb-1">
                    {weather.uvIndex <= 2 ? 'Low' :
                     weather.uvIndex <= 5 ? 'Moderate' :
                     weather.uvIndex <= 7 ? 'High' :
                     weather.uvIndex <= 10 ? 'Very High' :
                     'EXTREME'}
                  </div>
                  <div className="text-sm opacity-90">
                    {getUVWarning(weather.uvIndex)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sun Times */}
          <div className="flex items-center justify-around py-4 border-t border-b">
            <div className="flex items-center gap-2">
              <Sunrise className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-xs text-gray-600">Sunrise</div>
                <div className="font-semibold">
                  {weather.sunrise.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sunset className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-xs text-gray-600">Sunset</div>
                <div className="font-semibold">
                  {weather.sunset.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Conditions */}
          {activities && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Activity Conditions</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Waves className="h-6 w-6 mx-auto mb-1 text-ocean-500" />
                  <div className="text-sm font-medium text-gray-700">Swimming</div>
                  <div className={`text-sm font-semibold mt-1 ${
                    activities.swimming === 'excellent' ? 'text-green-600' :
                    activities.swimming === 'good' ? 'text-blue-600' :
                    activities.swimming === 'fair' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {activities.swimming.toUpperCase()}
                  </div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Waves className="h-6 w-6 mx-auto mb-1 text-ocean-500" />
                  <div className="text-sm font-medium text-gray-700">Surfing</div>
                  <div className={`text-sm font-semibold mt-1 ${
                    activities.surfing === 'excellent' ? 'text-green-600' :
                    activities.surfing === 'good' ? 'text-blue-600' :
                    activities.surfing === 'fair' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {activities.surfing.toUpperCase()}
                  </div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Eye className="h-6 w-6 mx-auto mb-1 text-ocean-500" />
                  <div className="text-sm font-medium text-gray-700">Snorkeling</div>
                  <div className={`text-sm font-semibold mt-1 ${
                    activities.snorkeling === 'excellent' ? 'text-green-600' :
                    activities.snorkeling === 'good' ? 'text-blue-600' :
                    activities.snorkeling === 'fair' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {activities.snorkeling.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7-Day Forecast */}
      {forecast && forecast.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">7-Day Forecast</h3>
          <div className="space-y-3">
            {forecast.map((day, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm text-gray-600 capitalize">
                    {day.condition}
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">
                        {Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {Math.round(day.windSpeed)} mph
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {Math.round(day.humidity)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Warnings */}
      {weather.uvIndex > 10 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-900 mb-1">Extreme UV Warning</div>
              <div className="text-sm text-red-700">
                UV levels are dangerously high. Avoid sun exposure between 10 AM and 4 PM. 
                Wear protective clothing, use SPF 50+ reef-safe sunscreen, and seek shade frequently.
              </div>
            </div>
          </div>
        </div>
      )}

      {weather.windSpeed > 15 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Wind className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-yellow-900 mb-1">High Wind Advisory</div>
              <div className="text-sm text-yellow-700">
                Strong winds of {Math.round(weather.windSpeed * 2.237)} mph may create hazardous conditions. 
                Exercise caution when swimming and be aware of increased wave action.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}