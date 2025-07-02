'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Sidebar from '../../../../components/Sidebar';

type Deck = {
  decks: number;
  id: string;
  name: string;
  description: string;
  user_id: string;
};

export default function DecksPage() {
  const { user, isSignedIn , isLoaded} = useUser();
  const router = useRouter();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [appUserId, setAppUserId] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  // Pagination for decks list
  const [visibleCount, setVisibleCount] = useState(10);
  const visibleDecks = decks.slice(0, visibleCount);

  // Redirect if not signed in
  useEffect(() => {
    if (!isSignedIn) router.push('/sign-in');
  }, [isSignedIn, router]);

  // Fetch appUserId from backend
  useEffect(() => {
    async function initAppUser() {
      if (!user) return;
      try {
        const res = await fetch(`/api/sync-user?clerkUserId=${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch app user');
        const data = await res.json();
        setAppUserId(data.user.id);
      } catch {
        toast.error('Failed to get user info');
      }
    }
    initAppUser();
  }, [user]);

  // Fetch decks once appUserId is available
  useEffect(() => {
    const fetchDecks = async (userId: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/decks?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch decks');
        const data: Deck[] = await res.json();
        setDecks(data.filter((d) => d?.id));
      } catch {
        toast.error('Failed to load decks');
      } finally {
        setLoading(false);
      }
    };
    if (appUserId) fetchDecks(appUserId);
  }, [appUserId]);

  // Increment deck stats and navigate to deck page
  function handleDeckClick(deckId: string) {
    router.push(`/decks/${deckId}`);
  }

  // Start editing deck
  const startEditing = (deck: Deck) => {
    setEditingId(deck.id);
    setEditName(deck.name);
    setEditDescription(deck.description);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  // Save edited deck data
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
      if (!res.ok) throw new Error('Failed to update deck');

      setDecks((current) =>
        current.map((d) =>
          d.id === deckId
            ? { ...d, name: editName.trim(), description: editDescription.trim() }
            : d
        )
      );
      cancelEditing();
      toast.success('Deck updated!');
    } catch {
      toast.error('Failed to update deck');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete deck with confirmation
  const deleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck?')) return;
    setDeleteLoadingId(deckId);
    try {
      const res = await fetch(`/api/decks/${deckId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete deck');

      setDecks((current) => current.filter((d) => d.id !== deckId));
      if (editingId === deckId) cancelEditing();
      toast.success('Deck deleted!');
    } catch {
      toast.error('Failed to delete deck');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // Load more decks handler with smooth scroll
  const handleLoadMore = useCallback(() => {
    setVisibleCount((count) => {
      const newCount = Math.min(count + 5, decks.length);
      // Scroll to last newly loaded deck after slight delay
      setTimeout(() => {
        const lastVisibleDeckId = decks[newCount - 1]?.id;
        if (lastVisibleDeckId) {
          const el = document.getElementById(`deck-${lastVisibleDeckId}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return newCount;
    });
  }, [decks]);

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
    <div className="flex min-h-screen bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white">
      {/* Sidebar */}
      <aside className="flex-shrink-0 h-screen border-r border-white/20">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-md">
                Deck Management
              </h1>
              <p className="text-indigo-100 mt-2 text-base sm:text-lg">
                Create, edit, and review your flashcard decks.
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-white/20" />
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-40" aria-busy="true" aria-label="Loading decks">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
          </div>
        ) : decks.length > 0 ? (
          <>
            <ul className="space-y-6" role="list">
              {visibleDecks.map((deck) => (
                <motion.li
                  id={`deck-${deck.id}`}
                  key={deck.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20 hover:shadow-2xl hover:-translate-y-0.5 transition"
                >
                  {editingId === deck.id ? (
                    <>
                      <div className="mb-4">
                        <label htmlFor="edit-name" className="block text-indigo-100 font-medium mb-1">
                          Deck Name
                        </label>
                        <input
                          id="edit-name"
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value.slice(0, 100))}
                          maxLength={100}
                          disabled={editLoading}
                          className="w-full p-3 rounded-md border border-white/20 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                          aria-required="true"
                          aria-invalid={!editName.trim()}
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="edit-description" className="block text-indigo-100 font-medium mb-1">
                          Description
                        </label>
                        <textarea
                          id="edit-description"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value.slice(0, 300))}
                          maxLength={300}
                          rows={3}
                          disabled={editLoading}
                          className="w-full p-3 rounded-md border border-white/20 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => saveEdit(deck.id)}
                          disabled={editLoading}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition shadow flex-1"
                          aria-label="Save deck edits"
                        >
                          {editLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={editLoading}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition shadow flex-1"
                          aria-label="Cancel deck edits"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleDeckClick(deck.id)}
                        className="block w-full text-left focus:outline-none"
                        aria-label={`Open deck ${deck.name}`}
                      >
                        <h2 className="text-2xl font-semibold text-white mb-1 truncate">{deck.name}</h2>
                        {deck.description && (
                          <p className="text-indigo-100 text-sm line-clamp-2">{deck.description}</p>
                        )}
                      </button>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => startEditing(deck)}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition shadow-sm hover:shadow-md flex items-center gap-1"
                          aria-label={`Edit deck ${deck.name}`}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteDeck(deck.id)}
                          disabled={deleteLoadingId === deck.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-sm hover:shadow-md flex items-center gap-1"
                          aria-label={`Delete deck ${deck.name}`}
                        >
                          {deleteLoadingId === deck.id ? 'Deleting…' : '🗑️ Delete'}
                        </button>
                      </div>
                    </>
                  )}
                </motion.li>
              ))}
            </ul>

            {/* Load More button */}
            {visibleCount < decks.length ? (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md shadow-md transition"
                  aria-label="Load more decks"
                  disabled={loading}
                >
                  Load More
                </button>
              </div>
            ) : (
              <p className="text-center text-indigo-100 mt-8 text-sm italic">
                You have loaded all decks.
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-indigo-100 mt-16 text-lg">
            You don’t have any decks yet. Start by creating one on your Dashboard!
          </p>
        )}
      </main>
    </div>
  );
}
