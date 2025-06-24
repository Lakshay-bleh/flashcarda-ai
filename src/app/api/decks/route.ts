import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { z } from 'zod';

// Zod schema for validating POST input
const deckSchema = z.object({
  name: z.string().min(1, 'Deck name is required'),
  description: z.string().optional(),
  userId: z.string().uuid('Invalid userId format'),
});

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json({ error: 'Missing or invalid userId' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', userId)
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
    const result = deckSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, userId } = result.data;

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
