'use client'

import { Beach } from '@/types'
import { useAuth } from '@/contexts/auth-context'
import { getUserAccessLevel } from '@/lib/access-control'
import Link from 'next/link'
import { 
  MapPin, Lock, Zap, TrendingUp, AlertCircle,
  Waves, Wind, Thermometer, Sun, Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RestrictedBeachCardProps {
  beach: Beach
  onClick?: () => void
}

export function RestrictedBeachCard({ beach, onClick }: RestrictedBeachCardProps) {
  const { user } = useAuth()
  const access = getUserAccessLevel(user)
  
  const handleClick = () => {
    // Don't navigate if user is not logged in
    if (!user) {
      // Redirect to signup instead
      window.location.href = '/auth/signup'
      return
    }
    if (onClick) onClick()
  }
  
  // For anonymous users - show very limited info
  if (!user) {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
        onClick={handleClick}
      >
        {/* Beach basic info */}
        <div className="mb-4">
          <h3 className="font-semibold text-xl text-gray-900 mb-2">{beach.name}</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{beach.island.charAt(0).toUpperCase() + beach.island.slice(1)}</span>
          </div>
          {beach.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{beach.description}</p>
          )}
        </div>
        
        {/* Blurred/locked content */}
        <div className="relative">
          <div className="filter blur-sm pointer-events-none select-none opacity-50">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Waves className="h-4 w-4" />
                  <span>Waves</span>
                </div>
                <div className="font-semibold text-gray-700">-- ft</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Wind className="h-4 w-4" />
                  <span>Wind</span>
                </div>
                <div className="font-semibold text-gray-700">-- mph</div>
              </div>
            </div>
          </div>
          
          {/* Overlay prompt */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-transparent flex items-end">
            <div className="w-full text-center pb-2">
              <div className="flex items-center justify-center gap-2 text-ocean-600 mb-2">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">Sign up to see live conditions</span>
              </div>
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white text-sm rounded-lg font-medium hover:shadow-md transition-all"
              >
                <Zap className="h-3 w-3 mr-1" />
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
        
        {/* Preview limit indicator */}
        <div className="absolute top-2 right-2">
          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Eye className="h-3 w-3" />
            1 free preview/day
          </div>
        </div>
      </div>
    )
  }
  
  // For free tier users - show current conditions but not forecasts
  if (user.tier === 'free' && !access.beaches.viewForecast) {
    console.log('Showing RestrictedBeachCard for free user:', beach.name, beach.currentConditions)
    return (
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all"
        onClick={handleClick}
      >
        {/* Header with status */}
        <div className={cn(
          'p-4',
          beach.currentStatus === 'good' ? 'bg-green-50' :
          beach.currentStatus === 'caution' ? 'bg-yellow-50' :
          beach.currentStatus === 'dangerous' ? 'bg-red-50' :
          'bg-gray-50'
        )}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{beach.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="h-3 w-3" />
                <span>{beach.island.charAt(0).toUpperCase() + beach.island.slice(1)}</span>
              </div>
            </div>
            <div className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              beach.currentStatus === 'good' ? 'bg-green-100 text-green-800' :
              beach.currentStatus === 'caution' ? 'bg-yellow-100 text-yellow-800' :
              beach.currentStatus === 'dangerous' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            )}>
              {beach.currentStatus === 'good' ? 'Safe' : 
               beach.currentStatus === 'caution' ? 'Caution' :
               beach.currentStatus === 'dangerous' ? 'Dangerous' : 'Unknown'}
            </div>
          </div>
        </div>
        
        {/* Current conditions */}
        <div className="p-4">
          {beach.currentConditions ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Waves className="h-4 w-4" />
                  <span>Waves</span>
                </div>
                <div className="font-semibold text-gray-900">
                  {beach.currentConditions.waveHeightFt ? 
                    `${Number(beach.currentConditions.waveHeightFt).toFixed(1)} ft` : '--'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Wind className="h-4 w-4" />
                  <span>Wind</span>
                </div>
                <div className="font-semibold text-gray-900">
                  {beach.currentConditions.windMph ? 
                    `${Number(beach.currentConditions.windMph).toFixed(1)} mph` : '--'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Thermometer className="h-4 w-4" />
                  <span>Water</span>
                </div>
                <div className="font-semibold text-gray-900">
                  {beach.currentConditions.waterTempF ? 
                    `${Number(beach.currentConditions.waterTempF).toFixed(0)}°F` : '--'}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                  <Sun className="h-4 w-4" />
                  <span>UV Index</span>
                </div>
                <div className="font-semibold text-gray-900">
                  {beach.currentConditions.uvIndex ?? '--'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Loading conditions...
            </div>
          )}
          
          {/* Pro features teaser */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp className="h-4 w-4" />
                <span>7-day forecast • Historical trends</span>
              </div>
              <Link
                href="/pricing"
                className="text-sm font-medium text-ocean-600 hover:text-ocean-700"
              >
                Go Pro →
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Pro users see everything (handled by regular BeachCard)
  return null
}