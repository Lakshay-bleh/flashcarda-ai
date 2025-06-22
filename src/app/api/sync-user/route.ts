import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase'; // Adjust path as needed

export async function GET(request: Request) {
  const url = new URL(request.url);
  const clerkUserId = url.searchParams.get('clerkUserId');

  if (!clerkUserId) {
    return NextResponse.json({ error: 'Missing clerkUserId' }, { status: 400 });
  }

  try {
    // Check if user exists
    const { data: existingUser, error: selectError } = await supabase
      .from('app_users')
      .select('*')
      .eq('clerk_id', clerkUserId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // Ignore "no rows found" error, throw others
      throw selectError;
    }

    if (!existingUser) {
      // Insert new user
      const { data: newUser, error: insertError } = await supabase
        .from('app_users')
        .insert([{ clerk_id: clerkUserId }])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      return NextResponse.json({ user: newUser });
    }

    return NextResponse.json({ user: existingUser });
  } catch (error) {
    console.error('Sync user error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
