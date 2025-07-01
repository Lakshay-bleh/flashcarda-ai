import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clerkUserId } = body;

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // Lookup user_id from clerkUserId
    const { data: user, error: userError } = await supabase
      .from('app_users')
      .select('id')
      .eq('clerk_id', clerkUserId)
      .maybeSingle();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch user stats to return
    const { data: userStats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (statsError) {
      return NextResponse.json({ error: statsError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, stats: userStats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
