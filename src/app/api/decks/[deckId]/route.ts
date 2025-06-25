import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../lib/supabase"

export async function GET(request: NextRequest, { params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params

  try {
    const { data: deck, error } = await supabase.from("decks").select("*").eq("id", deckId).single()

    if (error) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 })
    }

    return NextResponse.json(deck)
  } catch (error) {
    console.error("Error fetching deck:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params

  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const { data: deck, error } = await supabase
      .from("decks")
      .update({
        name,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deckId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(deck)
  } catch (error) {
    console.error("Error updating deck:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params

  try {
    // First delete all flashcards in the deck
    const { error: flashcardsError } = await supabase.from("flashcards").delete().eq("deck_id", deckId)

    if (flashcardsError) {
      return NextResponse.json({ error: flashcardsError.message }, { status: 500 })
    }

    // Then delete the deck
    const { error } = await supabase.from("decks").delete().eq("id", deckId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting deck:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
