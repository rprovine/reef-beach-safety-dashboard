'use client'

import { Beach } from '@/types'
import { cn, getStatusColor, getStatusLabel, formatTime } from '@/lib/utils'
import { 
  Waves, Wind, Thermometer, AlertTriangle, 
  CheckCircle, Clock, MapPin 
} from 'lucide-react'

interface BeachCardProps {
  beach: Beach
  selected?: boolean
  onClick?: () => void
  compact?: boolean
}

export function BeachCard({ beach, selected, onClick, compact }: BeachCardProps) {
  const statusIcon = {
    good: CheckCircle,
    caution: AlertTriangle,
    dangerous: AlertTriangle,
    gray: Clock,
  }[beach.currentStatus] || CheckCircle

  const StatusIcon = statusIcon

  if (compact) {
    return (
      <div
        className={cn(
          'p-3 rounded-lg border cursor-pointer transition-all',
          selected
            ? 'border-ocean-500 bg-ocean-50'
            : 'border-gray-200 bg-white hover:border-ocean-300'
        )}
        onClick={onClick}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">{beach.name}</h3>
          <div className={cn('px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1', 'bg-green-100 text-green-800')}>
            <StatusIcon className="h-3 w-3" />
            {beach.currentStatus === 'good' ? 'Safe' : beach.currentStatus}
          </div>
        </div>
        {beach.currentConditions && (
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Waves className="h-3 w-3" />
              {beach.currentConditions.waveHeightFt || '--'} ft
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-3 w-3" />
              {beach.currentConditions.windMph || '--'} mph
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              {beach.currentConditions.waterTempF || '--'}°F
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'beach-card cursor-pointer transition-all',
        selected && 'ring-2 ring-ocean-500'
      )}
      onClick={onClick}
    >
      {/* Status Header */}
      <div className={cn(
        'p-4 rounded-t-lg',
        beach.currentStatus === 'good' ? 'bg-green-50' :
        beach.currentStatus === 'caution' ? 'bg-yellow-50' :
        beach.currentStatus === 'dangerous' ? 'bg-red-50' :
        'bg-gray-50'
      )}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{beach.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              {beach.island.charAt(0).toUpperCase() + beach.island.slice(1)}
            </div>
          </div>
          <div className={cn(
            'px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1',
            'bg-green-100 text-green-800'
          )}>
            <StatusIcon className="h-4 w-4" />
            {beach.currentStatus === 'good' ? 'Safe' : beach.currentStatus}
          </div>
        </div>

        {beach.activeAdvisories > 0 && (
          <div className="mt-3 p-2 bg-red-100 text-red-800 rounded-md text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">{beach.activeAdvisories} Active Advisory(s)</span>
            </div>
          </div>
        )}
      </div>

      {/* Conditions */}
      <div className="p-4">
        {beach.currentConditions && beach.currentConditions.waveHeightFt ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Waves className="h-4 w-4" />
                <span className="text-sm">Waves</span>
              </div>
              <div className="font-semibold text-gray-900">
                {Number(beach.currentConditions.waveHeightFt).toFixed(1)} ft
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Wind className="h-4 w-4" />
                <span className="text-sm">Wind</span>
              </div>
              <div className="font-semibold text-gray-900">
                {Number(beach.currentConditions.windMph).toFixed(0)} mph
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Thermometer className="h-4 w-4" />
                <span className="text-sm">Water Temp</span>
              </div>
              <div className="font-semibold text-gray-900">
                {Number(beach.currentConditions.waterTempF).toFixed(0)}°F
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Updated</span>
              </div>
              <div className="font-semibold text-gray-900 text-xs">
                {new Date(beach.currentConditions.timestamp || beach.lastUpdated).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Loading current conditions...
          </div>
        )}
      </div>
    </div>
  )
}