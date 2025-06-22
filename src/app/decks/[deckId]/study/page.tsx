'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../../../../../lib/supabase';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

// Config
const PER_CARD_TIME = 30; // seconds for countdown timer per card
const AUTO_FLIP_ON_TIMER_END = true;
const AUTO_NEXT_ON_TIMER_END = false;

type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

function playSound(type: 'flip' | 'known' | 'unknown') {
  // Simple beep sounds using Web Audio API
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  switch (type) {
    case 'flip':
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      break;
    case 'known':
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      break;
    case 'unknown':
      oscillator.frequency.value = 300;
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      break;
  }

  oscillator.type = 'sine';
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.1);
}

export default function StudyModePage() {
  const { deckId } = useParams();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [perCardTimer, setPerCardTimer] = useState(PER_CARD_TIME);
  const [timerPaused, setTimerPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const perCardIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch and shuffle cards
  const fetchCards = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deckId)
      .order('id', { ascending: false });

    if (!error && data) {
      const shuffled = data.sort(() => 0.5 - Math.random());
      setCards(shuffled);
      setStartTime(new Date());
      setElapsedTime(0);
      setIndex(0);
      setFlipped(false);
      setStreak(0);
      setKnownCards(new Set());
      setPerCardTimer(PER_CARD_TIME);
      setTimerPaused(false);
    }
    setLoading(false);
  }, [deckId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Global timer for elapsed time
  useEffect(() => {
    if (startTime && !loading) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startTime, loading]);

  // Per card countdown timer
  useEffect(() => {
    if (timerPaused || loading || index >= cards.length) {
      if (perCardIntervalRef.current) {
        clearInterval(perCardIntervalRef.current);
        perCardIntervalRef.current = null;
      }
      return;
    }

    perCardIntervalRef.current = setInterval(() => {
      setPerCardTimer((t) => {
        if (t <= 1) {
          // Timer ended
          if (AUTO_FLIP_ON_TIMER_END && !flipped) {
            setFlipped(true);
            playSound('flip');
          }
          if (AUTO_NEXT_ON_TIMER_END) {
            next();
          }
          return PER_CARD_TIME; // reset for next card
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (perCardIntervalRef.current) clearInterval(perCardIntervalRef.current);
    };
  }, [flipped, timerPaused, loading, index]);

  // Keyboard nav + actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return;
      if (index >= cards.length) return;

      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === ' ') setFlipped((f) => {
        playSound('flip');
        return !f;
      });
      else if (e.key.toLowerCase() === 'k') {
        markKnown(true);
      } else if (e.key.toLowerCase() === 'u') {
        markKnown(false);
      }
      else if (e.key.toLowerCase() === 'p') {
        setTimerPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, cards.length, flipped, timerPaused]);

  const next = () => {
    if (index < cards.length - 1) {
      setFlipped(false);
      setIndex((i) => i + 1);
      setStreak((prev) => prev + 1);
      setPerCardTimer(PER_CARD_TIME);
      setTimerPaused(false);
    } else {
      // End of deck: stop timer intervals
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (perCardIntervalRef.current) {
        clearInterval(perCardIntervalRef.current);
        perCardIntervalRef.current = null;
      }
      setIndex(cards.length); // mark finished
      setTimerPaused(true);
    }
  };

  const prev = () => {
    if (index > 0) {
      setFlipped(false);
      setIndex((i) => i - 1);
      setStreak(0);
      setPerCardTimer(PER_CARD_TIME);
      setTimerPaused(false);
    }
  };

  const markKnown = (known: boolean) => {
    if (index >= cards.length) return;
    const cardId = cards[index].id;
    setKnownCards((prev) => {
      const newSet = new Set(prev);
      if (known) {
        newSet.add(cardId);
        setStreak((prevStreak) => prevStreak + 1);
        playSound('known');
      } else {
        newSet.delete(cardId);
        setStreak(0);
        playSound('unknown');
      }
      return newSet;
    });
    next();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) return <p className="text-center mt-20">Loading flashcards...</p>;
  if (!cards.length)
    return <p className="text-center mt-20">No flashcards to study in this deck.</p>;

  const finished = index >= cards.length;
  const progress = Math.min(((index) / cards.length) * 100, 100);
  const currentCard = cards[index];

  return (
    <main
      className="max-w-3xl mx-auto py-12 px-4 text-center select-none"
      role="main"
      aria-live="polite"
    >
      <h1 className="text-3xl font-bold mb-6">🧠 Study Mode</h1>

      {/* Stats */}
      <div className="flex flex-wrap justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <p>
          Card {finished ? cards.length : index + 1} / {cards.length}
        </p>
        <p>⏱ Total Time: {formatTime(elapsedTime)}</p>
        <p>⏳ Card Timer: {perCardTimer}s {timerPaused && '⏸️'}</p>
        <p>🔥 Streak: {streak}</p>
        <p>✅ Known: {knownCards.size}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Finished screen */}
      {finished ? (
        <section
          className="mt-16"
          aria-label="Finished deck summary and actions"
        >
          <h2 className="text-2xl font-bold mb-6">🎉 You finished the deck!</h2>
          <p className="mb-4 text-lg">
            Total time: <strong>{formatTime(elapsedTime)}</strong>
          </p>
          <p className="mb-8 text-lg">
            Known cards: <strong>{knownCards.size}</strong> / {cards.length}
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={fetchCards}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              🔀 Shuffle & Restart
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* Flashcard */}
          <section
            className="perspective mb-6 relative h-[220px] cursor-pointer select-text"
            aria-label="Flashcard question and answer"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setFlipped((f) => {
                  playSound('flip');
                  return !f;
                });
              }
            }}
          >
            <motion.div
              className="relative w-full h-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border dark:border-gray-700"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => {
                playSound('flip');
                setFlipped((f) => !f);
              }}
              role="button"
              aria-pressed={flipped}
              tabIndex={-1}
            >
              {/* Front */}
              <div
                className="absolute inset-0 backface-hidden flex items-center justify-center text-lg text-gray-900 dark:text-gray-100 whitespace-pre-wrap"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <ReactMarkdown>{currentCard.question}</ReactMarkdown>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rotate-y-180 flex items-center justify-center text-lg text-gray-900 dark:text-gray-100 whitespace-pre-wrap"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <ReactMarkdown>{currentCard.answer}</ReactMarkdown>
              </div>
            </motion.div>
            <p className="mt-3 text-xs text-gray-500 select-none">
              Click card or press <kbd>Space</kbd> / <kbd>Enter</kbd> to flip
            </p>
          </section>

          {/* Action buttons */}
          <section
            className="flex justify-center gap-4 mb-8 flex-wrap"
            aria-label="Flashcard actions"
          >
            <button
              onClick={() => markKnown(true)}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Mark card as Known"
            >
              ✔️ Known (K)
            </button>
            <button
              onClick={() => markKnown(false)}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Mark card as Unknown"
            >
              ❌ Unknown (U)
            </button>
            <button
              onClick={() => setTimerPaused((p) => !p)}
              className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-pressed={timerPaused}
              aria-label={timerPaused ? 'Resume timer (P)' : 'Pause timer (P)'}
            >
              {timerPaused ? '▶️ Resume Timer (P)' : '⏸ Pause Timer (P)'}
            </button>
          </section>

          {/* Navigation */}
          <section
            className="flex justify-center gap-4 flex-wrap"
            aria-label="Card navigation"
          >
            <button
              onClick={prev}
              disabled={index === 0}
              className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-disabled={index === 0}
              aria-label="Previous card"
            >
              ◀ Previous
            </button>
            <button
              onClick={next}
              disabled={index === cards.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-disabled={index === cards.length - 1}
              aria-label="Next card"
            >
              Next ▶
            </button>
          </section>
        </>
      )}
    </main>
  );
}
