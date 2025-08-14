'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getUserAccessLevel } from '@/lib/access-control'

export default function TestAccessPage() {
  const { user, signIn, signOut } = useAuth()
  const [testResult, setTestResult] = useState('')
  const access = getUserAccessLevel(user)

  const testUserTypes = {
    trial: () => {
      // Free user with active trial - should get FULL access
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 14)
      
      const trialUser = {
        id: 'trial-user',
        email: 'trial@example.com',
        tier: 'free' as const,
        trialEndDate: trialEndDate.toISOString(),
        createdAt: new Date().toISOString()
      }
      
      signIn(trialUser.email, trialUser.tier, trialUser)
      setTestResult('Set as TRIAL user (free tier + valid trial) - Should have FULL access')
      setTimeout(() => window.location.reload(), 1000)
    },
    
    paid: () => {
      // Paid Pro subscriber - should get FULL access
      const proUser = {
        id: 'pro-user',
        email: 'pro@example.com',
        tier: 'pro' as const,
        createdAt: new Date().toISOString()
      }
      
      signIn(proUser.email, proUser.tier, proUser)
      setTestResult('Set as PAID PRO user - Should have FULL access')
      setTimeout(() => window.location.reload(), 1000)
    },
    
    free: () => {
      // Free user with no trial - should get LIMITED access
      const freeUser = {
        id: 'free-user',
        email: 'free@example.com',
        tier: 'free' as const,
        createdAt: new Date().toISOString()
        // No trialEndDate!
      }
      
      signIn(freeUser.email, freeUser.tier, freeUser)
      setTestResult('Set as FREE user (no trial) - Should have LIMITED access')
      setTimeout(() => window.location.reload(), 1000)
    },
    
    rprovine: () => {
      // rprovine@gmail.com with trial
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 14)
      
      const rprovineUser = {
        id: 'rprovine-user',
        email: 'rprovine@gmail.com',
        tier: 'free' as const,
        trialEndDate: trialEndDate.toISOString(),
        subscriptionStatus: 'trial',
        createdAt: new Date().toISOString()
      }
      
      signIn(rprovineUser.email, rprovineUser.tier, rprovineUser)
      setTestResult('Set as rprovine@gmail.com with 14-day trial - Should have FULL access')
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  const accessDescription = {
    'pro': 'FULL ACCESS - All real-time data',
    'free': 'LIMITED ACCESS - Basic data only',
    'anonymous': 'NO ACCESS - Must sign in'
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Access Control Test</h1>
      
      {/* Current Status */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Current User Status</h2>
        <div className="space-y-2">
          <p><strong>Email:</strong> {user?.email || 'Not signed in'}</p>
          <p><strong>Tier:</strong> {user?.tier || 'N/A'}</p>
          <p><strong>Trial End Date:</strong> {user?.trialEndDate || 'No trial'}</p>
          <p><strong>Has Valid Trial:</strong> {user?.trialEndDate && new Date() < new Date(user.trialEndDate) ? 'YES' : 'NO'}</p>
        </div>
        
        <div className="mt-4 p-4 bg-white rounded">
          <p className="text-lg font-bold">
            Access Level: <span className={
              access.beaches.viewCurrentConditions ? 'text-green-600' : 'text-red-600'
            }>
              {access.beaches.viewCurrentConditions ? 'FULL ACCESS' : 'LIMITED ACCESS'}
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {access.beaches.viewCurrentConditions 
              ? 'You can see all real-time beach data'
              : 'You can only see basic beach information'}
          </p>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Test Different User Types</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={testUserTypes.trial}
            className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <div className="font-bold">Set as TRIAL User</div>
            <div className="text-sm">Free tier + 14-day trial</div>
            <div className="text-xs mt-1">Should get FULL access</div>
          </button>
          
          <button
            onClick={testUserTypes.paid}
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <div className="font-bold">Set as PAID Pro User</div>
            <div className="text-sm">Pro subscription</div>
            <div className="text-xs mt-1">Should get FULL access</div>
          </button>
          
          <button
            onClick={testUserTypes.free}
            className="p-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <div className="font-bold">Set as FREE User</div>
            <div className="text-sm">No trial, no payment</div>
            <div className="text-xs mt-1">Should get LIMITED access</div>
          </button>
          
          <button
            onClick={testUserTypes.rprovine}
            className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <div className="font-bold">Set as rprovine@gmail.com</div>
            <div className="text-sm">With 14-day trial</div>
            <div className="text-xs mt-1">Should get FULL access</div>
          </button>
        </div>
        
        <button
          onClick={() => {
            signOut()
            window.location.reload()
          }}
          className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Sign Out (Clear All)
        </button>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
          <p className="font-bold">{testResult}</p>
        </div>
      )}

      {/* Access Rules */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-3">Access Rules:</h3>
        <ul className="space-y-2 text-sm">
          <li>✅ <strong>Trial Users</strong> (free tier + valid trial date) → FULL access to all real-time data</li>
          <li>✅ <strong>Paid Subscribers</strong> (pro tier) → FULL access to all real-time data</li>
          <li>❌ <strong>Free Users</strong> (no trial or expired) → LIMITED access, upgrade prompts</li>
          <li>❌ <strong>Anonymous</strong> (not signed in) → No data, sign-up prompts</li>
        </ul>
      </div>
    </div>
  )
}