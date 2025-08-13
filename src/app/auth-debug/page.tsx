'use client'

import { useAuth } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'

export default function AuthDebugPage() {
  const { user, isAuthenticated, signIn, signOut } = useAuth()
  const [localStorage, setLocalStorage] = useState<Record<string, string>>({})
  
  useEffect(() => {
    // Get all localStorage items
    const items: Record<string, string> = {}
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key) {
        items[key] = window.localStorage.getItem(key) || ''
      }
    }
    setLocalStorage(items)
  }, [])
  
  const handleTestSignIn = () => {
    signIn('test@example.com', 'pro', {
      id: 'test-id',
      email: 'test@example.com',
      tier: 'pro',
      createdAt: new Date().toISOString()
    })
    window.location.reload()
  }

  const handleTrialSignIn = () => {
    const trialUser = {
      id: 'cmeaf4ghj0000s3n4amknioq',
      email: 'rprovine@gmail.com',
      tier: 'free' as const,
      subscriptionStatus: 'trial',
      trialEndDate: '2025-08-27T20:23:46.805Z',
      createdAt: '2025-08-13T20:23:46.807Z'
    }
    
    signIn(trialUser.email, trialUser.tier, trialUser)
    window.location.reload()
  }
  
  return (
    <div className="min-h-screen pt-20 p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>
      
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold mb-2">Current Auth State:</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify({ user, isAuthenticated }, null, 2)}
        </pre>
      </div>
      
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="font-semibold mb-2">LocalStorage Items:</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(localStorage, null, 2)}
        </pre>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={handleTestSignIn}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Sign In (Pro)
        </button>
        <button
          onClick={handleTrialSignIn}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sign In as Trial User
        </button>
        <button
          onClick={() => {
            signOut()
            window.location.reload()
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}