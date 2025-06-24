import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '../../../../../lib/supabase';
import ReactMarkdown from 'react-markdown';

type Props = {
  params: {
    deckId: string;
    slug: string;
  };
};

export default async function SharedDeckPage({ params }: Props) {
  const { deckId } = params;

  // Fetch deck
  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id, name, description, user_id')
    .eq('id', deckId)
    .single();

  if (deckError || !deck) {
    console.error('Deck not found:', deckError);
    notFound();
  }

  // Fetch flashcards
  const { data: flashcards, error: cardsError } = await supabase
    .from('flashcards')
    .select('id, question, answer, deck_id')
    .eq('deck_id', deckId)
    .order('id', { ascending: false });

  if (cardsError) {
    console.error('Failed to load flashcards:', cardsError);
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-2">{deck.name}</h1>
      {deck.description && (
        <p className="mb-8 text-gray-700 dark:text-gray-300">{deck.description}</p>
      )}

      <section className="space-y-6">
        {flashcards && flashcards.length > 0 ? (
          flashcards.map(({ id, question, answer }) => (
            <article
              key={id}
              className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow border border-gray-200 dark:border-gray-700"
            >
              <h2 className="font-semibold text-lg mb-2">Question:</h2>
              <div className="prose dark:prose-invert mb-4">
                <ReactMarkdown >{question}</ReactMarkdown>
              </div>

              <h3 className="font-semibold text-md mb-1">Answer:</h3>
              <div className="prose dark:prose-invert">
                <ReactMarkdown>{answer}</ReactMarkdown>
              </div>
            </article>
          ))
        ) : (
          <p>No flashcards available.</p>
        )}
      </section>
    </main>
  );
}
