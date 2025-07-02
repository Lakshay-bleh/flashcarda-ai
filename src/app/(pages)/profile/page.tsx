'use client';

import { useUser } from '@clerk/nextjs';
import EditProfileForm from './edit-form';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

type ProfileData = {
  full_name: string;
  username: string;
  bio: string;
  location: string;
  imageUrl?: string;
};

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      setLoadingProfile(true);
      try {
        if (!user) throw new Error('User not loaded');
        const res = await fetch(`/api/profile?userId=${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        console.log(data)

        setProfile({
          full_name: data.name || user.fullName || 'Unnamed User',
          username: data.username || user.username || 'no-username',
          bio: data.bio || '',
          location: data.location || '',
          imageUrl: data.image_url ?? user.imageUrl ?? '',
        });
      } catch (error) {
         if (!user) throw new Error('User not loaded');
         console.log(error)
        toast.error('Failed to load profile info');
        setProfile({
          full_name: user.fullName || 'Unnamed User',
          username: user.username || 'no-username',
          bio: '',
          location: '',
          imageUrl: user.imageUrl ?? '',
        });
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, [user]);

  if (!isLoaded || loadingProfile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-700 via-indigo-700 to-pink-700">
        <LoadingSpinner />
      </div>
    );

  if (!user)
    return (
      <div
        className="min-h-screen flex items-center justify-center
          bg-gradient-to-tr from-purple-700 via-indigo-700 to-pink-700
          text-pink-300 font-semibold text-xl"
      >
        User not found.
      </div>
    );

  return (
    <div
      className="min-h-screen px-6 py-12
        bg-gradient-to-tr from-purple-700 via-indigo-700 to-pink-700
        text-pink-200"
    >
      <div
        className="max-w-3xl mx-auto
          bg-gradient-to-br from-indigo-700 via-purple-800 to-pink-800
          rounded-2xl p-10
          border border-pink-400/40
          backdrop-blur-sm
          transition-transform hover:scale-[1.01] hover:shadow-lg
          flex flex-col items-center space-y-4"
      >
        <Image
          src={profile?.imageUrl || user.imageUrl || ''}
          alt="Profile"
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover
            ring-2 ring-pink-400 ring-opacity-40
            shadow-md
            transition-transform hover:scale-105"
          draggable={false}
          priority
        />
        <div className="text-center">
          <h2 className="text-3xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-sm">
            {profile?.full_name}
          </h2>
          <p className="text-pink-300 font-medium tracking-wide mb-1">
            @{profile?.username}
          </p>
          <p className="text-pink-300 font-medium tracking-wide">
            {user.primaryEmailAddress?.emailAddress || 'No email'}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <EditProfileForm userId={user.id} />
      </div>
    </div>
  );
}
