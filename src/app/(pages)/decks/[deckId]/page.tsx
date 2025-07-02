'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { supabase } from '../../../../lib/supabase';
import { toast } from 'sonner';
import { updateUserStats } from '../../../../lib/stats';
import FlashcardGenerator from '../../../../../components/FlashcardGenerator';
import Sidebar from '../../../../../components/Sidebar';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

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

  // flashcards only hold newly created cards
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [adding, setAdding] = useState(false);
  const [deckName, setDeckName] = useState<string>('');

  // Edit mode state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!deckId) {
      toast.error('Invalid deck ID');
      setIsLoading(false);
      return;
    }

    const fetchDeckName = async () => {
      const { data, error } = await supabase
        .from('decks')
        .select('name')
        .eq('id', deckId)
        .single();

      if (error) {
        toast.error('Failed to fetch deck name');
      } else if (data) {
        setDeckName(data.name);
      }
    };

    fetchDeckName();

    // IMPORTANT: Do NOT fetch existing flashcards here
    // so flashcards only contain newly added ones in this session
  }, [deckId, user]);

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
      setFlashcards((prev) => [
        {
          id: data.id,
          question: data.question ?? '',
          answer: data.answer ?? '',
        },
        ...prev,
      ]);
      toast.success('Flashcard added!');
      setQuestion('');
      setAnswer('');
      await updateUserStats(user.id, { cardsReviewed: 10 });
    }
    setAdding(false);
  };

  // Save edited flashcard
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
        prev.map((card) =>
          card.id === id
            ? { id: data.id, question: data.question ?? '', answer: data.answer ?? '' }
            : card
        )
      );
      toast.success('Flashcard updated');
      setEditingId(null);
    }
    setEditLoading(false);
  };

  // Delete flashcard
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
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans">
        <p className="text-red-400 text-xl font-semibold">Invalid deck ID.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans transition-colors">
      <Sidebar />

      <main className="flex-grow flex flex-col py-12 px-8 sm:px-12 lg:px-16 overflow-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-white/20 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
            {deckName || 'Deck Name'}
          </h1>

          <div className="flex gap-4 items-center">
            {/* Button to go to review page */}
            <button
              onClick={() => router.push(`/decks/${deckId}/flashcards`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-xl"
            >
              View Flashcards
            </button>

            {/* Start Studying Button */}
            <button
              onClick={() => router.push(`/decks/${deckId}/study`)}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold shadow-md transition"
            >
              Start Studying
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                const slug = 'flashcards';
                const shareUrl = `${window.location.origin}/decks/${deckId}/share/${slug}`;
                navigator.clipboard.writeText(shareUrl);
                toast.success('Deck link copied to clipboard!');
              }}
            >
              🔗 Share
            </button>
          </div>
        </header>

        {/* Flashcard Generator */}
        <FlashcardGenerator deckId={deckId} onGenerated={() => {}} />

        {/* Add Flashcard Form */}
        <form
          onSubmit={addCard}
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-12 space-y-6 transition-all hover:scale-[1.01]"
        >
          <h2 className="text-3xl font-semibold text-white drop-shadow">Add New Flashcard</h2>

          <div>
            <label className="block text-sm font-medium text-indigo-100 mb-1">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 500))}
              maxLength={500}
              required
              placeholder="Type your question..."
              className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white placeholder-indigo-200 focus:ring-2 focus:ring-pink-300 focus:outline-none transition"
            />
            <p className="text-xs text-right text-indigo-200">{question.length}/500</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-indigo-100 mb-1">Answer</label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.slice(0, 500))}
              maxLength={500}
              required
              placeholder="Type your answer..."
              className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white placeholder-indigo-200 focus:ring-2 focus:ring-pink-300 focus:outline-none transition"
            />
            <p className="text-xs text-right text-indigo-200">{answer.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={isLoading || adding}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-semibold transition shadow-md hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            ➕ Add Flashcard
          </button>
        </form>

        {/* Display newly created flashcards only */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-white drop-shadow">Newly Created Flashcards</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
            </div>
          ) : flashcards.length ? (
            <ul className="space-y-6">
              {flashcards.map((card) => (
                <motion.li
                  key={card.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20 transition hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  {editingId === card.id ? (
                    <>
                      <div className="mb-4">
                        <label className="text-sm font-medium block text-indigo-100 mb-1">Edit Question</label>
                        <input
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value.slice(0, 500))}
                          maxLength={500}
                          disabled={editLoading}
                          className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white placeholder-indigo-200"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="text-sm font-medium block text-indigo-100 mb-1">Edit Answer</label>
                        <input
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value.slice(0, 500))}
                          maxLength={500}
                          disabled={editLoading}
                          className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white placeholder-indigo-200"
                        />
                      </div>

                      <div className="prose prose-sm dark:prose-invert bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 text-indigo-200 mb-6">
                        <ReactMarkdown>{editAnswer || 'Markdown preview will appear here...'}</ReactMarkdown>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={() => handleSave(card.id)}
                          disabled={editLoading}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition"
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={() => !editLoading && setEditingId(null)}
                          disabled={editLoading}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-white mb-2">{card.question}</h3>
                      <div className="prose prose-sm dark:prose-invert bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 text-indigo-200 mb-6">
                        <ReactMarkdown>{card.answer}</ReactMarkdown>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingId(card.id);
                            setEditQuestion(card.question);
                            setEditAnswer(card.answer);
                          }}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition flex items-center gap-1"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          disabled={deleteLoadingId === card.id}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition flex items-center gap-1"
                        >
                          {deleteLoadingId === card.id ? 'Deleting...' : '🗑️ Delete'}
                        </button>
                      </div>
                    </>
                  )}
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-indigo-100">No new flashcards added yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}