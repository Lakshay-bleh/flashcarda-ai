'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import FlashcardGenerator from '../../../../components/FlashcardGenerator';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export default function DeckPage() {
  const params = useParams();
  const deckId = params?.deckId as string;

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const fetchFlashcards = async () => {
    if (!deckId) return;
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deckId)
      .order('id', { ascending: false });

    if (!error) setFlashcards(data || []);
  };

  useEffect(() => {
    fetchFlashcards();
  }, [deckId]);

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('flashcards')
      .insert([{ question, answer, deck_id: deckId }])
      .select();

    if (!error && data) {
      setFlashcards((prev) => [data[0], ...prev]);
      toast.success('Flashcard added!');
      setQuestion('');
      setAnswer('');
    } else {
      toast.error('Failed to add flashcard');
    }
  };

  const handleSave = async (id: string) => {
    const { data, error } = await supabase
      .from('flashcards')
      .update({ question: editQuestion, answer: editAnswer })
      .eq('id', id)
      .select();

    if (!error && data) {
      setFlashcards((prev) =>
        prev.map((card) => (card.id === id ? data[0] : card))
      );
      toast.success('Flashcard updated');
      setEditingId(null);
    } else {
      toast.error('Failed to update flashcard');
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('flashcards').delete().eq('id', id);
    if (!error) {
      setFlashcards((prev) => prev.filter((card) => card.id !== id));
      toast.success('Flashcard deleted');
    } else {
      toast.error('Failed to delete flashcard');
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧠 Flashcards for Deck</h1>

      <form onSubmit={addCard} className="mb-6 space-y-4">
        <div>
          <input
            className="w-full p-2 border rounded mb-2"
            placeholder="Question (supports markdown)"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <div className="prose prose-sm w-full border mb-2 p-2 rounded">
            <ReactMarkdown >
              {question || 'Markdown preview will appear here...'}
            </ReactMarkdown>
          </div>
        </div>

        <div>
          <input
            className="w-full p-2 border rounded mb-2"
            placeholder="Answer (supports markdown)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
          <div className="text-gray-800">
             <ReactMarkdown>
              {answer || 'Markdown preview will appear here...'}
            </ReactMarkdown>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          ➕ Add Flashcard
        </button>
      </form>

      <ul className="space-y-3 mb-12">
        {flashcards.map((card) => (
          <li
            key={card.id}
            className="p-4 rounded shadow border border-gray-200 "
          >
            {editingId === card.id ? (
              <>
                <input
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <input
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
                <button
                  onClick={() => handleSave(card.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="font-semibold">Q:</p>
                <div className="text-gray-800">
                  <ReactMarkdown>{card.question}</ReactMarkdown>
                </div>
                <p className="font-semibold mt-2">A:</p>
                <div className="text-gray-600">
                  <ReactMarkdown>{card.answer}</ReactMarkdown>
                </div>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(card.id);
                      setEditQuestion(card.question);
                      setEditAnswer(card.answer);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    🗑 Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Flashcard generator (updates list automatically) */}
      <FlashcardGenerator deckId={deckId} onGenerated={fetchFlashcards} />
    </div>
  );
}
