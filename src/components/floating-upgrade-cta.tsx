'use client'

import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

export function FloatingUpgradeCTA() {
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Show after 30 seconds for free users
    if (user?.tier === 'free' && !dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [user, dismissed])

  const handleDismiss = () => {
    setIsVisible(false)
    setDismissed(true)
    sessionStorage.setItem('floating-cta-dismissed', 'true')
  }

  if (!isVisible || user?.tier !== 'free') return null

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-slide-up">
      <div className="bg-gradient-to-r from-ocean-500 to-purple-600 rounded-2xl shadow-2xl p-6 text-white">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">
              Unlock Full Access
            </h3>
            <p className="text-ocean-100 text-sm">
              Get unlimited alerts, AI insights, and advanced analytics
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">$4.99</span>
            <span className="text-ocean-100">/month</span>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center px-4 py-2 bg-white text-ocean-600 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Upgrade
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}