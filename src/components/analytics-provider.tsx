'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initGA, initMixpanel, logPageView } from '@/lib/analytics'

function AnalyticsTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views on route change
    const url = pathname + searchParams.toString()
    logPageView(url)
  }, [pathname, searchParams])

  return null
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize analytics on mount
    initGA()
    initMixpanel()
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracking />
      </Suspense>
      {children}
    </>
  )
}