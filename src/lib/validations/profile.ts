// lib/validations/profile.ts
import { z } from 'zod';
import { supabase } from '../supabase';

export const profileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  bio: z.string().max(1000, 'Bio must be under 1000 characters').optional(),
  location: z.string().max(100, 'Location must be under 100 characters').optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  clerkId: z.string().optional(), // <-- Add clerkId here
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
      },
    ])
    .select();

  if (error) {
    console.error('Error creating profile:', error);
  }
  return data;
}
