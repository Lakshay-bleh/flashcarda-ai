import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function DELETE(req: NextRequest, { params }: { params: { deckId: string } }) {
  const { deckId } = params;

  if (!deckId) {
    return NextResponse.json({ error: 'Missing deckId' }, { status: 400 });
  }

  try {
    const { error } = await supabase.from('decks').delete().eq('id', deckId);

    if (error) {
      console.error('DELETE deck error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Deck deleted' }, { status: 200 });
  } catch (err) {
    console.error('DELETE deck unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { deckId: string } }) {
  const { deckId } = params;
  const body = await req.json();
  const { name, description } = body;

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('decks')
    .update({ name, description })
    .eq('id', deckId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
