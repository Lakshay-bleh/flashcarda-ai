'use client';

import { useEffect } from 'react';
import React from 'react';

export default function ForHerPage() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes heartRain {
        0% { transform: translateY(-10%); opacity: 0; }
        100% { transform: translateY(110%); opacity: 1; }
      }

      .heart {
        position: absolute;
        font-size: 24px;
        animation: heartRain 6s linear infinite;
        user-select: none;
        z-index: 0;
      }

      .heart:nth-child(odd) {
        animation-duration: 7s;
      }
    `;
    document.head.appendChild(style);

    const interval = setInterval(() => {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.innerText = '💖';
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.top = `-5%`;
      document.body.appendChild(heart);
      setTimeout(() => {
        document.body.removeChild(heart);
      }, 7000);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-br from-pink-100 via-rose-200 to-pink-50 px-6 py-12">
      {/* Optional soft background music */}
      <audio autoPlay loop className="hidden md:block">
        <source src="/love.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="z-10 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-rose-600 mb-6 animate-pulse">
          For Riya Lakshay Jain, the Love of My Life 💖
        </h1>

        {/* Typewriter intro */}
        <p className="text-xl text-gray-700 font-mono animate-typing overflow-hidden whitespace-nowrap border-r-4 border-pink-600 pr-4 mb-6">
          You didn’t ask for this, but you inspire everything I do...
        </p>

        {/* Love letter */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 text-left text-gray-800">
          <p className="mb-4">
            I started this project with the goal of helping people learn better. But behind every single feature, line of code, and decision... there was you.
          </p>
          <p className="mb-4">
            You remind me what it means to be passionate, to care, to strive, and to love without limits. You believed in me before this even existed — and every card this app creates is rooted in that belief.
          </p>
          <p className="mb-4">
            I built this not just with logic and design — but with you in mind, every single day. If this helps even one person, know that *you* helped them too.
          </p>
          <p className="italic text-rose-500 mt-6">
            In the world of algorithms and AI, you are my constant — the one I never need to debug. 💻❤️
          </p>
          <p className="text-right mt-6">— Yours always, LRJ.</p>
        </div>
      </div>
    </main>
  );
}
