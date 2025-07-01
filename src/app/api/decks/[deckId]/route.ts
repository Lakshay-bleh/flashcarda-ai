import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(request: NextRequest, { params }: { params: Promise<{ deckId: string }> }) {
  const { deckId } = await params;

  try {
    // 1) Fetch the deck
    const { data: deck, error } = await supabase.from("decks").select("*").eq("id", deckId).single();

    if (error) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // 2) Get current user's ID (assuming you're using Clerk for authentication)
    const { userId: clerkId } = getAuth(request);

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3) Get user from app_users
    const { data: appUser, error: userError } = await supabase
      .from("app_users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    if (userError || !appUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4) Increment the `decks` in user_stats
    const { data: userStats, error: statsError } = await supabase
      .from("user_stats")
      .select("decks")
      .eq("user_id", appUser.id)
      .single();

    if (statsError || !userStats) {
      return NextResponse.json({ error: "User stats not found" }, { status: 404 });
    }

    // Increment the `decks` value
    const newDecksValue = userStats.decks + 1;

    // 5) Update user stats with the incremented `decks`
    const { error: updateError } = await supabase
      .from("user_stats")
      .update({ decks: newDecksValue, updated_at: new Date().toISOString() })
      .eq("user_id", appUser.id);

    if (updateError) {
      console.error("Error updating decks:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 6) Return the updated deck and user stats
    return NextResponse.json({ deck, userStats: { ...userStats, decks: newDecksValue } });
  } catch (error) {
    console.error("Error fetching deck:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
