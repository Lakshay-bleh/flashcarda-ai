import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

async function createProfileIfNotExists(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (profileError) {
    console.error('Error checking profile:', profileError);
    return;
  }

  if (!profile) {
    const { error: insertError } = await supabase.from('profiles').insert({
      user_id: userId,
      bio: '',
      location: '',
      image_url: '',
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Error creating profile:', insertError);
    }
  }
}

async function createStatsIfNotExists(userId: string) {
  const { error: statsError } = await supabase
    .from('user_stats')
    .upsert(
      {
        user_id: userId,
        decks: 0,
        cards_reviewed: 0,
        hours_studied: 0,
        daily_goal: 30,
        reviewed_today: 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (statsError) {
    console.error('Error creating or updating user_stats:', statsError);
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const clerkUserId = url.searchParams.get('clerkUserId');

  if (!clerkUserId) {
    return NextResponse.json({ error: 'Missing clerkUserId' }, { status: 400 });
  }

  try {
    // 1) Check if user exists in app_users
    const { data: existingUser, error: selectError } = await supabase
      .from('app_users')
      .select('*')
      .eq('clerk_id', clerkUserId)
      .maybeSingle();

    if (selectError) {
      console.error('Select error:', selectError);
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    let user = existingUser;

    // 2) Insert user if not exists
    if (!user) {
      const { data: newUser, error: insertError } = await supabase
        .from('app_users')
        .insert([{ clerk_id: clerkUserId }])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      user = newUser;
    }

    // 3) Ensure profile and stats exist
    await Promise.all([createProfileIfNotExists(user.id), createStatsIfNotExists(user.id)]);

    // 4) Fetch the current user stats to make sure the value is updated correctly
    const { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (statsError) {
      console.error('Fetch stats error:', statsError);
      return NextResponse.json({ error: statsError.message }, { status: 500 });
    }

    // 5) Return the current stats
    return NextResponse.json({ user, stats });
  } catch (error) {
    console.error('Sync user error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
