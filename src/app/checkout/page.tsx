'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Shield, Check, Waves, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const plan = searchParams.get('plan') || 'pro'
  const billingCycle = searchParams.get('billing') || 'monthly'
  
  // Price calculation
  const monthlyPrice = 4.99
  const yearlyPrice = 47.88 // $3.99/month billed annually
  const price = billingCycle === 'yearly' ? yearlyPrice : monthlyPrice
  const displayPrice = billingCycle === 'yearly' ? 3.99 : monthlyPrice
  
  // HubSpot payment links for monthly and yearly subscriptions
  const HUBSPOT_MONTHLY_LINK = 'https://app-na2.hubspot.com/payments/2rHQSPqq4WdNPF?referrer=PAYMENT_LINK'
  const HUBSPOT_YEARLY_LINK = 'https://app-na2.hubspot.com/payments/jHDnkpDpZ?referrer=PAYMENT_LINK'
  const HUBSPOT_PAYMENT_LINK = billingCycle === 'yearly' ? HUBSPOT_YEARLY_LINK : HUBSPOT_MONTHLY_LINK
  
  useEffect(() => {
    // If not logged in, redirect to signup
    if (!user) {
      router.push('/auth/signup?plan=pro')
    }
  }, [user, router])
  
  const handleCheckout = () => {
    setLoading(true)
    
    // Build HubSpot payment link with user email parameter
    const paymentUrl = new URL(HUBSPOT_PAYMENT_LINK)
    if (user?.email) {
      paymentUrl.searchParams.append('email', user.email)
    }
    
    // Store checkout session for return
    localStorage.setItem('checkout-session', JSON.stringify({
      plan,
      billingCycle,
      price,
      timestamp: Date.now(),
      email: user?.email
    }))
    
    // Redirect to HubSpot payment page
    window.location.href = paymentUrl.toString()
  }
  
  const features = [
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
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link
          href="/pricing"
          className="inline-flex items-center text-ocean-600 hover:text-ocean-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to pricing
        </Link>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="border-b pb-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Beach Hui Pro</h3>
                  <p className="text-sm text-gray-600">
                    {billingCycle === 'yearly' ? 'Annual billing' : 'Monthly billing'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${displayPrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">/month</p>
                </div>
              </div>
              
              {billingCycle === 'yearly' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    🎉 Save $12/year with annual billing
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-3 mb-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${price.toFixed(2)}</span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Billed</span>
                  <span className="text-gray-900">Annually</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total today</span>
                <span className="text-gray-900">${price.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
            
            {/* User Info */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Email
              </label>
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-gray-900">{user?.email}</p>
              </div>
            </div>
            
            {/* Security badges */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
            
            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-ocean-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-ocean-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Waves className="animate-spin h-5 w-5 mr-2" />
                  Redirecting to payment...
                </span>
              ) : (
                'Proceed to Secure Checkout'
              )}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              By proceeding, you agree to our{' '}
              <Link href="/terms" className="text-ocean-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-ocean-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
            
            {/* Money back guarantee */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-1">
                7-Day Money Back Guarantee
              </p>
              <p className="text-xs text-blue-700">
                Not satisfied? Get a full refund within 7 days, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ocean-600"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}