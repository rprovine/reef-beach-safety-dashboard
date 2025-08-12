'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Waves, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        setError(data.error || 'Failed to send reset email')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center">
                  <Waves className="h-7 w-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-2xl text-gray-900">Beach Hui</span>
                  <span className="text-xs text-gray-500">by LeniLani Consulting</span>
                </div>
              </div>
            </div>

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Check your email
            </h1>
            
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            
            <p className="text-sm text-gray-500 mb-8">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setEmail('')
                }}
                className="w-full py-3 px-4 bg-ocean-500 text-white font-medium rounded-lg hover:bg-ocean-600 transition-all"
              >
                Try again
              </button>
              
              <Link
                href="/auth/signin"
                className="block w-full py-3 px-4 text-ocean-600 font-medium text-center hover:text-ocean-700 transition-all"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center">
                <Waves className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-2xl text-gray-900">Beach Hui</span>
                <span className="text-xs text-gray-500">by LeniLani Consulting</span>
              </div>
            </div>
          </div>

          <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">
            Forgot password?
          </h1>
          <p className="text-center text-gray-600 mb-8">
            No worries, we'll send you reset instructions.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white font-medium rounded-lg hover:from-ocean-600 hover:to-ocean-700 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Sending...' : 'Send reset instructions'}
            </button>
          </form>

          <div className="mt-6">
            <Link
              href="/auth/signin"
              className="flex items-center justify-center text-sm text-ocean-600 hover:text-ocean-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to sign in
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © 2025 LeniLani Consulting. All rights reserved.
        </p>
      </div>
    </div>
  )
}