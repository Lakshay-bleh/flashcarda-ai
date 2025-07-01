'use client';

import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="font-[Inter] bg-gray-50">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Hero Section */}
      <section className="bg-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            Powerful Tools for Smarter Learning
          </h1>
          <p className="mt-4 text-lg text-indigo-100">
            Everything you need to study better, retain more, and stay organized — all in one place.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Why FlashDecks?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Designed to make learning stick
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our features are built with one goal in mind: helping you remember what matters.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-2">
            {[
              {
                title: 'Custom Decks',
                desc: 'Build personalized flashcards with text, images, and audio. Perfect for every subject.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                )
              },
              {
                title: 'Smart Scheduling',
                desc: 'Our spaced repetition algorithm optimizes card reviews to enhance long-term retention.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                )
              },
              {
                title: 'Track Your Progress',
                desc: 'See your learning stats and mastery levels evolve with easy-to-understand visuals.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                )
              },
              {
                title: 'Study Together',
                desc: 'Collaborate with friends and classmates by sharing decks and studying as a team.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                )
              },
            ].map(({ title, desc, icon }, idx) => (
              <div key={idx} className="relative pl-16">
                <div className="absolute left-0 top-0 h-12 w-12 flex items-center justify-center rounded-md bg-indigo-500 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {icon}
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="mt-2 text-base text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to level up your memory?</span>
            <span className="block">Join FlashDecks today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Fast, effective, and fun — it’s learning reimagined.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
