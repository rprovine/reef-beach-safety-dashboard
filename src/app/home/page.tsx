'use client'

import Link from 'next/link'
import { 
  Shield, AlertTriangle, Activity, Sun, Fish, Waves,
  Users, Map, Bell, TrendingUp, Award, Heart,
  ChevronRight, Check, Star, ArrowRight, Zap,
  Droplets, Wind, Thermometer, Eye, Clock, Phone
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ocean-500 via-ocean-600 to-ocean-700 pt-20">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-white bg-white/20 backdrop-blur rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
              Live data from 71 Hawaii beaches
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Beach Hui
              <span className="block text-3xl md:text-4xl mt-2 text-ocean-100">
                Hawaii's Premier Beach & Reef Safety Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Real-time conditions, reef health monitoring, UV warnings, and marine life tracking. 
              Powered by OpenWeather, NOAA, and community reports.
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

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">71</div>
                <div className="text-sm text-white/80">Beaches Monitored</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/80">Real-time Updates</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">UV 11+</div>
                <div className="text-sm text-white/80">Extreme UV Alerts</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold text-white">5-Tab</div>
                <div className="text-sm text-white/80">Reef Dashboard</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  <span>Wave height & surf reports</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Wind speed & direction</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Water & air temperature</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Tide charts & predictions</span>
                </li>
              </ul>
            </div>

            {/* Reef Health Monitoring */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Fish className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Reef Health Dashboard</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Coral coverage & bleaching status</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Ocean acidification (pH levels)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Marine biodiversity tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Protected species alerts</span>
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
                  <span>Extreme UV index warnings (11-12)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Bacteria level monitoring</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Jellyfish & marine hazards</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Rip current risk assessment</span>
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
                  <span>Humidity & pressure tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Sunrise & sunset times</span>
                </li>
              </ul>
            </div>

            {/* Family Features */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Family Friendly</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Age-appropriate ratings</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Amenity information</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Accessibility details</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Best times for families</span>
                </li>
              </ul>
            </div>

            {/* Activity Ratings */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Waves className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Activity Conditions</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Swimming conditions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Surfing wave quality</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Snorkeling visibility</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Fishing recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted Data Sources
            </h2>
            <p className="text-xl text-gray-600">
              Real-time data from official sources and APIs
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-50 rounded-xl p-6 mb-4">
                <Sun className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900">OpenWeather</h3>
              <p className="text-sm text-gray-600 mt-2">Live weather & UV data</p>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-xl p-6 mb-4">
                <Waves className="h-12 w-12 text-green-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900">NOAA</h3>
              <p className="text-sm text-gray-600 mt-2">Tides & marine data</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-50 rounded-xl p-6 mb-4">
                <Droplets className="h-12 w-12 text-purple-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900">Hawaii DOH</h3>
              <p className="text-sm text-gray-600 mt-2">Water quality testing</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-50 rounded-xl p-6 mb-4">
                <Users className="h-12 w-12 text-orange-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900">Community</h3>
              <p className="text-sm text-gray-600 mt-2">Real-time reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Beach Hui */}
      <section className="py-20 bg-gradient-to-br from-ocean-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Beach Hui?
            </h2>
            <p className="text-xl text-gray-600">
              The most comprehensive beach safety platform for Hawaii
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-ocean-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-ocean-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Real-time Updates</h3>
                  <p className="text-gray-600 mt-1">
                    Conditions update every 10-30 minutes from multiple data sources
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Safety First</h3>
                  <p className="text-gray-600 mt-1">
                    Comprehensive safety scores based on multiple factors
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Conservation Focus</h3>
                  <p className="text-gray-600 mt-1">
                    Reef health monitoring and marine ecosystem protection
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Hawaii Specific</h3>
                  <p className="text-gray-600 mt-1">
                    Built specifically for Hawaii's unique conditions and beaches
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Coverage Across Hawaii
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Oʻahu</span>
                  <span className="font-semibold text-ocean-600">15 beaches</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Maui</span>
                  <span className="font-semibold text-ocean-600">15 beaches</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Kauaʻi</span>
                  <span className="font-semibold text-ocean-600">14 beaches</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Big Island</span>
                  <span className="font-semibold text-ocean-600">19 beaches</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Molokai</span>
                  <span className="font-semibold text-ocean-600">5 beaches</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Lanai</span>
                  <span className="font-semibold text-ocean-600">3 beaches</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Coverage</span>
                    <span className="font-bold text-ocean-600 text-xl">71 beaches</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-ocean-500 to-ocean-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Experience Beach Hui?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of locals and visitors who trust Beach Hui for real-time beach safety information
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/beaches"
              className="inline-flex items-center px-8 py-4 bg-white text-ocean-600 font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Explore Beaches Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/30 transition-all"
            >
              Try Demo Account
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <p className="text-white/70 text-sm mt-8">
            No credit card required • Free tier available • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Beach Hui</h3>
              <p className="text-gray-400 text-sm">
                Hawaii's premier beach and reef safety platform
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/beaches" className="hover:text-white">Beach Conditions</Link></li>
                <li><Link href="/api-docs" className="hover:text-white">API Access</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">
                LeniLani Consulting<br />
                Email: info@lenilani.com<br />
                Website: lenilani.com
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            © 2025 LeniLani Consulting. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}