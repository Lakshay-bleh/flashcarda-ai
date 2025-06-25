import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../../../lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string; flashcardId: string }> },
) {
  const { flashcardId, deckId } = await params

  try {
    const { data: flashcard, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("id", flashcardId)
      .eq("deck_id", deckId)
      .single()

    if (error) {
      return NextResponse.json({ error: "Flashcard not found" }, { status: 404 })
    }

    return NextResponse.json(flashcard)
  } catch (error) {
    console.error("Error fetching flashcard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string; flashcardId: string }> },
) {
  const { flashcardId, deckId } = await params

  try {
    const { question, answer } = await request.json()

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("flashcards")
      .update({ question, answer })
      .eq("id", flashcardId)
      .eq("deck_id", deckId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error("Error updating flashcard:", err)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string; flashcardId: string }> },
) {
  const { flashcardId, deckId } = await params

  try {
    if (!flashcardId) {
      return NextResponse.json({ error: "Flashcard ID is required" }, { status: 400 })
    }

    const { data: flashcard, error: fetchError } = await supabase
      .from("flashcards")
      .select("deck_id")
      .eq("id", flashcardId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: "Flashcard not found" }, { status: 404 })
    }

    if (flashcard.deck_id !== deckId) {
      return NextResponse.json({ error: "Flashcard does not belong to this deck" }, { status: 403 })
    }

    const { error } = await supabase.from("flashcards").delete().eq("id", flashcardId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting flashcard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
