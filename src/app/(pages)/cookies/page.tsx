'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function CookiePolicyPage() {
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
            Cookie Policy
          </h1>
          <p className="mt-2 text-indigo-100">
            Learn how we use cookies and similar technologies.
          </p>
        </header>

        {/* Cookie Policy Section */}
        <section className="mb-12 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-3xl font-semibold mb-4 text-white drop-shadow">
            What Are Cookies?
          </h2>
          <p className="mb-4 text-indigo-100">
            Cookies are small data files stored on your device when you visit a website. They help us enhance your experience by remembering preferences, analyzing site traffic, and personalizing content.
          </p>

          <h2 className="text-3xl font-semibold mb-4 text-white drop-shadow mt-8">
            How We Use Cookies
          </h2>
          <ul className="list-disc list-inside text-indigo-100 space-y-2">
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly (e.g., authentication and security).</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our site so we can improve it.</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and choices to personalize your experience.</li>
            <li><strong>Marketing Cookies:</strong> Used to deliver relevant ads and track the effectiveness of campaigns (if applicable).</li>
          </ul>

          <h2 className="text-3xl font-semibold mb-4 text-white drop-shadow mt-8">
            Managing Cookies
          </h2>
          <p className="mb-4 text-indigo-100">
            You can control or delete cookies through your browser settings. Disabling some cookies may impact the functionality of our site.
          </p>

          <h2 className="text-3xl font-semibold mb-4 text-white drop-shadow mt-8">
            Third-Party Cookies
          </h2>
          <p className="text-indigo-100">
            Some cookies may be set by third-party services that appear on our pages. We do not control the use of these cookies.
          </p>
        </section>

        <p className="text-indigo-100 text-center mb-8">
          Last updated: July 2025
        </p>
      </main>
    </div>
  );
}
