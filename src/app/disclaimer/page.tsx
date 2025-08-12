import { AlertTriangle, Shield, Info, Users, Phone, Heart } from 'lucide-react'

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Safety Disclaimer
          </h1>
          <p className="text-xl text-gray-600">
            Important information about beach and ocean safety
          </p>
        </div>

        {/* Critical Warning */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-2">
                Critical Safety Notice
              </h2>
              <p className="text-red-800 leading-relaxed">
                Beach Hui provides informational data only and should never be your sole source 
                for making safety decisions. Ocean conditions can change rapidly and dangerously. 
                Always follow official lifeguard guidance, posted warning signs, and use your 
                best judgment when entering the water.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-ocean-600" />
              Your Safety is Your Responsibility
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <p className="text-gray-700">
                While Beach Hui strives to provide accurate and timely information about beach 
                conditions, reef health, and ocean safety, we cannot guarantee the accuracy, 
                completeness, or timeliness of this information. Conditions in the ocean can 
                change within minutes, and data delays or technical issues may occur.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-ocean-600 mt-1">•</span>
                  <span>Always check with lifeguards before entering the water</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean-600 mt-1">•</span>
                  <span>Observe posted warning signs and flags at all beaches</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean-600 mt-1">•</span>
                  <span>Never turn your back on the ocean</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean-600 mt-1">•</span>
                  <span>Know your limits and swim within your abilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean-600 mt-1">•</span>
                  <span>Be aware of local hazards including rip currents, shore breaks, and marine life</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="h-6 w-6 text-ocean-600" />
              Data Sources and Limitations
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <p className="text-gray-700">
                Beach Hui aggregates data from multiple sources including:
              </p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• OpenWeather API for weather and UV data</li>
                <li>• NOAA for tide and marine forecasts</li>
                <li>• Hawaii Department of Health for water quality</li>
                <li>• Community reports from beach users</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                <p className="text-yellow-900 text-sm">
                  <strong>Important:</strong> Data may be delayed, incomplete, or temporarily unavailable. 
                  Equipment failures, network issues, or extreme weather can affect data collection. 
                  Always verify conditions in person before making safety decisions.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-6 w-6 text-ocean-600" />
              Special Considerations
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">For Visitors</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Hawaii's ocean conditions differ greatly from mainland beaches</li>
                    <li>• Waves can be deceptively powerful</li>
                    <li>• Ask locals about specific beach hazards</li>
                    <li>• Consider taking a ocean safety class</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">For Families</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Never leave children unattended near water</li>
                    <li>• Even shallow water can be dangerous</li>
                    <li>• Use proper flotation devices</li>
                    <li>• Teach children about ocean safety</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="h-6 w-6 text-ocean-600" />
              Emergency Contacts
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-red-50 rounded-lg p-4">
                  <p className="font-semibold text-red-900 mb-1">Emergency</p>
                  <p className="text-2xl font-bold text-red-600">911</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="font-semibold text-blue-900 mb-1">Ocean Safety</p>
                  <p className="text-2xl font-bold text-blue-600">(808) 922-3888</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                For non-emergency questions about beach conditions, contact the Ocean Safety 
                Division of your island's county government.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="h-6 w-6 text-ocean-600" />
              Reef and Marine Life Protection
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <p className="text-gray-700">
                While enjoying Hawaii's beaches, please help protect our fragile marine ecosystems:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Use reef-safe sunscreen only</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Don't touch or stand on coral reefs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Maintain distance from marine life (sea turtles, monk seals, dolphins)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Take only pictures, leave only footprints</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Report injured marine animals to authorities</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Legal Disclaimer */}
          <section className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Legal Disclaimer
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 text-sm text-gray-600 space-y-3">
              <p>
                <strong>NO WARRANTIES:</strong> Beach Hui and LeniLani Consulting provide this 
                service "as is" without any warranties, express or implied. We do not warrant 
                that the service will be uninterrupted, timely, secure, or error-free.
              </p>
              <p>
                <strong>LIMITATION OF LIABILITY:</strong> In no event shall Beach Hui, LeniLani 
                Consulting, or its affiliates be liable for any direct, indirect, incidental, 
                special, consequential, or punitive damages arising from your use of this service 
                or reliance on the information provided.
              </p>
              <p>
                <strong>INDEMNIFICATION:</strong> You agree to indemnify and hold harmless Beach 
                Hui and LeniLani Consulting from any claims arising from your use of this service 
                or your activities in or around ocean environments.
              </p>
              <p>
                <strong>GOVERNING LAW:</strong> This disclaimer shall be governed by the laws of 
                the State of Hawaii, without regard to its conflict of law provisions.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mt-12 text-center">
            <p className="text-gray-600">
              Questions or concerns about this disclaimer?
            </p>
            <p className="text-gray-600">
              Contact us at{' '}
              <a href="mailto:info@lenilani.com" className="text-ocean-600 hover:text-ocean-700">
                info@lenilani.com
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}