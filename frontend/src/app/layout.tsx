import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reef & Beach Safety Dashboard - Hawaii Ocean Conditions',
  description: 'Real-time beach safety conditions, surf reports, and ocean advisories for Hawaii beaches. Get alerts, forecasts, and embed widgets for your business.',
  keywords: 'Hawaii beach safety, ocean conditions, surf report, bacteria advisory, wave height, tide charts, beach alerts',
  authors: [{ name: 'LeniLani Consulting' }],
  openGraph: {
    title: 'Reef & Beach Safety Dashboard',
    description: 'Real-time Hawaii beach conditions and safety alerts',
    type: 'website',
    locale: 'en_US',
    siteName: 'Reef & Beach Safety',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} min-h-full bg-gray-50`}>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}