// lib/validations/profile.ts
import { z } from 'zod';
import { supabase } from '../supabase';

export const profileSchema = z.object({
  userId: z.string(),
  bio: z.string().optional(),
  location: z.string().optional(),
  imageUrl: z.string().optional(),
  clerkId: z.string().optional(),
  username: z.string().optional(),
  full_name: z.string().optional(),
});


export type ProfileInput = z.infer<typeof profileSchema>;

export async function createProfileOnSignIn(userId: string, clerkId?: string) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        user_id: userId,
        bio: '',
        location: '',
        image_url: '',
        clerk_id: clerkId ?? '',  // Use clerkId if provided, else empty string
        updated_at: new Date().toISOString(),
        full_name: '',
        username: ''
      },
    ])
    .select();

  if (error) {
    console.error('Error creating profile:', error);
  }
  return data;
}
