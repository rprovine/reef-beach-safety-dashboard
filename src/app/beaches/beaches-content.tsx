'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
  const [selectedBeachId, setSelectedBeachId] = useState<string | null>(
    searchParams.get('beach')
  )

  console.log('BeachesContent: About to call useBeaches with', { selectedIsland, searchQuery })
  
  const { data: beaches, isLoading, error } = useBeaches(
    selectedIsland === 'all' ? undefined : selectedIsland,
    searchQuery
  )

  // Debug logging
  console.log('Beaches data:', { beaches, isLoading, error, count: beaches?.length })

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
              <h1 className="text-2xl font-bold text-gray-900">Beach Safety Dashboard</h1>
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Island Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedIsland}
                  onChange={(e) => setSelectedIsland(e.target.value as Island | 'all')}
                  className="rounded-lg border-gray-300 text-sm focus:ring-ocean-500 focus:border-ocean-500"
                >
                  {islands.map((island) => (
                    <option key={island.value} value={island.value}>
                      {island.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Activity Filter */}
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    // Add activity filtering logic here
                    console.log('Activity filter:', e.target.value)
                  }}
                  className="rounded-lg border-gray-300 text-sm focus:ring-ocean-500 focus:border-ocean-500"
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
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    // Add safety filtering logic here
                    console.log('Safety filter:', e.target.value)
                  }}
                  className="rounded-lg border-gray-300 text-sm focus:ring-ocean-500 focus:border-ocean-500"
                >
                  <option value="all">All Safety Levels</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="caution">Use Caution</option>
                </select>
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-md">
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
              <div className="flex items-center text-sm text-gray-600">
                {beaches && (
                  <span>
                    {beaches.length} {beaches.length === 1 ? 'beach' : 'beaches'} found
                  </span>
                )}
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
        ) : !beaches || beaches.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600 mb-4">No beaches found</p>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left text-sm">
                <strong>Debug:</strong><br/>
                Loading: {String(isLoading)}<br/>
                Error: {error ? error.message : 'none'}<br/>
                Beaches: {beaches ? `${beaches.length} items` : 'null/undefined'}<br/>
                Island: {selectedIsland}<br/>
                Search: "{searchQuery}"
              </div>
            </div>
          </div>
        ) : viewMode === 'map' ? (
          <div className="h-[calc(100vh-12rem)]">
            <BeachMap
              beaches={beaches}
              selectedBeachId={selectedBeachId}
              onBeachSelect={handleBeachSelect}
              className="h-full"
            />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BeachList
              beaches={beaches}
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