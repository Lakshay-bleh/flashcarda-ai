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

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isSignedIn, router]);

  useEffect(() => {
    const fetchAppUserId = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/sync-user?clerkUserId=${user.id}`);
        if (!res.ok) throw new Error('Failed to get app user id');
        const data = await res.json();
        setAppUserId(data.user.id);
      } catch (err) {
        console.error('Failed to fetch app user id:', err);
      }
    };

    fetchAppUserId();
  }, [user]);

  // Reusable fetch decks function
  const fetchDecks = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/decks?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch decks');
      const data: Deck[] = await res.json();
      // filter out any invalid decks
      const validDecks = data.filter(deck => deck && deck.id);
      setDecks(validDecks);
    } catch (err) {
      console.error('Deck fetch failed:', err);
      toast.error('Failed to load decks');
    } finally {
      setLoading(false);
    }
  };

  // Fetch decks whenever appUserId changes
  useEffect(() => {
    if (appUserId) {
      fetchDecks(appUserId);
    }
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
      toast.success('Deck created!');
    } catch (err) {
      console.error('Create deck failed:', err);
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
      toast.error('Deck name cannot be empty.');
      return;
    }
    setEditLoading(true);
    try {
      const res = await fetch(`/api/decks/${deckId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), description: editDescription.trim() }),
      });
      if (!res.ok) throw new Error('Failed to update deck');
      // optionally, you can get the updated deck here but we will refetch all decks for consistency
      if (appUserId) {
        await fetchDecks(appUserId);
      }
      setEditingId(null);
      setEditName('');
      setEditDescription('');
      toast.success('Deck updated!');
    } catch (err) {
      console.error('Update deck failed:', err);
      toast.error('Failed to update deck.');
    } finally {
      setEditLoading(false);
    }
  };

  const deleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck? This action cannot be undone.')) return;
    setDeleteLoadingId(deckId);
    try {
      const res = await fetch(`/api/decks/${deckId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete deck');
      setDecks((prev) => prev.filter((deck) => deck.id !== deckId));
      if (editingId === deckId) cancelEditing();
      toast.success('Deck deleted!');
    } catch (err) {
      console.error('Delete deck failed:', err);
      toast.error('Failed to delete deck.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto transition-colors">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold">📚 Your Decks</h1>
        <SignOutButton>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 transition text-white rounded-md font-semibold">
            Sign Out
          </button>
        </SignOutButton>
      </div>

      {/* Create deck form */}
      <form
        onSubmit={createDeck}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-12 space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-semibold">Create New Deck</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Deck Name</label>
          <input
            className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            placeholder="e.g. Spanish Vocabulary"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 100))}
            maxLength={100}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (optional)</label>
          <textarea
            className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            placeholder="Brief description of what's in this deck"
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 300))}
            maxLength={300}
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-md font-semibold"
        >
          ➕ Create Deck
        </button>
      </form>

      {/* Deck list */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : decks.length > 0 ? (
        <ul className="space-y-6">
          {decks.map((deck) => (
            <motion.li
              key={deck.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md border border-gray-200 dark:border-gray-700 transition"
            >
              {editingId === deck.id ? (
                <>
                  <div className="mb-4">
                    <label className="text-sm font-medium block mb-1">Edit Deck Name</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value.slice(0, 100))}
                      className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      maxLength={100}
                      disabled={editLoading}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium block mb-1">Edit Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value.slice(0, 300))}
                      className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      rows={3}
                      maxLength={300}
                      disabled={editLoading}
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => saveEdit(deck.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                      disabled={editLoading}
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                      disabled={editLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    href={`/decks/${deck.id}`}
                    className="cursor-pointer block"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{deck.name}</h2>
                    {deck.description && (
                      <p className="text-gray-600 dark:text-gray-300">{deck.description}</p>
                    )}
                  </Link>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => startEditing(deck)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteDeck(deck.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                      disabled={deleteLoadingId === deck.id}
                    >
                      {deleteLoadingId === deck.id ? 'Deleting...' : '🗑 Delete'}
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
