'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'all')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setShowBanner(false)
    
    // Enable all analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      })
    }
  }

  const acceptEssential = () => {
    localStorage.setItem('cookie-consent', 'essential')
    localStorage.setItem('cookie-consent-date', new Date().toISOString())
    setShowBanner(false)
    
    // Disable non-essential analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied'
      })
    }
  }

  const customizeSettings = () => {
    setShowDetails(!showDetails)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-xl z-50 transform transition-transform duration-500">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-ocean-100 rounded-lg">
                <Cookie className="h-6 w-6 text-ocean-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🍪 We use cookies to enhance your beach experience
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We use cookies and similar technologies to provide personalized beach recommendations, 
                  remember your preferences, and analyze how you use Beach Hui to make it even better.
                </p>
                
                {showDetails && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Cookie Categories:</h4>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked
                          disabled
                          className="mt-1 rounded text-ocean-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Essential Cookies</div>
                          <div className="text-sm text-gray-600">
                            Required for basic functionality like authentication and security
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mt-1 rounded text-ocean-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Analytics Cookies</div>
                          <div className="text-sm text-gray-600">
                            Help us understand usage patterns and improve the app
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mt-1 rounded text-ocean-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Preference Cookies</div>
                          <div className="text-sm text-gray-600">
                            Remember your settings and favorite beaches
                          </div>
                        </div>
                      </label>
                      
                      <label className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mt-1 rounded text-ocean-500"
                        />
                        <div>
                          <div className="font-medium text-gray-900">Marketing Cookies</div>
                          <div className="text-sm text-gray-600">
                            Used to show relevant beach gear ads and measure campaigns
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={acceptAll}
                    className="px-6 py-2 bg-ocean-500 text-white font-medium rounded-lg hover:bg-ocean-600 transition-colors"
                  >
                    Accept All Cookies
                  </button>
                  <button
                    onClick={acceptEssential}
                    className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Essential Only
                  </button>
                  <button
                    onClick={customizeSettings}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {showDetails ? 'Hide Details' : 'Customize'}
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 mt-3">
                  By using Beach Hui, you agree to our{' '}
                  <Link href="/privacy" className="text-ocean-600 hover:underline">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link href="/terms" className="text-ocean-600 hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowBanner(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}