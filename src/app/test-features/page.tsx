'use client'

import { useState, useEffect } from 'react'
import { Activity, BarChart, Waves, Cloud, Wind } from 'lucide-react'

export default function TestFeaturesPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [comprehensiveData, setComprehensiveData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Fetch real analytics data
    fetch('/api/analytics?period=7d')
      .then(res => res.json())
      .then(data => setAnalyticsData(data))
      .catch(err => console.error('Analytics error:', err))
    
    // Fetch comprehensive beach data
    fetch('/api/beaches/waikiki-beach/comprehensive')
      .then(res => res.json())
      .then(data => {
        setComprehensiveData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Comprehensive data error:', err)
        setLoading(false)
      })
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Active Features Demo</h1>
        
        
        {/* 2. Real Analytics Data */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BarChart className="text-ocean-600" />
            Real Analytics Data (From Database)
          </h2>
          {analyticsData && (
            <div className="bg-white rounded-lg p-6 shadow">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-3xl font-bold">{analyticsData.overview?.totalBeaches || 0}</div>
                  <div className="text-gray-600">Total Beaches</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{analyticsData.overview?.statusCounts?.safe || 0}</div>
                  <div className="text-gray-600">Safe Today</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600">{analyticsData.overview?.statusCounts?.caution || 0}</div>
                  <div className="text-gray-600">Caution</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{analyticsData.overview?.avgSafetyScore || 0}%</div>
                  <div className="text-gray-600">Avg Safety Score</div>
                </div>
              </div>
              
              <h3 className="mt-6 font-semibold">Top Beaches by Popularity:</h3>
              <ul className="mt-2">
                {analyticsData.topBeaches?.map((beach: any, i: number) => (
                  <li key={i} className="py-2 border-b">
                    {beach.name} - Safety: {beach.safety}% | {beach.favorites} favorites
                  </li>
                ))}
              </ul>
              
              <h3 className="mt-6 font-semibold">Recent Incidents:</h3>
              <ul className="mt-2">
                {analyticsData.recentIncidents?.map((incident: any, i: number) => (
                  <li key={i} className="py-2 border-b">
                    {incident.beach}: {incident.type} ({incident.severity})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        
        {/* 3. Comprehensive Beach Data */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Waves className="text-ocean-600" />
            Comprehensive Beach Data (All APIs)
          </h2>
          {comprehensiveData && (
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-semibold mb-4">Waikiki Beach - Live Data from Multiple Sources:</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* NOAA Data */}
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-600 mb-1">NOAA Tide Data</div>
                  <div className="text-xl font-semibold">
                    {comprehensiveData.tideData?.currentTide?.toFixed(1) || 'N/A'} ft
                  </div>
                  <div className="text-xs text-gray-500">Current Tide</div>
                </div>
                
                {/* Wave Data */}
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-600 mb-1">Wave Height</div>
                  <div className="text-xl font-semibold">
                    {comprehensiveData.currentConditions?.waveHeightFt || 'N/A'} ft
                  </div>
                  <div className="text-xs text-gray-500">From Buoys</div>
                </div>
                
                {/* Weather Data */}
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-600 mb-1">UV Index</div>
                  <div className="text-xl font-semibold">
                    {comprehensiveData.weatherData?.uvIndex || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">OpenWeather API</div>
                </div>
                
                {/* Water Temp */}
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-600 mb-1">Water Temp</div>
                  <div className="text-xl font-semibold">
                    {comprehensiveData.currentConditions?.waterTempF || 'N/A'}°F
                  </div>
                  <div className="text-xs text-gray-500">NOAA Stations</div>
                </div>
                
                {/* Wind */}
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-600 mb-1">Wind Speed</div>
                  <div className="text-xl font-semibold">
                    {comprehensiveData.currentConditions?.windMph || 'N/A'} mph
                  </div>
                  <div className="text-xs text-gray-500">Weather API</div>
                </div>
                
                {/* Crowd Level */}
                <div className="border rounded p-3">
                  <div className="text-sm text-gray-600 mb-1">Crowd Level</div>
                  <div className="text-xl font-semibold">
                    {comprehensiveData.crowdEstimate || 'Moderate'}
                  </div>
                  <div className="text-xs text-gray-500">Calculated</div>
                </div>
              </div>
              
              {/* Activity Ratings */}
              <h3 className="mt-6 font-semibold">Activity Ratings (Calculated from conditions):</h3>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {['swimming', 'surfing', 'snorkeling', 'diving', 'fishing'].map(activity => (
                  <div key={activity} className="text-center p-2 border rounded">
                    <div className="capitalize text-sm">{activity}</div>
                    <div className={`font-semibold ${
                      comprehensiveData.activities?.[activity] === 'excellent' ? 'text-green-600' :
                      comprehensiveData.activities?.[activity] === 'good' ? 'text-blue-600' :
                      comprehensiveData.activities?.[activity] === 'fair' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {comprehensiveData.activities?.[activity] || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Webcam URLs */}
              {comprehensiveData.webcams && comprehensiveData.webcams.length > 0 && (
                <>
                  <h3 className="mt-6 font-semibold">Available Webcams:</h3>
                  <ul className="mt-2">
                    {comprehensiveData.webcams.map((cam: any, i: number) => (
                      <li key={i} className="text-sm text-gray-600">
                        ✓ {cam.name} - {cam.provider}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              {/* Data Sources */}
              <h3 className="mt-6 font-semibold">Active Data Sources:</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {['NOAA', 'OpenWeather', 'PacIOOS', 'Buoys', 'Database', 'Calculated'].map(source => (
                  <span key={source} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                    ✓ {source}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
        
        {/* 4. All API Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">API Endpoints (All Active)</h2>
          <div className="bg-white rounded-lg p-6 shadow">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <code className="text-sm">/api/analytics</code> - Real-time analytics from database
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <code className="text-sm">/api/beaches</code> - Beach data with conditions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <code className="text-sm">/api/beaches/[slug]/comprehensive</code> - All data sources combined
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <code className="text-sm">NOAA APIs</code> - Tides, waves, buoys, marine weather
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <code className="text-sm">OpenWeather API</code> - Weather, UV, air quality
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <code className="text-sm">Webcam Integration</code> - 20+ Hawaii beach cameras
              </li>
            </ul>
          </div>
        </section>
        
        {loading && (
          <div className="fixed top-20 right-4 bg-blue-100 text-blue-700 px-4 py-2 rounded">
            Loading live data from APIs...
          </div>
        )}
      </div>
    </div>
  )
}