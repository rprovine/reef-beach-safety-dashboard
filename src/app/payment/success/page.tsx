'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight, Sparkles, Mail } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import confetti from 'canvas-confetti'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const [processingUpgrade, setProcessingUpgrade] = useState(true)
  
  // Get payment details from URL or session
  const paymentId = searchParams.get('payment_id')
  const plan = searchParams.get('plan') || 'pro'
  
  useEffect(() => {
    // Celebrate with confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    // Process the upgrade
    const processUpgrade = async () => {
      if (user && paymentId) {
        try {
          // Call API to confirm payment and upgrade user
          const response = await fetch('/api/subscription/confirm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('beach-hui-token')}`
            },
            body: JSON.stringify({
              paymentId,
              plan,
              userId: user.id
            })
          })
          
          if (response.ok) {
            const data = await response.json()
            // Update local user data
            localStorage.setItem('beach-hui-user', JSON.stringify(data.user))
            
            // Clear checkout session
            localStorage.removeItem('checkout-session')
          }
        } catch (error) {
          console.error('Error processing upgrade:', error)
        }
      }
      
      setProcessingUpgrade(false)
    }
    
    processUpgrade()
  }, [user, paymentId, plan])
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          
          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Beach Hui Pro! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your payment was successful and your account has been upgraded.
          </p>
          
          {/* What's Next */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              What happens next?
            </h2>
            
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start gap-4">
                <div className="bg-ocean-100 rounded-full p-2 mt-1">
                  <Mail className="h-4 w-4 text-ocean-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Check your email</p>
                  <p className="text-sm text-gray-600">
                    We've sent a confirmation email with your receipt
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-full p-2 mt-1">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Explore Pro features</p>
                  <p className="text-sm text-gray-600">
                    All Pro features are now unlocked in your account
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Set up your alerts</p>
                  <p className="text-sm text-gray-600">
                    Create unlimited beach alerts for your favorite spots
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-ocean-500 to-purple-600 text-white rounded-lg font-medium hover:from-ocean-600 hover:to-purple-700 transition-colors"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            
            <Link
              href="/alerts"
              className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Set Up Alerts
            </Link>
          </div>
          
          {/* Support */}
          <p className="text-sm text-gray-600 mt-8">
            Need help? Contact us at{' '}
            <a href="mailto:support@beachhui.com" className="text-ocean-600 hover:underline">
              support@beachhui.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}