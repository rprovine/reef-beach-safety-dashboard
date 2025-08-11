'use client'

import { XCircle, ArrowLeft, HelpCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function PaymentCancelPage() {
  useEffect(() => {
    // Clear any checkout session
    localStorage.removeItem('checkout-session')
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Cancel Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-6">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
          </div>
          
          {/* Cancel Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your payment was cancelled and you have not been charged.
          </p>
          
          {/* Help Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Changed your mind?
            </h2>
            
            <p className="text-gray-600 mb-6">
              No worries! Your free account is still active and you can upgrade anytime.
            </p>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900 mb-1">
                      Questions about pricing?
                    </p>
                    <p className="text-sm text-blue-700">
                      We're happy to help you choose the right plan for your needs.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-left">
                    <p className="font-medium text-green-900 mb-1">
                      Want a demo?
                    </p>
                    <p className="text-sm text-green-700">
                      Schedule a free 15-minute demo to see Pro features in action.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-ocean-500 to-purple-600 text-white rounded-lg font-medium hover:from-ocean-600 hover:to-purple-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pricing
            </Link>
            
            <Link
              href="/beaches"
              className="inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Continue with Free
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