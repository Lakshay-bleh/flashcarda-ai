'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

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
  const [previewFlashcards, setPreviewFlashcards] = useState<
    { question: string; answer: string }[]
  >([]);

  // Function to fetch flashcards preview from backend
  const fetchPreview = useCallback(
    debounce(async (inputText: string, numQ: number) => {
      if (!inputText.trim()) {
        setPreviewFlashcards([]);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:8000/generate', {
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
        console.log(err)
        setError('Failed to generate preview.');
        setPreviewFlashcards([]);
      } finally {
        setLoading(false);
      }
    }, 800),
    []
  );

  // Trigger preview fetch when text or numQuestions changes
  useEffect(() => {
    fetchPreview(text, numQuestions);
  }, [text, numQuestions, fetchPreview]);

  // Original generate function to save generated flashcards
  const generate = async () => {
    if (!deckId || !text.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, num_questions: numQuestions }),
      });

      if (!res.ok) throw new Error('Backend failed');

      const data = await res.json();
      const inserts = data.flashcards.map((fc: { question: string; answer: string }) => ({
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
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow mb-8"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        🧠 Generate Flashcards
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste paragraph or text here..."
        rows={5}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 p-3 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center gap-4 mb-4">
        <input
          type="number"
          min={1}
          max={10}
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          className="w-24 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 p-2 rounded text-gray-900 dark:text-gray-100"
          placeholder="Questions"
        />
        <button
          onClick={generate}
          disabled={loading || !text.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition disabled:opacity-60"
        >
          {loading ? 'Generating...' : '⚡ Generate'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Live Preview</h3>
        {loading && <p className="text-gray-500 dark:text-gray-400">Loading preview...</p>}
        {!loading && previewFlashcards.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 italic">Flashcards preview will appear here...</p>
        )}
        <ul className="space-y-4">
          {previewFlashcards.map((fc, i) => (
            <li
              key={i}
              className="border border-gray-300 dark:border-gray-700 rounded p-3 bg-gray-50 dark:bg-gray-900 shadow-sm"
            >
              <p className="font-semibold text-gray-700 dark:text-gray-300">Q:</p>
              <div className="mb-2 text-gray-900 dark:text-gray-100">
                <ReactMarkdown >{fc.question}</ReactMarkdown>
              </div>
              
              <p className="font-semibold text-gray-700 dark:text-gray-300">A:</p>
              <div className="text-gray-800 dark:text-gray-200">
                <ReactMarkdown >{fc.answer}</ReactMarkdown>
              </div>       
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
