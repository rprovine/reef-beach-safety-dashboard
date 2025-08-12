'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id?: string
  email: string
  tier: 'free' | 'pro' | 'admin'
  createdAt?: string
  trialEndDate?: string  // Changed to match database schema
  isTrialing?: boolean
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'trial' | 'none'  // Changed 'trialing' to 'trial' to match database
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, tier: string, userData?: User) => void
  signOut: () => void
  isAuthenticated: boolean
  isPro: boolean
  isAdmin: boolean
  isInTrial: boolean
  daysRemainingInTrial: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session - support both old and new format
    const token = localStorage.getItem('beach-hui-token') || localStorage.getItem('auth-token')
    const userStr = localStorage.getItem('beach-hui-user')
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr)
        setUser(userData)
      } catch {
        // Fall back to old format
        const email = localStorage.getItem('user-email')
        const tier = localStorage.getItem('user-tier')
        if (email && tier) {
          setUser({ email, tier: tier as User['tier'] })
        }
      }
    } else {
      // Check old format
      const oldToken = localStorage.getItem('auth-token')
      const email = localStorage.getItem('user-email')
      const tier = localStorage.getItem('user-tier')
      
      if (oldToken && email && tier) {
        setUser({ email, tier: tier as User['tier'] })
      }
    }
  }, [])

  const signIn = (email: string, tier: string, userData?: User) => {
    const user = userData || { email, tier: tier as User['tier'] }
    setUser(user)
    
    // Store in new format
    localStorage.setItem('beach-hui-token', 'demo-token')
    localStorage.setItem('beach-hui-user', JSON.stringify(user))
    
    // Also store in old format for compatibility
    localStorage.setItem('auth-token', 'demo-token')
    localStorage.setItem('user-email', email)
    localStorage.setItem('user-tier', tier)
  }

  const signOut = () => {
    setUser(null)
    // Clear both old and new format
    localStorage.removeItem('beach-hui-token')
    localStorage.removeItem('beach-hui-user')
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-email')
    localStorage.removeItem('user-tier')
  }

  // Check if user is in trial period
  const isInTrial = () => {
    if (!user?.trialEndDate) return false
    const trialEnd = new Date(user.trialEndDate)
    return new Date() < trialEnd && user.tier === 'free'
  }

  // Check if user has Pro access (paid or trial)
  const hasProAccess = () => {
    if (user?.tier === 'pro' || user?.tier === 'admin') return true
    if (user?.tier === 'free' && isInTrial()) return true
    return false
  }

  const value = {
    user,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isPro: hasProAccess(),
    isAdmin: user?.tier === 'admin',
    isInTrial: isInTrial(),
    daysRemainingInTrial: user?.trialEndDate ? 
      Math.max(0, Math.ceil((new Date(user.trialEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}