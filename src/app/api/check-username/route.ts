import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  const clerkId = url.searchParams.get('userId'); // actually clerk_id

  if (!username || !clerkId) {
    return NextResponse.json({ error: 'Missing username or userId' }, { status: 400 });
  }

  // 1) Get the profile by username
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('username', username)
    .maybeSingle();

  if (profileError) {
    console.error('Supabase error fetching profile:', profileError);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // If username not taken, allow it
  if (!profileData) {
    return NextResponse.json({ isUnique: true });
  }

  // 2) Get the app_users record with user_id from profiles to check clerk_id
  const { data: appUserData, error: appUserError } = await supabase
    .from('app_users')
    .select('clerk_id')
    .eq('id', profileData.user_id) // app_users.id = profiles.user_id
    .maybeSingle();

  if (appUserError) {
    console.error('Supabase error fetching app_users:', appUserError);
    return NextResponse.json({ error: appUserError.message }, { status: 500 });
  }

  // 3) Compare clerk_id from DB with clerkId from request query
  const isUnique = !appUserData || appUserData.clerk_id === clerkId;

  return NextResponse.json({ isUnique });
}
