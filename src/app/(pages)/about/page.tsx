'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="font-[Inter] bg-white text-gray-900">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Hero */}
      <section className="bg-indigo-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl">About FlashDecks</h1>
          <p className="mt-4 text-lg text-indigo-200">
            Empowering learners through smarter flashcard study — backed by science, driven by community.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600">
            We believe that everyone can learn more effectively when armed with the right tools.
            FlashDecks is built to make spaced repetition accessible, engaging, and personalized.
            Whether you`&apos;`re studying for school, certifications, or lifelong learning, our mission
            is to help you remember what matters most.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Values</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What drives us
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                title: 'Science-Backed Learning',
                desc: 'We use evidence-based techniques like spaced repetition and active recall to help users learn better.'
              },
              {
                title: 'Simplicity & Focus',
                desc: 'We believe that great learning tools should be simple to use and distraction-free.'
              },
              {
                title: 'Learner Empowerment',
                desc: 'We put the learner in control — create, customize, and manage your own decks your way.'
              },
              {
                title: 'Community Collaboration',
                desc: 'Learning is better together. We support sharing, group study, and community-driven improvements.'
              },
            ].map((item, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                <p className="mt-2 text-base text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Vision (Optional section you can expand) */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Built by learners, for learners</h2>
          <p className="mt-4 text-lg text-gray-600">
            FlashDecks was created by a small team of developers, educators, and memory nerds who
            wanted a better way to study. We`&apos;`re passionate about building intuitive tools that work
            with your brain, not against it.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Join our growing community of learners</span>
            <span className="block">Start using FlashDecks today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            It’s free to get started, and there’s no limit to what you can learn.
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
