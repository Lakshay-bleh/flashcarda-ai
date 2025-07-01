import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const { clerkUserId, action, count } = await request.json();

    if (!clerkUserId || !action || typeof count !== 'number') {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Get user ID from clerkUserId
    const { data: user, error: userError } = await supabase
      .from('app_users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .maybeSingle();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch current user stats
    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (statsError) {
      return NextResponse.json({ error: statsError.message }, { status: 500 });
    }

    // Increment decks value
    const column = 'decks'; // Action can dynamically change columns, but for decks we are hardcoding it here.
    const currentDecks = stats?.decks ?? 0;
    const newDecksValue = currentDecks + count;

    // Upsert updated user stats
    const { error: upsertError } = await supabase
      .from('user_stats')
      .upsert(
        {
          user_id: user.id,
          [column]: newDecksValue,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
