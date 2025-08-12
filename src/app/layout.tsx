import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AIBeachBuddy } from '@/components/ai-beach-buddy'
import { TrialBanner } from '@/components/trial-banner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Beach Hui - Hawaii Ocean & Reef Conservation Platform',
  description: 'Hawaii\'s premier beach safety, reef conservation, and ocean conditions platform. Real-time reef health monitoring, marine life tracking, surf reports, and community-driven beach updates.',
  keywords: 'Hawaii beach safety, reef conservation, coral health, marine life, ocean conditions, surf report, bacteria advisory, wave height, tide charts, beach alerts, reef safe, coral bleaching',
  authors: [{ name: 'LeniLani Consulting' }],
  openGraph: {
    title: 'Beach Hui - Powered by LeniLani Consulting',
    description: 'Hawaii beach conditions, reef health, and marine conservation platform',
    type: 'website',
    locale: 'en_US',
    siteName: 'Beach Hui',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-gray-50`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <TrialBanner />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <AIBeachBuddy />
          </div>
        </Providers>
      </body>
    </html>
  )
}