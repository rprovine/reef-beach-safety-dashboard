'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Waves, Bell, Map, BarChart3, User, LogOut, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { TierBadge } from '@/components/tier-features'
import { TrialDaysIndicator } from '@/components/trial-banner'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = () => {
    signOut()
    window.location.href = '/'
  }

  const navigation = [
    { name: 'Beaches', href: '/beaches', icon: Map },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Alerts', href: '/alerts', icon: Bell },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Reef Safety', href: '/reef-safety', icon: Waves },
  ]

  const publicNavigation = [
    { name: 'Beaches', href: '/beaches' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'For Business', href: '/for-business' },
    { name: 'About', href: '/about' },
  ]

  const navItems = user ? navigation : publicNavigation

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white/90 backdrop-blur-sm shadow-sm'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center">
                  <Waves className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-safe border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-gray-900">
                  Beach Hui
                </span>
                <span className="text-xs -mt-1 text-gray-500">
                  by LeniLani Consulting
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'font-medium transition-colors',
                  pathname === item.href
                    ? 'text-ocean-600'
                    : 'text-gray-700 hover:text-ocean-600'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <TrialDaysIndicator />
                <TierBadge />
                <Link
                  href="/dashboard"
                  className="font-medium text-gray-700 hover:text-ocean-600"
                >
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-gray-100">
                    <User className="h-5 w-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                    <div className="px-4 py-2 border-b">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="font-medium transition-colors text-gray-700 hover:text-ocean-600"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-gradient-to-r from-ocean-500 to-ocean-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-ocean-600 hover:to-ocean-700 transition-all"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 ease-in-out",
        mobileMenuOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
      )}>
        <div className="space-y-1 bg-white px-4 pb-3 pt-2 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'block rounded-md px-3 py-2 text-base font-medium',
                pathname === item.href
                  ? 'bg-ocean-50 text-ocean-600'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t border-gray-200 pt-3">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/account"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/signin"
                  className="block w-full rounded-md bg-gray-100 px-3 py-2 text-center text-base font-medium text-gray-700 hover:bg-gray-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block w-full rounded-md bg-gradient-to-r from-ocean-500 to-ocean-600 px-3 py-2 text-center text-base font-medium text-white hover:from-ocean-600 hover:to-ocean-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}