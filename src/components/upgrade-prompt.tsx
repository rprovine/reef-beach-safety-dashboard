'use client'

import { useState } from 'react'
import { X, Lock, Zap, TrendingUp, Shield, Users, Bell, Download, Cpu, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface UpgradePromptProps {
  feature: string
  onClose?: () => void
}

export function UpgradePrompt({ feature, onClose }: UpgradePromptProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  if (!isOpen) return null

  const features = {
    alerts: {
      icon: Bell,
      title: 'Unlimited Beach Alerts',
      description: 'Get instant notifications for UV warnings, bacteria advisories, and dangerous conditions',
      benefits: [
        'Real-time push notifications',
        'Custom alert preferences',
        'SMS text alerts for emergencies',
        'Alert history and trends'
      ]
    },
    analytics: {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Deep dive into beach trends, patterns, and historical data',
      benefits: [
        '30-day historical data',
        'Predictive conditions',
        'Export data as CSV/JSON',
        'Custom date ranges'
      ]
    },
    community: {
      icon: Users,
      title: 'Community Reports',
      description: 'Access and share real-time beach conditions with the community',
      benefits: [
        'Submit unlimited reports',
        'Photo uploads',
        'Verified reporter badge',
        'Priority moderation'
      ]
    },
    ai: {
      icon: Cpu,
      title: 'AI Beach Buddy Pro',
      description: 'Unlimited AI-powered beach recommendations and insights',
      benefits: [
        'Unlimited AI queries',
        'Personalized recommendations',
        'Beach comparison tool',
        'Safety predictions'
      ]
    },
    download: {
      icon: Download,
      title: 'Data Export',
      description: 'Download beach data for analysis and reporting',
      benefits: [
        'CSV and JSON formats',
        'Bulk data export',
        'API access (100 calls/day)',
        'Scheduled reports'
      ]
    }
  }

  const currentFeature = features[feature as keyof typeof features] || features.alerts
  const Icon = currentFeature.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-ocean-500 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentFeature.title}</h2>
                <p className="text-ocean-100 mt-1">{currentFeature.description}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Pro Feature</span>
          </div>

          <div className="space-y-3 mb-6">
            {currentFeature.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1">
                  <Zap className="h-4 w-4 text-ocean-500" />
                </div>
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-ocean-50 to-purple-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-900">Upgrade to Pro</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">$4.99</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Or save $12/year with annual billing at $47.88/year
            </p>
          </div>

          {/* Additional Pro Features */}
          <div className="border-t pt-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Also includes:</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-green-500" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-1">
                <Bell className="h-3 w-3 text-blue-500" />
                <span>Custom alerts</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-purple-500" />
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-orange-500" />
                <span>Community access</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href="/pricing"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-ocean-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Upgrade Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function InlineUpgradePrompt({ feature = 'Pro' }: { feature?: string }) {
  return (
    <div className="bg-gradient-to-r from-ocean-50 to-purple-50 rounded-xl p-6 border border-ocean-200">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-gradient-to-r from-ocean-500 to-purple-600 rounded-lg text-white">
          <Lock className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            Upgrade to Pro to unlock {feature}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Get unlimited access to all features, real-time alerts, and advanced analytics.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-ocean-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
            >
              View Plans
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
            <span className="text-sm text-gray-600">
              Starting at <span className="font-semibold text-gray-900">$4.99/month</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}