// app/api/stats/route.ts

import { supabase } from '../../../../lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const statsSchema = z.object({
  deckId: z.string().min(1, 'deckId is required'),
  known: z.number().int().nonnegative(),
  total: z.number().int().positive(),
  accuracy: z.number().min(0).max(100),
  duration: z.number().int().nonnegative()
});

export async function POST(req: NextRequest) {
  const { userId } = await auth(); 
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = statsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { deckId, known, total, accuracy, duration } = parsed.data;

  // Get internal user ID
  const { data: appUser, error: userError } = await supabase
    .from('app_users')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (userError || !appUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Record study session
  const { error: sessionError } = await supabase.from('study_sessions').insert([{
    user_id: appUser.id,
    deck_id: deckId,
    known_count: known,
    total_count: total,
    accuracy,
    duration_sec: duration
  }]);

  if (sessionError) {
    return NextResponse.json({ error: 'Failed to record study session' }, { status: 500 });
  }

  // Handle streak
  const todayISO = new Date().toISOString().split('T')[0];

  const { data: streak, error: streakError } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', appUser.id)
    .single();

  if (streakError && streakError.code !== 'PGRST116') {
    return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 });
  }

  const updateStreak = async (newStreak: number) => {
    const { error } = await supabase
      .from('streaks')
      .update({ current_streak: newStreak, last_study: todayISO })
      .eq('id', streak?.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 });
    }
  };

  if (streak) {
    const lastStudy = new Date(streak.last_study);
    const today = new Date(todayISO);
    const diffDays = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      const res = await updateStreak(streak.current_streak + 1);
      if (res) return res;
    } else if (diffDays > 1) {
      const res = await updateStreak(1);
      if (res) return res;
    }
    // Same-day activity? No streak change.
  } else {
    const { error: insertError } = await supabase
      .from('streaks')
      .insert([{ user_id: appUser.id, current_streak: 1, last_study: todayISO }]);

    if (insertError) {
      return NextResponse.json({ error: 'Failed to create streak' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Study session recorded and streak updated' });
}
