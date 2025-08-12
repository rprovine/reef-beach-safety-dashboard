'use client'

import { useAuth } from '@/contexts/auth-context'
import { canAccessFeature } from '@/lib/access-control'
import Link from 'next/link'
import { Lock, Zap, TrendingUp, AlertCircle } from 'lucide-react'

interface AccessGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
  showUpgradePrompt?: boolean
  message?: string
}

export function AccessGate({ 
  feature, 
  children, 
  fallback,
  showUpgradePrompt = true,
  message
}: AccessGateProps) {
  const { user, isInTrial, isPro } = useAuth()
  
  const hasAccess = canAccessFeature(user, feature)
  
  if (hasAccess) {
    return <>{children}</>
  }
  
  if (fallback) {
    return <>{fallback}</>
  }
  
  if (!showUpgradePrompt) {
    return null
  }
  
  // Default upgrade prompts based on user status
  if (!user) {
    // Not logged in
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 text-center border border-gray-200">
        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Sign Up to Access This Feature
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {message || 'Create a free account to view real-time beach conditions, safety scores, and more.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Zap className="h-4 w-4 mr-2" />
            Start Free Trial
          </Link>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all"
          >
            Sign In
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          14-day Pro trial • No credit card required
        </p>
      </div>
    )
  }
  
  if (user.tier === 'free' && !isInTrial) {
    // Free user, not in trial
    return (
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 text-center border border-purple-200">
        <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Pro Feature
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {message || 'Upgrade to Pro to access 7-day forecasts, historical trends, unlimited alerts, and more.'}
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          <Zap className="h-4 w-4 mr-2" />
          Upgrade to Pro - $4.99/mo
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          Cancel anytime • Instant access
        </p>
      </div>
    )
  }
  
  // Shouldn't reach here, but just in case
  return null
}

// Blur overlay for restricted content
export function BlurredContent({ 
  children, 
  show = true,
  message = "Premium content"
}: { 
  children: React.ReactNode
  show?: boolean
  message?: string
}) {
  if (!show) return <>{children}</>
  
  return (
    <div className="relative">
      <div className="filter blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">{message}</p>
        </div>
      </div>
    </div>
  )
}

// Component to track and limit beach detail views
export function BeachDetailGate({ 
  beachId, 
  children 
}: { 
  beachId: string
  children: React.ReactNode
}) {
  const { user } = useAuth()
  
  // Check if user has reached their daily limit
  const checkDailyLimit = () => {
    if (!user) {
      // Anonymous users get 1 preview
      const viewedToday = localStorage.getItem('beach-views-today')
      const today = new Date().toDateString()
      
      if (viewedToday) {
        const views = JSON.parse(viewedToday)
        if (views.date === today && views.count >= 1) {
          return false
        }
      }
      
      // Track the view
      localStorage.setItem('beach-views-today', JSON.stringify({
        date: today,
        count: (viewedToday ? JSON.parse(viewedToday).count : 0) + 1
      }))
      
      return true
    }
    
    // Logged in users have higher limits
    return true
  }
  
  const hasAccess = checkDailyLimit()
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Daily Preview Limit Reached
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              You've reached your daily limit of 1 beach preview. Sign up for a free account to view up to 10 beaches per day, or go Pro for unlimited access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Start Free Trial (14 days)
              </Link>
              <Link
                href="/beaches"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all"
              >
                Back to Beaches
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}