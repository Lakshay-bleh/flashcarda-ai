'use client';

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="font-[Inter] bg-white text-gray-900">

      {/* Hero Section */}
      <section className="bg-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-indigo-200">
            Whether you&apos;re just getting started or ready to power up your learning, we&apos;ve got a plan for you.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-gray-600">
              Start free and upgrade anytime as your learning needs grow.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-lg p-6 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Free</h3>
              <p className="mt-4 text-4xl font-extrabold text-gray-900">$0</p>
              <p className="mt-2 text-gray-600">Forever</p>
              <ul className="mt-6 space-y-2 text-gray-600 text-sm">
                <li>✅ Unlimited decks</li>
                <li>✅ Basic spaced repetition</li>
                <li>✅ Limited AI generation</li>
              </ul>
              <Link
                href="/sign-up"
                className="mt-6 inline-block px-5 py-3 text-indigo-600 bg-white border border-indigo-600 rounded-md font-medium hover:bg-indigo-50"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="border border-indigo-600 rounded-lg p-6 text-center shadow-lg bg-indigo-50">
              <h3 className="text-xl font-semibold text-indigo-800">Pro</h3>
              <p className="mt-4 text-4xl font-extrabold text-indigo-800">$8</p>
              <p className="mt-2 text-indigo-600">per month</p>
              <ul className="mt-6 space-y-2 text-indigo-700 text-sm">
                <li>🚀 Advanced spaced repetition</li>
                <li>📊 Progress tracking & analytics</li>
                <li>🔒 Private decks</li>
                <li>🧠 AI-generated flashcards</li>
              </ul>
              <Link
                href="/sign-up"
                className="mt-6 inline-block px-5 py-3 text-white bg-indigo-600 rounded-md font-medium hover:bg-indigo-700"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Teams Plan */}
            <div className="border border-gray-200 rounded-lg p-6 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">Teams</h3>
              <p className="mt-4 text-4xl font-extrabold text-gray-900">Custom</p>
              <p className="mt-2 text-gray-600">For groups and institutions</p>
              <ul className="mt-6 space-y-2 text-gray-600 text-sm">
                <li>👥 Group management</li>
                <li>📁 Shared deck libraries</li>
                <li>📈 Team insights</li>
                <li>📞 Priority support</li>
              </ul>
              <Link
                href="/contact"
                className="mt-6 inline-block px-5 py-3 text-indigo-600 bg-white border border-indigo-600 rounded-md font-medium hover:bg-indigo-50"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to boost your learning?</span>
            <span className="block">Pick your plan and get started today.</span>
          </h2>
          <p className="mt-4 text-lg text-indigo-200">
            No credit card required for Free Plan. Cancel anytime.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
