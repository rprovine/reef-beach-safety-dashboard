'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogIn, Waves, Shield, Users, Building2, AlertCircle, Check } from 'lucide-react'

const demoAccounts = [
  {
    tier: 'Free',
    email: 'free@demo.com',
    password: 'demo123',
    price: 'Free',
    features: ['View beach conditions', '3 favorite beaches', 'Basic alerts'],
    icon: Waves,
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  {
    tier: 'Consumer',
    email: 'consumer@demo.com',
    password: 'demo123',
    price: '$4.99/mo',
    features: ['Unlimited favorites', 'Advanced alerts', 'No ads', '7-day forecast'],
    icon: Shield,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    tier: 'Business',
    email: 'business@demo.com',
    password: 'demo123',
    price: '$49/mo',
    features: ['Embeddable widgets', 'API access', 'Priority support', 'Analytics'],
    icon: Building2,
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    tier: 'Enterprise',
    email: 'enterprise@demo.com',
    password: 'demo123',
    price: 'Custom',
    features: ['Custom integrations', 'SLA', 'Dedicated support', 'White label'],
    icon: Users,
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  }
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<typeof demoAccounts[0] | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // For demo, check against demo accounts
      const account = demoAccounts.find(acc => acc.email === email)
      
      if (account && password === account.password) {
        // Store user info in localStorage for demo
        localStorage.setItem('user', JSON.stringify({
          email: account.email,
          tier: account.tier.toLowerCase(),
          name: `${account.tier} User`,
          features: account.features
        }))
        
        // Redirect to dashboard or beaches page
        router.push('/dashboard')
      } else {
        // Try actual API login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        if (response.ok) {
          const data = await response.json()
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          router.push('/dashboard')
        } else {
          setError('Invalid email or password')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (account: typeof demoAccounts[0]) => {
    setEmail(account.email)
    setPassword(account.password)
    setSelectedAccount(account)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/beaches" className="inline-flex items-center justify-center mb-4 group">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full group-hover:scale-105 transition-transform">
              <Waves className="h-10 w-10 text-white" />
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Beach Hui</h1>
          <p className="text-gray-600">Hawaii's Premier Beach Safety & Reef Conservation Platform</p>
          <p className="text-sm text-gray-500 mt-1">Powered by LeniLani Consulting</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Login Form - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {selectedAccount && (
                  <div className={`p-3 rounded-lg border ${selectedAccount.color}`}>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {selectedAccount.tier} Account Selected
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white rounded-lg hover:from-ocean-600 hover:to-ocean-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <div className="text-center">
                  <Link href="/signup" className="text-ocean-600 hover:text-ocean-700 text-sm font-medium">
                    Don't have an account? Sign up →
                  </Link>
                </div>
              </div>
            </div>

            {/* Back to Beaches Link */}
            <div className="mt-4 text-center">
              <Link 
                href="/beaches" 
                className="text-gray-600 hover:text-gray-900 text-sm inline-flex items-center gap-1"
              >
                ← Back to Beach Dashboard
              </Link>
            </div>
          </div>

          {/* Demo Accounts - Right Side */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Demo Accounts</h2>
                <p className="text-gray-600">Click any account to auto-fill login credentials and explore features</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {demoAccounts.map((account) => {
                  const Icon = account.icon
                  return (
                    <button
                      key={account.tier}
                      onClick={() => quickLogin(account)}
                      className={`text-left p-4 rounded-xl border-2 hover:shadow-lg transition-all group ${
                        selectedAccount?.tier === account.tier 
                          ? account.color + ' ring-2 ring-offset-2 ring-ocean-500'
                          : 'bg-white border-gray-200 hover:border-ocean-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${account.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-gray-900">
                              {account.tier}
                            </h3>
                            <span className="text-sm font-semibold text-ocean-600">
                              {account.price}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3 font-mono">
                            {account.email}
                          </p>
                          <div className="space-y-1">
                            {account.features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-1">
                                <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-xs text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> These are demo accounts for testing. In production, users would create real accounts with actual payment processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}