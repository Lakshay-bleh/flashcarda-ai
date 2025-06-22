'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

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

  const generate = async () => {
    if (!deckId || !text) return;

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
    } catch (err: unknown) {
      console.error(err);
      toast.error('Failed to generate or save flashcards.');
      setError('Something went wrong. Check backend or input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded shadow mt-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4">🧠 Generate Flashcards</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste paragraph here..."
        className="w-full border rounded p-2 mb-4"
        rows={5}
      />

      <div className="prose p-4 rounded mb-4">
        <ReactMarkdown>{text || '*Live preview will appear here...*'}</ReactMarkdown>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <input
          type="number"
          min={1}
          max={10}
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          className="p-2 w-24 border rounded"
          placeholder="Questions"
        />
        <button
          onClick={generate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}
