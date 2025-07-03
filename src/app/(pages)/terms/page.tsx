'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect if not signed in
  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.push('/sign-in');
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) return null;

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans transition-colors">
      <main className="flex-grow flex flex-col py-12 px-8 sm:px-12 lg:px-16 overflow-auto max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 border-b border-white/20 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
            Privacy Policy & Terms of Service
          </h1>
          <p className="mt-2 text-indigo-100">
            Please read these terms carefully before using our services.
          </p>
        </header>

        {/* Privacy Policy Section */}
        <section className="mb-12 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-3xl font-semibold mb-4 text-white drop-shadow">
            Privacy Policy
          </h2>
          <p className="mb-4 text-indigo-100">
            We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your data when you use our services.
          </p>
          <ul className="list-disc list-inside text-indigo-100 space-y-2">
            <li><strong>Data Collection:</strong> We collect personal information such as your name and email address only when you register or interact with our platform.</li>
            <li><strong>Data Usage:</strong> Your data is used to provide and improve our services, communicate with you, and personalize your experience.</li>
            <li><strong>Data Sharing:</strong> We do not sell or rent your personal information to third parties. We may share data with trusted service providers under strict confidentiality agreements.</li>
            <li><strong>Security:</strong> We implement appropriate technical and organizational measures to protect your data against unauthorized access, loss, or misuse.</li>
            <li><strong>Your Rights:</strong> You have the right to access, update, or delete your personal information at any time.</li>
          </ul>
        </section>

        {/* Terms of Service Section */}
        <section className="mb-12 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-3xl font-semibold mb-4 text-white drop-shadow">
            Terms of Service
          </h2>
          <p className="mb-4 text-indigo-100">
            By using our services, you agree to the following terms and conditions:
          </p>
          <ul className="list-disc list-inside text-indigo-100 space-y-2">
            <li><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account and password.</li>
            <li><strong>Acceptable Use:</strong> You agree not to misuse our services or engage in prohibited activities such as illegal actions, harassment, or spreading harmful content.</li>
            <li><strong>Content Ownership:</strong> You retain ownership of the content you create. We are not responsible for user-generated content.</li>
            <li><strong>Service Availability:</strong> We strive to keep our services available but do not guarantee uninterrupted access.</li>
            <li><strong>Modifications:</strong> We may update these terms periodically. Continued use of the service indicates acceptance of any changes.</li>
            <li><strong>Limitation of Liability:</strong> We are not liable for any damages arising from your use of the services.</li>
          </ul>
        </section>

        <p className="text-indigo-100 text-center mb-8">
          Last updated: July 2025
        </p>
      </main>
    </div>
  );
}
