'use client'

import { useState, useEffect } from 'react'
import { X, Zap, Clock, ArrowRight, Gift, Star } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

export function TrialBanner() {
  const { user } = useAuth()
  const [dismissed, setDismissed] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState(14)
  const [showUrgency, setShowUrgency] = useState(false)

  useEffect(() => {
    if (user?.tier === 'free' && user?.createdAt) {
      const trialEnd = new Date(user.createdAt)
      trialEnd.setDate(trialEnd.getDate() + 14)
      const now = new Date()
      const days = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      setDaysRemaining(Math.max(0, days))
      setShowUrgency(days <= 3)
    }

    // Check if banner was dismissed in this session
    const bannerDismissed = sessionStorage.getItem('trial-banner-dismissed')
    if (bannerDismissed) {
      setDismissed(true)
    }
  }, [user])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('trial-banner-dismissed', 'true')
  }

  // Don't show banner if user is not on trial or has dismissed it
  if (!user || user.tier !== 'free' || dismissed || daysRemaining <= 0) {
    return null
  }

  const urgencyColor = showUrgency ? 'from-red-500 to-orange-500' : 'from-ocean-500 to-purple-600'
  const urgencyBg = showUrgency ? 'bg-red-50' : 'bg-ocean-50'

  return (
    <div className={`fixed top-16 left-0 right-0 z-40 ${urgencyBg} border-b shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center flex-1">
            {/* Timer Icon */}
            <div className={`bg-gradient-to-r ${urgencyColor} p-2 rounded-lg text-white mr-3`}>
              {showUrgency ? <Zap className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            
            {/* Message */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-gray-900">
                  {showUrgency ? '⚡ Last Chance!' : '🎁 Free Trial:'} {daysRemaining} days remaining
                </span>
                <span className="text-gray-600 hidden sm:inline">
                  • Unlock unlimited beaches, AI insights, and reef monitoring
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              {showUrgency && (
                <span className="hidden lg:inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  <Gift className="h-4 w-4 mr-1" />
                  Save $12/year
                </span>
              )}
              
              <Link
                href="/pricing"
                className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${urgencyColor} text-white rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105`}
              >
                <Star className="h-4 w-4 mr-1" />
                Upgrade to Pro
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
              
              <button
                onClick={handleDismiss}
                className="p-1 text-gray-400 hover:text-gray-600"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TrialDaysIndicator() {
  const { user } = useAuth()
  const [daysRemaining, setDaysRemaining] = useState(14)

  useEffect(() => {
    if (user?.tier === 'free' && user?.createdAt) {
      const trialEnd = new Date(user.createdAt)
      trialEnd.setDate(trialEnd.getDate() + 14)
      const now = new Date()
      const days = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      setDaysRemaining(Math.max(0, days))
    }
  }, [user])

  if (!user || user.tier !== 'free') return null

  const urgencyColor = daysRemaining <= 3 ? 'text-red-600 bg-red-50' : 'text-ocean-600 bg-ocean-50'

  return (
    <Link
      href="/pricing"
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${urgencyColor} hover:opacity-80 transition-opacity`}
    >
      <Clock className="h-3 w-3 mr-1" />
      {daysRemaining} days left
    </Link>
  )
}