import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../../lib/supabase';

type Params = {
  params: {
    deckId: string;
    flashcardId: string;
  };
};

export async function PATCH(req: NextRequest, context: Params) {
  const { flashcardId } = context.params;

  try {
    const { question, answer } = await req.json();

    const { data, error } = await supabase
      .from('flashcards')
      .update({ question, answer })
      .eq('id', flashcardId)
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
  const { flashcardId } = context.params;

  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
