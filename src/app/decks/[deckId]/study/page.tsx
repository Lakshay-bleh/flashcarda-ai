'use client';
import { useFlashcards } from './hooks/useFlashcards';
import Flashcard from './components/Flashcard';
import Stats from './components/Stats';
import ProgressBar from './components/ProgressBar';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function calculateScore(
  maxStreak: number,
  elapsedTime: number,
  totalQuestions: number,
  maxTimeAllowed: number
): number {
  if (totalQuestions === 0) return 0;

  const streakScore = Math.min(maxStreak / totalQuestions, 1);

  const timeScore = Math.min(elapsedTime / maxTimeAllowed, 1);
  const invertedTimeScore = 1 - timeScore;

  const streakWeight = 0.7;
  const timeWeight = 0.3;

  const combinedScore = streakScore * streakWeight + invertedTimeScore * timeWeight;

  return Math.round(combinedScore * 100);
}

function FinalStatsCard({
  total,
  known,
  elapsed,
  maxStreak,
  onRestart,
}: {
  total: number;
  known: number;
  elapsed: number;
  maxStreak: number;
  onRestart: () => void;
}) {
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const score = calculateScore(maxStreak, elapsed, total, 300);

  return (
    <div className="mt-10 p-8 bg-white shadow-xl rounded-3xl border border-gray-300 text-left space-y-5 max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-5 text-teal-700">Deck Complete!</h2>
      <div className="space-y-3 text-lg text-gray-800">
        <p><strong>Total Cards:</strong> {total}</p>
        <p><strong>Known Cards:</strong> {known}</p>
        <p><strong>Time Taken:</strong> {minutes}:{seconds < 10 ? '0' : ''}{seconds}</p>
        <p><strong>Max Streak:</strong> {maxStreak}</p>
        <p><strong>Score (normalized):</strong> <span className="text-xl font-bold text-indigo-600">{score}</span></p>
      </div>
      <div className="pt-6 flex justify-center">
        <button
          onClick={onRestart}
          className="px-7 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
        >
          🔁 Shuffle & Restart
        </button>
      </div>
    </div>
  );
}

interface StudyModePageProps {
  params: {
    deckId: string;
  };
}

export default function StudyModePage({ params }: StudyModePageProps) {
  const {
    cards,
    index,
    flipped,
    loading,
    knownCards,
    maxStreak,
    elapsedTime,
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
  } = useFlashcards();

  const router = useRouter();
  const { deckId } = params;
  const finished = index >= cards.length;

  // Use useEffect to handle side effects
  useEffect(() => {
    if (finished && !timerPaused) {
      setTimerPaused(true);
      stopTimer();
    }
  }, [finished, timerPaused, setTimerPaused, stopTimer]);

  if (loading) return <p className="text-center mt-20 text-lg text-gray-600">Loading flashcards...</p>;
  if (!cards.length) return <p className="text-center mt-20 text-lg text-gray-600">No flashcards found.</p>;

  const current = cards[Math.min(index, cards.length - 1)];

  // Restart handler resets timer and fetches cards
  function handleRestart() {
    resetTimer();
    fetchCards();
  }

  function handleExit() {
    router.push(`/decks/${deckId}`);
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4 text-center">
    
      {/* Exit Study Mode button */}
      <div className="mb-6 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold mb-8 text-indigo-800 tracking-wide">
        Study Mode
      </h1>
        <button
          onClick={handleExit}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md font-semibold text-gray-700 transition"
          aria-label="Exit Study Mode"
        >
          ❌ Exit Study Mode
        </button>
      </div>

      <div className="mb-8">
        <Stats
          index={Math.min(index, cards.length)}
          total={cards.length}
          elapsedTime={elapsedTime}
          paused={timerPaused}
          perCardTimer={perCardTimer}
          streak={maxStreak}
          known={knownCards.size}
        />
        <ProgressBar progress={(Math.min(index, cards.length) / cards.length) * 100} />
      </div>

      {finished ? (
        <FinalStatsCard
          total={cards.length}
          known={knownCards.size}
          elapsed={elapsedTime}
          maxStreak={maxStreak}
          onRestart={handleRestart}
        />
      ) : (
        <>
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 mb-8 px-6 py-10 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-3xl shadow-lg border border-indigo-300">
            {/* Prev Button - Left side */}
            <button
              onClick={prev}
              disabled={index === 0}
              className={`px-5 py-3 rounded-md text-white font-semibold transition ${
                index === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              aria-label="Previous Card"
            >
              ← Prev
            </button>

            {/* Flashcard - Center */}
            <div className="flex-grow mx-6 max-w-2xl">
              <Flashcard
                question={current.question}
                answer={current.answer}
                flipped={flipped}
                onFlip={() => setFlipped((f) => !f)}
                className="p-6 bg-white rounded-xl shadow-md border border-indigo-300"
              />
            </div>

            {/* Next Button - Right side */}
            <button
              onClick={next}
              disabled={index >= cards.length - 1}
              className={`px-5 py-3 rounded-md text-white font-semibold transition ${
                index >= cards.length - 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              aria-label="Next Card"
            >
              Next →
            </button>
          </div>

          {/* Controls - Known, Unknown, Pause - inline rectangular buttons */}
          <div className="max-w-3xl mx-auto flex justify-center gap-4 mb-8 px-6">
            <button
              onClick={() => markKnown(true)}
              className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Known (K)
            </button>
            <button
              onClick={() => markKnown(false)}
              className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Unknown (U)
            </button>
            <button
              onClick={() => setTimerPaused((p) => !p)}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                timerPaused
                  ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              {timerPaused ? 'Resume (P)' : 'Pause (P)'}
            </button>
          </div>

          {/* Shuffle Deck */}
          <div className="max-w-3xl mx-auto flex justify-center">
            <button
              onClick={handleRestart}
              className="px-7 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              🔀 Shuffle Deck
            </button>
          </div>
        </>
      )}
    </main>
  );
}
