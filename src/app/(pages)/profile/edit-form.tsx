'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

type Props = {
  userId: string;
};

type ProfileData = {
  name: string;
  bio: string;
  location: string;
  imageUrl?: string;
};

export default function EditProfileForm({ userId }: Props) {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    bio: '',
    location: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile?userId=${userId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProfile({
          name: data.name || '',
          bio: data.bio || '',
          location: data.location || '',
          imageUrl: data.image_url ?? '',
        });
      } catch {
        toast.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const toastId = toast.loading('Uploading image...');

    try {
      const res = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const { url } = await res.json();
      setProfile((prev) => ({ ...prev, imageUrl: url }));

      toast.dismiss(toastId);
      toast.success('Image uploaded!');
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('Upload failed');
      console.error('Image upload error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const toastId = toast.loading('Saving profile...');

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: profile.name,
          bio: profile.bio,
          location: profile.location,
          imageUrl: profile.imageUrl,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');

      toast.dismiss(toastId);
      toast.success('Profile updated!');
    } catch {
      toast.dismiss(toastId);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-indigo-200 font-semibold animate-pulse">
        Loading profile...
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-white/20 shadow-lg space-y-8"
    >
      <h2 className="text-4xl font-extrabold text-white text-center mb-4 drop-shadow-md">
        Edit Profile
      </h2>

      <div>
        <label htmlFor="name" className="block mb-2 text-indigo-100 font-semibold">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={profile.name}
          onChange={handleChange}
          placeholder="Your full name"
          className="w-full rounded-xl bg-white/20 text-white placeholder-indigo-200 p-3 border border-white/20 focus:outline-none focus:ring-4 focus:ring-pink-300"
        />
      </div>

      <div>
        <label className="block mb-3 text-indigo-100 font-semibold">
          Profile Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:bg-pink-500 file:text-white file:px-5 file:py-2 file:rounded-lg file:font-semibold cursor-pointer hover:file:brightness-110 transition"
        />
        {profile.imageUrl && (
          <img
            src={profile.imageUrl}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full mt-4 border-2 border-pink-300 object-cover shadow ring-1 ring-white/20"
            draggable={false}
          />
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block mb-2 text-indigo-100 font-semibold">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us about yourself"
          className="w-full rounded-xl bg-white/20 text-white placeholder-indigo-200 p-4 border border-white/20 focus:outline-none focus:ring-4 focus:ring-pink-300 resize-none"
        />
      </div>

      <div>
        <label htmlFor="location" className="block mb-2 text-indigo-100 font-semibold">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          value={profile.location}
          onChange={handleChange}
          placeholder="Where are you from?"
          className="w-full rounded-xl bg-white/20 text-white placeholder-indigo-200 p-3 border border-white/20 focus:outline-none focus:ring-4 focus:ring-pink-300"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:brightness-110 disabled:opacity-50 text-white py-4 rounded-xl font-bold shadow transition active:scale-95"
      >
        {saving ? (
          <div className="flex justify-center items-center gap-2">
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
              ></path>
            </svg>
            Saving...
          </div>
        ) : (
          'Save Changes'
        )}
      </button>
    </form>
  );
}
