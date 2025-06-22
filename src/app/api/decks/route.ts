// src/app/api/decks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase'; // adjust if needed

export async function GET(req: NextRequest) {
  try {
    const appUserId = req.nextUrl.searchParams.get('userId');
    if (!appUserId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Fetch decks directly using app user UUID
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', appUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET decks error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET decks unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, userId } = body; // now expecting appUserId directly

    if (!name || !userId) {
      return NextResponse.json({ error: 'Missing name or userId' }, { status: 400 });
    }

    // Insert new deck with user_id
    const { data, error } = await supabase
      .from('decks')
      .insert([{ name, description, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error('POST create deck error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('POST create deck unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
