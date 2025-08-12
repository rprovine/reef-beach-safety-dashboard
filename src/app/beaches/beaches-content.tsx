'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BeachMap } from '@/components/map'
import { BeachList } from '@/components/beaches/beach-list'
import { useBeaches } from '@/hooks/use-beaches'
import { Island } from '@/types'
import { Search, Map, List, Filter } from 'lucide-react'

const islands: { value: Island | 'all'; label: string }[] = [
  { value: 'all', label: 'All Islands' },
  { value: 'oahu', label: 'Oʻahu' },
  { value: 'maui', label: 'Maui' },
  { value: 'kauai', label: 'Kauaʻi' },
  { value: 'hawaii', label: 'Big Island' },
]

export default function BeachesContent() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [selectedIsland, setSelectedIsland] = useState<Island | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedActivity, setSelectedActivity] = useState<string>('all')
  const [selectedSafety, setSelectedSafety] = useState<string>('all')
  const [selectedBeachId, setSelectedBeachId] = useState<string | null>(
    searchParams.get('beach')
  )

  const { data: beaches, isLoading, error } = useBeaches(
    selectedIsland === 'all' ? undefined : selectedIsland,
    searchQuery
  )
  
  // Debug logging
  console.log('Beaches data:', { beaches, isLoading, error, count: beaches?.length })

  // Filter beaches based on activity and safety selections
  const filteredBeaches = useMemo(() => {
    if (!beaches) return []
    
    let filtered = [...beaches]
    
    // Filter by activity
    if (selectedActivity !== 'all') {
      filtered = filtered.filter(beach => {
        // Check if beach has activity data from API
        if (beach.activities && typeof beach.activities === 'object') {
          const activities = beach.activities as Record<string, string>
          
          if (selectedActivity === 'family') {
            // Check family safety score
            return beach.safetyScore && beach.safetyScore >= 70
          }
          
          // Check if specific activity has good or excellent rating
          const activityRating = activities[selectedActivity]
          return activityRating === 'excellent' || activityRating === 'good'
        }
        
        // Fallback: check based on conditions for specific activities
        if (selectedActivity === 'swimming') {
          const waveHeight = beach.currentConditions?.waveHeightFt as number | undefined
          return waveHeight !== undefined && waveHeight < 3
        } else if (selectedActivity === 'surfing') {
          const waveHeight = beach.currentConditions?.waveHeightFt as number | undefined
          return waveHeight !== undefined && waveHeight >= 3
        } else if (selectedActivity === 'snorkeling') {
          const waveHeight = beach.currentConditions?.waveHeightFt as number | undefined
          return waveHeight !== undefined && waveHeight < 2
        }
        
        return true
      })
    }
    
    // Filter by safety level
    if (selectedSafety !== 'all') {
      filtered = filtered.filter(beach => {
        // Use safety score if available
        if (beach.safetyScore !== undefined) {
          if (selectedSafety === 'excellent') return beach.safetyScore >= 85
          if (selectedSafety === 'good') return beach.safetyScore >= 70 && beach.safetyScore < 85
          if (selectedSafety === 'fair') return beach.safetyScore >= 50 && beach.safetyScore < 70
          if (selectedSafety === 'caution') return beach.safetyScore < 50
        }
        
        // Fallback to status
        if (selectedSafety === 'excellent' || selectedSafety === 'good') {
          return beach.currentStatus === 'good'
        } else if (selectedSafety === 'fair') {
          return beach.currentStatus === 'caution'
        } else if (selectedSafety === 'caution') {
          return beach.currentStatus === 'dangerous'
        }
        
        return true
      })
    }
    
    return filtered
  }, [beaches, selectedActivity, selectedSafety])

  const handleBeachSelect = (beachId: string) => {
    setSelectedBeachId(beachId)
    // Update URL without navigation
    const url = new URL(window.location.href)
    url.searchParams.set('beach', beachId)
    window.history.pushState({}, '', url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 space-y-4">
            {/* Title and View Toggle */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Beach Hui - Community Beach & Reef Safety</h1>
              <div className="flex items-center gap-4">
                <Link 
                  href="/login" 
                  className="px-4 py-2 bg-ocean-500 text-white rounded-lg hover:bg-ocean-600 transition-colors text-sm font-medium"
                >
                  Login / Demo
                </Link>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white text-ocean-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Map className="h-4 w-4" />
                  Map
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-ocean-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                  List
                </button>
              </div>
            </div>
          </div>

            {/* Filters */}
            <div className="flex flex-col gap-3">
              {/* Mobile: Horizontal scrollable filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 sm:overflow-visible sm:flex-wrap">
                {/* Island Filter */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Filter className="h-4 w-4 text-gray-500 hidden sm:block" />
                  <select
                    value={selectedIsland}
                    onChange={(e) => setSelectedIsland(e.target.value as Island | 'all')}
                    className="rounded-lg border-gray-300 text-sm focus:ring-ocean-500 focus:border-ocean-500 min-w-[120px]"
                  >
                    {islands.map((island) => (
                      <option key={island.value} value={island.value}>
                        {island.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Activity Filter */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="rounded-lg border-gray-300 text-sm focus:ring-ocean-500 focus:border-ocean-500 min-w-[140px]"
                  >
                    <option value="all">All Activities</option>
                    <option value="swimming">Swimming</option>
                    <option value="surfing">Surfing</option>
                    <option value="snorkeling">Snorkeling</option>
                    <option value="diving">Diving</option>
                    <option value="fishing">Fishing</option>
                    <option value="family">Family Friendly</option>
                  </select>
                </div>

                {/* Safety Filter */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={selectedSafety}
                    onChange={(e) => setSelectedSafety(e.target.value)}
                    className="rounded-lg border-gray-300 text-sm focus:ring-ocean-500 focus:border-ocean-500 min-w-[140px]"
                  >
                    <option value="all">All Safety Levels</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="caution">Use Caution</option>
                  </select>
                </div>
              </div>

              {/* Search bar on its own row */}
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search beaches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 text-sm focus:ring-ocean-500 focus:border-ocean-500"
                  />
                </div>
                
                {/* Beach Count */}
                <div className="flex items-center text-sm text-gray-600 flex-shrink-0">
                  {filteredBeaches && (
                    <span className="whitespace-nowrap">
                      {filteredBeaches.length} {filteredBeaches.length === 1 ? 'beach' : 'beaches'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-500 mx-auto mb-4"></div>
              <p>Loading beaches...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading beaches: {error.message}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          </div>
        ) : !filteredBeaches || filteredBeaches.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                {beaches && beaches.length > 0 
                  ? 'No beaches match your selected filters' 
                  : 'No beaches found'}
              </p>
              {beaches && beaches.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedActivity('all')
                    setSelectedSafety('all')
                  }}
                  className="px-4 py-2 bg-ocean-500 text-white rounded-lg hover:bg-ocean-600"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'map' ? (
          <div className="h-[calc(100vh-12rem)]">
            <BeachMap
              beaches={filteredBeaches}
              selectedBeachId={selectedBeachId}
              onBeachSelect={handleBeachSelect}
              className="h-full"
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BeachList
              beaches={filteredBeaches}
              loading={isLoading}
              error={error}
              selectedBeachId={selectedBeachId}
              onBeachSelect={handleBeachSelect}
            />
          </div>
        )}
      </div>

      {/* Mobile View Toggle (Fixed Bottom) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 lg:hidden z-50">
        <div className="flex items-center gap-2 bg-white shadow-lg p-1 rounded-full">
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-ocean-500 text-white'
                : 'text-gray-600'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-ocean-500 text-white'
                : 'text-gray-600'
            }`}
          >
            List
          </button>
        </div>
      </div>
    </div>
  )
}