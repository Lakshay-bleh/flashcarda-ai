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
          You are the most beautiful, most special, best thing that ever happened to me. 
          <br /><br />
          My life is filled with flowers after meeting you. I feel comfort, love, care, peace with you...
          <br /><br />
          I am blessed to have you in my life. As my love, As my life partner for whom I can do everything.
          <br /><br />
          This is a very small thing to just show how much you matter to me.
          <br /><br />
          I build this site with your constant support and love. This is dedicated to you my love.
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
