import { notFound } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import ReactMarkdown from "react-markdown";

type Props = {
  params: {
    deckId: string;
    slug: string;
  };
};

export default async function SharedDeckPage({ params }: Props) {
  const { deckId } = (await Promise.resolve(params));

  // Fetch deck
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select("id, name, description")
    .eq("id", deckId)
    .single();

  if (deckError || !deck) {
    notFound();
  }

  // Fetch flashcards
  const { data: flashcards, error: cardsError } = await supabase
    .from("flashcards")
    .select("id, question, answer")
    .eq("deck_id", deckId)
    .order("id", { ascending: false });

  if (cardsError) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white font-sans">
      <main className="max-w-5xl mx-auto px-6 py-14">
        {/* Header */}
        <header className="mb-12 border-b border-white/20 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight drop-shadow-sm">
            {deck.name}
          </h1>
          <span className="text-sm text-white/70">
            Shared deck • {flashcards?.length || 0} flashcards
          </span>
        </header>

        {/* Description */}
        {deck.description && (
          <section className="prose prose-invert prose-p:text-indigo-200 prose-h2:text-white prose-strong:text-indigo-100 max-w-3xl mb-10">
            <ReactMarkdown>{deck.description}</ReactMarkdown>
          </section>
        )}

        {/* Flashcards */}
        <section className="grid grid-cols-1 gap-6">
          {flashcards && flashcards.length > 0 ? (
            flashcards.map(({ id, question, answer }) => (
              <article
                key={id}
                className="rounded-2xl p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition hover:shadow-2xl hover:-translate-y-1"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
                  {question}
                </h2>
                <div className="prose prose-sm prose-invert prose-p:text-indigo-200 bg-white/5 p-4 rounded-lg border border-white/10">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-indigo-100">
              No flashcards available in this deck.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
