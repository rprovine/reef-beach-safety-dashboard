'use client'

import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

export default function APITestPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [timestamp, setTimestamp] = useState<string>('')
  
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/beaches')
      const beaches = await response.json()
      setData(beaches.slice(0, 5)) // Just show first 5 beaches
      setTimestamp(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }
  
  useEffect(() => {
    fetchData()
    // Auto-refresh every 30 seconds to show data is live
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="min-h-screen pt-20 p-8">
      <h1 className="text-3xl font-bold mb-4">Live API Data Test</h1>
      
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <button
          onClick={() => {
            // Set trial user - rprovine@gmail.com
            localStorage.clear() // Clear everything first
            
            const trialEndDate = new Date()
            trialEndDate.setDate(trialEndDate.getDate() + 14) // 14 days from now
            
            const trialUser = {
              id: 'cmeaf4ghj0000s3n4amknioq',
              email: 'rprovine@gmail.com',
              tier: 'free',
              subscriptionStatus: 'trial',
              trialEndDate: trialEndDate.toISOString(),
              createdAt: new Date().toISOString()
            }
            
            localStorage.setItem('beach-hui-token', 'demo-token')
            localStorage.setItem('beach-hui-user', JSON.stringify(trialUser))
            localStorage.setItem('auth-token', 'demo-token')
            localStorage.setItem('user-email', trialUser.email)
            localStorage.setItem('user-tier', trialUser.tier)
            
            alert('rprovine@gmail.com trial user set with 14 days trial! Click OK to reload.')
            window.location.reload()
          }}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
        >
          🚀 SET rprovine@gmail.com TRIAL
        </button>
        
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
        <span className="text-gray-600">Last updated: {timestamp}</span>
      </div>
      
      <div className="space-y-4">
        {data.map((beach, index) => (
          <div key={beach.id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{beach.name}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Wave Height</div>
                <div className="text-lg font-bold">{beach.currentConditions?.waveHeightFt} ft</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Wind Speed</div>
                <div className="text-lg font-bold">{beach.currentConditions?.windMph} mph</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">UV Index</div>
                <div className="text-lg font-bold">{beach.currentConditions?.uvIndex}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Water Temp</div>
                <div className="text-lg font-bold">{beach.currentConditions?.waterTempF}°F</div>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              Data Sources: 
              Weather: {beach.currentConditions?.source?.weather || 'N/A'} | 
              Marine: {beach.currentConditions?.source?.marine || 'N/A'} | 
              Tide: {beach.currentConditions?.source?.tide || 'N/A'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-blue-50 p-4 rounded">
        <h3 className="font-semibold mb-2">API Status:</h3>
        <ul className="space-y-1 text-sm">
          <li>✅ OpenWeather API: Working (real weather, UV index)</li>
          <li>❌ StormGlass API: Payment Required (quota exceeded)</li>
          <li>✅ NOAA API: Working (real tide data)</li>
          <li>✅ Database: Fallback when APIs unavailable</li>
        </ul>
        <p className="mt-2 text-sm text-gray-600">
          Note: Data refreshes automatically every 30 seconds to demonstrate live updates.
        </p>
      </div>
    </div>
  )
}