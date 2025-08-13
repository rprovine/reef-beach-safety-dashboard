'use client'

import { useState, useEffect } from 'react'
import { Camera, CameraOff, Maximize2, RefreshCw, ExternalLink, MapPin } from 'lucide-react'
import { getBeachWebcams, getNearbyWebcams, type Webcam } from '@/lib/hawaii-webcams'

interface BeachWebcamsProps {
  beachSlug?: string
  coordinates?: { lat: number; lng: number }
  className?: string
}

export function BeachWebcams({ beachSlug, coordinates, className = '' }: BeachWebcamsProps) {
  const [webcams, setWebcams] = useState<Webcam[]>([])
  const [selectedWebcam, setSelectedWebcam] = useState<Webcam | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({})
  const [refreshKey, setRefreshKey] = useState(0)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setLoading(true)
    
    // Get webcams based on beach or nearby coordinates
    let cams: Webcam[] = []
    
    if (beachSlug) {
      cams = getBeachWebcams(beachSlug)
    }
    
    // If no beach-specific cams or coordinates provided, get nearby ones
    if (cams.length === 0 && coordinates) {
      cams = getNearbyWebcams(coordinates.lat, coordinates.lng, 20)
    }
    
    setWebcams(cams)
    setLoading(false)
  }, [beachSlug, coordinates])

  // Auto-refresh images every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1)
      setImageError({}) // Reset errors on refresh
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const handleImageError = (webcamId: string) => {
    setImageError(prev => ({ ...prev, [webcamId]: true }))
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    setImageError({})
  }

  const openWebcamInNewTab = (webcam: Webcam) => {
    window.open(webcam.url, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-500"></div>
        </div>
      </div>
    )
  }

  if (webcams.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <CameraOff className="h-12 w-12 mb-2" />
          <p>No webcams available for this location</p>
        </div>
      </div>
    )
  }

  const displayedWebcams = showAll ? webcams : webcams.slice(0, 4)

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Camera className="h-5 w-5 text-ocean-600" />
            Live Beach Cameras
          </h3>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-ocean-600 transition-colors"
            title="Refresh cameras"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedWebcams.map((webcam) => (
            <div
              key={webcam.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
            >
              {/* Display webcam thumbnail or placeholder */}
              <div className="relative aspect-video">
                {imageError[webcam.id] ? (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
                    onClick={() => openWebcamInNewTab(webcam)}
                  >
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 font-medium">{webcam.name}</p>
                      <p className="text-xs text-gray-500">Click to open camera</p>
                    </div>
                  </div>
                ) : webcam.type === 'image' ? (
                  <div onClick={() => setSelectedWebcam(webcam)}>
                    <img
                      src={webcam.url.includes('?') ? `${webcam.url}&t=${refreshKey}` : `${webcam.url}?t=${refreshKey}`}
                      alt={webcam.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(webcam.id)}
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div 
                    className="w-full h-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors"
                    onClick={() => openWebcamInNewTab(webcam)}
                  >
                    <div className="text-center text-white">
                      <Camera className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">{webcam.name}</p>
                      <p className="text-xs opacity-75">Click to view stream</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Overlay with information */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="font-semibold">{webcam.name}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3" />
                    <span>{webcam.location}</span>
                  </div>
                  {webcam.description && (
                    <p className="text-xs mt-1 opacity-90">{webcam.description}</p>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <ExternalLink className="h-5 w-5 text-white" />
                </div>
              </div>
              
              {/* Provider badge */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                  {webcam.provider}
                </span>
              </div>
              
              {/* Live indicator for streams */}
              {webcam.type === 'stream' && (
                <div className="absolute top-2 right-2">
                  <span className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View all/less button */}
        {webcams.length > 4 && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-ocean-600 hover:text-ocean-700 font-medium transition-colors"
            >
              {showAll ? '← Show less' : `View all ${webcams.length} cameras →`}
            </button>
          </div>
        )}
        
        {/* Note about external cameras */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            Note: Some cameras may require opening in a new window due to provider restrictions. 
            Click on any camera to view the live feed.
          </p>
        </div>
      </div>

      {/* Fullscreen Modal for image webcams only */}
      {selectedWebcam && selectedWebcam.type === 'image' && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedWebcam(null)}
        >
          <div 
            className="relative w-full max-w-6xl bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-xl font-semibold">{selectedWebcam.name}</h3>
                  <p className="text-sm opacity-90">{selectedWebcam.location} • {selectedWebcam.provider}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openWebcamInNewTab(selectedWebcam)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedWebcam(null)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="aspect-video flex items-center justify-center">
              <img
                src={selectedWebcam.url.includes('?') ? `${selectedWebcam.url}&t=${Date.now()}` : `${selectedWebcam.url}?t=${Date.now()}`}
                alt={selectedWebcam.name}
                className="max-w-full max-h-full object-contain"
                onError={() => {
                  setSelectedWebcam(null)
                  openWebcamInNewTab(selectedWebcam)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}