import { supabase } from '../../../../../lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest, 
  { params }: { params: Promise<{ deckId: string }> }) {
  const { name, description, is_public } = await request.json();
  const { deckId } = await params;

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
