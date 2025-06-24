import { supabase } from '../../../../lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId } = await auth(); // This gets user from server context

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { deckId, known, total, accuracy, duration } = await req.json();

  if (!deckId) {
    return NextResponse.json({ error: 'Missing deckId' }, { status: 400 });
  }

  const { data: appUser, error: userError } = await supabase
    .from('app_users')
    .select('id')
    .eq('clerk_id', userId)
    .single();

  if (userError || !appUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Insert study session
  const { error: sessionError } = await supabase.from('study_sessions').insert([
    {
      user_id: appUser.id,
      deck_id: deckId,
      known_count: known,
      total_count: total,
      accuracy,
      duration_sec: duration,
    },
  ]);

  if (sessionError) {
    return NextResponse.json({ error: 'Failed to record study session' }, { status: 500 });
  }

  // Upsert streak
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  const { data: streak, error: streakError } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', appUser.id)
    .single();

  if (streakError && streakError.code !== 'PGRST116') { // PGRST116 = no rows found, ignore that
    return NextResponse.json({ error: 'Failed to fetch streak' }, { status: 500 });
  }

  if (streak) {
    const lastStudyDate = new Date(streak.last_study);
    const diffDays = Math.floor(
      (today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Increment streak
      const { error: updateError } = await supabase
        .from('streaks')
        .update({ current_streak: streak.current_streak + 1, last_study: todayISO })
        .eq('id', streak.id);

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 });
      }
    } else if (diffDays > 1) {
      // Reset streak
      const { error: resetError } = await supabase
        .from('streaks')
        .update({ current_streak: 1, last_study: todayISO })
        .eq('id', streak.id);

      if (resetError) {
        return NextResponse.json({ error: 'Failed to reset streak' }, { status: 500 });
      }
    }
    // if diffDays == 0, do nothing (same day)
  } else {
    // Insert new streak
    const { error: insertError } = await supabase
      .from('streaks')
      .insert([{ user_id: appUser.id, current_streak: 1, last_study: todayISO }]);

    if (insertError) {
      return NextResponse.json({ error: 'Failed to create streak' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Stats updated' });
}
