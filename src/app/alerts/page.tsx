'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { TierFeature } from '@/components/tier-features'
import { 
  Bell, BellOff, AlertTriangle, Waves, Wind, 
  Fish, Shield, Mail, Phone, Plus, X,
  Check, Clock, Settings, Trash2
} from 'lucide-react'
import Link from 'next/link'

interface Alert {
  id: string
  beach: string
  type: 'wave' | 'wind' | 'tide' | 'wildlife' | 'weather' | 'safety'
  condition: string
  threshold: string
  deliveryMethod: 'email' | 'sms' | 'push'
  enabled: boolean
  lastTriggered?: Date
  triggeredCount: number
}

// Mock data
const mockAlerts: Alert[] = [
  {
    id: '1',
    beach: 'Waikiki Beach',
    type: 'wave',
    condition: 'Wave height above',
    threshold: '6 ft',
    deliveryMethod: 'email',
    enabled: true,
    lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    triggeredCount: 3
  },
  {
    id: '2',
    beach: 'Pipeline',
    type: 'safety',
    condition: 'High risk advisory',
    threshold: 'Any',
    deliveryMethod: 'sms',
    enabled: true,
    triggeredCount: 1
  },
  {
    id: '3',
    beach: 'Hanauma Bay',
    type: 'wildlife',
    condition: 'Monk seal sighting',
    threshold: 'Any',
    deliveryMethod: 'email',
    enabled: false,
    triggeredCount: 0
  }
]

