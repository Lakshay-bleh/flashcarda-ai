'use client';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Tooltip, IconButton } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../../../../lib/supabase';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../../../components/Sidebar'; // Uncomment if you have Sidebar

type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export default function FlashcardReviewPage({ params }: { params: { deckId: string } }) {
  const { deckId } = params;

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!deckId) {
      setError('Invalid deck ID');
      setLoading(false);
      return;
    }

    async function fetchFlashcards() {
      setLoading(true);
      const { data, error } = await supabase
        .from('flashcards')
        .select('id, question, answer')
        .eq('deck_id', deckId)
        .order('id', { ascending: false });

      if (error) {
        toast.error('Failed to load flashcards');
        setError('Failed to load flashcards.');
        setFlashcards([]);
      } else {
        setFlashcards(
          (data || []).map((fc: { id: string; question: string | null; answer: string | null }) => ({
            id: fc.id,
            question: fc.question ?? '',
            answer: fc.answer ?? '',
          }))
        );
        setError('');
      }
      setLoading(false);
    }

    fetchFlashcards();
  }, [deckId]);

  const toggleFlip = useCallback(
    (index: number) => {
      setFlippedIndex((current) => (current === index ? null : index));
    },
    []
  );

  const startEditing = (card: Flashcard) => {
    setEditingId(card.id);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
    setFlippedIndex(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleSave = async (id: string) => {
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
            ? {
                id: data.id,
                question: data.question ?? '',
                answer: data.answer ?? '',
              }
            : card
        )
      );
      toast.success('Flashcard updated');
      setEditingId(null);
    }
    setEditLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;

    setDeletingId(id);
    const { error } = await supabase.from('flashcards').delete().eq('id', id);
    setDeletingId(null);

    if (error) {
      toast.error('Failed to delete flashcard');
    } else {
      setFlashcards((prev) => prev.filter((fc) => fc.id !== id));
      toast.success('Flashcard deleted');
      if (editingId === id) setEditingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans">
        <p className="text-red-400 text-xl font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans">
      <Sidebar /> 

      <main className="flex-grow flex flex-col py-12 px-8 sm:px-12 lg:px-16 overflow-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-white/20 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
            Flashcards Review
          </h1>

          <div className="flex gap-4 items-center">

            {/* Start Studying Button */}
            <button
              onClick={() => router.push(`/decks/${deckId}/study`)}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold shadow-md transition"
            >
              Enter Study Mode
            </button>

          </div>
        </header>

        {flashcards.length === 0 ? (
          <p className="text-center text-indigo-100 italic text-xl">No flashcards found in this deck.</p>
        ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((card, i) => (
            <motion.li
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-64 cursor-pointer select-none"
              tabIndex={0}
              onClick={() => editingId !== card.id && toggleFlip(i)}
              onKeyDown={(e) => {
                if (editingId !== card.id && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  toggleFlip(i);
                }
              }}
              aria-pressed={flippedIndex === i}
            >
              <div className="w-full h-full" style={{ perspective: 1000 }}>
                <div
                  className="relative w-full h-full transition-transform duration-700"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedIndex === i ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front Side */}
                  <div
                    className="absolute w-full h-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 overflow-hidden text-white flex flex-col justify-center items-center text-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    {editingId === card.id ? (
                      <>
                        <input
                          className="mb-2 w-full p-2 rounded border border-white/20 bg-white/20 text-white placeholder-indigo-200 text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
                          maxLength={500}
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                          disabled={editLoading}
                        />
                        <textarea
                          className="w-full p-2 rounded border border-white/20 bg-white/20 text-white placeholder-indigo-200 text-sm resize-none focus:ring-2 focus:ring-pink-300 focus:outline-none"
                          maxLength={1000}
                          rows={3}
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          disabled={editLoading}
                        />
                        <div className="prose prose-sm text-indigo-200 mt-2 max-h-24 overflow-auto w-full text-left">
                          <ReactMarkdown>{editAnswer || 'Markdown preview will appear here...'}</ReactMarkdown>
                        </div>
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <Tooltip title="Save">
                            <IconButton
                                onClick={(e) => {
                                e.stopPropagation();
                                handleSave(card.id);
                                }}
                                disabled={editLoading}
                                size="small"
                                sx={{
                                color: '#10b981', // Tailwind green-500
                                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.3)' },
                                }}
                            >
                                <SaveIcon fontSize="small" />
                            </IconButton>
                            </Tooltip>

                            <Tooltip title="Cancel">
                            <IconButton
                                onClick={(e) => {
                                e.stopPropagation();
                                cancelEditing();
                                }}
                                disabled={editLoading}
                                size="small"
                                sx={{
                                color: '#9ca3af', // Tailwind gray-400
                                backgroundColor: 'rgba(156, 163, 175, 0.15)',
                                '&:hover': { backgroundColor: 'rgba(156, 163, 175, 0.3)' },
                                }}
                            >
                                <CancelIcon fontSize="small" />
                            </IconButton>
                            </Tooltip>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg sm:text-xl font-semibold text-white">{card.question}</h3>

                        {/* Controls */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <Tooltip title="Edit flashcard">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditing(card);
                              }}
                              size="small"
                              sx={{
                                color: '#db2777',
                                backgroundColor: 'rgba(219, 39, 119, 0.15)',
                                '&:hover': { backgroundColor: 'rgba(219, 39, 119, 0.3)' },
                                boxShadow: '0 2px 6px rgba(219, 39, 119, 0.4)',
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete flashcard">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(card.id);
                              }}
                              size="small"
                              disabled={deletingId === card.id}
                              sx={{
                                color: '#ef4444',
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.3)' },
                                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Back Side */}
                  <div
                    className="absolute w-full h-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 text-white flex items-center justify-center text-center"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="max-h-48 overflow-auto text-white text-lg font-bold font-mono text-center leading-relaxed">
                      <ReactMarkdown>{card.answer || '_No answer provided._'}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>

        )}
      </main>
    </div>
  );
}
