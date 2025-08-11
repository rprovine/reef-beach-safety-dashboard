'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shield, AlertTriangle, CheckCircle, Activity, 
  Wind, Waves, Sun, CloudRain, Bell, TrendingUp,
  Users, Building2, Smartphone, BarChart3, Map,
  ArrowRight, Play, Star
} from 'lucide-react'
import { SignUpButton } from '@clerk/nextjs'

const beachStats = [
  { label: 'Beaches Monitored', value: '47', icon: Map },
  { label: 'Active Alerts', value: '12', icon: Bell },
  { label: 'Data Updates/Day', value: '2,880', icon: Activity },
  { label: 'Business Partners', value: '23', icon: Building2 },
]

const features = [
  {
    icon: Shield,
    title: 'Real-Time Safety Status',
    description: 'Live updates every 15 minutes from NOAA, PacIOOS, and Hawaii DOH.',
    color: 'from-green-400 to-emerald-600',
  },
  {
    icon: Bell,
    title: 'Custom Alerts',
    description: 'Get notified via SMS or email when conditions change at your beaches.',
    color: 'from-blue-400 to-ocean-600',
  },
  {
    icon: BarChart3,
    title: '7-Day Forecasts',
    description: 'Plan ahead with detailed wave, wind, and tide predictions.',
    color: 'from-purple-400 to-indigo-600',
  },
  {
    icon: Smartphone,
    title: 'Embeddable Widgets',
    description: 'Add live beach conditions to your website in minutes.',
    color: 'from-coral-400 to-coral-600',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'General Manager, Waikiki Beach Resort',
    content: 'ReefSafe has reduced our guest inquiries about beach conditions by 70%. The widget on our website is invaluable.',
    rating: 5,
    image: '/testimonials/sarah.jpg',
  },
  {
    name: 'Kai Nakamura',
    role: 'Owner, North Shore Surf School',
    content: 'The alert system helps us plan our lessons perfectly. We know exactly when conditions are ideal for beginners.',
    rating: 5,
    image: '/testimonials/kai.jpg',
  },
  {
    name: 'Maria Santos',
    role: 'Concierge, Four Seasons Maui',
    content: 'Our guests love that we can give them real-time, accurate beach safety information. It builds trust.',
    rating: 5,
    image: '/testimonials/maria.jpg',
  },
]

export default function HomePage() {
  const [currentBeachStatus, setCurrentBeachStatus] = useState('green')
  const [videoPlaying, setVideoPlaying] = useState(false)

  useEffect(() => {
    // Simulate real-time status changes
    const interval = setInterval(() => {
      const statuses = ['green', 'yellow', 'red']
      setCurrentBeachStatus(statuses[Math.floor(Math.random() * statuses.length)])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/50 via-ocean-800/30 to-ocean-900/50 z-10" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/images/beach-hero.jpg"
          >
            <source src="/videos/ocean-waves.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-white bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <span className={`inline-block w-2 h-2 mr-2 rounded-full animate-pulse ${
                currentBeachStatus === 'green' ? 'bg-green-400' : 
                currentBeachStatus === 'yellow' ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              Live beach conditions updating now
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
              Know Before
              <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                You Go
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Real-time beach safety monitoring for Hawaii. 
              Get instant alerts, forecasts, and conditions for 47+ beaches across the islands.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <button className="px-8 py-4 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                  Start Free Trial
                  <ArrowRight className="inline-block ml-2 h-5 w-5" />
                </button>
              </SignUpButton>

              <button
                onClick={() => setVideoPlaying(true)}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </button>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
              {beachStats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="text-white"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-white/60" />
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600">
              Real-time data from Hawaii's most popular beaches
            </p>
          </div>

          {/* Beach Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <BeachStatusCard
              name="Waikiki Beach"
              status="green"
              waveHeight="2.5 ft"
              windSpeed="8 mph"
              waterTemp="78°F"
            />
            <BeachStatusCard
              name="Pipeline"
              status="red"
              waveHeight="12 ft"
              windSpeed="18 mph"
              waterTemp="76°F"
              advisory="High Surf Warning"
            />
            <BeachStatusCard
              name="Lanikai Beach"
              status="yellow"
              waveHeight="4 ft"
              windSpeed="14 mph"
              waterTemp="79°F"
            />
          </div>

          <div className="text-center">
            <Link
              href="/beaches"
              className="inline-flex items-center text-ocean-600 hover:text-ocean-700 font-semibold"
            >
              View all 47 beaches
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Everything You Need for Beach Safety
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by hotels, tour operators, and thousands of beachgoers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}
                />
                <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Trusted by Hawaii's Top Hospitality Brands
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full mr-3" />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-ocean-500 to-ocean-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-4">
            Start Protecting Your Guests Today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join 23+ businesses already using ReefSafe to keep their guests informed and safe
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignUpButton mode="modal">
              <button className="px-8 py-4 bg-white text-ocean-600 font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                Start 14-Day Free Trial
              </button>
            </SignUpButton>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white hover:bg-white/10 transition-all duration-200"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Beach Status Card Component
function BeachStatusCard({ name, status, waveHeight, windSpeed, waterTemp, advisory }: any) {
  const statusColors = {
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    red: 'bg-red-100 text-red-800 border-red-200',
  }

  const statusIcons = {
    green: CheckCircle,
    yellow: AlertTriangle,
    red: AlertTriangle,
  }

  const StatusIcon = statusIcons[status as keyof typeof statusIcons]

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className={`p-4 ${status === 'green' ? 'bg-green-50' : status === 'yellow' ? 'bg-yellow-50' : 'bg-red-50'}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[status as keyof typeof statusColors]}`}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {status === 'green' ? 'Safe' : status === 'yellow' ? 'Caution' : 'Unsafe'}
          </div>
        </div>
        {advisory && (
          <div className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-md">
            ⚠️ {advisory}
          </div>
        )}
      </div>
      <div className="p-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <Waves className="h-5 w-5 text-ocean-500 mx-auto mb-1" />
          <div className="text-sm text-gray-600">Waves</div>
          <div className="font-semibold text-gray-900">{waveHeight}</div>
        </div>
        <div className="text-center">
          <Wind className="h-5 w-5 text-ocean-500 mx-auto mb-1" />
          <div className="text-sm text-gray-600">Wind</div>
          <div className="font-semibold text-gray-900">{windSpeed}</div>
        </div>
        <div className="text-center">
          <Sun className="h-5 w-5 text-ocean-500 mx-auto mb-1" />
          <div className="text-sm text-gray-600">Temp</div>
          <div className="font-semibold text-gray-900">{waterTemp}</div>
        </div>
      </div>
    </div>
  )
}