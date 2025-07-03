'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans transition-colors">

      <main className="flex-grow flex flex-col py-12 px-8 sm:px-12 lg:px-16 overflow-auto max-w-4xl mx-auto">
        <header className="mb-12 border-b border-white/20 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
            Privacy Policy
          </h1>
        </header>

        <section className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 space-y-6">

          <p>
            This Privacy Policy describes how we collect, use, and protect your personal information when you use our smart flashcard collections application (the “Service”). Your privacy is important to us, and we are committed to safeguarding it.
          </p>

          <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
          <p>
            We collect several types of information to provide and improve our Service:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Personal Information:</strong> When you register or use our Service, we may collect your name, email address, and authentication identifiers (via third-party services like Clerk).</li>
            <li><strong>Content Data:</strong> Information you create within the Service, including flashcard decks, deck names, descriptions, and other content you upload or enter.</li>
            <li><strong>Usage Data:</strong> Data about how you interact with the Service, such as features used, access times, and device information to help improve performance and user experience.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>To provide, maintain, and personalize your experience with the Service.</li>
            <li>To authenticate your identity and manage your account securely.</li>
            <li>To communicate important updates, security alerts, and support messages.</li>
            <li>To analyze usage patterns for improving the Service and fixing issues.</li>
            <li>To comply with legal obligations and enforce our Terms of Service.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">3. How We Share Your Information</h2>
          <p>
            We do not sell or trade your personal information to third parties. We may share your data with:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Service Providers:</strong> Trusted third parties who assist with hosting, data storage, analytics, and customer support.</li>
            <li><strong>Legal Compliance:</strong> When required by law, to respond to legal processes or protect rights and safety.</li>
          </ul>
          <p>
            All third parties are required to handle your information securely and confidentially.
          </p>

          <h2 className="text-2xl font-semibold mt-6">4. Data Security</h2>
          <p>
            We implement industry-standard security measures including encryption, access controls, and regular security assessments to protect your information. However, no system is completely secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-semibold mt-6">5. Data Retention</h2>
          <p>
            We retain your personal data only as long as necessary to provide the Service and fulfill legal obligations. When you delete your account or content, we will remove your information from active systems, though some data may persist in backups for a limited time.
          </p>

          <h2 className="text-2xl font-semibold mt-6">6. Your Rights and Choices</h2>
          <p>You have control over your personal data and may:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Access and update your profile information.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>Opt-out of marketing communications by following the unsubscribe instructions.</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information below.
          </p>

          <h2 className="text-2xl font-semibold mt-6">7. Third-Party Services</h2>
          <p>
            Our Service may use third-party services such as Clerk for authentication and other integrations. These services have their own privacy policies and data handling practices.
          </p>

          <h2 className="text-2xl font-semibold mt-6">8. Children’s Privacy</h2>
          <p>
            Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal data, please contact us immediately.
          </p>

          <h2 className="text-2xl font-semibold mt-6">9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically to reflect changes in practices or legal requirements. We will notify you of any material changes by posting the updated policy here with a new effective date.
          </p>

          <h2 className="text-2xl font-semibold mt-6">10. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or your personal data, please contact us at{' '}
            <a href="mailto:support@example.com" className="underline hover:text-pink-300">
              support@flashcards.com
            </a>.
          </p>

          <p className="text-sm opacity-75 mt-8">
            <em>Effective Date: July 3, 2025</em>
          </p>
        </section>
      </main>
    </div>
  );
}
