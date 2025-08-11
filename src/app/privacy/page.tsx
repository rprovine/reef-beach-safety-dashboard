export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p>Beach Hui collects information to provide better services to our users:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Email, name, and tier preferences when you create an account</li>
              <li><strong>Usage Data:</strong> Beach views, alerts created, and app interactions</li>
              <li><strong>Location Data:</strong> With your permission, to show nearby beaches</li>
              <li><strong>Community Reports:</strong> Beach conditions and photos you share</li>
              <li><strong>Device Information:</strong> Device type, browser, and OS for optimization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide real-time beach conditions and safety alerts</li>
              <li>Send personalized notifications about beach conditions</li>
              <li>Improve our services through analytics</li>
              <li>Process payments for Pro subscriptions</li>
              <li>Communicate important updates and safety information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
            <p>We do not sell your personal information. We share data only:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your consent</li>
              <li>For legal requirements</li>
              <li>With service providers (payment processing, email delivery)</li>
              <li>Anonymized data for beach safety research</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>We implement industry-standard security measures including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure password hashing</li>
              <li>Regular security audits</li>
              <li>Limited data access controls</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
            <p>We use cookies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication and security</li>
              <li>Remembering preferences</li>
              <li>Analytics (Google Analytics, Mixpanel)</li>
              <li>Improving user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
            <p>Beach Hui is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p>We may update this privacy policy. We will notify you of significant changes via email or app notification.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p>For privacy concerns or questions:</p>
            <ul className="list-none space-y-2">
              <li>Email: privacy@beachhui.com</li>
              <li>Address: Beach Hui, Honolulu, HI 96815</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}