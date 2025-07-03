'use client';
import { useEffect } from 'react';

export default function GlobalEffects() {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === '`') {
        alert("To the girl who lights up my world — this is all for you 💖");
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);
  return null;
}