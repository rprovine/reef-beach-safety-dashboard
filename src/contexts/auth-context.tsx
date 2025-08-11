'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  email: string
  tier: 'free' | 'pro' | 'admin'
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, tier: string) => void
  signOut: () => void
  isAuthenticated: boolean
  isPro: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('auth-token')
    const email = localStorage.getItem('user-email')
    const tier = localStorage.getItem('user-tier')
    
    if (token && email && tier) {
      setUser({ email, tier: tier as User['tier'] })
    }
  }, [])

  const signIn = (email: string, tier: string) => {
    const userTier = tier as User['tier']
    setUser({ email, tier: userTier })
    localStorage.setItem('auth-token', 'demo-token')
    localStorage.setItem('user-email', email)
    localStorage.setItem('user-tier', tier)
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-email')
    localStorage.removeItem('user-tier')
  }

  const value = {
    user,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isPro: user?.tier === 'pro' || user?.tier === 'admin',
    isAdmin: user?.tier === 'admin'
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