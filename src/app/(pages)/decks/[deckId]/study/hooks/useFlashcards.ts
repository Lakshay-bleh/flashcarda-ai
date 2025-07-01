'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../../../../../../lib/supabase';

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

const PER_CARD_TIME = 30;

export function useFlashcards() {
  const { deckId } = useParams();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0); // Track max streak
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [perCardTimer, setPerCardTimer] = useState(PER_CARD_TIME);
  const [timerPaused, setTimerPaused] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cardTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    if (!deckId || typeof deckId !== 'string') {
      setCards([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deckId as string)
      .order('id', { ascending: false });

    if (data) {
      const shuffled = data.sort(() => 0.5 - Math.random());
      const mapped = shuffled.map(card => ({
        id: card.id,
        question: card.question ?? '',
        answer: card.answer ?? '',
      }));
      setCards(mapped);
      setStartTime(new Date());
      setIndex(0);
      setFlipped(false);
      setStreak(0);
      setMaxStreak(0);        // reset max streak on reload
      setKnownCards(new Set());
      setPerCardTimer(PER_CARD_TIME);
      setTimerPaused(false);
      setElapsedTime(0);      // reset elapsedTime on reload
    }
    setLoading(false);
  }, [deckId]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // Global timer
  useEffect(() => {
    if (!startTime) return;
    if (timerPaused) return;  // stop incrementing when paused

    intervalRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [startTime, timerPaused]);

  // Card timer
  useEffect(() => {
    if (timerPaused || index >= cards.length) {
      clearInterval(cardTimerRef.current!);
      return;
    }

    cardTimerRef.current = setInterval(() => {
      setPerCardTimer(t => {
        if (t <= 1) {
          setFlipped(true);
          return PER_CARD_TIME;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(cardTimerRef.current!);
  }, [index, timerPaused, cards.length]);

  const next = () => {
    setIndex(i => Math.min(i + 1, cards.length));
    setFlipped(false);
    setPerCardTimer(PER_CARD_TIME);
  };

  const prev = () => {
    setIndex(i => Math.max(i - 1, 0));
    setFlipped(false);
    setPerCardTimer(PER_CARD_TIME);
  };

  // Update maxStreak on streak changes
  useEffect(() => {
    if (streak > maxStreak) {
      setMaxStreak(streak);
    }
  }, [streak, maxStreak]);

  const markKnown = (known: boolean) => {
    const cardId = cards[index]?.id;
    setKnownCards(prev => {
      const nextSet = new Set(prev);
      if (known) {
        nextSet.add(cardId);
      } else {
        nextSet.delete(cardId);
      }
      return nextSet;
    });

    if (known) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
    next();
  };

  const resetTimer = () => {
    setStartTime(new Date());
    setElapsedTime(0);
    setPerCardTimer(PER_CARD_TIME);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (cardTimerRef.current) clearInterval(cardTimerRef.current);
    setTimerPaused(true);
  };

  return {
    cards,
    index,
    flipped,
    loading,
    elapsedTime,
    streak,
    maxStreak,
    knownCards,
    perCardTimer,
    timerPaused,
    setFlipped,
    setTimerPaused,
    next,
    prev,
    markKnown,
    fetchCards,
    resetTimer,
    stopTimer,
  };
}
