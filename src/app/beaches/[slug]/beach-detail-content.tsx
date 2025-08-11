'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useBeachDetail, useBeachHistory } from '@/hooks/use-beaches'
import { beachDetailsService } from '@/lib/beach-details'
import { cn, formatDateTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import { 
  Waves, Wind, Thermometer, AlertTriangle, Clock, 
  MapPin, ArrowLeft, Bell, Calendar, TrendingUp,
  TrendingDown, Minus, ChevronRight, Activity,
  Car, Users, Star, Shield
} from 'lucide-react'
import { BeachMap } from '@/components/map'
import { Skeleton } from '@/components/ui/skeleton'
import { ReefDashboard } from '@/components/reef/reef-dashboard'
import { generateReefData } from '@/lib/reef-data'

export default function BeachDetailContent() {
  const params = useParams()
  const slug = params.slug as string
  
  const { data: beach, isLoading, error } = useBeachDetail(slug)
  const { data: history } = useBeachHistory(slug, 7)
  const beachDetails = beachDetailsService.getBeachDetails(slug)
  
  // Extract all additional data from comprehensive API
  const safetyScore = beach?.safetyScore
  const activities = beach?.activities
  const bacteriaLevel = beach?.bacteriaLevel
  const warnings = beach?.warnings || []
  const recommendations = beach?.recommendations || []
  const trends = beach?.trends
  const family = beach?.family

  if (isLoading) {
    return <BeachDetailSkeleton />
  }

  if (error || !beach) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Beach Not Found</h1>
          <p className="text-gray-600 mb-4">Sorry, we couldn&apos;t find that beach.</p>
          <Link
            href="/beaches"
            className="inline-flex items-center text-ocean-600 hover:text-ocean-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to beaches
          </Link>
        </div>
      </div>
    )
  }

  const { beach: beachData, currentConditions, forecast7Day, advisories, tides } = beach
  
  // Generate reef data for this beach
  const reefData = generateReefData(slug, beachData.name)

  // Calculate trend from history
  const getTrend = (current: number | null, history: number[] | null | undefined) => {
    if (!current || !history || history.length < 2) return null
    const avg = history.reduce((a, b) => a + b, 0) / history.length
    const diff = ((current - avg) / avg) * 100
    if (Math.abs(diff) < 5) return 'stable'
    return diff > 0 ? 'up' : 'down'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/beaches"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{beachData.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    {beachData.island.charAt(0).toUpperCase() + beachData.island.slice(1)}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getStatusColor(beachData.currentStatus || beachData.status || 'good')
                  )}>
                    {getStatusLabel(beachData.currentStatus || beachData.status || 'good')}
                  </span>
                </div>
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-ocean-500 text-white rounded-lg hover:bg-ocean-600 transition-colors">
              <Bell className="h-4 w-4 mr-2" />
              Set Alert
            </button>
          </div>
        </div>
      </div>

      {/* Active Advisories */}
      {advisories && advisories.length > 0 && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {advisories.map((advisory: any) => (
              <div key={advisory.id} className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900">{advisory.title}</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Active since {formatDateTime(advisory.startedAt)}
                  </p>
                  {advisory.url && (
                    <a
                      href={advisory.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-red-600 hover:text-red-700 mt-2"
                    >
                      View official advisory
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Safety Score and Warnings */}
            {(safetyScore !== undefined || warnings.length > 0) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Safety Assessment</h2>
                  {safetyScore !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Safety Score:</span>
                      <span className={`text-2xl font-bold ${
                        safetyScore >= 80 ? 'text-green-600' :
                        safetyScore >= 60 ? 'text-yellow-600' :
                        safetyScore >= 40 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {safetyScore}/100
                      </span>
                    </div>
                  )}
                </div>
                
                {warnings.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {warnings.map((warning: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-yellow-800">{warning}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {bacteriaLevel && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">Water Quality</span>
                      <span className={`text-sm font-semibold ${
                        bacteriaLevel === 'safe' ? 'text-green-600' :
                        bacteriaLevel === 'caution' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {bacteriaLevel.toUpperCase()}
                      </span>
                    </div>
                    {beach?.enterococcus !== undefined && (
                      <div className="text-xs text-blue-700 mt-1">
                        Enterococcus: {Number(beach.enterococcus).toFixed(1)} MPN/100ml
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Activity Ratings from API */}
            {activities && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Activity Conditions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(activities).map(([activity, rating]) => (
                    <div key={activity} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-900 capitalize mb-1">
                        {activity}
                      </div>
                      <div className={`text-sm font-semibold ${
                        rating === 'excellent' ? 'text-green-600' :
                        rating === 'good' ? 'text-green-500' :
                        rating === 'fair' ? 'text-yellow-500' :
                        'text-orange-500'
                      }`}>
                        {String(rating).toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Conditions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Current Conditions</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Updated {currentConditions?.timestamp ? formatDateTime(currentConditions.timestamp) : 'Recently'}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ConditionCard
                  icon={Waves}
                  label="Wave Height"
                  value={currentConditions?.waveHeightFt}
                  unit="ft"
                  trend={getTrend(currentConditions?.waveHeightFt, history?.waveHeights)}
                />
                <ConditionCard
                  icon={Wind}
                  label="Wind Speed"
                  value={currentConditions?.windMph}
                  unit="mph"
                  trend={getTrend(currentConditions?.windMph, history?.windSpeeds)}
                />
                <ConditionCard
                  icon={Thermometer}
                  label="Water Temp"
                  value={currentConditions?.waterTempF}
                  unit="°F"
                  trend={getTrend(currentConditions?.waterTempF, history?.waterTemps)}
                />
                <ConditionCard
                  icon={Activity}
                  label="Tide"
                  value={currentConditions?.tideFt}
                  unit="ft"
                  trend={currentConditions?.tideFt && currentConditions.tideFt > 0 ? 'up' : 'down'}
                />
              </div>
            </div>

            {/* Recommendations from API */}
            {recommendations.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
                <div className="space-y-2">
                  {recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-ocean-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trends */}
            {trends && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Trends</h2>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(trends).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-gray-600 capitalize mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className={`text-sm font-semibold ${
                        value === 'improving' ? 'text-green-600' :
                        value === 'declining' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {String(value).toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Beach Information */}
            {beachDetails && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About This Beach</h2>
                
                {/* Native Name & Pronunciation */}
                {beachDetails.nativeName && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-blue-900">Hawaiian Name:</span>
                      <span className="text-blue-800">{beachDetails.nativeName}</span>
                      {beachDetails.pronunciation && (
                        <span className="text-blue-600">({beachDetails.pronunciation})</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-700 leading-relaxed mb-6">{beachDetails.description}</p>

                {/* Highlights */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Highlights</h3>
                  <div className="grid gap-2">
                    {beachDetails.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activities Grid */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Activities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(beachDetails.activities).map(([activity, rating]) => {
                      const display = beachDetailsService.getActivityRatingDisplay(rating)
                      return (
                        <div key={activity} className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900 capitalize mb-1">
                            {activity.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className={`text-xs ${display.color}`}>
                            {display.label}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(beachDetails.amenities)
                      .filter(([_, available]) => available)
                      .map(([amenity, _]) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          <span>{beachDetailsService.getAmenityIcon(amenity as keyof typeof beachDetails.amenities)}</span>
                          <span className="capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
                        </span>
                      ))}
                  </div>
                </div>

                {/* Safety Information */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Safety Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Difficulty Level</div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        beachDetails.safetyInfo.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        beachDetails.safetyInfo.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        beachDetails.safetyInfo.difficulty === 'advanced' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {beachDetails.safetyInfo.difficulty}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Kid Friendly</div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        beachDetails.safetyInfo.kidFriendly ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {beachDetails.safetyInfo.kidFriendly ? 'Yes' : 'Use Caution'}
                      </span>
                    </div>
                  </div>
                  {beachDetails.safetyInfo.hazards.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600 mb-2">Potential Hazards</div>
                      {beachDetails.safetyInfo.hazards.map((hazard, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-orange-700 mb-1">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{hazard}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Access Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Access & Parking
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 mb-1">Walking Time</div>
                      <div className="text-gray-900">{beachDetails.access.walkingTime}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Parking</div>
                      <div className="text-gray-900">{beachDetails.access.parkingInfo}</div>
                    </div>
                    {beachDetails.access.entranceFee && (
                      <div>
                        <div className="text-gray-600 mb-1">Entrance Fee</div>
                        <div className="text-gray-900">{beachDetails.access.entranceFee}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cultural Significance */}
                {beachDetails.culturalSignificance && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-3">Cultural Significance</h3>
                    <p className="text-purple-800 text-sm leading-relaxed mb-3">
                      {beachDetails.culturalSignificance.history}
                    </p>
                    {beachDetails.culturalSignificance.respect.length > 0 && (
                      <div>
                        <div className="text-purple-800 font-medium text-sm mb-2">Please Respect:</div>
                        {beachDetails.culturalSignificance.respect.map((item, index) => (
                          <div key={index} className="text-purple-700 text-sm mb-1">
                            • {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 7-Day Forecast */}
            {forecast7Day && forecast7Day.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">7-Day Forecast</h2>
                <div className="space-y-3">
                  {forecast7Day.map((day: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="text-gray-500">
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="flex items-center text-sm">
                            <Waves className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="text-gray-900">{day.waveHeightFt.avg} ft</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {day.waveHeightFt.min}-{day.waveHeightFt.max} ft
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm">
                            <Wind className="h-3 w-3 mr-1 text-gray-400" />
                            <span className="text-gray-900">{day.windMph.avg} mph</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {day.windMph.min}-{day.windMph.max} mph
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tide Chart */}
            {tides && tides.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Tides</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tides.slice(0, 4).map((tide: any, idx: number) => (
                    <div key={idx} className="text-center">
                      <div className={cn(
                        'text-xs font-medium px-2 py-1 rounded-full inline-block mb-2',
                        tide.type === 'high' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      )}>
                        {tide.type === 'high' ? 'High Tide' : 'Low Tide'}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Number(tide.height).toFixed(1)} ft
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(tide.time).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reef Dashboard */}
            <ReefDashboard 
              beachName={beachData.name}
              reefData={reefData}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-64">
                <BeachMap
                  beaches={[beachData]}
                  selectedBeachId={beachData.slug}
                  onBeachSelect={() => {}}
                  center={[beachData.coordinates?.lat || beachData.lat, beachData.coordinates?.lng || beachData.lng]}
                  zoom={13}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-900">Set Alert</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-900">View History</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="font-semibold text-yellow-900 mb-3">Safety Tips</h3>
              <ul className="space-y-2 text-sm text-yellow-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Always follow lifeguard instructions
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Check for posted warning signs
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Never turn your back on the ocean
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Know your limits and swim near lifeguards
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ConditionCardProps {
  icon: React.ElementType
  label: string
  value: number | null
  unit: string
  trend?: 'up' | 'down' | 'stable' | null
}

function ConditionCard({ icon: Icon, label, value, unit, trend }: ConditionCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  
  const formatValue = (val: number | null, unitType: string) => {
    if (val === null) return '--'
    
    // Format based on unit type
    if (unitType === 'ft') return Number(val).toFixed(1)
    if (unitType === 'mph') return Number(val).toFixed(0)
    if (unitType === '°F') return Number(val).toFixed(0)
    return Number(val).toFixed(1)
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-ocean-500" />
        {trend && (
          <TrendIcon className={cn(
            'h-4 w-4',
            trend === 'up' ? 'text-red-500' : 
            trend === 'down' ? 'text-green-500' : 
            'text-gray-400'
          )} />
        )}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-semibold text-gray-900">
        {value !== null ? `${formatValue(value, unit)}${unit}` : '--'}
      </div>
    </div>
  )
}

function BeachDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}