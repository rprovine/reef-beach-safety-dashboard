'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { initPostHog, trackUserClassification, trackVisitorOrigin } from '@/lib/posthog'

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const { user } = useAuth()

  useEffect(() => {
    // Initialize PostHog on client side
    initPostHog()

    // Track visitor origin and timezone info for Hawaii tourism analytics
    if (typeof window !== 'undefined') {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const isInternational = !timezone.includes('America')
      
      // Detect user location for tourism vs local classification
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            // Hawaii coordinates: roughly 18.9-22.2°N, 154.8-160.2°W
            const isInHawaii = (
              latitude >= 18.9 && latitude <= 22.2 &&
              longitude >= -160.2 && longitude <= -154.8
            )
            
            trackVisitorOrigin({
              country: 'unknown', // Would need IP geolocation service for exact country
              timezone,
              isInternational,
            })

            // Classify user type based on location
            if (isInHawaii) {
              trackUserClassification({
                userType: 'local',
                confidence: 0.8,
                indicators: ['hawaii_geolocation']
              })
            } else {
              trackUserClassification({
                userType: 'tourist',
                confidence: 0.7,
                indicators: ['non_hawaii_geolocation']
              })
            }
          },
          () => {
            // Fallback to timezone-based classification
            const isLikelyHawaiiTime = timezone.includes('Hawaii') || timezone.includes('Pacific/Honolulu')
            
            trackVisitorOrigin({
              country: 'unknown',
              timezone,
              isInternational,
            })

            trackUserClassification({
              userType: isLikelyHawaiiTime ? 'local' : 'tourist',
              confidence: 0.5,
              indicators: ['timezone_based']
            })
          },
          { timeout: 10000, enableHighAccuracy: false }
        )
      }
    }
  }, [])

  // Track user authentication events
  useEffect(() => {
    if (user) {
      // Enhanced user identification for PostHog
      if (typeof window !== 'undefined') {
        const posthog = require('posthog-js').default
        posthog.identify(user.id, {
          email: user.email,
          tier: user.tier,
          created_at: user.createdAt,
          // Don't include sensitive data like phone numbers
        })
      }
    }
  }, [user])

  return <>{children}</>
}