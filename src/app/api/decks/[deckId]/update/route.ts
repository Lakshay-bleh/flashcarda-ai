import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

type Params = {
  params: {
    deckId: string;
  };
};

export async function PATCH(req: NextRequest, context: Params) {
  const { deckId } = context.params;

  try {
    const { name, description, is_public } = await req.json();

    const { data, error } = await supabase
      .from('decks')
      .update({ name, description, is_public })
      .eq('id', deckId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deck: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
