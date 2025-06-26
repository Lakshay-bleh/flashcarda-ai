'use client';

import { useEffect, useState } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

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
    } catch {
      toast.error('Failed to load decks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appUserId) fetchDecks(appUserId);
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
      if (!res.ok) throw new Error();
      const newDeck = await res.json();
      setDecks([newDeck, ...decks]);
      setName('');
      setDescription('');
      toast.success('Deck created!');
    } catch {
      toast.error('Failed to create deck.');
    }
  };

  const startEditing = (deck: Deck) => {
    setEditingId(deck.id);
    setEditName(deck.name);
    setEditDescription(deck.description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const saveEdit = async (deckId: string) => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    setEditLoading(true);
    try {
      const res = await fetch(`/api/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), description: editDescription.trim() }),
      });
      if (!res.ok) throw new Error();
      if (appUserId) await fetchDecks(appUserId);
      cancelEditing();
      toast.success('Updated!');
    } catch {
      toast.error('Failed to update deck.');
    } finally {
      setEditLoading(false);
    }
  };

  const deleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure?')) return;
    setDeleteLoadingId(deckId);
    try {
      const res = await fetch(`/api/decks/${deckId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setDecks(decks.filter(d => d.id !== deckId));
      if (editingId === deckId) cancelEditing();
      toast.success('Deleted!');
    } catch {
      toast.error('Failed to delete deck.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 transition-colors py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">📚 Your Decks</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your flashcard collections</p>
        </div>
        <SignOutButton>
          <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition shadow-sm hover:shadow-md">
            Sign Out
          </button>
        </SignOutButton>
      </header>

      {/* Create Form */}
      <form
        onSubmit={createDeck}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-12 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">Create New Deck</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Deck Name</label>
          <input
            className="w-full p-3 border rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="e.g. Spanish Vocabulary"
            value={name}
            onChange={e => setName(e.target.value.slice(0, 100))}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (optional)</label>
          <textarea
            className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            placeholder="Brief description"
            value={description}
            onChange={e => setDescription(e.target.value.slice(0, 300))}
            maxLength={300}
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <span>➕</span> Create Deck
        </button>
      </form>

      {/* Deck List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : decks.length ? (
        <ul className="space-y-6">
          {decks.map(deck => (
            <motion.li
              key={deck.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 transition hover:-translate-y-0.5"
            >
              {editingId === deck.id ? (
                <>
                  <div className="mb-4">
                    <label className="text-sm font-medium block mb-1">Edit Deck Name</label>
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value.slice(0, 100))}
                      maxLength={100}
                      disabled={editLoading}
                      className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium block mb-1">Edit Description</label>
                    <textarea
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value.slice(0, 300))}
                      rows={3}
                      maxLength={300}
                      disabled={editLoading}
                      className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => saveEdit(deck.id)}
                      disabled={editLoading}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={editLoading}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href={`/decks/${deck.id}`} className='block'>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{deck.name}</h2>
                      {deck.description && (
                        <p className="text-gray-600 dark:text-gray-300">{deck.description}</p>
                      )}
                  </Link>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => startEditing(deck)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition shadow-sm hover:shadow-md flex items-center gap-1"
                    >
                      <span>✏️</span> Edit
                    </button>
                    <button
                      onClick={() => deleteDeck(deck.id)}
                      disabled={deleteLoadingId === deck.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-sm hover:shadow-md flex items-center gap-1"
                    >
                      <span>{deleteLoadingId === deck.id ? '⏳' : '🗑'}</span>
                      {deleteLoadingId === deck.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </>
              )}
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          You don’t have any decks yet. Create your first one!
        </p>
      )}
    </div>
  );
}
