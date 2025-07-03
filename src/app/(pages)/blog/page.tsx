'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
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
      <main className="flex-grow flex flex-col py-12 px-8 sm:px-12 lg:px-16 overflow-auto max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-12 border-b border-white/20 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
            Our Blog
          </h1>
          <p className="mt-2 text-indigo-100">
            Insights, stories, and updates from our team.
          </p>
        </header>

        {/* Blog Post Cards */}
        <section className="grid gap-8 md:grid-cols-2">
          {[
            {
              title: 'How We Built a Scalable Auth System with Clerk',
              date: 'June 20, 2025',
              description: 'A deep dive into how we integrated Clerk and managed authentication across our app.',
            },
            {
              title: 'Designing for Accessibility: Lessons Learned',
              date: 'May 28, 2025',
              description: 'Explore practical ways to make web interfaces more inclusive and accessible.',
            },
            {
              title: 'Performance Matters: Optimizing Next.js Apps',
              date: 'April 14, 2025',
              description: 'We break down the top performance wins that made our app feel snappier.',
            },
            {
              title: 'Remote Culture: Building a Strong Distributed Team',
              date: 'March 10, 2025',
              description: 'How we keep collaboration, culture, and morale high—even from afar.',
            },
          ].map((post, i) => (
            <article
              key={i}
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 hover:bg-white/20 transition"
            >
              <h2 className="text-2xl font-bold text-white drop-shadow mb-1">
                {post.title}
              </h2>
              <p className="text-indigo-200 text-sm mb-2">{post.date}</p>
              <p className="text-indigo-100">{post.description}</p>
            </article>
          ))}
        </section>

        <p className="text-indigo-100 text-center mt-12">
          Want more? Subscribe to updates or check back regularly.
        </p>
      </main>
    </div>
  );
}
