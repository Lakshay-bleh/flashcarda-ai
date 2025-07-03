'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function CareersPage() {
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
            Careers
          </h1>
          <p className="mt-2 text-indigo-100">
            Join us and help shape the future of our platform.
          </p>
        </header>

        {/* Careers Section */}
        <section className="mb-12 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-3xl font-semibold mb-4 text-white drop-shadow">
            Why Work With Us?
          </h2>
          <p className="mb-4 text-indigo-100">
            We&apos;re building meaningful products and are committed to a culture of innovation, inclusivity, and impact. As a member of our team, you’ll have the freedom to grow, the tools to succeed, and the support to thrive.
          </p>

          <ul className="list-disc list-inside text-indigo-100 space-y-2">
            <li>🌍 Remote-first culture</li>
            <li>💻 Modern tech stack</li>
            <li>🧠 Learning & development support</li>
            <li>📈 Equity opportunities</li>
            <li>💖 Diverse and inclusive team</li>
          </ul>
        </section>

        {/* Open Roles Section */}
        <section className="mb-12 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-3xl font-semibold mb-4 text-white drop-shadow">
            Open Positions
          </h2>

          <div className="space-y-6">
            <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-white drop-shadow">
                Frontend Engineer
              </h3>
              <p className="text-indigo-100 mt-2">Build delightful user experiences using React, Next.js, and Tailwind.</p>
              <p className="text-indigo-200 mt-1 italic">Remote — Full Time</p>
            </div>

            <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-white drop-shadow">
                Backend Engineer
              </h3>
              <p className="text-indigo-100 mt-2">Work on robust, scalable APIs and microservices using Node.js and PostgreSQL.</p>
              <p className="text-indigo-200 mt-1 italic">Remote — Full Time</p>
            </div>

            <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-white drop-shadow">
                Product Designer
              </h3>
              <p className="text-indigo-100 mt-2">Design intuitive interfaces and define the user journey from concept to launch.</p>
              <p className="text-indigo-200 mt-1 italic">Remote — Contract</p>
            </div>
          </div>
        </section>

        <p className="text-indigo-100 text-center mb-8">
          Don’t see a role that fits? Reach out to us at <a href="mailto:careers@example.com" className="underline">careers@flashcards.com</a>
        </p>
      </main>
    </div>
  );
}
