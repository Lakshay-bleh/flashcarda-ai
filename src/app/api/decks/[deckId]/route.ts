import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

type Params = {
  params: {
    deckId: string;
  };
};

export async function GET(req: NextRequest, context: Params) {
  const { deckId } = context.params;

  if (!deckId) {
    return NextResponse.json({ error: 'Missing deckId' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('id', deckId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: Params) {
  const { deckId } = context.params;

  if (!deckId) {
    return NextResponse.json({ error: 'Missing deckId' }, { status: 400 });
  }

  try {
    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('decks')
      .update({ name, description })
      .eq('id', deckId)
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

export async function DELETE(req: NextRequest, context: Params) {
  const { deckId } = context.params;

  if (!deckId) {
    return NextResponse.json({ error: 'Missing deckId' }, { status: 400 });
  }

  try {
    const { error } = await supabase.from('decks').delete().eq('id', deckId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Deck deleted' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
