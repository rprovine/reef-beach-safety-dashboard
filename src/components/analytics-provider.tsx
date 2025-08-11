'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initGA, initMixpanel, logPageView } from '@/lib/analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize analytics on mount
    initGA()
    initMixpanel()
  }, [])

  useEffect(() => {
    // Track page views on route change
    const url = pathname + searchParams.toString()
    logPageView(url)
  }, [pathname, searchParams])

  return <>{children}</>
}