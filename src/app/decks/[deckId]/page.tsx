'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { updateUserStats } from '../../../lib/stats';
import FlashcardGenerator from '../../../../components/FlashcardGenerator';

type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export default function DeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params?.deckId as string | undefined;
  const { user } = useUser();

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deckName, setDeckName] = useState<string>('');

  useEffect(() => {
    if (!deckId) {
      toast.error('Invalid deck ID');
      setIsLoading(false);
      return;
    }

    const fetchDeckName = async () => {
      const { data, error } = await supabase
        .from('decks')           // Assuming your deck table is named 'decks'
        .select('name')          // Select the name column
        .eq('id', deckId)        // Filter by deckId
        .single();               // Get single row

      if (error) {
        toast.error('Failed to fetch deck name');
      } else if (data) {
        setDeckName(data.name);
      }
    };

    const fetchFlashcards = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('deck_id', deckId)
        .order('id', { ascending: false });

      if (error) {
        toast.error('Failed to fetch flashcards');
      } else {
        setFlashcards(data || []);
      }
      setIsLoading(false);
    };
    fetchDeckName(); 
    fetchFlashcards();
  }, [deckId]);

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deckId) return;
    if (!user) {
      toast.error('You must be logged in to add flashcards.');
      return;
    }

    setAdding(true);
    const { data, error } = await supabase
      .from('flashcards')
      .insert([{ question, answer, deck_id: deckId }])
      .select()
      .single();

    if (error || !data) {
      toast.error('Failed to add flashcard');
    } else {
      setFlashcards((prev) => [data, ...prev]);
      toast.success('Flashcard added!');
      setQuestion('');
      setAnswer('');
      await updateUserStats(user.id, 10);
    }
    setAdding(false);
  };

  const handleSave = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to update flashcards.');
      return;
    }

    setEditLoading(true);
    const { data, error } = await supabase
      .from('flashcards')
      .update({ question: editQuestion, answer: editAnswer })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      toast.error('Failed to update flashcard');
    } else {
      setFlashcards((prev) =>
        prev.map((card) => (card.id === id ? data : card))
      );
      toast.success('Flashcard updated');
      setEditingId(null);
    }
    setEditLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;

    setDeleteLoadingId(id);
    const { error } = await supabase.from('flashcards').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete flashcard');
    } else {
      setFlashcards((prev) => prev.filter((card) => card.id !== id));
      toast.success('Flashcard deleted');
      if (editingId === id) setEditingId(null);
    }
    setDeleteLoadingId(null);
  };

  if (!deckId) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500">Invalid deck ID.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto transition-colors">
      <header className="flex rounded-lg items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-50">
        {deckId && (
          <button
            onClick={() => {
              const slug = encodeURIComponent('flashcards');
              const shareUrl = `${window.location.origin}/share/${deckId}/${slug}`;
              navigator.clipboard.writeText(shareUrl);
              toast.success('Deck link copied to clipboard!');
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-md font-semibold"
          >
            🔗 Share
          </button>
        )}

        {/* Deck Name in center */}
        <h1 className="text-4xl font-bold text-center flex-1">
          🧠 {deckName || 'Deck Name'}
        </h1>

        <SignOutButton>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 transition text-white rounded-md font-semibold">
            Sign Out
          </button>
        </SignOutButton>
      </header>


      <FlashcardGenerator deckId={deckId} onGenerated={() => {
        // Refresh flashcards after generation
        setIsLoading(true);
        supabase
          .from('flashcards')
          .select('*')
          .eq('deck_id', deckId)
          .order('id', { ascending: false })
          .then(({ data, error }) => {
            if (error) toast.error('Failed to fetch flashcards');
            else setFlashcards(data || []);
            setIsLoading(false);
          });
      }} />

      <form
        onSubmit={addCard}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-12 space-y-6 border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-semibold">Add New Flashcard</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Question</label>
          <input
            className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, 500))}
            maxLength={500}
            required
          />
          <p className="text-xs text-right text-gray-500 dark:text-gray-400">{question.length}/500</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Answer</label>
          <input
            className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            placeholder="Type your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value.slice(0, 500))}
            maxLength={500}
            required
          />
          <p className="text-xs text-right text-gray-500 dark:text-gray-400">{answer.length}/500</p>
        </div>

        <button
          disabled={isLoading || adding}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-md font-semibold disabled:opacity-50"
        >
          ➕ Add Flashcard
        </button>
      </form>

      <div className="mb-8 flex justify-center">
        <button
          onClick={() => router.push(`/decks/${deckId}/study`)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition"
        >
          🧠 Start Studying
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <ul className="space-y-6">
          {flashcards.map((card) => (
            <motion.li
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md border border-gray-200 dark:border-gray-700 transition"
            >
              {editingId === card.id ? (
                <>
                  <div className="mb-4">
                    <label className="text-sm font-medium block mb-1">Edit Question</label>
                    <input
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value.slice(0, 500))}
                      className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      maxLength={500}
                      disabled={editLoading}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-sm font-medium block mb-1">Edit Answer</label>
                    <input
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value.slice(0, 500))}
                      className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      maxLength={500}
                      disabled={editLoading}
                    />
                  </div>

                  <div className="prose prose-sm dark:prose-invert bg-gray-50 dark:bg-gray-900 p-4 rounded border border-gray-100 dark:border-gray-700 text-sm mb-6">
                    <ReactMarkdown>{editAnswer || 'Markdown preview will appear here...'}</ReactMarkdown>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleSave(card.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                      disabled={editLoading}
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={() => !editLoading && setEditingId(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                      disabled={editLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Question</p>
                    <div className="text-gray-900 dark:text-gray-100">
                      <ReactMarkdown>{card.question}</ReactMarkdown>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Answer</p>
                    <div className="text-gray-800 dark:text-gray-300">
                      <ReactMarkdown>{card.answer}</ReactMarkdown>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        setEditingId(card.id);
                        setEditQuestion(card.question);
                        setEditAnswer(card.answer);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                      disabled={deleteLoadingId === card.id}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                      disabled={deleteLoadingId === card.id}
                    >
                      {deleteLoadingId === card.id ? 'Deleting...' : '🗑 Delete'}
                    </button>
                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/share/${deckId}/flashcard/${card.id}`;
                        navigator.clipboard.writeText(shareUrl);
                        toast.success('Flashcard link copied to clipboard!');
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                      🔗 Share
                    </button>
                  </div>
                </>
              )}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
