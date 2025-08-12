'use client'

import { Beach } from '@/types'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'
import { 
  MapPin, Waves, Wind, Sun, AlertTriangle,
  ChevronRight, Lock, Star, Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileBeachCardProps {
  beach: Beach
  onClick?: () => void
}

export function MobileBeachCard({ beach, onClick }: MobileBeachCardProps) {
  const { user } = useAuth()
  
  const handleClick = () => {
    if (onClick) onClick()
  }
  
  // For anonymous users - show limited info with CTA
  if (!user) {
    return (
      <div 
        className="bg-white border-b border-gray-200 p-4 active:bg-gray-50 transition-colors"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-semibold text-base text-gray-900 truncate">
              {beach.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                {beach.island.charAt(0).toUpperCase() + beach.island.slice(1)}
              </span>
            </div>
            
            {/* Locked content indicator */}
            <div className="flex items-center gap-2 mt-2">
              <Lock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">Sign up to see conditions</span>
            </div>
          </div>
          
          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
        </div>
      </div>
    )
  }
  
  // For logged-in users - show full info in compact format
  const statusColor = 
    beach.currentStatus === 'good' ? 'text-green-600 bg-green-50' :
    beach.currentStatus === 'caution' ? 'text-yellow-600 bg-yellow-50' :
    beach.currentStatus === 'dangerous' ? 'text-red-600 bg-red-50' :
    'text-gray-600 bg-gray-50'
  
  const statusText = 
    beach.currentStatus === 'good' ? 'Safe' :
    beach.currentStatus === 'caution' ? 'Caution' :
    beach.currentStatus === 'dangerous' ? 'Danger' :
    'Unknown'
  
  return (
    <div 
      className="bg-white border-b border-gray-200 active:bg-gray-50 transition-colors"
      onClick={handleClick}
    >
      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-semibold text-base text-gray-900 truncate">
              {beach.name}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {beach.island.charAt(0).toUpperCase() + beach.island.slice(1)}
                </span>
              </div>
              <div className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                statusColor
              )}>
                {statusText}
              </div>
            </div>
          </div>
          
          <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
        </div>
        
        {/* Conditions Grid - 2x2 on mobile */}
        {beach.currentConditions && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-gray-500 mb-0.5">
                <Waves className="h-3 w-3" />
                <span className="text-xs">Waves</span>
              </div>
              <div className="font-semibold text-sm text-gray-900">
                {beach.currentConditions.waveHeightFt ? 
                  `${Number(beach.currentConditions.waveHeightFt).toFixed(1)} ft` : '--'}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-gray-500 mb-0.5">
                <Wind className="h-3 w-3" />
                <span className="text-xs">Wind</span>
              </div>
              <div className="font-semibold text-sm text-gray-900">
                {beach.currentConditions.windMph ? 
                  `${Number(beach.currentConditions.windMph).toFixed(0)} mph` : '--'}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-gray-500 mb-0.5">
                <Sun className="h-3 w-3" />
                <span className="text-xs">UV Index</span>
              </div>
              <div className="font-semibold text-sm text-gray-900">
                {beach.currentConditions.uvIndex ?? '--'}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-gray-500 mb-0.5">
                <Clock className="h-3 w-3" />
                <span className="text-xs">Updated</span>
              </div>
              <div className="font-semibold text-sm text-gray-900">
                {beach.lastUpdated ? 
                  new Date(beach.lastUpdated).toLocaleTimeString('en-US', { 
                    hour: 'numeric',
                    minute: '2-digit' 
                  }) : '--'}
              </div>
            </div>
          </div>
        )}
        
        {/* Alerts indicator */}
        {beach.activeAdvisories > 0 && (
          <div className="flex items-center gap-2 mt-3 text-red-600">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs font-medium">
              {beach.activeAdvisories} active {beach.activeAdvisories === 1 ? 'advisory' : 'advisories'}
            </span>
          </div>
        )}
        
        {/* Safety Score */}
        {beach.safetyScore !== undefined && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-gray-600">Safety Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-20">
                <div 
                  className={cn(
                    "h-1.5 rounded-full",
                    beach.safetyScore >= 80 ? "bg-green-500" :
                    beach.safetyScore >= 60 ? "bg-yellow-500" :
                    "bg-red-500"
                  )}
                  style={{ width: `${beach.safetyScore}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700">
                {beach.safetyScore}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}