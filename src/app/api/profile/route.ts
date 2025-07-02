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
        { error: 'Validation failed', fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { userId: clerkId, bio, location, imageUrl } = parsed.data;
    const userId = await getUuidFromExternalId(clerkId);
    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Updating profile for userId:', userId);
    console.log('Payload:', { bio, location, imageUrl });

    // Try update first
    // Declare username and full_name if needed
    const username = parsed.data.username ?? null;
    const full_name = parsed.data.full_name ?? null;

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
      {
        user_id: userId,
        full_name,
        username,
        bio,
        location,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
      )
      .select();


    console.log('Update result data:', data);
    console.log('Update result error:', error);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No profile updated' }, { status: 404 });
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

    // Fetch profile data (including username if stored here)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('bio, location, image_url, updated_at, username, full_name') // include full_name here
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

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
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      if (!insertedProfile) {
        return NextResponse.json({ error: 'Failed to insert or retrieve profile' }, { status: 500 });
      }
      return NextResponse.json({
        full_name: insertedProfile.full_name,
        username: insertedProfile.username,
        bio: insertedProfile.bio,
        location: insertedProfile.location,
        imageUrl: insertedProfile.image_url,
        updatedAt: insertedProfile.updated_at,
      });
    }

    return NextResponse.json({
      full_name: profile.full_name,
      username: profile.username,
      bio: profile.bio ?? '',
      location: profile.location ?? '',
      imageUrl: profile.image_url ?? '',
      updatedAt: profile.updated_at ?? null,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
