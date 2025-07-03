'use client'
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand + tagline */}
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-indigo-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <button
                onClick={() => (window.location.href = "/#")}
                className="ml-2 text-xl font-bold text-gray-900"
              >
                FlashDecks
              </button>
            </div>
            <p className="text-gray-300 text-base">
              The smart way to study and retain information using scientifically
              proven techniques.
            </p>
          </div>

          {/* Links */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            {/* Product + Resources */}
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Product
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/features" className="text-base text-gray-400 hover:text-white">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/examples" className="text-base text-gray-400 hover:text-white">
                      Examples
                    </Link>
                  </li>
                  <li>
                    <Link href="/updates" className="text-base text-gray-400 hover:text-white">
                      Updates
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-400 hover:text-white">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/docs" className="text-base text-gray-400 hover:text-white">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-400 hover:text-white">
                      API Status
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-base text-gray-400 hover:text-white">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" className="text-base text-gray-400 hover:text-white">
                      Help & FAQs
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Company + Legal */}
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-base text-gray-400 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-400 hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-400 hover:text-white">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/" className="text-base text-gray-400 hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-400 hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-base text-gray-400 hover:text-white">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-400">
            &copy; 2025 FlashDecks. All rights reserved.
          </p>
          <p className="text-sm text-indigo-400 mt-2 italic">
            Built with love for Riya 💜
          </p>
        </div>
      </div>
    </footer>
  );
}
