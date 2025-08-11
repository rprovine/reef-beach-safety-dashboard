'use client'

import { useEffect, useState } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Beach } from '@/types'
import { cn, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Waves, Wind, Thermometer, AlertTriangle, MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet
// @ts-expect-error Leaflet icon URL fix
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface BeachMapProps {
  beaches: Beach[]
  selectedBeachId: string | null
  onBeachSelect: (beachId: string) => void
  center?: [number, number]
  zoom?: number
  className?: string
}

// Custom marker icons for different beach statuses
const createCustomIcon = (status: string) => {
  const colors = {
    green: '#10b981',
    yellow: '#f59e0b',
    red: '#ef4444',
    gray: '#6b7280',
  }

  const color = colors[status as keyof typeof colors] || colors.gray

  return L.divIcon({
    className: 'custom-beach-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

// Component to handle map updates when selected beach changes
function MapUpdater({ selectedBeach }: { selectedBeach: Beach | null }) {
  const map = useMap()

  useEffect(() => {
    if (selectedBeach && selectedBeach.coordinates) {
      map.flyTo(
        [selectedBeach.coordinates.lat, selectedBeach.coordinates.lng],
        14,
        { duration: 1 }
      )
    }
  }, [selectedBeach, map])

  return null
}

// Island center coordinates
const islandCenters = {
  oahu: { lat: 21.4389, lng: -158.0001, zoom: 10 },
  maui: { lat: 20.7984, lng: -156.3319, zoom: 10 },
  kauai: { lat: 22.0964, lng: -159.5261, zoom: 10 },
  hawaii: { lat: 19.5429, lng: -155.6659, zoom: 9 },
}

export function BeachMap({
  beaches,
  selectedBeachId,
  onBeachSelect,
  center = [21.3099, -157.8581], // Hawaii center
  zoom = 8,
  className,
}: BeachMapProps) {
  const [, setMap] = useState<L.Map | null>(null)
  const selectedBeach = beaches.find((b) => b.slug === selectedBeachId)

  // Determine initial center based on selected beach or first beach's island
  const getInitialCenter = (): [number, number] => {
    if (selectedBeach?.coordinates) {
      return [selectedBeach.coordinates.lat, selectedBeach.coordinates.lng]
    }
    
    if (beaches.length > 0) {
      const firstBeachIsland = beaches[0].island as keyof typeof islandCenters
      const islandData = islandCenters[firstBeachIsland]
      if (islandData) {
        return [islandData.lat, islandData.lng]
      }
    }
    
    return center
  }

  const getInitialZoom = () => {
    if (selectedBeach) return 13
    
    if (beaches.length > 0) {
      const firstBeachIsland = beaches[0].island as keyof typeof islandCenters
      const islandData = islandCenters[firstBeachIsland]
      if (islandData) {
        return islandData.zoom
      }
    }
    
    return zoom
  }

  return (
    <div className={cn('relative w-full h-full rounded-xl overflow-hidden', className)}>
      <MapContainer
        center={getInitialCenter()}
        zoom={getInitialZoom()}
        className="w-full h-full"
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater selectedBeach={selectedBeach || null} />

        {beaches.map((beach) => {
          if (!beach.coordinates) return null

          return (
            <Marker
              key={beach.id}
              position={[beach.coordinates.lat, beach.coordinates.lng]}
              icon={createCustomIcon(beach.status)}
              eventHandlers={{
                click: () => onBeachSelect(beach.slug),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{beach.name}</h3>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {beach.island.charAt(0).toUpperCase() + beach.island.slice(1)}
                      </p>
                    </div>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      getStatusColor(beach.status)
                    )}>
                      {getStatusLabel(beach.status)}
                    </span>
                  </div>

                  {beach.currentConditions && (
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <Waves className="h-3 w-3 text-gray-500" />
                        <span>Waves: {beach.currentConditions.waveHeightFt || '--'} ft</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-3 w-3 text-gray-500" />
                        <span>Wind: {beach.currentConditions.windMph || '--'} mph</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-3 w-3 text-gray-500" />
                        <span>Water: {beach.currentConditions.waterTempF || '--'}°F</span>
                      </div>
                    </div>
                  )}

                  {beach.advisory && (
                    <div className="mt-2 p-1 bg-red-100 text-red-800 rounded text-xs">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">{beach.advisory.title}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => onBeachSelect(beach.slug)}
                    className="mt-2 w-full px-2 py-1 bg-ocean-500 text-white rounded text-xs font-medium hover:bg-ocean-600 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="text-xs font-semibold text-gray-900 mb-2">Beach Status</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-700">Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-xs text-gray-700">Caution</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-700">Unsafe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span className="text-xs text-gray-700">No Data</span>
          </div>
        </div>
      </div>
    </div>
  )
}