'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Waves, Shield, Building2, Users, LogOut, Bell, Heart, 
  TrendingUp, Map, Code, AlertCircle, Check, X, 
  Calendar, Fish, Siren, Share2, Download, Globe,
  BarChart3, Zap, Crown, Star
} from 'lucide-react'

interface User {
  email: string
  tier: string
  name: string
  features: string[]
}

const tierFeatures = {
  free: {
    icon: Waves,
    color: 'bg-gray-100 text-gray-800',
    borderColor: 'border-gray-300',
    features: [
      { name: 'View Beach Conditions', available: true, icon: Map },
      { name: '3 Favorite Beaches', available: true, icon: Heart },
      { name: 'Basic Alerts', available: true, icon: Bell },
      { name: 'Advanced Alerts', available: false, icon: Bell },
      { name: '7-Day Forecast', available: false, icon: Calendar },
      { name: 'Marine Life Calendar', available: false, icon: Fish },
      { name: 'API Access', available: false, icon: Code },
      { name: 'Embeddable Widgets', available: false, icon: Globe },
      { name: 'Emergency Features', available: false, icon: Siren },
      { name: 'Offline Mode', available: false, icon: Download }
    ]
  },
  consumer: {
    icon: Shield,
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-blue-300',
    features: [
      { name: 'View Beach Conditions', available: true, icon: Map },
      { name: 'Unlimited Favorites', available: true, icon: Heart },
      { name: 'Advanced Alerts', available: true, icon: Bell },
      { name: '7-Day Forecast', available: true, icon: Calendar },
      { name: 'Marine Life Calendar', available: true, icon: Fish },
      { name: 'Community Reports', available: true, icon: Users },
      { name: 'API Access', available: false, icon: Code },
      { name: 'Embeddable Widgets', available: false, icon: Globe },
      { name: 'Emergency Features', available: true, icon: Siren },
      { name: 'Offline Mode', available: true, icon: Download }
    ]
  },
  business: {
    icon: Building2,
    color: 'bg-purple-100 text-purple-800',
    borderColor: 'border-purple-300',
    features: [
      { name: 'View Beach Conditions', available: true, icon: Map },
      { name: 'Unlimited Favorites', available: true, icon: Heart },
      { name: 'Advanced Alerts', available: true, icon: Bell },
      { name: '7-Day Forecast', available: true, icon: Calendar },
      { name: 'Marine Life Calendar', available: true, icon: Fish },
      { name: 'Community Reports', available: true, icon: Users },
      { name: 'API Access (1000 req/day)', available: true, icon: Code },
      { name: 'Embeddable Widgets', available: true, icon: Globe },
      { name: 'Analytics Dashboard', available: true, icon: BarChart3 },
      { name: 'Priority Support', available: true, icon: Zap }
    ]
  },
  enterprise: {
    icon: Users,
    color: 'bg-orange-100 text-orange-800',
    borderColor: 'border-orange-300',
    features: [
      { name: 'Everything in Business', available: true, icon: Crown },
      { name: 'Unlimited API Access', available: true, icon: Code },
      { name: 'Custom Integrations', available: true, icon: Zap },
      { name: 'White Label Options', available: true, icon: Globe },
      { name: 'SLA Guarantee', available: true, icon: Shield },
      { name: 'Dedicated Support', available: true, icon: Star },
      { name: 'Custom Data Sources', available: true, icon: BarChart3 },
      { name: 'Advanced Analytics', available: true, icon: TrendingUp },
      { name: 'Team Management', available: true, icon: Users },
      { name: 'Custom Features', available: true, icon: Crown }
    ]
  }
}

const sampleAlerts = [
  { id: 1, beach: 'Waikiki Beach', condition: 'Wave Height > 4ft', status: 'active' },
  { id: 2, beach: 'Sunset Beach', condition: 'High Surf Advisory', status: 'triggered' },
  { id: 3, beach: 'Hanauma Bay', condition: 'Bacteria Level Alert', status: 'active' }
]

