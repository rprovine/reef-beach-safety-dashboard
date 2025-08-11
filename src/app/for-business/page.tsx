import { Building2, Users, BarChart3, Shield, Globe, Zap, Code, Phone, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Building2,
    title: 'White-Label Solutions',
    description: 'Customize Beach Hui with your brand colors, logo, and domain for seamless integration.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Manage multiple users, set permissions, and coordinate beach safety across your organization.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track visitor patterns, safety incidents, and beach conditions with detailed reports.'
  },
  {
    icon: Shield,
    title: 'Priority Support',
    description: '24/7 dedicated support with guaranteed response times and a dedicated account manager.'
  },
  {
    icon: Globe,
    title: 'API Access',
    description: 'Integrate beach data directly into your apps and systems with unlimited API calls.'
  },
  {
    icon: Zap,
    title: 'Real-Time Alerts',
    description: 'Custom alert zones and instant notifications for your specific beach locations.'
  }
]

const useCases = [
  {
    title: 'Hotels & Resorts',
    description: 'Keep guests informed about beach conditions and safety. Display real-time data in lobbies and rooms.',
    icon: '🏨'
  },
  {
    title: 'Tour Operators',
    description: 'Plan activities based on conditions. Ensure customer safety with up-to-date beach information.',
    icon: '🚐'
  },
  {
    title: 'Surf Schools',
    description: 'Monitor wave conditions and schedule lessons. Track multiple beaches for optimal teaching spots.',
    icon: '🏄'
  },
  {
    title: 'Government Agencies',
    description: 'Public safety monitoring and reporting. Coordinate emergency response and beach management.',
    icon: '🏛️'
  }
]

const testimonials = [
  {
    quote: "Beach Hui has transformed how we manage beach safety for our guests. The real-time alerts have prevented numerous incidents.",
    author: 'Sarah Chen',
    role: 'Operations Director',
    company: 'Grand Pacific Resort'
  },
  {
    quote: "The API integration was seamless. We now display live beach conditions on our booking platform, increasing customer confidence.",
    author: 'Mike Kahana',
    role: 'CEO',
    company: 'Aloha Adventures Tours'
  }
]

export default function ForBusinessPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-ocean-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="text-ocean-200 font-medium">BEACH HUI FOR BUSINESS</span>
              </div>
              <h1 className="text-4xl font-bold mb-6 sm:text-5xl">
                Enterprise Beach Safety & Analytics Platform
              </h1>
              <p className="text-xl text-ocean-100 mb-8">
                Protect your customers, optimize operations, and make data-driven decisions 
                with Hawaii's most comprehensive beach intelligence platform.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/contact"
                  className="bg-white text-ocean-600 px-6 py-3 rounded-lg font-medium hover:bg-ocean-50 transition-colors inline-flex items-center"
                >
                  Schedule Demo
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
                >
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-6">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-ocean-100">Beaches Monitored</span>
                  <span className="text-2xl font-bold">70+</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-ocean-100">Daily API Calls</span>
                  <span className="text-2xl font-bold">1M+</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/20">
                  <span className="text-ocean-100">Business Clients</span>
                  <span className="text-2xl font-bold">250+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ocean-100">Uptime SLA</span>
                  <span className="text-2xl font-bold">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Enterprise Features</h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to manage beach safety at scale
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="h-10 w-10 text-ocean-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Who Uses Beach Hui Business?</h2>
            <p className="mt-4 text-xl text-gray-600">
              Trusted by Hawaii's leading tourism and hospitality businesses
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="bg-white rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                <p className="text-sm text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-6 w-6 text-ocean-600" />
              <span className="text-ocean-600 font-medium">DEVELOPER FRIENDLY</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Powerful API for Seamless Integration
            </h2>
            <p className="text-gray-600 mb-6">
              Access real-time beach data, historical trends, and predictive analytics through 
              our RESTful API. Build custom dashboards, automate alerts, and integrate beach 
              intelligence into your existing systems.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10.28 2.28L4 8.56 1.72 6.28l1.06-1.06L4 6.44l5.22-5.22 1.06 1.06z"/>
                  </svg>
                </div>
                <span className="text-gray-700">RESTful API with JSON responses</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10.28 2.28L4 8.56 1.72 6.28l1.06-1.06L4 6.44l5.22-5.22 1.06 1.06z"/>
                  </svg>
                </div>
                <span className="text-gray-700">WebSocket support for real-time updates</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10.28 2.28L4 8.56 1.72 6.28l1.06-1.06L4 6.44l5.22-5.22 1.06 1.06z"/>
                  </svg>
                </div>
                <span className="text-gray-700">SDKs for Python, JavaScript, and PHP</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-1 mt-0.5">
                  <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10.28 2.28L4 8.56 1.72 6.28l1.06-1.06L4 6.44l5.22-5.22 1.06 1.06z"/>
                  </svg>
                </div>
                <span className="text-gray-700">99.9% uptime SLA guarantee</span>
              </li>
            </ul>
            <Link
              href="/api-docs"
              className="text-ocean-600 font-medium hover:text-ocean-700 inline-flex items-center"
            >
              View API Documentation
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 text-white font-mono text-sm">
            <div className="mb-4">
              <span className="text-gray-500"># Get current conditions for Waikiki Beach</span>
            </div>
            <div className="mb-4">
              <span className="text-purple-400">GET</span> /api/v1/beaches/waikiki/conditions
            </div>
            <div className="mb-4">
              <span className="text-gray-500"># Response</span>
            </div>
            <div className="text-green-400">
              {`{
  "beach": "Waikiki Beach",
  "conditions": {
    "waveHeight": 2.5,
    "waterTemp": 78,
    "visibility": 25,
    "uvIndex": 8,
    "safety": "good"
  },
  "alerts": [],
  "timestamp": "2024-01-15T10:30:00Z"
}`}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Business Clients Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8">
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-ocean-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Beach Operations?
          </h2>
          <p className="text-xl text-ocean-100 mb-8 max-w-2xl mx-auto">
            Join 250+ businesses using Beach Hui to keep customers safe and operations efficient.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-ocean-600 px-8 py-4 rounded-lg font-medium hover:bg-ocean-50 transition-colors inline-flex items-center"
            >
              <Phone className="mr-2 h-5 w-5" />
              Talk to Sales
            </Link>
            <Link
              href="/api-docs"
              className="border border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
            >
              Explore API Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}