import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../../../lib/supabase"

export async function GET(request: NextRequest, { params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params

  try {
    const { data: flashcards, error } = await supabase
      .from("flashcards")
      .select("*")
      .eq("deck_id", deckId)
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(flashcards)
  } catch (error) {
    console.error("Error fetching flashcards:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params

  try {
    const { question, answer } = await request.json()

    if (!question || !answer) {
      return NextResponse.json({ error: "Missing question or answer" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("flashcards")
      .insert([{ question, answer, deck_id: deckId }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error("Error creating flashcard:", err)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
