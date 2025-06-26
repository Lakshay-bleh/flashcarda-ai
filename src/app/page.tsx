'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const card = document.getElementById('demoCard');
    if (card) {
      const toggleFlip = () => card.classList.toggle('flipped');
      card.addEventListener('click', toggleFlip);

      return () => {
        card.removeEventListener('click', toggleFlip);
      };
    }
  }, []);

  return (
    <div className="font-[Inter] bg-gray-50">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        .gradient-bg {
          background: linear-gradient(135deg, #6B73FF 0%, #000DFF 50%, #00D4FF 100%);
        }
        .card-flip {
          transform-style: preserve-3d;
          transition: transform 0.8s;
          position: relative;
        }
        .card-flip.flipped {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          backface-visibility: hidden;
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .card-back {
          transform: rotateY(180deg);
        }
        .wave-shape {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }
        .wave-shape svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 150px;
        }
        .wave-shape .shape-fill {
          fill: #FFFFFF;
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg className="h-8 w-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">FlashDecks</span>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
              <a href="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Features</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">Pricing</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">About</a>
              <a href="#" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Get Started</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative gradient-bg text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center py-20">
            <div>
              <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
                <span className="block">Master your learning</span>
                <span className="block text-indigo-200">with FlashDecks</span>
              </h1>
              <p className="mt-4 text-lg leading-6 text-indigo-100">
                Create, study, and master flashcards with our intelligent spaced repetition system.
              </p>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                >
                  Start Learning
                </a>
                <a
                  href="#"
                  className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70"
                >
                  See How It Works
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-96 max-w-md mx-auto mt-10 lg:mt-0">
          <div className="card-flip w-full h-full cursor-pointer" id="demoCard">
            <div
              className="card-front rounded-xl shadow-2xl flex items-center justify-center p-8"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            >
              <h3 className="text-2xl font-bold text-gray-800">What is the capital of France?</h3>
            </div>
            <div
              className="card-back rounded-xl shadow-2xl flex items-center justify-center p-8"
              style={{ backgroundColor: 'rgba(224, 231, 255, 0.8)' }} // Light indigo
            >
              <h3 className="text-2xl font-bold text-indigo-800">Paris</h3>
            </div>
          </div>
        </div>
        <div className="wave-shape">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to memorize
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              FlashDecks uses proven techniques to help you retain information longer.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  title: 'Create Custom Decks',
                  desc: 'Build your own flashcard decks with text, images, and audio. Organize them by subject or topic.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  )
                },
                {
                  title: 'Spaced Repetition',
                  desc: 'Our algorithm shows you cards at optimal intervals to maximize retention and minimize study time.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )
                },
                {
                  title: 'Progress Tracking',
                  desc: 'Visualize your learning progress with detailed statistics and mastery indicators for each deck.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  )
                },
                {
                  title: 'Collaborative Learning',
                  desc: 'Share decks with classmates or study groups, and learn together with collaborative features.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  )
                },
              ].map(({ title, desc, icon }, idx) => (
                <div key={idx} className="relative animate-fadeIn">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
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
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{title}</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to boost your memory?</span>
            <span className="block">Start using FlashDecks today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of students who are learning more efficiently with our flashcard system.
          </p>
          <a
            href="#"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Sign up for free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex items-center">
                <svg className="h-8 w-8 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-white">FlashDecks</span>
              </div>
              <p className="text-gray-300 text-base">
                The smart way to study and retain information using scientifically proven techniques.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Product</h3>
                  <ul className="mt-4 space-y-4">
                    {['Features', 'Pricing', 'Examples', 'Updates'].map(item => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-400 hover:text-white">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    {['Documentation', 'Guides', 'API Status', 'Contact'].map(item => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-400 hover:text-white">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    {['About', 'Blog', 'Careers', 'Press'].map(item => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-400 hover:text-white">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    {['Privacy', 'Terms', 'Cookie Policy'].map(item => (
                      <li key={item}>
                        <a href="#" className="text-base text-gray-400 hover:text-white">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 text-center">
              &copy; 2023 FlashDecks. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
