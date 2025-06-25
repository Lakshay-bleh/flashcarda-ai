import { notFound } from "next/navigation"
import { supabase } from "../../../../../lib/supabase"
import ReactMarkdown from "react-markdown"

type Props = {
  params: Promise<{
    deckId: string
    slug: string
  }>
}

export default async function SharedDeckPage({ params }: Props) {
  const { deckId } = await params

  // Fetch deck
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select("id, name, description, user_id")
    .eq("id", deckId)
    .single()

  if (deckError || !deck) {
    console.error("Deck not found:", deckError)
    notFound()
  }

  // Fetch flashcards
  const { data: flashcards, error: cardsError } = await supabase
    .from("flashcards")
    .select("id, question, answer, deck_id")
    .eq("deck_id", deckId)
    .order("id", { ascending: false })

  if (cardsError) {
    console.error("Failed to load flashcards:", cardsError)
    notFound()
  }

  return (
    <main className="max-w-3xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{deck.name}</h1>
        {deck.description && (
          <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300">
            <ReactMarkdown>{deck.description}</ReactMarkdown>
          </div>
        )}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Shared deck • {flashcards?.length || 0} flashcards
        </div>
      </div>

      <section className="space-y-6">
        {flashcards && flashcards.length > 0 ? (
          flashcards.map(({ id, question, answer }) => (
            <article
              key={id}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h2 className="font-semibold text-lg mb-3 text-blue-600 dark:text-blue-400">Question:</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{question}</ReactMarkdown>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <h3 className="font-semibold text-md mb-3 text-green-600 dark:text-green-400">Answer:</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">📚</div>
            <p className="text-gray-600 dark:text-gray-400">No flashcards available in this deck.</p>
          </div>
        )}
      </section>
    </main>
  )
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props) {
  const { deckId } = await params

  const { data: deck } = await supabase.from("decks").select("name, description").eq("id", deckId).single()

  return {
    title: deck?.name ? `${deck.name} - Shared Flashcard Deck` : "Shared Flashcard Deck",
    description: deck?.description || "A shared flashcard deck for studying",
  }
}
