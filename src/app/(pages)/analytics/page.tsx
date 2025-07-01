'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/Sidebar';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

type Deck = {
  id: string;
  name: string;
  description: string;
  user_id: string;
};

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  deck_id: string;
};

export default function AnalyticsPage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [appUserId, setAppUserId] = useState<string | null>(null);

  // Holds flashcard counts per deck
  const [flashcardCounts, setFlashcardCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isSignedIn) router.push('/sign-in');
  }, [isSignedIn, router]);

  useEffect(() => {
    async function initAppUser() {
      if (!user) return;
      try {
        const res = await fetch(`/api/sync-user?clerkUserId=${user.id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAppUserId(data.user.id);
      } catch {
        console.error('Unable to fetch appUserId');
      }
    }
    initAppUser();
  }, [user]);

  const fetchDecks = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/decks?userId=${userId}`);
      if (!res.ok) throw new Error();
      const data: Deck[] = await res.json();
      setDecks(data.filter(d => d?.id));
      return data;
    } catch (e) {
      console.error(e);
      setDecks([]);
      return [];
    }
  };

  // Fetch flashcards count per deck in parallel
  const fetchFlashcardCounts = async (decks: Deck[]) => {
    try {
      const counts: Record<string, number> = {};
      await Promise.all(
        decks.map(async (deck) => {
          const res = await fetch(`/api/decks/${deck.id}/flashcards`);
          if (!res.ok) throw new Error(`Failed to fetch flashcards for deck ${deck.id}`);
          const flashcards: Flashcard[] = await res.json();
          counts[deck.id] = flashcards.length;
        })
      );
      setFlashcardCounts(counts);
    } catch (e) {
      console.error(e);
      setFlashcardCounts({});
    }
  };

  useEffect(() => {
    if (!appUserId) return;

    async function loadData() {
      // Assert appUserId is non-null here
      const fetchedDecks = await fetchDecks(appUserId!);
      if (fetchedDecks.length > 0) {
        await fetchFlashcardCounts(fetchedDecks);
      } else {
        setFlashcardCounts({});
      }
      setLoading(false);
    }

    loadData();
  }, [appUserId]);

  const totalFlashcards = Object.values(flashcardCounts).reduce((a, b) => a + b, 0);

  const chartData = decks.map((deck) => ({
    name: deck.name.length > 15 ? deck.name.slice(0, 15) + '…' : deck.name,
    flashcards: flashcardCounts[deck.id] || 0,
  }));

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans transition-colors">
      <Sidebar />

      <main className="flex-grow flex flex-col py-12 px-8 sm:px-12 lg:px-16 overflow-auto">
        <header className="flex justify-between items-center mb-12 border-b border-white/20 pb-6">
          <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
            Analytics Dashboard
          </h2>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
          </div>
        ) : decks.length === 0 ? (
          <p className="mt-12 text-center text-indigo-100">
            No decks found. Create some decks first to see analytics!
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold mb-2">Total Decks</h3>
                <p className="text-5xl font-bold">{decks.length}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold mb-2">Total Flashcards</h3>
                <p className="text-5xl font-bold">{totalFlashcards}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold mb-4">Average Flashcards per Deck</h3>
                <p className="text-5xl font-bold">
                  {decks.length > 0 ? (totalFlashcards / decks.length).toFixed(1) : '0'}
                </p>
              </div>
            </div>

            {/* Flashcards per deck bar chart */}
            <section className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-2xl font-semibold mb-6 text-center">Flashcards per Deck</h3>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255 255 255 / 0.2)" />
                  <XAxis dataKey="name" stroke="white" tick={{ fill: 'white' }} />
                  <YAxis stroke="white" tick={{ fill: 'white' }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#000' }} />
                  <Bar dataKey="flashcards" fill="#ec4899" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>
          </motion.div>
        )}
      </main>
    </div>
  );
}
