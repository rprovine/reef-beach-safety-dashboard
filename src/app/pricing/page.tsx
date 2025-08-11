'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Zap, Shield, Building2, ChevronRight } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { trackConversion } from '@/lib/analytics'
import toast from 'react-hot-toast'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for casual beach-goers',
    icon: '🌊',
    features: [
      { name: 'View real-time beach conditions', included: true },
      { name: '3 beach alerts', included: true },
      { name: 'Basic weather data', included: true },
      { name: 'Community reports (view only)', included: true },
      { name: 'UV index monitoring', included: true },
      { name: '7-day forecast', included: false },
      { name: 'Historical trends', included: false },
      { name: 'SMS/Push notifications', included: false },
      { name: 'API access', included: false },
      { name: 'Data export', included: false },
      { name: 'Priority support', included: false },
      { name: 'AI Beach Buddy unlimited', included: false }
    ],
    cta: 'Get Started',
    ctaLink: '/auth/signup',
    popular: false
  },
  {
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    description: 'For beach enthusiasts & families',
    icon: '🏄',
    features: [
      { name: 'Everything in Free', included: true },
      { name: 'Unlimited beach alerts', included: true },
      { name: '7-day forecast', included: true },
      { name: 'Historical trends & analytics', included: true },
      { name: 'SMS/Push notifications', included: true },
      { name: 'Community reporting', included: true },
      { name: 'API access (100 calls/day)', included: true },
      { name: 'Data export (CSV/JSON)', included: true },
      { name: 'Priority email support', included: true },
      { name: 'AI Beach Buddy unlimited', included: true },
      { name: 'Reef health monitoring', included: true },
      { name: 'Marine life tracking', included: true },
      { name: 'Custom alert zones', included: false },
      { name: 'White-label options', included: false }
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/auth/signup?tier=pro',
    popular: true
  },
  {
    name: 'Business',
    price: '$49',
    period: '/month',
    description: 'For tour operators & businesses',
    icon: '🏢',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Unlimited API calls', included: true },
      { name: 'Custom alert zones', included: true },
      { name: 'White-label options', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Bulk data export', included: true },
      { name: '24/7 phone support', included: true },
      { name: 'Team collaboration tools', included: true },
      { name: 'Advanced analytics dashboard', included: true },
      { name: 'Custom reports', included: true },
      { name: 'Training & onboarding', included: true },
      { name: 'SLA guarantee', included: true },
      { name: 'HIPAA compliance', included: true }
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    popular: false
  }
]

export default function PricingPage() {
  const { user } = useAuth()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const handleSelectPlan = (planName: string) => {
    trackConversion('upgrade', 0)
    if (planName === 'Business') {
      window.location.href = '/contact'
    } else {
      toast.success(`Redirecting to ${planName} signup...`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Choose Your Beach Adventure
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Get the most out of Hawaii's beaches with the right plan for you
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-ocean-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-ocean-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-ocean-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-ocean-500 to-purple-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">{plan.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                  
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {billingPeriod === 'yearly' && plan.price !== '$0' 
                        ? plan.price === '$4.99' ? '$3.99' : `$${Math.floor(parseFloat(plan.price.slice(1)) * 0.8)}`
                        : plan.price}
                    </span>
                    <span className="text-gray-600">
                      {plan.period === 'forever' ? '/forever' : 
                       billingPeriod === 'yearly' ? '/month' : plan.period}
                    </span>
                    {billingPeriod === 'yearly' && plan.price !== '$0' && (
                      <div className="text-sm text-green-600 mt-1">
                        Save ${plan.price === '$4.99' ? '12' : Math.floor(parseFloat(plan.price.slice(1)) * 12 * 0.2)}/year
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mt-0.5 mr-3 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <div className="mt-8">
                  <Link
                    href={plan.ctaLink}
                    onClick={() => handleSelectPlan(plan.name)}
                    className={`block w-full text-center px-6 py-3 rounded-lg font-medium transition-colors ${
                      plan.popular
                        ? 'bg-gradient-to-r from-ocean-500 to-purple-600 text-white hover:from-ocean-600 hover:to-purple-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                    <ChevronRight className="inline-block ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Start with our Free plan to explore features. Upgrade to Pro with a 7-day money-back guarantee.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and Apple Pay. Business plans can pay by invoice.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer discounts for non-profits?</h3>
              <p className="text-gray-600">
                Yes! Non-profit organizations get 50% off Pro and Business plans. Contact us for details.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Trusted by beach lovers across Hawaii</p>
          <div className="flex justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-700">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-gray-700">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-700">SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}