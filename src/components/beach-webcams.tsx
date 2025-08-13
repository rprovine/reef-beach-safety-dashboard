'use client'

import { useState, useEffect } from 'react'
import { Camera, CameraOff, Maximize2, RefreshCw, ExternalLink, MapPin } from 'lucide-react'
import { getBeachWebcams, getNearbyWebcams, type Webcam } from '@/lib/hawaii-webcams'
import Image from 'next/image'

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

  // Auto-refresh images based on their refresh interval
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = []
    
    webcams.forEach(cam => {
      if (cam.type === 'image' && cam.refreshInterval) {
        const interval = setInterval(() => {
          setRefreshKey(prev => prev + 1)
        }, cam.refreshInterval * 1000)
        intervals.push(interval)
      }
    })
    
    return () => intervals.forEach(clearInterval)
  }, [webcams])

  const handleImageError = (webcamId: string) => {
    setImageError(prev => ({ ...prev, [webcamId]: true }))
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    setImageError({})
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
          {webcams.map((webcam) => (
            <div
              key={`${webcam.id}-${refreshKey}`}
              className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
              onClick={() => setSelectedWebcam(webcam)}
            >
              {webcam.type === 'image' ? (
                <div className="relative aspect-video">
                  {imageError[webcam.id] ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <div className="text-center">
                        <CameraOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Camera offline</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={`${webcam.url}?t=${refreshKey}`}
                      alt={webcam.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(webcam.id)}
                    />
                  )}
                </div>
              ) : (
                <div className="relative aspect-video bg-gray-900">
                  <iframe
                    src={webcam.url}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <Maximize2 className="h-5 w-5 text-white" />
                </div>
              </div>
              
              {/* Provider badge */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                  {webcam.provider}
                </span>
              </div>
              
              {/* Live indicator */}
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

        {webcams.length > 4 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-ocean-600 hover:text-ocean-700 font-medium">
              View all {webcams.length} cameras →
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {selectedWebcam && (
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
                  <a
                    href={selectedWebcam.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
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
            <div className="aspect-video">
              {selectedWebcam.type === 'image' ? (
                <img
                  src={`${selectedWebcam.url}?t=${Date.now()}`}
                  alt={selectedWebcam.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={selectedWebcam.url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}