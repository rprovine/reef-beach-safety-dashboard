'use client'

import { Beach } from '@/types'
import { useAuth } from '@/contexts/auth-context'
import { getUserAccessLevel } from '@/lib/access-control'
import Link from 'next/link'
import { 
  MapPin, Lock, Zap, TrendingUp, AlertCircle,
  Waves, Wind, Thermometer, Sun, Eye,
  Crown, Activity
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
        
        {/* Show what they're missing - no fake data */}
        <div className="relative">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-3">With a free account, you'll get:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Waves className="h-4 w-4 text-ocean-500 mt-0.5" />
                <span>Real-time wave heights & conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <Wind className="h-4 w-4 text-ocean-500 mt-0.5" />
                <span>Current wind speed & direction</span>
              </li>
              <li className="flex items-start gap-2">
                <Thermometer className="h-4 w-4 text-ocean-500 mt-0.5" />
                <span>Water temperature updates</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-ocean-500 mt-0.5" />
                <span>Safety alerts & advisories</span>
              </li>
            </ul>
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
  
  // For free tier users - show what Pro offers, not limited data
  if (user.tier === 'free' && !access.beaches.viewForecast) {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all"
        onClick={handleClick}
      >
        {/* Header with beach info */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{beach.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <MapPin className="h-3 w-3" />
                <span>{beach.island.charAt(0).toUpperCase() + beach.island.slice(1)}</span>
              </div>
              {beach.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{beach.description}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Show Pro features they're missing */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-ocean-50 to-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Upgrade to Pro for:
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-ocean-600 mt-0.5" />
                <span className="text-gray-700">7-day forecasts</span>
              </div>
              <div className="flex items-start gap-2">
                <Activity className="h-4 w-4 text-ocean-600 mt-0.5" />
                <span className="text-gray-700">Historical trends</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-ocean-600 mt-0.5" />
                <span className="text-gray-700">Unlimited alerts</span>
              </div>
              <div className="flex items-start gap-2">
                <Eye className="h-4 w-4 text-ocean-600 mt-0.5" />
                <span className="text-gray-700">Detailed analytics</span>
              </div>
            </div>
          
            
            {/* CTA Button */}
            <div className="mt-4">
              <Link
                href="/pricing"
                className="block w-full text-center px-4 py-2 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white rounded-lg font-medium hover:shadow-md transition-all"
              >
                Upgrade to Pro →
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