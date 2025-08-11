'use client'

import { useState } from 'react'
import { 
  Waves, AlertTriangle, Heart, Fish, Shield, 
  BookOpen, Users, TrendingUp, TrendingDown,
  Droplets, Thermometer, Eye, AlertCircle,
  CheckCircle, XCircle, Info
} from 'lucide-react'
import { BeachReefData } from '@/types/reef'
import { getReefSafetyScore, getRecommendedActivities } from '@/lib/reef-data'

interface ReefDashboardProps {
  beachName: string
  reefData: BeachReefData
}

export function ReefDashboard({ beachName, reefData }: ReefDashboardProps) {
  const [activeTab, setActiveTab] = useState<'health' | 'ecosystem' | 'hazards' | 'education' | 'conservation'>('health')
  const safetyScore = getReefSafetyScore(reefData.hazards)
  const activities = getRecommendedActivities(reefData)

  const tabs = [
    { id: 'health', label: 'Reef Health', icon: Heart },
    { id: 'ecosystem', label: 'Marine Life', icon: Fish },
    { id: 'hazards', label: 'Hazards', icon: AlertTriangle },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'conservation', label: 'Conservation', icon: Shield }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean-500 to-ocean-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Waves className="h-6 w-6" />
              {beachName} Reef System
            </h2>
            <p className="text-ocean-100 mt-1">Powered by Beach Hui - LeniLani Consulting</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{reefData.health.healthScore}</div>
            <div className="text-ocean-100 text-sm">Health Score</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-ocean-100 text-xs">Coral Coverage</div>
            <div className="text-white font-bold text-lg">{reefData.health.coralCoverage.toFixed(0)}%</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-ocean-100 text-xs">Water Visibility</div>
            <div className="text-white font-bold text-lg">{reefData.health.waterClarity.visibility}m</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-ocean-100 text-xs">Safety Score</div>
            <div className="text-white font-bold text-lg">{safetyScore}/100</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-ocean-100 text-xs">Species Count</div>
            <div className="text-white font-bold text-lg">{reefData.ecosystem.speciesCount}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-ocean-500 text-ocean-600 bg-ocean-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'health' && (
          <div className="space-y-6">
            {/* Coral Bleaching Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-orange-500" />
                Coral Bleaching Status
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Bleaching Level</span>
                    <span className={`font-medium ${
                      reefData.health.coralBleaching.status === 'none' ? 'text-green-600' :
                      reefData.health.coralBleaching.status === 'mild' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {reefData.health.coralBleaching.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        reefData.health.coralBleaching.percentage < 15 ? 'bg-green-500' :
                        reefData.health.coralBleaching.percentage < 30 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${reefData.health.coralBleaching.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {reefData.health.coralBleaching.percentage.toFixed(1)}% bleached
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Temperature Stress</span>
                    <span className={`font-medium ${
                      reefData.health.temperature.stressLevel === 'none' ? 'text-green-600' :
                      reefData.health.temperature.stressLevel.includes('watch') ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {reefData.health.temperature.stressLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Current: {reefData.health.temperature.current.toFixed(1)}°C
                    {reefData.health.temperature.anomaly > 0 && (
                      <span className="text-red-600 ml-2">
                        (+{reefData.health.temperature.anomaly.toFixed(1)}°C above normal)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Water Quality */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                Water Quality
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Clarity</div>
                  <div className={`text-lg font-semibold ${
                    reefData.health.waterClarity.rating === 'excellent' ? 'text-green-600' :
                    reefData.health.waterClarity.rating === 'good' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {reefData.health.waterClarity.rating.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Turbidity: {reefData.health.waterClarity.turbidity.toFixed(1)} NTU
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Ocean pH</div>
                  <div className={`text-lg font-semibold ${
                    reefData.health.oceanAcidification.pH >= 8.0 ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {reefData.health.oceanAcidification.pH.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {reefData.health.oceanAcidification.trend}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Pollution</div>
                  <div className={`text-lg font-semibold ${
                    reefData.health.pollution.level === 'minimal' ? 'text-green-600' :
                    reefData.health.pollution.level === 'low' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {reefData.health.pollution.level.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Sunscreen impact: {reefData.health.pollution.sunscreenImpact}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ecosystem' && (
          <div className="space-y-6">
            {/* Marine Life Overview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Marine Life Diversity</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Fish Population</div>
                  <div className={`text-2xl font-bold ${
                    reefData.ecosystem.fishPopulation.abundance === 'abundant' ? 'text-green-600' :
                    reefData.ecosystem.fishPopulation.abundance === 'moderate' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {reefData.ecosystem.fishPopulation.abundance.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Best viewing: {reefData.ecosystem.fishPopulation.bestViewingTime}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Biodiversity Score</div>
                  <div className="text-2xl font-bold text-ocean-600">
                    {reefData.ecosystem.biodiversityScore}/100
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {reefData.ecosystem.speciesCount} species recorded
                  </div>
                </div>
              </div>
            </div>

            {/* Key Species */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Common Species</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {reefData.ecosystem.fishPopulation.keySpecies.map((species, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white p-3 rounded-lg">
                    <Fish className="h-5 w-5 text-ocean-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{species.commonName}</div>
                      {species.hawaiianName && (
                        <div className="text-xs text-gray-600 italic">{species.hawaiianName}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Abundance: {species.abundance}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protected Species */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-600" />
                Protected Species
              </h3>
              <div className="space-y-3">
                {reefData.ecosystem.protectedSpecies.seaTurtles.recentSightings > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🐢</span>
                      <div>
                        <div className="font-medium">Hawaiian Green Sea Turtles (Honu)</div>
                        <div className="text-sm text-gray-600">
                          {reefData.ecosystem.protectedSpecies.seaTurtles.recentSightings} sightings this week
                        </div>
                      </div>
                    </div>
                    <Info className="h-5 w-5 text-amber-600" />
                  </div>
                )}
                
                {reefData.ecosystem.protectedSpecies.hawaiianMonkSeals.recentSightings > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🦭</span>
                      <div>
                        <div className="font-medium">Hawaiian Monk Seals</div>
                        <div className="text-sm text-gray-600">
                          {reefData.ecosystem.protectedSpecies.hawaiianMonkSeals.recentSightings} sightings
                        </div>
                      </div>
                    </div>
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                  </div>
                )}

                {reefData.ecosystem.protectedSpecies.whales.inSeason && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🐋</span>
                      <div>
                        <div className="font-medium">Humpback Whales</div>
                        <div className="text-sm text-gray-600">
                          IN SEASON! {reefData.ecosystem.protectedSpecies.whales.distance?.toFixed(1)} miles offshore
                        </div>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hazards' && (
          <div className="space-y-6">
            {/* Current Warnings */}
            {(reefData.hazards.venomous.boxJellyfish.warning || 
              reefData.hazards.venomous.portugueseManOWar.recent) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Warnings
                </h3>
                <div className="space-y-2">
                  {reefData.hazards.venomous.boxJellyfish.warning && (
                    <div className="flex items-start gap-2">
                      <span className="text-xl">🪼</span>
                      <div>
                        <div className="font-medium text-red-800">Box Jellyfish Warning</div>
                        <div className="text-sm text-red-600">
                          Expected {reefData.hazards.venomous.boxJellyfish.nextRisk.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                  {reefData.hazards.venomous.portugueseManOWar.recent && (
                    <div className="flex items-start gap-2">
                      <span className="text-xl">⚠️</span>
                      <div>
                        <div className="font-medium text-red-800">Portuguese Man o\' War</div>
                        <div className="text-sm text-red-600">
                          {reefData.hazards.venomous.portugueseManOWar.beachings} recent beachings
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sharp Hazards */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Sharp & Physical Hazards</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Sharp Coral</span>
                    <span className={`text-sm font-medium ${
                      reefData.hazards.sharpCoral.risk === 'low' ? 'text-green-600' :
                      reefData.hazards.sharpCoral.risk === 'moderate' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {reefData.hazards.sharpCoral.risk.toUpperCase()} RISK
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {reefData.hazards.sharpCoral.areas.join(', ') || 'Minimal sharp coral'}
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Sea Urchins (Wana)</span>
                    <span className={`text-sm font-medium ${
                      reefData.hazards.seaUrchin.density === 'none' ? 'text-green-600' :
                      reefData.hazards.seaUrchin.density === 'low' ? 'text-blue-600' :
                      reefData.hazards.seaUrchin.density === 'moderate' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {reefData.hazards.seaUrchin.density.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {reefData.hazards.seaUrchin.nightRisk && '⚠️ Higher risk at night'}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Conditions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Current Conditions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Rip Currents</div>
                  <div className={`text-lg font-semibold ${
                    reefData.hazards.currentHazards.ripCurrents === 'low' ? 'text-green-600' :
                    reefData.hazards.currentHazards.ripCurrents === 'moderate' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {reefData.hazards.currentHazards.ripCurrents.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Wave Break</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {reefData.hazards.currentHazards.waveBreakZone}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Minimum Depth</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {reefData.hazards.shallowReef.minDepth} ft
                  </div>
                  <div className="text-xs text-gray-500">at low tide</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="space-y-6">
            {/* Reef Etiquette */}
            <div className="bg-ocean-50 rounded-lg p-4 border border-ocean-200">
              <h3 className="font-semibold text-lg mb-3 text-ocean-800">Reef Etiquette</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {reefData.education.guidelines.map((guideline, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-xl">{guideline.icon}</span>
                    <div className="flex-1">
                      <div className={`text-sm ${
                        guideline.importance === 'critical' ? 'font-semibold text-red-700' : 'text-gray-700'
                      }`}>
                        {guideline.rule}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Snorkeling Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                Snorkeling Conditions
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Quality</div>
                  <div className={`text-lg font-semibold ${
                    reefData.education.snorkeling.quality === 'excellent' ? 'text-green-600' :
                    reefData.education.snorkeling.quality === 'good' ? 'text-blue-600' :
                    'text-yellow-600'
                  }`}>
                    {reefData.education.snorkeling.quality.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Visibility: {reefData.education.snorkeling.visibility}m
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Entry Difficulty</div>
                  <div className={`text-lg font-semibold ${
                    reefData.education.snorkeling.entryDifficulty === 'easy' ? 'text-green-600' :
                    reefData.education.snorkeling.entryDifficulty === 'moderate' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {reefData.education.snorkeling.entryDifficulty.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {reefData.education.snorkeling.bestConditions}
                  </div>
                </div>
              </div>
              
              {reefData.education.snorkeling.highlights.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">Highlights</div>
                  <div className="flex flex-wrap gap-2">
                    {reefData.education.snorkeling.highlights.map((highlight, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Marine Protected Area */}
            {reefData.education.marineProtectedArea.status && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="font-semibold text-lg mb-3 text-green-800 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Marine Protected Area ({reefData.education.marineProtectedArea.type})
                </h3>
                <div className="space-y-2">
                  {reefData.education.marineProtectedArea.regulations.map((reg, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-700">{reg}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'conservation' && (
          <div className="space-y-6">
            {/* Sunscreen Policy */}
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h3 className="font-semibold text-lg mb-3 text-amber-800">Reef-Safe Sunscreen Policy</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-800">Banned Ingredients</div>
                    <div className="text-sm text-gray-600">
                      {reefData.conservation.sunscreenPolicy.bannedIngredients.join(', ')}
                    </div>
                  </div>
                </div>
                {reefData.conservation.sunscreenPolicy.vendors.length > 0 && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-800">Available at</div>
                      <div className="text-sm text-gray-600">
                        {reefData.conservation.sunscreenPolicy.vendors.join(', ')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Restoration Projects */}
            {reefData.conservation.restoration.active && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Active Restoration Projects</h3>
                <div className="space-y-3">
                  {reefData.conservation.restoration.projects.map((project, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {project.organization} • {project.type}
                      </div>
                      {project.volunteerOpportunities && (
                        <div className="flex items-center gap-2 mt-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">Volunteers welcome!</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visitor Impact */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3">Visitor Impact</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Impact Level</span>
                    <span className={`font-medium ${
                      reefData.conservation.visitorImpact.level === 'minimal' ? 'text-green-600' :
                      reefData.conservation.visitorImpact.level === 'low' ? 'text-blue-600' :
                      reefData.conservation.visitorImpact.level === 'moderate' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {reefData.conservation.visitorImpact.level.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        reefData.conservation.visitorImpact.dailyVisitors < reefData.conservation.visitorImpact.carryingCapacity * 0.5 ? 'bg-green-500' :
                        reefData.conservation.visitorImpact.dailyVisitors < reefData.conservation.visitorImpact.carryingCapacity * 0.8 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (reefData.conservation.visitorImpact.dailyVisitors / reefData.conservation.visitorImpact.carryingCapacity) * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {reefData.conservation.visitorImpact.dailyVisitors} / {reefData.conservation.visitorImpact.carryingCapacity} daily capacity
                  </div>
                </div>
              </div>
            </div>

            {/* Community Programs */}
            {reefData.conservation.community.volunteerGroups.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-lg mb-3 text-blue-800">Get Involved</h3>
                <div className="space-y-2">
                  {reefData.conservation.community.volunteerGroups.map((group, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{group}</span>
                    </div>
                  ))}
                  {reefData.conservation.community.citizenScience.programs.map((program, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{program}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommended Activities */}
        {activities.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3">Recommended Activities Today</h3>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity, idx) => (
                <span key={idx} className="px-3 py-1 bg-ocean-100 text-ocean-700 rounded-full text-sm">
                  {activity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}