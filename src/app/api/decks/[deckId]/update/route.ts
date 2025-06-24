import { supabase } from '../../../../../lib/supabase';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { deckId: string } }) {
  const { name, description, is_public } = await req.json();
  const { deckId } = params;

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
}
