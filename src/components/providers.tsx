'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/auth-context'
import { AnalyticsProvider } from '@/components/analytics-provider'
import { CookieConsent } from '@/components/cookie-consent'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchInterval: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
        retry: 3,
        // Ensure queries run on mount
        refetchOnMount: true,
      },
    },
  }))

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AnalyticsProvider>
          {children}
          <Toaster position="top-right" />
          <CookieConsent />
          <Analytics />
          <SpeedInsights />
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </AnalyticsProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}