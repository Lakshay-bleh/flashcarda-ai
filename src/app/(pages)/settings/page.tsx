'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import Sidebar from '../../../../components/Sidebar';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type UserSettings = {
  language: string;
  detail_level: 'Simple' | 'Medium' | 'In-depth';
  include_examples: boolean;
  study_goal: number;
  spaced_repetition: boolean;
  auto_shuffle: boolean;
  show_hints: boolean;
  theme: 'System' | 'Light' | 'Dark';
  session_timeout: '15min' | '30min' | '1hour' | 'Never';
};

const DEFAULT_SETTINGS: UserSettings = {
  language: 'English',
  detail_level: 'Medium',
  include_examples: true,
  study_goal: 25,
  spaced_repetition: false,
  auto_shuffle: true,
  show_hints: false,
  theme: 'System',
  session_timeout: '30min',
};

export default function SettingsPage() {
  const { user, isSignedIn } = useUser();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [appUserId, setAppUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch(`/api/sync-user?clerkUserId=${user?.id}`)
      .then(res => res.json())
      .then(data => {
        setAppUserId(data.user.id);
      })
      .catch(() => {
        toast.error('Failed to sync user.');
      });
  }, [user, isSignedIn]);

  useEffect(() => {
    if (!appUserId) return;

    async function fetchSettings() {
      setFetching(true);
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', appUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          await createSettingsIfNotExist();
        } else {
          toast.error('Failed to load settings.');
        }
      } else {
        setSettings(data);
      }
      setFetching(false);
    }

    async function createSettingsIfNotExist() {
      const { error } = await supabase
        .from('user_settings')
        .insert([{ ...DEFAULT_SETTINGS, user_id: appUserId }]);

      if (error) {
        toast.error('Failed to create settings.');
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    }

    fetchSettings();
  }, [appUserId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings(prev => ({ ...prev, [name]: newValue }));
  };

  // const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSettings(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appUserId) return;

    setLoading(true);
    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: appUserId,
          ...settings,
        },
        {
          onConflict: 'user_id',
        }
      );
    if (error) {
      toast.error('Failed to save settings.');
    } else {
      toast.success('Settings saved!');
    }
    setLoading(false);
  };

  // ----------------- LOADING UI -----------------
  if (fetching) {
    return (
      <div className="min-h-screen flex bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans">
        <Sidebar />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
        </main>
      </div>
    );
  }

  // ----------------- SETTINGS PAGE -----------------
  return (
    <div className="min-h-screen flex bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans transition-colors">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-grow flex flex-col py-12 px-8 sm:px-12 lg:px-16 overflow-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-white/20 pb-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-md">
              Update your study preferences
            </h2>
          </div>
        </header>

        {/* Settings Form */}
        {fetching ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 mb-12 space-y-6 transition-all hover:scale-[1.01]"
          >
            <h2 className="text-3xl font-semibold text-white drop-shadow">
              User Settings
            </h2>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-indigo-100 mb-1">Preferred Language</label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/20 text-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option className="bg-white text-black">English</option>
                <option className="bg-white text-black">Spanish</option>
                <option className="bg-white text-black">French</option>
                <option className="bg-white text-black">German</option>
                <option className="bg-white text-black">Chinese</option>
                <option className="bg-white text-black">Japanese</option>
              </select>
            </div>

            {/* Detail Level */}
            <div>
              <label className="block text-sm font-medium text-indigo-100 mb-1">Card Detail Level</label>
              <select
                name="detail_level"
                value={settings.detail_level}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/20 text-black border border-white/20"
              >
                <option className="bg-white text-black" value="Simple">Simple</option>
                <option className="bg-white text-black" value="Medium">Medium</option>
                <option className="bg-white text-black" value="In-depth">In-depth</option>
              </select>
            </div>

            {/* Include Examples
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="include_examples"
                name="include_examples"
                checked={settings.include_examples}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label htmlFor="include_examples" className="text-indigo-100 font-medium">
                Include real-world examples in flashcards
              </label>
            </div> */}

            {/* Study Goal
            <div>
              <label className="block text-sm font-medium text-indigo-100 mb-1">Daily Study Goal (cards)</label>
              <input
                type="number"
                name="study_goal"
                value={settings.study_goal}
                onChange={handleNumberChange}
                min={1}
                max={100}
                className="w-full p-3 rounded-lg border border-white/20 bg-white/20 text-white placeholder-indigo-200"
              />
            </div> */}

            {/* Spaced Repetition */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="spaced_repetition"
                name="spaced_repetition"
                checked={settings.spaced_repetition}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label htmlFor="spaced_repetition" className="text-indigo-100 font-medium">
                Enable spaced repetition scheduling
              </label>
            </div>

            {/* Auto Shuffle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="auto_shuffle"
                name="auto_shuffle"
                checked={settings.auto_shuffle}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label htmlFor="auto_shuffle" className="text-indigo-100 font-medium">
                Automatically shuffle cards during study
              </label>
            </div>

            {/* Show Hints */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="show_hints"
                name="show_hints"
                checked={settings.show_hints}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <label htmlFor="show_hints" className="text-indigo-100 font-medium">
                Show hints on flashcards by default
              </label>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-indigo-100 mb-1">Preferred Theme</label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/20 text-black border border-white/20"
              >
                <option className="bg-white text-black" value="System">System</option>
                <option className="bg-white text-black" value="Light">Light</option>
                <option className="bg-white text-black" value="Dark">Dark</option>
              </select>
            </div>

            {/* Session Timeout */}
            <div>
              <label className="block text-sm font-medium text-indigo-100 mb-1">Session Timeout</label>
              <select
                name="session_timeout"
                value={settings.session_timeout}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/20 text-black border border-white/20"
              >
                <option className="bg-white text-black" value="15min">15 minutes</option>
                <option className="bg-white text-black" value="30min">30 minutes</option>
                <option className="bg-white text-black" value="1hour">1 hour</option>
                <option className="bg-white text-black" value="Never">Never</option>
              </select>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg font-medium transition shadow-md hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}