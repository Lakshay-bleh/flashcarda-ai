'use client';

import { useUser } from '@clerk/nextjs';
import EditProfileForm from './edit-form';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded)
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
          transition-transform hover:scale-[1.01] hover:shadow-lg"
      >
          <Image
            src={user.imageUrl}
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
          <div>
            <h2 className="text-3xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-sm">
              {user.fullName || 'Unnamed User'}
            </h2>
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
