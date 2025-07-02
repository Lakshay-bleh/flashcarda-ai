'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'; // or 'next/router' if using pages router

type Props = {
  userId: string;
};

type ProfileData = {
  full_name: string;
  username: string;
  bio: string;
  location: string;
  imageUrl?: string;
};

export default function EditProfileForm({ userId }: Props) {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Validation errors
  const [formErrors, setFormErrors] = useState<{
    full_name: string | null;
    username: string | null;
    location: string | null;
  }>({
    full_name: null,
    username: null,
    location: null,
  });

  // Additional username uniqueness error
  const [usernameError, setUsernameError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile?userId=${userId}`);
        if (!res.ok) throw new Error();

        const data = await res.json();

        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
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
    setFormErrors((prev) => ({ ...prev, [e.target.name]: null }));
    if (e.target.name === 'username') setUsernameError(null);
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

  // Validate required fields
  const validateFields = () => {
    const errors: typeof formErrors = {
      full_name: null,
      username: null,
      location: null,
    };

    if (!profile.full_name.trim()) errors.full_name = 'Full name is required.';
    if (!profile.username.trim()) errors.username = 'Username is required.';
    if (!profile.location.trim()) errors.location = 'Location is required.';

    setFormErrors(errors);

    return !Object.values(errors).some((e) => e !== null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setUsernameError(null);

    if (!validateFields()) return;

    setSaving(true);

    const toastId = toast.loading('Validating username...');

    const isUnique = await fetch(
      `/api/check-username?username=${encodeURIComponent(profile.username)}&userId=${userId}`
    )
      .then((res) => res.json())
      .then((data) => data.isUnique);

    if (!isUnique) {
      setUsernameError('This username is already taken.');
      toast.dismiss(toastId);
      setSaving(false);
      return;
    }

    toast.dismiss(toastId);

    const saveToastId = toast.loading('Saving profile...');

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          full_name: profile.full_name.trim(),
          username: profile.username.trim(),
          bio: profile.bio,
          location: profile.location.trim(),
          imageUrl: profile.imageUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to save');

      toast.dismiss(saveToastId);
      toast.success('Profile updated!');

      router.push('/home'); // Redirect on success
    } catch {
      toast.dismiss(saveToastId);
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
      className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 shadow-lg space-y-10"
      noValidate
    >
      <h2 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-md">
        Edit Profile
      </h2>

      {/* Full Name */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <label htmlFor="name" className="sm:w-36 text-indigo-100 font-semibold mb-2 sm:mb-0">
          Full Name <span className="text-red-400">*</span>
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          value={profile.full_name ?? ''}
          onChange={handleChange}
          placeholder="Your full name"
          className={`flex-1 rounded-xl bg-white/20 text-white placeholder-indigo-200 p-3 border transition ${
            formErrors.full_name ? 'border-red-400' : 'border-white/20'
          } focus:outline-none focus:ring-4 focus:ring-pink-300`}
          required
        />
      </div>
      {formErrors.full_name && (
        <p className="sm:ml-36 mt-1 text-sm text-red-400">{formErrors.full_name}</p>
      )}

      {/* Username */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <label htmlFor="username" className="sm:w-36 text-indigo-100 font-semibold mb-2 sm:mb-0">
          Username <span className="text-red-400">*</span>
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={profile.username ?? ''}
          onChange={handleChange}
          placeholder="Choose a unique username"
          className={`flex-1 rounded-xl bg-white/20 text-white placeholder-indigo-200 p-3 border transition ${
            formErrors.username || usernameError ? 'border-red-400' : 'border-white/20'
          } focus:outline-none focus:ring-4 focus:ring-pink-300`}
          required
          autoComplete="off"
        />
      </div>
      {(formErrors.username || usernameError) && (
        <p className="sm:ml-36 mt-1 text-sm text-red-400">{formErrors.username || usernameError}</p>
      )}

      {/* Profile Image */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <span className="sm:w-36 block text-indigo-100 font-semibold mb-2 sm:mb-0">Profile Image</span>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:bg-pink-500 file:text-white file:px-5 file:py-2 file:rounded-lg file:font-semibold cursor-pointer hover:file:brightness-110 transition"
          />
          {profile.imageUrl && (
            <div className="mt-4">
              <Image
                src={profile.imageUrl}
                alt="Profile Preview"
                width={96}
                height={96}
                className="w-24 h-24 rounded-full border-2 border-pink-300 object-cover shadow ring-1 ring-white/20"
                draggable={false}
                unoptimized
              />
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
        <label htmlFor="bio" className="sm:w-36 text-indigo-100 font-semibold mb-2 sm:mb-0">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={profile.bio ?? ''}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us about yourself"
          className="flex-1 rounded-xl bg-white/20 text-white placeholder-indigo-200 p-4 border border-white/20 focus:outline-none focus:ring-4 focus:ring-pink-300 resize-none"
        />
      </div>

      {/* Location */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
        <label htmlFor="location" className="sm:w-36 text-indigo-100 font-semibold mb-2 sm:mb-0">
          Location <span className="text-red-400">*</span>
        </label>
        <input
          id="location"
          name="location"
          type="text"
          value={profile.location ?? ''}
          onChange={handleChange}
          placeholder="Where are you from?"
          className={`flex-1 rounded-xl bg-white/20 text-white placeholder-indigo-200 p-3 border transition ${
            formErrors.location ? 'border-red-400' : 'border-white/20'
          } focus:outline-none focus:ring-4 focus:ring-pink-300`}
          required
        />
      </div>
      {formErrors.location && (
        <p className="sm:ml-36 mt-1 text-sm text-red-400">{formErrors.location}</p>
      )}

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
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
              />
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
