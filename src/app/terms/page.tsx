export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By using Beach Hui, you agree to these Terms of Service. If you disagree with any part, please do not use our service.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p>Beach Hui provides:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Real-time beach condition information</li>
              <li>Safety alerts and recommendations</li>
              <li>Community reporting features</li>
              <li>Subscription-based premium features</li>
            </ul>
            <p className="mt-4 font-semibold">Important: Beach Hui is for informational purposes only. Always use your judgment and follow official safety warnings.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate information</li>
              <li>You are responsible for account security</li>
              <li>One person per account</li>
              <li>You must be 13+ years old</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Subscription Terms</h2>
            <h3 className="text-xl font-semibold mb-2">Pro Tier ($9.99/month)</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Billed monthly</li>
              <li>Cancel anytime</li>
              <li>No refunds for partial months</li>
              <li>Features subject to availability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Content</h2>
            <p>When you submit reports or photos:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You retain ownership of your content</li>
              <li>You grant Beach Hui a license to use, display, and distribute</li>
              <li>Content must be accurate and not misleading</li>
              <li>No inappropriate or harmful content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Prohibited Uses</h2>
            <p>You may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Submit false beach reports</li>
              <li>Harass other users</li>
              <li>Scrape or copy our data</li>
              <li>Use the service for illegal purposes</li>
              <li>Attempt to hack or disrupt the service</li>
              <li>Resell or redistribute premium features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="font-semibold">⚠️ Important Safety Notice</p>
              <p>Beach Hui provides information for planning purposes only. Ocean conditions can change rapidly. Always:</p>
              <ul className="list-disc pl-6 mt-2">
                <li>Check official warnings</li>
                <li>Observe actual conditions</li>
                <li>Follow lifeguard instructions</li>
                <li>Use appropriate safety equipment</li>
              </ul>
            </div>
            <p>The service is provided "as is" without warranties of any kind.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>Beach Hui is not liable for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Injuries or damages from beach activities</li>
              <li>Inaccurate conditions or predictions</li>
              <li>Service interruptions</li>
              <li>Third-party content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p>You agree to indemnify Beach Hui from claims arising from your use of the service or violation of these terms.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p>We may modify these terms. Continued use after changes constitutes acceptance.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p>We may terminate accounts that violate these terms. You may delete your account at any time.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p>These terms are governed by the laws of Hawaii, USA.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact</h2>
            <p>For questions about these terms:</p>
            <ul className="list-none space-y-2">
              <li>Email: legal@beachhui.com</li>
              <li>Address: Beach Hui, Honolulu, HI 96815</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}