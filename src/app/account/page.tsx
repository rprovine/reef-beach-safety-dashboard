'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, CreditCard, Calendar, ArrowRight, Check, X, 
  AlertCircle, Clock, Zap, Shield, ChevronRight,
  Mail, Phone, MapPin, Settings
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const { user, isInTrial, daysRemainingInTrial, isPro, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin')
    }
  }, [user, router])

  const handleUpgrade = () => {
    router.push('/checkout?plan=pro&billing=monthly')
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to Pro features at the end of your billing period.')) {
      return
    }

    setCanceling(true)
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('beach-hui-token')}`
        }
      })

      if (response.ok) {
        toast.success('Subscription canceled. You will retain Pro access until the end of your billing period.')
        // Refresh user data
        window.location.reload()
      } else {
        toast.error('Failed to cancel subscription. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setCanceling(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean-500"></div>
      </div>
    )
  }

  const isTrialExpiring = isInTrial && daysRemainingInTrial <= 3
  const hasActiveSubscription = user.tier === 'pro' && user.subscriptionStatus === 'active'

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

        {/* Trial/Subscription Status Banner */}
        {isInTrial && (
          <div className={`rounded-xl p-6 mb-8 ${
            isTrialExpiring 
              ? 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200' 
              : 'bg-gradient-to-r from-ocean-50 to-purple-50 border-2 border-ocean-200'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {isTrialExpiring ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-ocean-600" />
                  )}
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isTrialExpiring ? 'Trial Ending Soon!' : 'Pro Trial Active'}
                  </h2>
                </div>
                <p className="text-gray-700 mb-2">
                  {daysRemainingInTrial} day{daysRemainingInTrial !== 1 ? 's' : ''} remaining in your free trial
                </p>
                
                {/* Clear trial process explanation */}
                <div className="bg-white/50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-semibold text-gray-800 mb-2">What happens next:</p>
                  <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                    <li>Right now: You have <span className="font-medium text-green-700">FULL Pro access</span> (all features unlocked)</li>
                    <li>Day {14 - daysRemainingInTrial + 1}-14: Continue enjoying Pro features for free</li>
                    <li>Day 14: Last day to upgrade and keep Pro features</li>
                    <li>Day 15+: <span className="font-medium text-orange-700">Automatically switches to Free tier</span> if not upgraded</li>
                  </ul>
                  <p className="text-xs text-gray-600 mt-2 italic">
                    Free tier = Limited to 3 beach alerts, basic features only
                  </p>
                </div>
                <button
                  onClick={handleUpgrade}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-ocean-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Upgrade to Pro - $4.99/month
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
              <div className="hidden lg:block">
                <Zap className="h-20 w-20 text-ocean-200" />
              </div>
            </div>
          </div>
        )}

        {/* Active Subscription */}
        {hasActiveSubscription && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Pro Subscription Active</h2>
                </div>
                <p className="text-gray-700 mb-2">
                  You have full access to all Pro features
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>$4.99/month</span>
                  <span>•</span>
                  <span>Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                {canceling ? 'Canceling...' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium text-gray-900">
                  {user.tier === 'admin' ? 'Administrator' : 
                   user.tier === 'pro' ? 'Pro Member' : 
                   isInTrial ? 'Free Trial (Pro Access)' : 'Free Member'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Plan Features */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Your {isInTrial ? 'Trial' : user.tier === 'pro' ? 'Pro' : 'Free'} Features
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {(isPro || isInTrial) ? [
              'Unlimited beach alerts',
              '7-day forecast & historical trends',
              'SMS/Push notifications',
              'Community reporting access',
              'API access (100 calls/day)',
              'Data export (CSV/JSON)',
              'Priority email support',
              'AI Beach Buddy unlimited',
              'Reef health monitoring',
              'Marine life tracking'
            ] : [
              '3 beach alerts maximum',
              'Current conditions only',
              'Email notifications only',
              'View community reports',
              'Basic beach information',
              'Safety scores',
              'Limited AI queries (5/day)',
              'Standard support'
            ]}.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {!isPro && !isInTrial && (
            <div className="mt-6 pt-6 border-t">
              <Link
                href="/pricing"
                className="inline-flex items-center text-ocean-600 hover:text-ocean-700 font-medium"
              >
                View all Pro features
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/alerts"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Manage Alerts</h3>
                <p className="text-sm text-gray-600 mt-1">Configure your beach notifications</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Dashboard</h3>
                <p className="text-sm text-gray-600 mt-1">View your beach activity</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        </div>

        {/* Sign Out */}
        <div className="mt-8 pt-8 border-t">
          <button
            onClick={signOut}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}