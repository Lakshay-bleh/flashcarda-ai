'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Sidebar from '../../../../components/Sidebar';

type Deck = {
  id: string;
  name: string;
  description: string;
  user_id: string;
};

export default function DashboardPage() {
  const { user, isSignedIn, isLoaded } = useUser();
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

  const [visibleCount, setVisibleCount] = useState(2);

  // Redirect if not signed in
  useEffect(() => {
    if (!isLoaded) return; // Wait for auth state to load
    if (!isSignedIn) router.push('/sign-in');
  }, [isSignedIn, isLoaded, router]);

  // Sync user and get internal app user ID
  useEffect(() => {
    const syncUser = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/sync-user?clerkUserId=${user.id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAppUserId(data.user.id);
      } catch (err) {
        console.log(err);
        console.error('Failed to sync user');
      }
    };
    syncUser();
  }, [user]);

  // Fetch decks
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

  // Create deck
  const createDeck = async (e: FormEvent) => {
    e.preventDefault();
    if (!appUserId) return;
    try {
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim(), userId: appUserId }),
      });
      if (!res.ok) throw new Error();
      const newDeck = await res.json();
      setDecks(prev => [newDeck, ...prev]);
      setName('');
      setDescription('');
      toast.success('Deck created!');
    } catch {
      toast.error('Failed to create deck.');
    }
  };

  // Edit helpers
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
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim(),
        }),
      });
      if (!res.ok) throw new Error();
      setDecks(prev =>
        prev.map(deck =>
          deck.id === deckId ? { ...deck, name: editName, description: editDescription } : deck
        )
      );
      cancelEditing();
      toast.success('Deck updated!');
    } catch {
      toast.error('Failed to update deck.');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete
  const deleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck?')) return;
    setDeleteLoadingId(deckId);
    try {
      const res = await fetch(`/api/decks/${deckId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setDecks(prev => prev.filter(d => d.id !== deckId));
      if (editingId === deckId) cancelEditing();
      toast.success('Deck deleted.');
    } catch {
      toast.error('Failed to delete deck.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  useEffect(() => {
    setVisibleCount(2);
  }, [decks]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 2);
  };

    if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    // Optionally return null or spinner, or just rely on useEffect redirect
    return null;
  }

  if (!appUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans transition-colors">
      <Sidebar />
      <main className="flex-grow flex flex-col py-12 px-8 sm:px-12 lg:px-16 overflow-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-white/20 pb-6">
          <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
            Manage your smart flashcard collections
          </h2>
        </header>

        {/* Create Deck Form */}
        <form
          onSubmit={createDeck}
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-12 space-y-6 transition-all hover:scale-[1.01]"
        >
          <h2 className="text-3xl font-semibold text-white drop-shadow">Create New Deck</h2>
          <div>
            <label className="block text-sm font-medium text-indigo-100 mb-1">Deck Name</label>
            <input
              className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white placeholder-indigo-200 focus:ring-2 focus:ring-pink-300 focus:outline-none transition"
              placeholder="e.g. Spanish Vocabulary"
              value={name}
              onChange={e => setName(e.target.value.slice(0, 100))}
              maxLength={100}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-100 mb-1">Description (optional)</label>
            <textarea
              className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white placeholder-indigo-200"
              placeholder="Brief description"
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 300))}
              maxLength={300}
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-medium transition shadow-md hover:shadow-xl flex items-center justify-center gap-2"
          >
            <span>➕</span> Create Deck
          </button>
        </form>

        {/* Deck List */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
          </div>
        ) : decks.length ? (
          <>
            <ul className="space-y-6">
              {decks.slice(0, visibleCount).map(deck => (
                <motion.li
                  key={deck.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20 transition hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  {editingId === deck.id ? (
                    <>
                      <div className="mb-4">
                        <label className="text-sm font-medium block text-indigo-100 mb-1">Edit Deck Name</label>
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value.slice(0, 100))}
                          maxLength={100}
                          disabled={editLoading}
                          className="w-full p-3 rounded-md border border-white/20 bg-white/20 text-white"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="text-sm font-medium block text-indigo-100 mb-1">Edit Description</label>
                        <textarea
                          value={editDescription}
                          onChange={e => setEditDescription(e.target.value.slice(0, 300))}
                          rows={3}
                          maxLength={300}
                          disabled={editLoading}
                          className="w-full p-3 rounded-md border border-white/20 bg-white/20 text-white"
                        />
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => saveEdit(deck.id)}
                          disabled={editLoading}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition shadow"
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={editLoading}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition shadow"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href={`/decks/${deck.id}`}>
                        <div className="block cursor-pointer">
                          <h2 className="text-xl font-semibold text-white mb-1">{deck.name}</h2>
                          {deck.description && (
                            <p className="text-indigo-100">{deck.description}</p>
                          )}
                        </div>
                      </Link>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => startEditing(deck)}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition shadow-sm hover:shadow-md flex items-center gap-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteDeck(deck.id)}
                          disabled={deleteLoadingId === deck.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-sm hover:shadow-md flex items-center gap-1"
                        >
                          {deleteLoadingId === deck.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </>
                  )}
                </motion.li>
              ))}
            </ul>

            {/* Load More Button */}
            {visibleCount < decks.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-8 rounded-lg font-medium transition shadow-md hover:shadow-xl"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-indigo-100">
            You don’t have any decks yet. Create your first one!
          </p>
        )}
      </main>
    </div>
  );
}
