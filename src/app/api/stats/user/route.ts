import { getAuth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('API /api/stats/user called');

  const { userId: clerkId } = getAuth(request);
  console.log('User from Clerk:', clerkId);

  if (!clerkId) {
    console.log('Unauthorized user');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: appUser, error: userError } = await supabase
    .from('app_users')
    .select('id')
    .eq('clerk_id', clerkId)
    .single();

  console.log('App user:', appUser, 'Error:', userError);

  if (userError || !appUser) {
    console.log('User not found');
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Fetch user stats without incrementing
  const { data: stats, error: statsError } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', appUser.id)
    .single();

  if (statsError) {
    console.error('Error fetching user stats:', statsError);
    return NextResponse.json({ error: statsError.message }, { status: 500 });
  }

  if (!stats) {
    console.log('Stats not found');
    return NextResponse.json({ error: 'Stats not found' }, { status: 404 });
  }

  console.log('Stats fetch success:', stats);

  return NextResponse.json(stats);
}
