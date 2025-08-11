'use client'

import { useState } from 'react'
import { 
  Shield, AlertTriangle, Fish, Heart, Waves, 
  Eye, Droplets, ThermometerSun, Users, 
  ChevronRight, Info, CheckCircle, XCircle,
  Book, Camera, MapPin
} from 'lucide-react'
import Link from 'next/link'

export default function ReefSafetyPage() {
  const [activeTab, setActiveTab] = useState<'hazards' | 'protection' | 'guidelines' | 'emergency'>('hazards')
  
  const hazards = [
    {
      name: 'Sharp Coral & Rocks',
      icon: '🪸',
      risk: 'high',
      description: 'Coral cuts can be serious and prone to infection',
      prevention: [
        'Wear reef shoes or booties',
        'Never stand on or touch coral',
        'Enter/exit water carefully',
        'Watch for shallow areas at low tide'
      ]
    },
    {
      name: 'Sea Urchins (Wana)',
      icon: '🦔',
      risk: 'high',
      description: 'Painful spines that break off in skin',
      prevention: [
        'Watch where you step',
        'Avoid rocky areas at night',
        'Wear protective footwear',
        'Use a flashlight in murky water'
      ]
    },
    {
      name: 'Portuguese Man o\' War',
      icon: '🎈',
      risk: 'medium',
      description: 'Painful stings even when washed up on beach',
      prevention: [
        'Check beach warnings',
        'Look for blue bubbles on sand',
        'Never touch even if appears dead',
        'Swim away if spotted in water'
      ]
    },
    {
      name: 'Box Jellyfish',
      icon: '🪼',
      risk: 'high',
      description: 'Arrives 8-10 days after full moon',
      prevention: [
        'Check lunar calendar',
        'Avoid swimming during warnings',
        'Stay in protected areas',
        'Wear protective clothing'
      ]
    },
    {
      name: 'Strong Currents',
      icon: '🌊',
      risk: 'extreme',
      description: 'Rip currents and surge can be deadly',
      prevention: [
        'Swim parallel to shore if caught',
        'Never fight the current directly',
        'Stay calm and conserve energy',
        'Wave for help if needed'
      ]
    },
    {
      name: 'Fire Coral',
      icon: '🔥',
      risk: 'medium',
      description: 'Causes burning sensation and welts',
      prevention: [
        'Learn to identify (yellowish-brown)',
        'Maintain safe distance',
        'Wear full wetsuit if needed',
        'Avoid contact with any coral'
      ]
    }
  ]
  
  const protectedSpecies = [
    {
      name: 'Hawaiian Monk Seal',
      hawaiianName: 'ʻIlio holo i ka uaua',
      status: 'Critically Endangered',
      distance: '150 feet (50 yards)',
      fine: 'Up to $50,000',
      tips: [
        'Call NOAA hotline if injured: 1-888-256-9840',
        'Never feed or approach',
        'Keep dogs away',
        'Allow seal to rest undisturbed'
      ]
    },
    {
      name: 'Green Sea Turtle',
      hawaiianName: 'Honu',
      status: 'Threatened',
      distance: '10 feet (3 meters)',
      fine: 'Up to $15,000',
      tips: [
        'Observe quietly from distance',
        'Never touch or ride',
        'Don\'t use flash photography',
        'Don\'t block their path to ocean'
      ]
    },
    {
      name: 'Spinner Dolphin',
      hawaiianName: 'Nai\'a',
      status: 'Protected',
      distance: '50 yards (150 feet)',
      fine: 'Up to $100,000',
      tips: [
        'Don\'t swim with or chase',
        'Observe from shore or boat',
        'Let them approach you',
        'Respect resting areas'
      ]
    },
    {
      name: 'Humpback Whale',
      hawaiianName: 'Koholā',
      status: 'Protected (Winter)',
      distance: '100 yards (300 feet)',
      fine: 'Up to $50,000',
      tips: [
        'Winter season: November - May',
        'Stay on designated vessels',
        'Report entanglements',
        'No drones near whales'
      ]
    }
  ]
  
  const safetyGuidelines = [
    {
      category: 'Before You Go',
      icon: <Book className="h-5 w-5" />,
      items: [
        'Check weather and surf conditions',
        'Review beach safety ratings',
        'Know your swimming ability',
        'Tell someone your plans',
        'Bring reef-safe sunscreen',
        'Pack first aid supplies'
      ]
    },
    {
      category: 'At the Beach',
      icon: <MapPin className="h-5 w-5" />,
      items: [
        'Observe for 10-15 minutes first',
        'Ask locals about conditions',
        'Locate lifeguard stations',
        'Identify safe entry/exit points',
        'Watch other swimmers',
        'Check for warning signs'
      ]
    },
    {
      category: 'In the Water',
      icon: <Waves className="h-5 w-5" />,
      items: [
        'Never turn your back on ocean',
        'Stay within your limits',
        'Swim with a buddy',
        'Stay hydrated',
        'Exit if conditions change',
        'Respect marine life'
      ]
    },
    {
      category: 'Photography',
      icon: <Camera className="h-5 w-5" />,
      items: [
        'No flash with sea turtles',
        'Maintain legal distances',
        'Use zoom lenses',
        'Don\'t disturb wildlife for photos',
        'Be aware of surroundings',
        'Secure equipment'
      ]
    }
  ]
  
  const emergencyInfo = {
    numbers: [
      { service: 'Emergency (Police/Fire/Medical)', number: '911' },
      { service: 'Coast Guard Search & Rescue', number: '1-800-552-6458' },
      { service: 'NOAA Marine Wildlife', number: '1-888-256-9840' },
      { service: 'Poison Control', number: '1-800-222-1222' },
      { service: 'Beach Safety Hotline', number: '(808) 555-SAFE' }
    ],
    firstAid: [
      {
        injury: 'Coral Cuts',
        treatment: [
          'Clean thoroughly with fresh water',
          'Remove visible debris gently',
          'Apply antibiotic ointment',
          'Cover with clean bandage',
          'Seek medical attention for deep cuts'
        ]
      },
      {
        injury: 'Jellyfish Sting',
        treatment: [
          'Rinse with seawater (not fresh)',
          'Apply vinegar for box jellyfish',
          'Remove tentacles with tweezers',
          'Apply heat or cold for pain',
          'Seek immediate help for severe reactions'
        ]
      },
      {
        injury: 'Sea Urchin Puncture',
        treatment: [
          'Soak in hot water (as hot as tolerable)',
          'Remove visible spines carefully',
          'Don\'t dig for embedded spines',
          'Apply antibiotic ointment',
          'See doctor if spines remain'
        ]
      }
    ]
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean-500 to-ocean-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reef & Ocean Safety Guide</h1>
              <p className="text-ocean-100 mt-2">
                Essential information for safe ocean activities in Hawaii
              </p>
            </div>
            <Shield className="h-16 w-16 text-ocean-200" />
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-8">
            {[
              { id: 'hazards', label: 'Hazards' },
              { id: 'protection', label: 'Protected Species' },
              { id: 'guidelines', label: 'Safety Guidelines' },
              { id: 'emergency', label: 'Emergency' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-ocean-600'
                    : 'bg-ocean-600 text-white hover:bg-ocean-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hazards Tab */}
        {activeTab === 'hazards' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hazards.map((hazard) => (
              <div key={hazard.name} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{hazard.icon}</span>
                    <h3 className="font-semibold text-gray-900">{hazard.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    hazard.risk === 'extreme' ? 'bg-red-100 text-red-700' :
                    hazard.risk === 'high' ? 'bg-orange-100 text-orange-700' :
                    hazard.risk === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {hazard.risk} risk
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{hazard.description}</p>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700 uppercase">Prevention</div>
                  {hazard.prevention.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Protected Species Tab */}
        {activeTab === 'protection' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Federal Protection Laws</h3>
                  <p className="text-yellow-800 text-sm">
                    All marine mammals and sea turtles are protected under federal law. 
                    Harassment, touching, or feeding these animals is illegal and can result in 
                    significant fines and criminal charges.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {protectedSpecies.map((species) => (
                <div key={species.name} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900">{species.name}</h3>
                    <p className="text-sm text-gray-600 italic">{species.hawaiianName}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                      species.status.includes('Critically') ? 'bg-red-100 text-red-700' :
                      species.status.includes('Threatened') ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {species.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500">Min Distance</div>
                      <div className="text-sm font-semibold text-gray-900">{species.distance}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Max Fine</div>
                      <div className="text-sm font-semibold text-red-600">{species.fine}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700 uppercase">Guidelines</div>
                    {species.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <Info className="h-3 w-3 text-ocean-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Safety Guidelines Tab */}
        {activeTab === 'guidelines' && (
          <div className="grid md:grid-cols-2 gap-6">
            {safetyGuidelines.map((section) => (
              <div key={section.category} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-ocean-100 rounded-lg text-ocean-600">
                    {section.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900">{section.category}</h3>
                </div>
                <div className="space-y-2">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Emergency Tab */}
        {activeTab === 'emergency' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-semibold text-red-900 mb-4">Emergency Contacts</h3>
                <div className="space-y-3">
                  {emergencyInfo.numbers.map((contact) => (
                    <div key={contact.service} className="pb-3 border-b border-red-200 last:border-0">
                      <div className="text-sm text-red-800">{contact.service}</div>
                      <a href={`tel:${contact.number}`} className="text-lg font-bold text-red-900 hover:text-red-700">
                        {contact.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-6">First Aid Procedures</h3>
                <div className="space-y-6">
                  {emergencyInfo.firstAid.map((item) => (
                    <div key={item.injury} className="border-l-4 border-ocean-500 pl-4">
                      <h4 className="font-medium text-gray-900 mb-3">{item.injury}</h4>
                      <div className="space-y-2">
                        {item.treatment.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-6 h-6 bg-ocean-100 text-ocean-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-gray-600">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Remember</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Stay calm in emergencies</li>
                  <li>• Call for help immediately when needed</li>
                  <li>• Don\'t move injured persons unless necessary</li>
                  <li>• Know your location for emergency services</li>
                  <li>• Prevention is always better than treatment</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}