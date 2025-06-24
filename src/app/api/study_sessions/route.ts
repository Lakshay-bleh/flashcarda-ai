// app/api/study_sessions/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('study_sessions')
    .select('*, decks(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
