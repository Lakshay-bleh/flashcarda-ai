'use client';

import { useEffect, useState } from 'react';
import { useUser} from '@clerk/nextjs';
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
  const { user, isSignedIn } = useUser();
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

  // Redirect if not signed in
  useEffect(() => {
    if (!isSignedIn) router.push('/sign-in');
  }, [isSignedIn, router]);

  // Fetch appUserId
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

  // Fetch decks
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

  // Update stats on deck click, then navigate
  async function handleDeckClick(deckId: string) {
    if (!appUserId || !user) return;

    try {
      // Send POST request to increment the decks
      const res = await fetch('/api/user-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkUserId: user.id,
          action: 'decks',
          count: 1,  // Increment by 1
        }),
      });

      if (!res.ok) throw new Error('Failed to update stats');

      // Now update the local state
      setDecks((prevDecks) => {
        return prevDecks.map((deck) =>
          deck.id === deckId
            ? { ...deck, decks: (deck.decks || 0) + 1 }
            : deck
        );
      });
    } catch (error) {
      console.error('Error updating stats:', error);
      toast.error('Could not update stats');
    } finally {
      router.push(`/decks/${deckId}`);
    }
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

  // Save deck edits
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
      setDecks(current =>
        current.map(d =>
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

  // Delete deck
  const deleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck?')) return;
    setDeleteLoadingId(deckId);
    try {
      const res = await fetch(`/api/decks/${deckId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete deck');
      setDecks(current => current.filter(d => d.id !== deckId));
      if (editingId === deckId) cancelEditing();
      toast.success('Deck deleted!');
    } catch {
      toast.error('Failed to delete deck');
    } finally {
      setDeleteLoadingId(null);
    }
  };

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
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
          </div>
        ) : decks.length > 0 ? (
          <ul className="space-y-6">
            {decks.map(deck => (
              <motion.li
                key={deck.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20 hover:shadow-2xl hover:-translate-y-0.5 transition"
              >
                {editingId === deck.id ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-indigo-100 font-medium mb-1">Deck Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value.slice(0, 100))}
                        maxLength={100}
                        disabled={editLoading}
                        className="w-full p-3 rounded-md border border-white/20 bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-indigo-100 font-medium mb-1">Description</label>
                      <textarea
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value.slice(0, 300))}
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
                      >
                        {editLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEditing}
                        disabled={editLoading}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition shadow flex-1"
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
                    >
                      <h2 className="text-2xl font-semibold text-white mb-1 truncate">
                        {deck.name}
                      </h2>
                      {deck.description && (
                        <p className="text-indigo-100 text-sm line-clamp-2">{deck.description}</p>
                      )}
                    </button>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => startEditing(deck)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition shadow-sm hover:shadow-md flex items-center gap-1"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteDeck(deck.id)}
                        disabled={deleteLoadingId === deck.id}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-sm hover:shadow-md flex items-center gap-1"
                      >
                        {deleteLoadingId === deck.id ? 'Deleting…' : '🗑️ Delete'}
                      </button>
                    </div>
                  </>
                )}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-indigo-100 mt-16 text-lg">
            You don’t have any decks yet. Start by creating one on your Dashboard!
          </p>
        )}
      </main>
    </div>
  );
}
