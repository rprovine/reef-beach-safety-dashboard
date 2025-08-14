'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Waves, Shield, Building2, Users, LogOut, Bell, Heart, 
  TrendingUp, Map, Code, AlertCircle, Check, X, 
  Calendar, Fish, Siren, Share2, Download, Globe,
  BarChart3, Zap, Crown, Star, Wind, Thermometer, Eye
} from 'lucide-react'
import { ReferralSystem } from '@/components/referral-system'
import { SocialShare } from '@/components/social-share'
import { getUserAccessLevel } from '@/lib/access-control'

interface User {
  email: string
  tier: string
  name: string
  features: string[]
  trialEndDate?: string
  subscriptionStatus?: string
}

const tierFeatures = {
  free: {
    icon: Waves,
    color: 'bg-gray-100 text-gray-800',
    borderColor: 'border-gray-300',
    features: [
      { name: 'View Beach Conditions', available: true, icon: Map },
      { name: '3 Beach Alerts', available: true, icon: Bell },
      { name: 'Basic Weather Data', available: true, icon: Calendar },
      { name: 'Community Reports', available: true, icon: Users },
      { name: '7-Day Forecast', available: false, icon: Calendar },
      { name: 'Historical Trends', available: false, icon: TrendingUp },
      { name: 'SMS/Push Alerts', available: false, icon: Siren },
      { name: 'API Access', available: false, icon: Code },
      { name: 'Export Data', available: false, icon: Download },
      { name: 'Priority Support', available: false, icon: Zap }
    ]
  },
  pro: {
    icon: Crown,
    color: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white',
    borderColor: 'border-yellow-300',
    features: [
      { name: 'View Beach Conditions', available: true, icon: Map },
      { name: 'Unlimited Alerts', available: true, icon: Bell },
      { name: '7-Day Forecast', available: true, icon: Calendar },
      { name: 'Historical Trends', available: true, icon: TrendingUp },
      { name: 'SMS/Push Alerts', available: true, icon: Siren },
      { name: 'Community Reports', available: true, icon: Users },
      { name: 'API Access (100/day)', available: true, icon: Code },
      { name: 'Export Data', available: true, icon: Download },
      { name: 'Priority Support', available: true, icon: Zap },
      { name: 'Advanced Analytics', available: true, icon: BarChart3 }
    ]
  },
  admin: {
    icon: Shield,
    color: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    borderColor: 'border-purple-300',
    features: [
      { name: 'Everything in Pro', available: true, icon: Crown },
      { name: 'Edit Beach Data', available: true, icon: Building2 },
      { name: 'Manage Reports', available: true, icon: Users },
      { name: 'User Management', available: true, icon: Users },
      { name: 'System Analytics', available: true, icon: BarChart3 },
      { name: 'Unlimited API Access', available: true, icon: Code },
      { name: 'Data Source Config', available: true, icon: Globe },
      { name: 'Emergency Overrides', available: true, icon: Siren },
      { name: 'Custom Features', available: true, icon: Star },
      { name: 'Direct Support', available: true, icon: Zap }
    ]
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [favoriteBeaches, setFavoriteBeaches] = useState<any[]>([])
  const [activeAlerts, setActiveAlerts] = useState<any[]>([])
  const [beachConditions, setBeachConditions] = useState<any>({})

  useEffect(() => {
    // Check for new auth format first
    const beachHuiToken = localStorage.getItem('beach-hui-token')
    const beachHuiUser = localStorage.getItem('beach-hui-user')
    
    if (beachHuiToken && beachHuiUser) {
      // New auth format (real users)
      const userData = JSON.parse(beachHuiUser)
      setUser({
        email: userData.email,
        tier: userData.tier || 'free',
        name: userData.name || userData.email.split('@')[0],
        features: tierFeatures[userData.tier as keyof typeof tierFeatures]?.features.filter(f => f.available).map(f => f.name) || [],
        trialEndDate: userData.trialEndDate,
        subscriptionStatus: userData.subscriptionStatus
      })
    } else {
      // Check old demo auth format
      const token = localStorage.getItem('auth-token')
      const email = localStorage.getItem('user-email')
      const tier = localStorage.getItem('user-tier')
      
      if (!token || !email || !tier) {
        router.push('/auth/signin')
        return
      }
      
      setUser({
        email,
        tier,
        name: email.split('@')[0],
        features: tierFeatures[tier as keyof typeof tierFeatures]?.features.filter(f => f.available).map(f => f.name) || []
      })
    }
  }, [router])

  // Fetch real data
  useEffect(() => {
    if (!user) return
    
    // Check access level for debugging
    const access = getUserAccessLevel(user)
    console.log('[Dashboard] User access level:', {
      hasUser: !!user,
      userTier: user.tier,
      isTrialing: user.trialEndDate && new Date() < new Date(user.trialEndDate) && user.tier === 'free',
      trialEndDate: user.trialEndDate,
      canViewConditions: access.beaches.viewCurrentConditions,
      canViewForecast: access.beaches.viewForecast
    })

    // Fetch analytics data
    fetch('/api/analytics-hybrid?period=7d')
      .then(res => res.json())
      .then(data => {
        console.log('[Dashboard] Analytics data:', data)
        setAnalyticsData(data)
      })
      .catch(err => console.error('Error fetching analytics:', err))

    // Fetch beaches and set favorites
    fetch('/api/beaches')
      .then(res => res.json())
      .then(beaches => {
        // Get user's favorite beaches from localStorage or use top 3
        const savedFavorites = localStorage.getItem(`favorites_${user.email}`)
        if (savedFavorites) {
          const favoriteIds = JSON.parse(savedFavorites)
          setFavoriteBeaches(beaches.filter((b: any) => favoriteIds.includes(b.id)).slice(0, 3))
        } else {
          // Default to top 3 beaches
          setFavoriteBeaches(beaches.slice(0, 3))
        }
        
        // Fetch conditions for favorite beaches
        Promise.all(
          beaches.slice(0, 3).map((beach: any) =>
            fetch(`/api/beaches/${beach.slug}/comprehensive`)
              .then(res => res.json())
              .catch(() => null)
          )
        ).then(conditions => {
          const conditionsMap: any = {}
          conditions.forEach((cond, idx) => {
            if (cond && beaches[idx]) {
              console.log(`[Dashboard] Beach ${beaches[idx].name} conditions:`, cond)
              conditionsMap[beaches[idx].slug] = cond
            }
          })
          setBeachConditions(conditionsMap)
        })
      })
      .catch(err => console.error('Error fetching beaches:', err))

    // Load alerts from localStorage
    const savedAlerts = localStorage.getItem(`alerts_${user.email || user.name}`)
    if (savedAlerts) {
      const alerts = JSON.parse(savedAlerts)
      setActiveAlerts(alerts.filter((a: any) => a.enabled))
    }

    setLoading(false)
  }, [user])

  const handleLogout = () => {
    // Clear all auth tokens
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-email')
    localStorage.removeItem('user-tier')
    localStorage.removeItem('beach-hui-token')
    localStorage.removeItem('beach-hui-user')
    router.push('/auth/signin')
  }

  const toggleFavorite = (beachId: string) => {
    if (!user) return
    
    const savedFavorites = localStorage.getItem(`favorites_${user.email}`) 
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : []
    
    if (favorites.includes(beachId)) {
      const newFavorites = favorites.filter((id: string) => id !== beachId)
      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(newFavorites))
    } else {
      favorites.push(beachId)
      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(favorites))
    }
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
    <div className="min-h-screen bg-gray-50 pt-16">
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
        {/* Welcome Section with Live Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-gray-600 mb-4">
            You're currently on the <span className="font-semibold">{user.tier}</span> plan.
            {user.tier === 'free' && ' Upgrade to unlock more features!'}
          </p>
          
          {/* Live Statistics */}
          {analyticsData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-ocean-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-ocean-700">{analyticsData.overview?.totalBeaches || 0}</div>
                <div className="text-sm text-ocean-600">Total Beaches</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-700">{analyticsData.overview?.statusCounts?.safe || 0}</div>
                <div className="text-sm text-green-600">Safe Today</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-700">{analyticsData.overview?.statusCounts?.caution || 0}</div>
                <div className="text-sm text-yellow-600">Caution</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-700">{analyticsData.overview?.avgSafetyScore || 0}%</div>
                <div className="text-sm text-blue-600">Avg Safety</div>
              </div>
            </div>
          )}
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
                
                <Link
                  href="/alerts"
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center group"
                >
                  <Bell className="h-6 w-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900">Manage Alerts</span>
                </Link>
                
                <Link
                  href="/community"
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center group"
                >
                  <Users className="h-6 w-6 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900">Community</span>
                </Link>
                
                <Link
                  href="/analytics"
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center group"
                >
                  <BarChart3 className="h-6 w-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-900">Analytics</span>
                </Link>
              </div>
            </div>

            {/* Favorite Beaches with Live Data */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Favorite Beaches</h3>
                <Link href="/beaches" className="text-ocean-600 hover:text-ocean-700 text-sm">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-3">
                {favoriteBeaches.length > 0 ? (
                  favoriteBeaches.map((beach) => {
                    const conditions = beachConditions[beach.slug]
                    return (
                      <Link
                        key={beach.id}
                        href={`/beaches/${beach.slug}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{beach.name}</p>
                          <p className="text-sm text-gray-600">{beach.island.charAt(0).toUpperCase() + beach.island.slice(1)}</p>
                          {conditions && conditions.conditions && (
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Waves className="h-3 w-3" />
                                {conditions.conditions.waveHeight ? Number(conditions.conditions.waveHeight).toFixed(1) : '--'} ft
                              </span>
                              <span className="flex items-center gap-1">
                                <Wind className="h-3 w-3" />
                                {conditions.conditions.windSpeed ? Number(conditions.conditions.windSpeed).toFixed(1) : '--'} mph
                              </span>
                              <span className="flex items-center gap-1">
                                <Thermometer className="h-3 w-3" />
                                {conditions.conditions.waterTemp ? Number(conditions.conditions.waterTemp).toFixed(0) : '--'}°F
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              toggleFavorite(beach.id)
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Heart className={`h-4 w-4 ${true ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                          </button>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            beach.currentStatus === 'good' ? 'bg-green-100 text-green-800' :
                            beach.currentStatus === 'caution' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {beach.currentStatus || 'good'}
                          </span>
                        </div>
                      </Link>
                    )
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No favorite beaches yet. Browse beaches to add favorites!
                  </p>
                )}
                {user.tier === 'free' && favoriteBeaches.length >= 3 && (
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
                  <Link href="/alerts" className="text-ocean-600 hover:text-ocean-700 text-sm">
                    Manage →
                  </Link>
                </div>
                
                <div className="space-y-3">
                  {activeAlerts.length > 0 ? (
                    activeAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            alert.lastTriggered && (Date.now() - new Date(alert.lastTriggered).getTime()) < 24*60*60*1000
                              ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            <AlertCircle className={`h-4 w-4 ${
                              alert.lastTriggered && (Date.now() - new Date(alert.lastTriggered).getTime()) < 24*60*60*1000
                                ? 'text-red-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {alert.beach.replace('-', ' ').split(' ').map((w: string) => 
                                w.charAt(0).toUpperCase() + w.slice(1)
                              ).join(' ')}
                            </p>
                            <p className="text-sm text-gray-600">{alert.condition} {alert.threshold}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.lastTriggered && (Date.now() - new Date(alert.lastTriggered).getTime()) < 24*60*60*1000
                            ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {alert.lastTriggered && (Date.now() - new Date(alert.lastTriggered).getTime()) < 24*60*60*1000
                            ? 'Triggered' : 'Active'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No active alerts. Create alerts to monitor beach conditions.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Referral System */}
            <ReferralSystem />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Plan */}
            <div className={`bg-white rounded-xl shadow-sm p-6 border-2 ${tierConfig.borderColor}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Plan</h3>
                <div className={`p-2 rounded-lg ${tierConfig.color}`}>
                  <TierIcon className="h-5 w-5" />
                </div>
              </div>
              
              <div className="space-y-2">
                {tierConfig.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {feature.available ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={`text-sm ${feature.available ? 'text-gray-900' : 'text-gray-400'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
              
              {user.tier === 'free' && (
                <Link
                  href="/pricing"
                  className="block w-full mt-6 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600 text-center"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>

            {/* Recent Activity */}
            {analyticsData?.recentIncidents && analyticsData.recentIncidents.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Incidents</h3>
                <div className="space-y-3">
                  {analyticsData.recentIncidents.slice(0, 5).map((incident: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <AlertCircle className={`h-4 w-4 mt-0.5 ${
                        incident.severity === 'high' ? 'text-red-600' :
                        incident.severity === 'medium' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{incident.beach}</p>
                        <p className="text-gray-600">{incident.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Beach Hui</h3>
              <SocialShare 
                url="https://beachhui.lenilani.com"
                title="Check beach conditions with Beach Hui - Stay safe at Hawaii beaches!"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}