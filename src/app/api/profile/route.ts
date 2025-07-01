import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { profileSchema } from '../../../lib/validations/profile';

async function getUuidFromExternalId(externalId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('app_users')
    .select('id')
    .eq('clerk_id', externalId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching UUID from external ID:', error);
    return null;
  }

  return data?.id ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Here userId is actually Clerk ID
    const { userId: clerkId, bio, location, imageUrl } = parsed.data;

    // Convert clerkId to internal UUID
    const userId = await getUuidFromExternalId(clerkId);
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: userId, // use internal UUID here
          bio,
          location,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' } // upsert based on user_id foreign key
      )
      .select();

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No data returned from upsert' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        bio: data[0].bio,
        location: data[0].location,
        imageUrl: data[0].image_url,
        updatedAt: data[0].updated_at,
      },
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const externalUserId = url.searchParams.get('userId');
    if (!externalUserId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const userId = await getUuidFromExternalId(externalUserId);
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Try fetching profile, no error if not found
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Insert default profile if none exists
    if (!profile) {
      const { data: insertedProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          bio: '',
          location: '',
          image_url: '',
          updated_at: new Date().toISOString(),
        })
        .select()
        .maybeSingle();

      if (insertError) {
        console.error('Error inserting profile:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      profile = insertedProfile;
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json({
      bio: profile.bio,
      location: profile.location,
      imageUrl: profile.image_url,
      updatedAt: profile.updated_at,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
