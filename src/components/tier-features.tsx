'use client'

import { Lock, Crown, Shield, AlertCircle, TrendingUp, FileText, Bell } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

interface TierFeatureProps {
  requiredTier: 'free' | 'pro' | 'admin'
  feature: string
  children: React.ReactNode
}

export function TierFeature({ requiredTier, feature, children }: TierFeatureProps) {
  const { user, isPro, isAdmin } = useAuth()
  
  // Check if user has access
  const hasAccess = 
    requiredTier === 'free' ||
    (requiredTier === 'pro' && (isPro || isAdmin)) ||
    (requiredTier === 'admin' && isAdmin)
    
  if (hasAccess) {
    return <>{children}</>
  }
  
  // Show locked content
  return (
    <div className="relative">
      <div className="opacity-30 pointer-events-none blur-sm">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6">
          {requiredTier === 'pro' ? (
            <>
              <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Pro Feature</h3>
              <p className="text-sm text-gray-600 mb-4">{feature} is available for Pro members</p>
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Link>
            </>
          ) : (
            <>
              <Shield className="h-12 w-12 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Admin Only</h3>
              <p className="text-sm text-gray-600">{feature} requires admin access</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function TierBadge() {
  const { user } = useAuth()
  
  if (!user) return null
  
  const badges = {
    free: { icon: Lock, color: 'bg-gray-100 text-gray-700', label: 'Free' },
    pro: { icon: Crown, color: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white', label: 'Pro' },
    admin: { icon: Shield, color: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white', label: 'Admin' }
  }
  
  const badge = badges[user.tier]
  const Icon = badge.icon
  
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {badge.label}
    </div>
  )
}

export function FeaturesList() {
  const { user, isPro, isAdmin } = useAuth()
  
  const features = [
    {
      tier: 'free',
      title: 'Basic Features',
      icon: Lock,
      items: [
        'View current beach conditions',
        'Basic weather data',
        'Safety warnings',
        'View 3 beaches per day'
      ]
    },
    {
      tier: 'pro',
      title: 'Pro Features',
      icon: Crown,
      items: [
        'All Free features',
        'Unlimited beach access',
        '7-day forecasts',
        'Advanced reef data',
        'Email/SMS alerts',
        'Historical trends',
        'API access (100 calls/day)',
        'Download reports'
      ]
    },
    {
      tier: 'admin',
      title: 'Admin Features',
      icon: Shield,
      items: [
        'All Pro features',
        'Manage community reports',
        'Edit beach data',
        'View analytics',
        'Manage users',
        'API access (unlimited)',
        'Priority support'
      ]
    }
  ]
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {features.map((tier) => {
        const Icon = tier.icon
        const isCurrentTier = user?.tier === tier.tier
        const hasAccess = 
          tier.tier === 'free' ||
          (tier.tier === 'pro' && isPro) ||
          (tier.tier === 'admin' && isAdmin)
          
        return (
          <div
            key={tier.tier}
            className={`rounded-xl p-6 border-2 ${
              isCurrentTier
                ? 'border-ocean-500 bg-ocean-50'
                : hasAccess
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{tier.title}</h3>
              <Icon className={`h-6 w-6 ${
                isCurrentTier ? 'text-ocean-500' : hasAccess ? 'text-green-500' : 'text-gray-400'
              }`} />
            </div>
            
            <ul className="space-y-2">
              {tier.items.map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <span className={`mr-2 ${hasAccess ? 'text-green-500' : 'text-gray-400'}`}>
                    {hasAccess ? '✓' : '○'}
                  </span>
                  <span className={`text-sm ${hasAccess ? 'text-gray-700' : 'text-gray-400'}`}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            
            {isCurrentTier && (
              <div className="mt-4 px-3 py-1 bg-ocean-500 text-white text-xs font-medium rounded-full text-center">
                Your Plan
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}