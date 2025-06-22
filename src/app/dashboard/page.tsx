'use client';

import { useEffect, useState } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Deck = {
  id: string;
  name: string;
  description: string;
  user_id: string;
};

export default function DashboardPage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [appUserId, setAppUserId] = useState<string | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isSignedIn, router]);

  // Get app user UUID by mapping Clerk user ID
  useEffect(() => {
    const fetchAppUserId = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/sync-user?clerkUserId=${user.id}`);
        if (!res.ok) throw new Error('Failed to get app user id');
        const data = await res.json();
        // data.user is the app user object, get its id
        setAppUserId(data.user.id);
      } catch (err) {
        console.error('Failed to fetch app user id:', err);
      }
    };

    fetchAppUserId();
  }, [user]);

  // Fetch decks by appUserId (UUID)
  useEffect(() => {
    const fetchDecks = async () => {
      if (!appUserId) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/decks?userId=${appUserId}`);
        if (!res.ok) throw new Error('Failed to fetch decks');
        const data: Deck[] = await res.json();
        setDecks(data);
      } catch (err) {
        console.error('Deck fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [appUserId]);

  const createDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appUserId) return;

    try {
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, userId: appUserId }),
      });
      if (!res.ok) throw new Error('Deck creation failed');
      const newDeck: Deck = await res.json();
      setDecks((prev) => [newDeck, ...prev]);
      setName('');
      setDescription('');
    } catch (err) {
      console.error('Create deck failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📚 Your Decks</h1>
          <SignOutButton>
            <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
              Sign Out
            </button>
          </SignOutButton>
        </div>

        {/* Create deck form */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Deck</h2>
          <form onSubmit={createDeck} className="space-y-4">
            <div>
              <label htmlFor="deck-name" className="block text-sm font-medium text-gray-700 mb-1">
                Deck Name
              </label>
              <input
                id="deck-name"
                type="text"
                placeholder="e.g. Spanish Vocabulary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="deck-desc" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="deck-desc"
                placeholder="Brief description of what's in this deck"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>+</span> Create Deck
            </button>
          </form>
        </div>

        {/* Deck list */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-6">Loading your decks...</div>
          ) : decks.length > 0 ? (
            decks.map((deck) => (
              <Link href={`/decks/${deck.id}`} key={deck.id}>
                <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">{deck.name}</h2>
                  {deck.description && <p className="text-gray-500">{deck.description}</p>}
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">You don’t have any decks yet. Create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
