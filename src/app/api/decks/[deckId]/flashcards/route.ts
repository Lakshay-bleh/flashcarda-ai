import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

type Params = {
  params: {
    deckId: string;
  };
};

export async function GET(req: NextRequest, context: Params) {
  const { deckId } = context.params;

  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: Params) {
  const { deckId } = context.params;

  try {
    const { question, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Missing question or answer' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('flashcards')
      .insert([{ question, answer, deck_id: deckId }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
