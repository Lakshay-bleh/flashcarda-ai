'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../../lib/supabase';
import { toast } from 'sonner';

export default function EditDeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params?.deckId;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!deckId) return;
    const fetchDeck = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('decks')
        .select('*')
        .eq('id', deckId)
        .single();

      if (error || !data) {
        toast.error('Failed to load deck');
        setLoading(false);
        return;
      }

      setName(data.name);
      setDescription(data.description || '');
      setLoading(false);
    };
    fetchDeck();
  }, [deckId]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from('decks')
      .update({ name, description })
      .eq('id', deckId);

    if (error) {
      toast.error('Failed to save deck');
    } else {
      toast.success('Deck updated');
      router.push(`/decks/${deckId}`);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Edit Deck</h1>

      <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div>
          <label className="block font-semibold mb-2" htmlFor="name">
            Deck Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            disabled={saving}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2" htmlFor="description">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            maxLength={500}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 border rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            disabled={saving}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
    </main>
  );
}
