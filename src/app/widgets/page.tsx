'use client'

import { useState } from 'react'
import { Code, Copy, Check, Monitor, Smartphone, Globe, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const widgetTypes = [
  {
    id: 'current-conditions',
    name: 'Current Conditions Widget',
    description: 'Display real-time beach conditions on your website',
    preview: '🌊 Wave Height: 3-5ft | 🌡️ Water: 78°F | ☀️ UV: 8',
    code: `<iframe src="https://beachhui.com/widget/conditions?beach=waikiki" width="350" height="200" frameborder="0"></iframe>`
  },
  {
    id: 'safety-badge',
    name: 'Safety Badge',
    description: 'Show current safety status with color-coded badge',
    preview: '✅ Beach Safety: GOOD',
    code: `<script src="https://beachhui.com/widget/safety-badge.js" data-beach="waikiki"></script>`
  },
  {
    id: 'forecast',
    name: '7-Day Forecast Widget',
    description: 'Embed weekly beach forecast',
    preview: '📅 7-Day Forecast Available',
    code: `<iframe src="https://beachhui.com/widget/forecast?beach=waikiki&days=7" width="400" height="300" frameborder="0"></iframe>`
  },
  {
    id: 'reef-health',
    name: 'Reef Health Monitor',
    description: 'Display coral reef health metrics',
    preview: '🐠 Reef Health: 85% | 🌡️ Bleaching Risk: Low',
    code: `<div id="reef-health-widget" data-location="waikiki"></div>
<script src="https://beachhui.com/widget/reef-health.js"></script>`
  }
]

const customizationOptions = [
  { name: 'Theme', options: ['Light', 'Dark', 'Auto'] },
  { name: 'Size', options: ['Compact', 'Standard', 'Large'] },
  { name: 'Language', options: ['English', 'Japanese', 'Chinese'] },
  { name: 'Units', options: ['Imperial', 'Metric'] }
]

export default function WidgetsPage() {
  const [selectedWidget, setSelectedWidget] = useState(widgetTypes[0])
  const [copied, setCopied] = useState(false)
  const [customization, setCustomization] = useState({
    theme: 'Light',
    size: 'Standard',
    language: 'English',
    units: 'Imperial'
  })

  const copyCode = () => {
    navigator.clipboard.writeText(selectedWidget.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-ocean-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code className="h-6 w-6 text-ocean-600" />
              <span className="text-ocean-600 font-medium">BEACH HUI WIDGETS</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Embed Beach Data Anywhere
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Add real-time beach conditions, safety alerts, and reef health data to your 
              website with our customizable widgets. No coding experience required.
            </p>
          </div>
        </div>
      </div>

      {/* Widget Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Widget Selection */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose a Widget</h2>
            <div className="space-y-3">
              {widgetTypes.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => setSelectedWidget(widget)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedWidget.id === widget.id
                      ? 'border-ocean-500 bg-ocean-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-gray-900">{widget.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Widget Preview and Code */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Preview */}
              <div className="border-b border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="text-2xl mb-2">🏖️</div>
                  <div className="font-mono text-sm text-gray-700">
                    {selectedWidget.preview}
                  </div>
                </div>
              </div>

              {/* Customization */}
              <div className="border-b border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize</h3>
                <div className="grid grid-cols-2 gap-4">
                  {customizationOptions.map((option) => (
                    <div key={option.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {option.name}
                      </label>
                      <select
                        value={customization[option.name.toLowerCase()]}
                        onChange={(e) => setCustomization({
                          ...customization,
                          [option.name.toLowerCase()]: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        {option.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Embed Code */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Embed Code</h3>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-2 px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{selectedWidget.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Widget Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-ocean-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-8 w-8 text-ocean-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Responsive Design</h3>
              <p className="text-gray-600">
                Widgets automatically adapt to any screen size and device
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">
                Data refreshes automatically every 5 minutes
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
              <p className="text-gray-600">
                Perfect for mobile apps and responsive websites
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-ocean-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Integration Guide</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-ocean-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Choose Your Widget</h3>
                <p className="text-gray-600">Select from our pre-built widgets or customize your own</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-ocean-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Copy the Code</h3>
                <p className="text-gray-600">Click the copy button to get the embed code</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-ocean-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Paste in Your Website</h3>
                <p className="text-gray-600">Add the code to your HTML where you want the widget to appear</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <Link
              href="/api-docs"
              className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors inline-flex items-center"
            >
              View API Docs
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="border border-ocean-600 text-ocean-600 px-6 py-3 rounded-lg font-medium hover:bg-ocean-50 transition-colors"
            >
              Get Support
            </Link>
          </div>
        </div>
      </div>

      {/* Pricing Note */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-gray-600">
            Widgets are available on all plans. Pro and Business plans get priority updates and custom styling.
          </p>
          <Link
            href="/pricing"
            className="text-ocean-600 font-medium hover:text-ocean-700 inline-flex items-center mt-2"
          >
            View Pricing Plans
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}