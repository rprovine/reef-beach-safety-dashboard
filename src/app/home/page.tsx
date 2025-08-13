'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Shield, AlertTriangle, Activity, Sun, Fish, Waves,
  Users, Map, Bell, TrendingUp, Award, Heart,
  ChevronRight, Check, Star, ArrowRight, Zap,
  Droplets, Wind, Thermometer, Eye, Clock, Phone, Camera
} from 'lucide-react'

export default function HomePage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [topBeaches, setTopBeaches] = useState<any[]>([])
  const [currentConditions, setCurrentConditions] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real analytics data
    fetch('/api/analytics?period=24h')
      .then(res => res.json())
      .then(data => {
        setAnalyticsData(data)
        // Get top beaches
        if (data.topBeaches) {
          setTopBeaches(data.topBeaches.slice(0, 3))
          
          // Fetch current conditions for top beaches
          Promise.all(
            data.topBeaches.slice(0, 3).map((beach: any) =>
              fetch(`/api/beaches/${beach.slug}/comprehensive`)
                .then(res => res.json())
                .catch(() => null)
            )
          ).then(conditions => {
            const condMap: any = {}
            conditions.forEach((cond, idx) => {
              if (cond && data.topBeaches[idx]) {
                condMap[data.topBeaches[idx].slug] = cond
              }
            })
            setCurrentConditions(condMap)
          })
        }
      })
      .catch(err => console.error('Error fetching analytics:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ocean-500 via-ocean-600 to-ocean-700 pt-20">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-white bg-white/20 backdrop-blur rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
              Live data from {analyticsData?.overview?.totalBeaches || 71} Hawaii beaches
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Beach Hui
              <span className="block text-3xl md:text-4xl mt-2 text-ocean-100">
                Hawaii's Premier Beach & Reef Safety Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Real-time conditions, reef health monitoring, UV warnings, and marine life tracking. 
              Powered by NOAA, OpenWeather, and community reports.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/beaches"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-ocean-600 font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all w-auto"
              >
                View Live Beaches
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/30 transition-all w-auto"
              >
                Get Started Free
              </Link>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">
                  {analyticsData?.overview?.totalBeaches || 71}
                </div>
                <div className="text-sm text-white/80">Beaches Monitored</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">
                  {analyticsData?.overview?.statusCounts?.safe || 45}
                </div>
                <div className="text-sm text-white/80">Safe Right Now</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">
                  {analyticsData?.overview?.avgSafetyScore || 82}%
                </div>
                <div className="text-sm text-white/80">Avg Safety Score</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/80">Live Updates</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Beaches Section (Live Data) */}
      {topBeaches.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Beaches Right Now
              </h2>
              <p className="text-lg text-gray-600">
                Live conditions from Hawaii's most visited beaches today
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {topBeaches.map((beach) => {
                const conditions = currentConditions[beach.slug]
                return (
                  <Link
                    key={beach.slug}
                    href={`/beaches/${beach.slug}`}
                    className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-ocean-600 transition-colors">
                          {beach.name}
                        </h3>
                        <p className="text-sm text-gray-600">{beach.island}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        beach.safety >= 80 ? 'bg-green-100 text-green-800' :
                        beach.safety >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {beach.safety}% Safe
                      </span>
                    </div>

                    {conditions && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Waves className="h-4 w-4 text-blue-500" />
                          <span>{conditions.currentConditions?.waveHeightFt || '--'} ft waves</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-gray-500" />
                          <span>{conditions.currentConditions?.windMph || '--'} mph</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          <span>{conditions.currentConditions?.waterTempF || '--'}°F</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-500" />
                          <span>UV {conditions.weatherData?.uvIndex || '--'}</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {beach.favorites || 0} favorites • {beach.views || 0} views today
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/beaches"
                className="inline-flex items-center text-ocean-600 hover:text-ocean-700 font-medium"
              >
                View All Beaches
                <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Core Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Beach & Reef Monitoring
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to stay safe and informed at Hawaii's beaches
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Real-time Conditions */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-ocean-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-ocean-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Conditions</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>NOAA wave & tide data</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Live buoy readings</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Water & air temperature</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Current & tide predictions</span>
                </li>
              </ul>
            </div>

            {/* Beach Webcams */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Beach Cameras</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>20+ Hawaii beach webcams</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>HD streaming views</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Crowd level monitoring</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Surf break conditions</span>
                </li>
              </ul>
            </div>

            {/* Safety Alerts */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Safety & Warnings</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Real-time UV index alerts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>High surf advisories</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Jellyfish & marine hazards</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Bacteria level monitoring</span>
                </li>
              </ul>
            </div>

            {/* Weather Integration */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Sun className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Weather Integration</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>OpenWeather API live data</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>7-day weather forecasts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Marine weather conditions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Storm & wind warnings</span>
                </li>
              </ul>
            </div>

            {/* Reef Monitoring */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Fish className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Reef Health Dashboard</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Coral coverage tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Water quality metrics</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Marine biodiversity data</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Protected species alerts</span>
                </li>
              </ul>
            </div>

            {/* Smart Alerts */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Alerts</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Custom condition alerts</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Email notifications</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>SMS alerts (Pro)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Push notifications (Pro)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      {analyticsData?.recentIncidents && analyticsData.recentIncidents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Recent Beach Activity
              </h2>
              <p className="text-lg text-gray-600">
                Latest updates and incidents from Hawaii beaches
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsData.recentIncidents.slice(0, 6).map((incident: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      incident.severity === 'high' ? 'bg-red-100' :
                      incident.severity === 'medium' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        incident.severity === 'high' ? 'text-red-600' :
                        incident.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{incident.beach}</h4>
                      <p className="text-sm text-gray-600 mt-1">{incident.type}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(incident.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you need more features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for casual beach-goers</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg font-normal text-gray-600">/month</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>View all beach conditions</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>3 beach alerts</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic weather data</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Community reports</span>
                </li>
              </ul>
              
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-xl p-8 text-white relative">
              <div className="absolute -top-4 right-8 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-white/90 mb-6">For beach enthusiasts & professionals</p>
              <div className="text-4xl font-bold mb-6">$9<span className="text-lg font-normal">/month</span></div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>Unlimited alerts</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>SMS & push notifications</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>7-day forecasts</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>Historical data & trends</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>API access (100 calls/day)</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Link
                href="/auth/signup"
                className="block w-full text-center px-6 py-3 bg-white text-yellow-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Start Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ocean-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Stay Safe at the Beach?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of beach-goers who trust Beach Hui for real-time safety information
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/beaches"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-ocean-600 font-semibold rounded-full hover:bg-gray-50 transition-colors"
            >
              View Beaches Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-ocean-700 text-white font-semibold rounded-full hover:bg-ocean-800 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}