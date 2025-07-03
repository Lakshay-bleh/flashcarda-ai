'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type ApiStatus = {
  name: string;
  status: 'Operational' | 'Degraded' | 'Down';
  responseTimeMs: number;
  lastChecked: string;
};

export default function ApiStatusPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const [statusData, setStatusData] = useState<ApiStatus[]>([]);

  // Simulate API status fetching (replace with actual endpoint if needed)
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // Simulated delay
    setTimeout(() => {
      setStatusData([
        {
          name: 'Authentication API',
          status: 'Operational',
          responseTimeMs: 120,
          lastChecked: new Date().toLocaleString(),
        },
        {
          name: 'User Profile Service',
          status: 'Operational',
          responseTimeMs: 450,
          lastChecked: new Date().toLocaleString(),
        },
        {
          name: 'Payments API',
          status: 'Degraded',
          responseTimeMs: 98,
          lastChecked: new Date().toLocaleString(),
        },
        {
          name: 'Email Notification Service',
          status: 'Down',
          responseTimeMs: 0,
          lastChecked: new Date().toLocaleString(),
        },
      ]);
    }, 1000);
  }, [isLoaded, isSignedIn]);

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
            API Status Dashboard
          </h1>
          <p className="mt-2 text-indigo-100">
            Monitor the health of our services and internal APIs.
          </p>
        </header>

        {/* API Status Cards */}
        <section className="space-y-6">
          {statusData.length === 0 ? (
            <p className="text-indigo-100">Fetching API status...</p>
          ) : (
            statusData.map((api, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-white drop-shadow">
                    {api.name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      api.status === 'Operational'
                        ? 'bg-green-500 text-white'
                        : api.status === 'Degraded'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {api.status}
                  </span>
                </div>
                <p className="text-indigo-100">
                  Response Time:{' '}
                  <span className="font-mono">{api.responseTimeMs}ms</span>
                </p>
                <p className="text-indigo-200 text-sm mt-1">
                  Last checked: {api.lastChecked}
                </p>
              </div>
            ))
          )}
        </section>

        <p className="text-indigo-100 text-center mt-12">
          Last updated: {new Date().toLocaleDateString()} — Updates every few minutes.
        </p>
      </main>
    </div>
  );
}
