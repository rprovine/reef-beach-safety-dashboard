'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { TierFeature } from '@/components/tier-features'
import { 
  Camera, AlertTriangle, Fish, Users, Clock, 
  ThumbsUp, MessageCircle, MapPin, Send, Star,
  Wind, Waves, Eye, Droplets
} from 'lucide-react'
import Link from 'next/link'

interface Report {
  id: string
  user: string
  beach: string
  type: 'conditions' | 'hazard' | 'wildlife' | 'general'
  title: string
  description: string
  timestamp: Date
  likes: number
  comments: number
  verified: boolean
  images?: string[]
  conditions?: {
    waves: string
    wind: string
    visibility: string
    crowdLevel: string
  }
}

// Mock data for demo
const mockReports: Report[] = [
  {
    id: '1',
    user: 'Sarah K.',
    beach: 'Waikiki Beach',
    type: 'conditions',
    title: 'Perfect morning conditions!',
    description: 'Calm waters, great visibility for snorkeling. Saw several sea turtles near the reef.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 24,
    comments: 5,
    verified: true,
    conditions: {
      waves: 'Calm (1-2 ft)',
      wind: 'Light (5 mph)',
      visibility: 'Excellent (30+ ft)',
      crowdLevel: 'Moderate'
    }
  },
  {
    id: '2',
    user: 'Mike T.',
    beach: 'Pipeline',
    type: 'hazard',
    title: '⚠️ Strong rip current on north side',
    description: 'Be careful! Strong rip current forming on the north side of the beach. Lifeguards have posted warnings.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 45,
    comments: 12,
    verified: true
  },
  {
    id: '3',
    user: 'Lisa M.',
    beach: 'Hanauma Bay',
    type: 'wildlife',
    title: 'Monk seal resting on beach',
    description: 'Hawaiian monk seal on the east side of the beach. Area has been cordoned off. Please keep distance!',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 67,
    comments: 8,
    verified: true
  },
  {
    id: '4',
    user: 'Tom R.',
    beach: 'Lanikai Beach',
    type: 'general',
    title: 'Parking full by 8 AM',
    description: 'Heads up - parking was completely full by 8 AM today (Saturday). Consider arriving earlier or using alternative transportation.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 31,
    comments: 3,
    verified: false
  }
]