const alertTypes = {
  wave: { icon: Waves, color: 'text-blue-600 bg-blue-100' },
  wind: { icon: Wind, color: 'text-gray-600 bg-gray-100' },
  tide: { icon: Waves, color: 'text-cyan-600 bg-cyan-100' },
  wildlife: { icon: Fish, color: 'text-green-600 bg-green-100' },
  weather: { icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-100' },
  safety: { icon: Shield, color: 'text-red-600 bg-red-100' }
}

export default function AlertsPage() {
  const { user, isPro } = useAuth()
  const [alerts, setAlerts] = useState(mockAlerts)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  const freeAlertsLimit = 3
  const proAlertsLimit = 'unlimited'
  
  const toggleAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert
    ))
  }
  
  const deleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId))
  }
  
  const canCreateMoreAlerts = isPro || alerts.length < freeAlertsLimit
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Beach Alerts</h1>
              <p className="text-gray-600 mt-2">
                Get notified about changing conditions at your favorite beaches
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              disabled={!canCreateMoreAlerts}
              className={`inline-flex items-center px-6 py-3 font-medium rounded-lg transition-colors ${
                canCreateMoreAlerts
                  ? 'bg-ocean-500 text-white hover:bg-ocean-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Alert
            </button>
          </div>
          
          {/* Alert Limit Status */}
          <div className="mt-4 flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {user ? (
                isPro ? (
                  <span className="text-green-600 font-medium">
                    Unlimited alerts with Pro
                  </span>
                ) : (
                  <span>
                    Using {alerts.length} of {freeAlertsLimit} free alerts
                  </span>
                )
              ) : (
                <span>Sign in to create alerts</span>
              )}
            </div>
            {!isPro && user && (
              <Link
                href="/auth/signin"
                className="text-sm text-ocean-600 hover:text-ocean-700 font-medium"
              >
                Upgrade to Pro for unlimited alerts →
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          // Sign in prompt
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Sign in to Create Alerts
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create custom alerts to stay informed about changing conditions at your favorite beaches.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-6 py-3 bg-ocean-500 text-white font-medium rounded-lg hover:bg-ocean-600"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Alerts List */}
            <div className="lg:col-span-2">
              {alerts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <BellOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Alerts Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Create your first alert to get started
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center px-6 py-3 bg-ocean-500 text-white font-medium rounded-lg hover:bg-ocean-600"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Alert
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => {
                    const typeConfig = alertTypes[alert.type]
                    const Icon = typeConfig.icon
                    
                    return (
                      <div key={alert.id} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {alert.beach}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {alert.condition} {alert.threshold}
                              </p>
                              <div className="flex items-center gap-4 mt-3 text-xs">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                                  alert.deliveryMethod === 'email' ? 'bg-blue-100 text-blue-700' :
                                  alert.deliveryMethod === 'sms' ? 'bg-green-100 text-green-700' :
                                  'bg-purple-100 text-purple-700'
                                }`}>
                                  {alert.deliveryMethod === 'email' && <Mail className="h-3 w-3 mr-1" />}
                                  {alert.deliveryMethod === 'sms' && <Phone className="h-3 w-3 mr-1" />}
                                  {alert.deliveryMethod === 'push' && <Bell className="h-3 w-3 mr-1" />}
                                  {alert.deliveryMethod}
                                </span>
                                {alert.lastTriggered && (
                                  <span className="text-gray-500">
                                    <Clock className="h-3 w-3 inline mr-1" />
                                    Last triggered {Math.floor((Date.now() - alert.lastTriggered.getTime()) / (1000 * 60 * 60 * 24))}d ago
                                  </span>
                                )}
                                <span className="text-gray-500">
                                  Triggered {alert.triggeredCount} time{alert.triggeredCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleAlert(alert.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                alert.enabled ? 'bg-ocean-500' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                alert.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`} />
                            </button>
                            <button
                              onClick={() => deleteAlert(alert.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* SMS Alerts - Pro Feature */}
              <TierFeature requiredTier="pro" feature="SMS & Push Notifications">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Advanced Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">SMS Alerts</div>
                        <div className="text-sm text-gray-600">Get instant text messages</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Bell className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Push Notifications</div>
                        <div className="text-sm text-gray-600">Real-time mobile alerts</div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600">
                    Upgrade to Pro
                  </button>
                </div>
              </TierFeature>
              
              {/* Alert Types */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Alert Types</h3>
                <div className="space-y-3">
                  {Object.entries(alertTypes).map(([type, config]) => {
                    const Icon = config.icon
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-gray-700 capitalize">{type}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Alert Settings */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Alert Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Daily digest</span>
                    <input type="checkbox" className="rounded text-ocean-500" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Weekend only</span>
                    <input type="checkbox" className="rounded text-ocean-500" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Quiet hours (10pm-6am)</span>
                    <input type="checkbox" className="rounded text-ocean-500" defaultChecked />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Create Alert Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Alert</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beach
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500">
                  <option>Select a beach...</option>
                  <option>Waikiki Beach</option>
                  <option>Pipeline</option>
                  <option>Hanauma Bay</option>
                  <option>Sunset Beach</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alert Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500">
                  <option>Wave height above</option>
                  <option>Wind speed above</option>
                  <option>High tide warning</option>
                  <option>Wildlife sighting</option>
                  <option>Safety advisory</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Threshold
                </label>
                <input
                  type="text"
                  placeholder="e.g., 6 ft"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="cursor-pointer">
                    <input type="radio" name="delivery" value="email" className="sr-only" defaultChecked />
                    <div className="p-3 border-2 border-ocean-500 rounded-lg text-center">
                      <Mail className="h-5 w-5 mx-auto mb-1 text-ocean-600" />
                      <span className="text-xs">Email</span>
                    </div>
                  </label>
                  <label className={`cursor-pointer ${!isPro ? 'opacity-50' : ''}`}>
                    <input type="radio" name="delivery" value="sms" className="sr-only" disabled={!isPro} />
                    <div className="p-3 border-2 border-gray-200 rounded-lg text-center">
                      <Phone className="h-5 w-5 mx-auto mb-1 text-gray-400" />
                      <span className="text-xs">SMS</span>
                      {!isPro && <span className="text-xs text-yellow-600 block">Pro</span>}
                    </div>
                  </label>
                  <label className={`cursor-pointer ${!isPro ? 'opacity-50' : ''}`}>
                    <input type="radio" name="delivery" value="push" className="sr-only" disabled={!isPro} />
                    <div className="p-3 border-2 border-gray-200 rounded-lg text-center">
                      <Bell className="h-5 w-5 mx-auto mb-1 text-gray-400" />
                      <span className="text-xs">Push</span>
                      {!isPro && <span className="text-xs text-yellow-600 block">Pro</span>}
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-ocean-500 text-white font-medium rounded-lg hover:bg-ocean-600"
                >
                  Create Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}