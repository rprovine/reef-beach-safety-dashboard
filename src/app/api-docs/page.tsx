'use client'

import { useState } from 'react'
import { Code, Book, Key, Shield, Zap, Globe, Copy, Check, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const endpoints = [
  {
    category: 'Beaches',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/beaches',
        description: 'List all beaches',
        auth: false
      },
      {
        method: 'GET',
        path: '/api/v1/beaches/{id}',
        description: 'Get beach details',
        auth: false
      },
      {
        method: 'GET',
        path: '/api/v1/beaches/{id}/conditions',
        description: 'Get current conditions',
        auth: false
      },
      {
        method: 'GET',
        path: '/api/v1/beaches/{id}/forecast',
        description: 'Get 7-day forecast',
        auth: true
      }
    ]
  },
  {
    category: 'Alerts',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/alerts',
        description: 'List user alerts',
        auth: true
      },
      {
        method: 'POST',
        path: '/api/v1/alerts',
        description: 'Create new alert',
        auth: true
      },
      {
        method: 'DELETE',
        path: '/api/v1/alerts/{id}',
        description: 'Delete alert',
        auth: true
      }
    ]
  },
  {
    category: 'Reef Health',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/reef/{location}',
        description: 'Get reef health data',
        auth: false
      },
      {
        method: 'GET',
        path: '/api/v1/reef/{location}/history',
        description: 'Get historical data',
        auth: true
      }
    ]
  }
]

const codeExamples = {
  javascript: `// Get beach conditions
fetch('https://api.beachhui.com/v1/beaches/waikiki/conditions', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
  
  python: `# Get beach conditions
import requests

response = requests.get(
    'https://api.beachhui.com/v1/beaches/waikiki/conditions',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)
data = response.json()
print(data)`,
  
  curl: `# Get beach conditions
curl -X GET "https://api.beachhui.com/v1/beaches/waikiki/conditions" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
}

export default function ApiDocsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [copied, setCopied] = useState(false)
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0].endpoints[0])

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[selectedLanguage])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Beach Hui API Documentation</h1>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Build amazing applications with real-time beach and reef data
          </p>
          <div className="flex gap-4">
            <Link
              href="/auth/signup?tier=pro"
              className="bg-ocean-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors inline-flex items-center"
            >
              Get API Key
              <Key className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="https://github.com/beachhui/api-examples"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              View Examples
            </a>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-ocean-100 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-ocean-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900">Get Your API Key</h3>
            </div>
            <p className="text-gray-600">
              Sign up for a Pro or Business account to get your API key
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-ocean-100 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-ocean-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900">Make Your First Call</h3>
            </div>
            <p className="text-gray-600">
              Use our RESTful endpoints to fetch beach data
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-ocean-100 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-ocean-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900">Build Amazing Apps</h3>
            </div>
            <p className="text-gray-600">
              Integrate beach data into your applications
            </p>
          </div>
        </div>

        {/* Base URL */}
        <div className="bg-gray-900 text-white rounded-lg p-6 mb-12">
          <h3 className="text-lg font-semibold mb-2">Base URL</h3>
          <code className="text-green-400 text-lg">https://api.beachhui.com/v1</code>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">API Endpoints</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Endpoint List */}
            <div className="lg:col-span-1">
              {endpoints.map((category) => (
                <div key={category.category} className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-3">{category.category}</h3>
                  <div className="space-y-2">
                    {category.endpoints.map((endpoint) => (
                      <button
                        key={endpoint.path}
                        onClick={() => setSelectedEndpoint(endpoint)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedEndpoint === endpoint
                            ? 'bg-ocean-100 border border-ocean-300'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-semibold ${
                            endpoint.method === 'GET' ? 'text-green-600' :
                            endpoint.method === 'POST' ? 'text-blue-600' :
                            'text-red-600'
                          }`}>
                            {endpoint.method}
                          </span>
                          {endpoint.auth && (
                            <Shield className="h-3 w-3 text-yellow-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1 font-mono">{endpoint.path}</p>
                        <p className="text-xs text-gray-600 mt-1">{endpoint.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Endpoint Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-lg font-mono font-semibold ${
                      selectedEndpoint.method === 'GET' ? 'text-green-600' :
                      selectedEndpoint.method === 'POST' ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {selectedEndpoint.method}
                    </span>
                    <code className="text-gray-700">{selectedEndpoint.path}</code>
                    {selectedEndpoint.auth && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Auth Required
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{selectedEndpoint.description}</p>
                </div>

                {/* Code Example */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Example Request</h4>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="curl">cURL</option>
                      </select>
                      <button
                        onClick={copyCode}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{codeExamples[selectedLanguage]}</code>
                  </pre>
                </div>

                {/* Response Example */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Example Response</h4>
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm text-green-400">{`{
  "beach": {
    "id": "waikiki",
    "name": "Waikiki Beach",
    "location": {
      "lat": 21.2765,
      "lng": -157.8255
    }
  },
  "conditions": {
    "waveHeight": 2.5,
    "wavePeriod": 8,
    "waterTemp": 78,
    "visibility": 25,
    "uvIndex": 8,
    "windSpeed": 12,
    "windDirection": "ENE"
  },
  "safety": {
    "overall": "good",
    "flags": ["green"],
    "hazards": [],
    "lifeguards": true
  },
  "timestamp": "2024-01-15T10:30:00Z"
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Limits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Free Plan</h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">10</p>
            <p className="text-gray-600">requests per day</p>
          </div>
          <div className="bg-gradient-to-r from-ocean-500 to-purple-600 text-white rounded-lg p-6">
            <h3 className="font-semibold mb-2">Pro Plan</h3>
            <p className="text-3xl font-bold mb-2">100</p>
            <p className="text-ocean-100">requests per day</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Business Plan</h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">Unlimited</p>
            <p className="text-gray-600">no limits</p>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Authentication</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 mb-4">
              The Beach Hui API uses API keys to authenticate requests. You can get your API key 
              from your dashboard after signing up for a Pro or Business account.
            </p>
            <div className="bg-gray-900 text-white rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Include your API key in the Authorization header:</p>
              <code className="text-green-400">Authorization: Bearer YOUR_API_KEY</code>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Security Note:</strong> Keep your API key secure and never expose it in 
                client-side code or public repositories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SDKs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Official SDKs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <a href="https://github.com/beachhui/js-sdk" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">JavaScript/TypeScript</h3>
            <code className="text-sm text-gray-600">npm install @beachhui/sdk</code>
          </a>
          <a href="https://github.com/beachhui/python-sdk" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Python</h3>
            <code className="text-sm text-gray-600">pip install beachhui</code>
          </a>
          <a href="https://github.com/beachhui/php-sdk" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">PHP</h3>
            <code className="text-sm text-gray-600">composer require beachhui/sdk</code>
          </a>
        </div>
      </div>

      {/* Support */}
      <div className="bg-ocean-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-ocean-100 mb-6">
            Our developer support team is here to help you integrate Beach Hui API
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-ocean-600 px-6 py-3 rounded-lg font-medium hover:bg-ocean-50 transition-colors"
            >
              Contact Support
            </Link>
            <a
              href="https://discord.gg/beachhui"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-ocean-700 transition-colors"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}