export default function CommunityPage() {
  const { user, isPro } = useAuth()
  const [selectedType, setSelectedType] = useState<'all' | 'conditions' | 'hazard' | 'wildlife' | 'general'>('all')
  const [showReportForm, setShowReportForm] = useState(false)
  
  const filteredReports = selectedType === 'all' 
    ? mockReports 
    : mockReports.filter(r => r.type === selectedType)
  
  const typeColors = {
    conditions: 'bg-blue-100 text-blue-800',
    hazard: 'bg-red-100 text-red-800',
    wildlife: 'bg-green-100 text-green-800',
    general: 'bg-gray-100 text-gray-800'
  }
  
  const typeIcons = {
    conditions: Waves,
    hazard: AlertTriangle,
    wildlife: Fish,
    general: Users
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Reports</h1>
              <p className="text-gray-600 mt-2">Real-time updates from fellow beachgoers</p>
            </div>
            <button
              onClick={() => setShowReportForm(true)}
              className="inline-flex items-center px-6 py-3 bg-ocean-500 text-white font-medium rounded-lg hover:bg-ocean-600 transition-colors"
            >
              <Send className="h-5 w-5 mr-2" />
              Submit Report
            </button>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex space-x-2 mt-6">
            {['all', 'conditions', 'hazard', 'wildlife', 'general'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-ocean-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reports List */}
          <div className="lg:col-span-2 space-y-6">
            {filteredReports.map((report) => {
              const Icon = typeIcons[report.type]
              
              return (
                <div key={report.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${typeColors[report.type]}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{report.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{report.beach}</span>
                            <span>•</span>
                            <span>{report.user}</span>
                            {report.verified && (
                              <>
                                <span>•</span>
                                <span className="text-green-600 font-medium">✓ Verified</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {Math.floor((Date.now() - report.timestamp.getTime()) / (1000 * 60 * 60))}h ago
                      </div>
                    </div>
                    
                    {/* Content */}
                    <p className="text-gray-700 mb-4">{report.description}</p>
                    
                    {/* Conditions */}
                    {report.conditions && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center text-gray-600 mb-1">
                            <Waves className="h-4 w-4 mr-1" />
                            <span className="text-xs">Waves</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.conditions.waves}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center text-gray-600 mb-1">
                            <Wind className="h-4 w-4 mr-1" />
                            <span className="text-xs">Wind</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.conditions.wind}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center text-gray-600 mb-1">
                            <Eye className="h-4 w-4 mr-1" />
                            <span className="text-xs">Visibility</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.conditions.visibility}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center text-gray-600 mb-1">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="text-xs">Crowd</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {report.conditions.crowdLevel}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm">{report.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-ocean-600">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm">{report.comments}</span>
                        </button>
                      </div>
                      <button className="text-sm text-ocean-600 hover:text-ocean-700 font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submit Report CTA */}
            <div className="bg-ocean-50 rounded-xl p-6 border border-ocean-200">
              <h3 className="font-semibold text-ocean-900 mb-3">Share Your Experience</h3>
              <p className="text-sm text-ocean-700 mb-4">
                Help the community by reporting current conditions, hazards, or wildlife sightings.
              </p>
              <button
                onClick={() => setShowReportForm(true)}
                className="w-full px-4 py-2 bg-ocean-500 text-white font-medium rounded-lg hover:bg-ocean-600"
              >
                Submit Report
              </button>
            </div>
            
            {/* Top Contributors */}
            <TierFeature requiredTier="pro" feature="Top Contributors">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Top Contributors</h3>
                <div className="space-y-3">
                  {['Sarah K.', 'Mike T.', 'Lisa M.', 'Tom R.', 'Amy L.'].map((name, idx) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-ocean-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-ocean-600">
                            {name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{name}</span>
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm ml-1">{87 - idx * 12}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TierFeature>
            
            {/* Report Guidelines */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Reporting Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-ocean-500 mr-2">•</span>
                  Be specific about location and time
                </li>
                <li className="flex items-start">
                  <span className="text-ocean-500 mr-2">•</span>
                  Include photos when possible
                </li>
                <li className="flex items-start">
                  <span className="text-ocean-500 mr-2">•</span>
                  Report hazards immediately
                </li>
                <li className="flex items-start">
                  <span className="text-ocean-500 mr-2">•</span>
                  Respect marine life - observe from distance
                </li>
                <li className="flex items-start">
                  <span className="text-ocean-500 mr-2">•</span>
                  Verify information before sharing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Form Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Beach Report</h2>
              
              {user ? (
                <form className="space-y-6">
                  {/* Beach Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Beach Location
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500">
                      <option>Select a beach...</option>
                      <option>Waikiki Beach</option>
                      <option>Pipeline</option>
                      <option>Hanauma Bay</option>
                      <option>Lanikai Beach</option>
                    </select>
                  </div>
                  
                  {/* Report Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['conditions', 'hazard', 'wildlife', 'general'].map((type) => (
                        <label key={type} className="cursor-pointer">
                          <input type="radio" name="type" value={type} className="sr-only" />
                          <div className="p-3 border-2 border-gray-200 rounded-lg hover:border-ocean-500 transition-colors">
                            <span className="text-sm font-medium capitalize">{type}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Brief summary of your report"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Provide details about what you observed..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                    />
                  </div>
                  
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photos (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowReportForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-ocean-500 text-white font-medium rounded-lg hover:bg-ocean-600"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign in to Submit Reports</h3>
                  <p className="text-gray-600 mb-6">
                    You need to be signed in to contribute to the community.
                  </p>
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center px-6 py-3 bg-ocean-500 text-white font-medium rounded-lg hover:bg-ocean-600"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}