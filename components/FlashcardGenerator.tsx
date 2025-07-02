'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

// Flashcard type
type Flashcard = {
  question: string;
  answer: string;
};

// Debounce utility
function debounce<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      void fn(...args);
    }, delay);
  };
}

// Use env var for API base URL, fallback to localhost for dev
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export default function FlashcardGenerator({
  deckId,
  onGenerated,
}: {
  deckId: string;
  onGenerated: () => void;
}) {
  const [text, setText] = useState('');
  const [numQuestions, setNumQuestions] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewFlashcards, setPreviewFlashcards] = useState<Flashcard[]>([]);

  useEffect(() => {
    const fetchPreview = debounce(async (inputText: string, numQ: number) => {
      if (!inputText.trim()) {
        setPreviewFlashcards([]);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText, num_questions: numQ }),
        });

        if (!res.ok) throw new Error('Failed to fetch preview');

        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setPreviewFlashcards([]);
        } else {
          setPreviewFlashcards(data.flashcards || []);
          setError('');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to generate preview.');
        setPreviewFlashcards([]);
      } finally {
        setLoading(false);
      }
    }, 800);

    fetchPreview(text, numQuestions);
  }, [text, numQuestions]);

  const generate = async () => {
    if (!deckId || !text.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, num_questions: numQuestions }),
      });

      if (!res.ok) throw new Error('Backend failed');

      const data = await res.json();
      const inserts = data.flashcards.map((fc: Flashcard) => ({
        ...fc,
        deck_id: deckId,
      }));

      const { error: insertError } = await supabase.from('flashcards').insert(inserts);

      if (insertError) throw insertError;

      setText('');
      onGenerated();
      toast.success(`${inserts.length} flashcards generated!`);
      setPreviewFlashcards([]);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate or save flashcards.');
      setError('Something went wrong. Check backend or input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-12 space-y-6 transition-all hover:scale-[1.01] text-white"
    >
      <h2 className="text-3xl font-semibold drop-shadow mb-4">Generate Flashcards</h2>

      <textarea
        rows={5}
        className="w-full p-4 rounded-lg border border-white/20 bg-white/20 text-white placeholder-indigo-200 focus:ring-2 focus:ring-pink-300 focus:outline-none transition"
        placeholder="Paste paragraph or text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex items-center gap-4">
        <input
          type="number"
          min={1}
          max={10}
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          className="w-24 p-3 rounded-lg border border-white/20 bg-white/20 text-white"
        />
        <button
          onClick={generate}
          disabled={loading || !text.trim()}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-xl"
        >
          {loading ? 'Generating...' : '⚡ Generate'}
        </button>
      </div>

      {error && <p className="text-red-300">{error}</p>}

      <div>
        <h3 className="text-2xl font-semibold mb-2">Live Preview</h3>
        {loading && <p className="italic text-indigo-100">Loading preview...</p>}
        {!loading && previewFlashcards.length === 0 && (
          <p className="italic text-indigo-100">Flashcards preview will appear here...</p>
        )}

        <ul className="space-y-4 mt-4">
          {previewFlashcards.map((fc, i) => (
            <li
              key={i}
              className="border border-white/20 rounded-xl p-4 bg-white/10 backdrop-blur"
            >
              <div className="mb-2">
                <p className="text-indigo-100 font-semibold mb-1">Q:</p>
                <div className="text-white">
                  <ReactMarkdown>{fc.question}</ReactMarkdown>
                </div>
              </div>
              <div>
                <p className="text-indigo-100 font-semibold mb-1">A:</p>
                <div className="text-white">
                  <ReactMarkdown>{fc.answer}</ReactMarkdown>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