const favoriteBeaches = [
  { id: 1, name: 'Waikiki Beach', island: 'Oahu', status: 'good' },
  { id: 2, name: 'Sunset Beach', island: 'Oahu', status: 'caution' },
  { id: 3, name: 'Hanauma Bay', island: 'Oahu', status: 'good' }
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-500"></div>
      </div>
    )
  }

  if (!user) return null

  const tierConfig = tierFeatures[user.tier as keyof typeof tierFeatures] || tierFeatures.free
  const TierIcon = tierConfig.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/beaches" className="flex items-center gap-2 group">
                <Waves className="h-8 w-8 text-ocean-600 group-hover:scale-105 transition-transform" />
                <h1 className="text-2xl font-bold text-gray-900">Reef Beach Safety</h1>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full ${tierConfig.color} font-medium text-sm`}>
                <TierIcon className="h-4 w-4 inline mr-1" />
                {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Tier
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600">
            You're currently on the <span className="font-semibold">{user.tier}</span> plan.
            {user.tier === 'free' && ' Upgrade to unlock more features!'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link
                  href="/beaches"
                  className="p-4 bg-ocean-50 rounded-lg hover:bg-ocean-100 transition-colors text-center group"
                >
                  <Map className="h-6 w-6 text-ocean-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900">View Beaches</span>
                </Link>
                
                <button
                  className={`p-4 rounded-lg transition-colors text-center group ${
                    user.tier !== 'free' 
                      ? 'bg-blue-50 hover:bg-blue-100' 
                      : 'bg-gray-50 cursor-not-allowed opacity-50'
                  }`}
                  disabled={user.tier === 'free'}
                >
                  <Bell className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">Manage Alerts</span>
                </button>
                
                <button
                  className={`p-4 rounded-lg transition-colors text-center group ${
                    user.tier === 'business' || user.tier === 'enterprise'
                      ? 'bg-purple-50 hover:bg-purple-100' 
                      : 'bg-gray-50 cursor-not-allowed opacity-50'
                  }`}
                  disabled={user.tier !== 'business' && user.tier !== 'enterprise'}
                >
                  <Globe className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">Widgets</span>
                </button>
                
                <button
                  className={`p-4 rounded-lg transition-colors text-center group ${
                    user.tier === 'business' || user.tier === 'enterprise'
                      ? 'bg-green-50 hover:bg-green-100' 
                      : 'bg-gray-50 cursor-not-allowed opacity-50'
                  }`}
                  disabled={user.tier !== 'business' && user.tier !== 'enterprise'}
                >
                  <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-gray-900">Analytics</span>
                </button>
              </div>
            </div>

            {/* Favorite Beaches */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Favorite Beaches</h3>
                <Link href="/beaches" className="text-ocean-600 hover:text-ocean-700 text-sm">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-3">
                {favoriteBeaches.map((beach) => (
                  <Link
                    key={beach.id}
                    href={`/beaches/${beach.name.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{beach.name}</p>
                      <p className="text-sm text-gray-600">{beach.island}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      beach.status === 'good' ? 'bg-green-100 text-green-800' :
                      beach.status === 'caution' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {beach.status}
                    </span>
                  </Link>
                ))}
                {user.tier === 'free' && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    Upgrade to add unlimited favorites
                  </p>
                )}
              </div>
            </div>

            {/* Active Alerts */}
            {user.tier !== 'free' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
                  <button className="text-ocean-600 hover:text-ocean-700 text-sm">
                    Manage →
                  </button>
                </div>
                
                <div className="space-y-3">
                  {sampleAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          alert.status === 'triggered' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <AlertCircle className={`h-4 w-4 ${
                            alert.status === 'triggered' ? 'text-red-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{alert.beach}</p>
                          <p className="text-sm text-gray-600">{alert.condition}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'triggered' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Plan Features */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Plan Features</h3>
              <div className="space-y-2">
                {tierConfig.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      feature.available ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`p-1 rounded ${
                      feature.available ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      {feature.available ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <feature.icon className={`h-4 w-4 ${
                      feature.available ? 'text-gray-700' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm ${
                      feature.available ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
              
              {user.tier !== 'enterprise' && (
                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white rounded-lg hover:from-ocean-600 hover:to-ocean-700 transition-all font-medium">
                  Upgrade Plan
                </button>
              )}
            </div>

            {/* API Usage (Business/Enterprise) */}
            {(user.tier === 'business' || user.tier === 'enterprise') && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Usage</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Requests Today</span>
                      <span className="font-medium">247 / {user.tier === 'enterprise' ? '∞' : '1000'}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-ocean-600 h-2 rounded-full" style={{ width: '24.7%' }}></div>
                    </div>
                  </div>
                  <button className="text-ocean-600 hover:text-ocean-700 text-sm font-medium">
                    View API Docs →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}