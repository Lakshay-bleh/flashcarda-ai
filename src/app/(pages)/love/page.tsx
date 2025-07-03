'use client';
import React, { useEffect } from 'react';
import './for-her.css';

export default function ForHerSecretPage() {
  useEffect(() => {
    // Optional: Add ambient background music
    const audio = new Audio('/music/mrignayani.mp3'); // if you have a local file
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Avoid autoplay block
    return () => audio.pause();
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 relative overflow-hidden flex flex-col items-center justify-center px-4 py-12">
      {/* Animated floating hearts or particles */}
      <div className="hearts-container pointer-events-none absolute inset-0 z-0" />

      {/* Content Container */}
      <div className="z-10 max-w-3xl w-full bg-white/70 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-pink-200 animate-fade-in-up space-y-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-pink-600 drop-shadow-md text-center animate-pulse-slow">
          For the One Who Changed Everything 💖
        </h2>

        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed text-left font-light tracking-wide animate-fade-in">
          We met in a classroom full of dreams, at Vidyamandir, when life was still drawing its outlines — and somehow, between pages of notebooks and shared glances, your presence began to mean more than I could have imagined.
          <br /><br />
          Since then, every moment with you has unfolded like a quiet miracle. We&apos;ve walked through laughter and quiet tears, through unexpected milestones and unplanned memories, collecting small pieces of forever with each step.
          <br /><br />
          Whether it was simple conversations or silent companionship, every second with you stitched itself into my heart like the soft hum of our favorite song — <em>Mrignayani</em> — a tune that now plays in the background of everything I do.
          <br /><br />
          You&apos;ve been my calm in chaos, my fire when I flicker, and the one who makes the ordinary feel magical.
          We&apos;ve grown together, changed, discovered pieces of ourselves we didn’t know existed — and through it all, your love has been the most grounding and beautiful part of my world.
          <br /><br />
          In your eyes, I’ve found home; in your soul, I’ve felt peace.
          Every moment shared, every word, every silence — it all adds up to a love I never want to live without.
        </p>

        <p className="text-2xl sm:text-3xl text-pink-600 font-semibold text-center mt-6 animate-heartbeat">
          I love you, Riya Lakshay Jain.
          <br />
          <span className="block mt-1 text-pink-500 italic text-lg">– Your lover...</span>
        </p>
      </div>
    </div>
  );
}
