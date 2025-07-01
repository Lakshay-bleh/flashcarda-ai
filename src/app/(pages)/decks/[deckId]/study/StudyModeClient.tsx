'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useFlashcards } from './hooks/useFlashcards';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  Container,
  Stack,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Sidebar from '../../../../../../components/Sidebar';  // Import Sidebar component

// Score calculation unchanged
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
    <Paper
      elevation={6}
      sx={{
        mt: 8,
        p: 6,
        maxWidth: 480,
        mx: 'auto',
        borderRadius: 4,
        border: '2px solid #a855f7', // purple border
        backgroundColor: 'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="pink.600" gutterBottom>
        Deck Complete!
      </Typography>
      <Stack spacing={2} color="text.primary" mb={4}>
        <Typography variant="body1"><strong>Total Cards:</strong> {total}</Typography>
        <Typography variant="body1"><strong>Known Cards:</strong> {known}</Typography>
        <Typography variant="body1"><strong>Time Taken:</strong> {minutes}:{seconds < 10 ? '0' : ''}{seconds}</Typography>
        <Typography variant="body1"><strong>Max Streak:</strong> {maxStreak}</Typography>
        <Typography variant="h6" fontWeight="bold" color="indigo.700">
          Score: {score}
        </Typography>
      </Stack>
      <Button
        variant="contained"
        color="secondary"
        size="large"
        onClick={onRestart}
        startIcon={<RestartAltIcon />}
        sx={{
          backgroundColor: '#db2777', // pink-600
          '&:hover': { backgroundColor: '#be185d' }, // pink-700
          fontWeight: 'bold',
          px: 5,
          py: 1.5,
          borderRadius: 3,
        }}
      >
        Shuffle & Restart
      </Button>
    </Paper>
  );
}

interface StudyModePageProps {
  deckId: string;
}

export default function StudyModePage({ deckId }: StudyModePageProps) {
  const {
    cards,
    index,
    flipped,
    loading,
    knownCards,
    maxStreak,
    elapsedTime,
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
  const finished = index >= cards.length;

  const [cardTimer, setCardTimer] = useState(30);
  const cardTimerRef = useRef<number | null>(null);

  // Per-card timer effect
  useEffect(() => {
    if (finished || timerPaused) {
      if (cardTimerRef.current) clearInterval(cardTimerRef.current);
      setCardTimer(30);
      return;
    }

    setCardTimer(30);
    if (cardTimerRef.current) clearInterval(cardTimerRef.current);

    cardTimerRef.current = window.setInterval(() => {
      setCardTimer((t) => {
        if (t === 1) {
          if (flipped) {
            next();
            setFlipped(false);
          } else {
            setFlipped(true);
          }
          return 30;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (cardTimerRef.current) clearInterval(cardTimerRef.current);
    };
  }, [index, timerPaused, flipped, next, setFlipped, finished]);

  // Stop overall timer when finished
  useEffect(() => {
    if (finished && !timerPaused) {
      setTimerPaused(true);
      stopTimer();
    }
  }, [finished, timerPaused, setTimerPaused, stopTimer]);

  // Keyboard shortcuts (K/U/P)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (finished) return;
      const key = e.key.toLowerCase();
      if (key === 'k') {
        markKnown(true);
        setFlipped(false);
        setCardTimer(30);
      } else if (key === 'u') {
        markKnown(false);
        setFlipped(false);
        setCardTimer(30);
      } else if (key === 'p') {
        setTimerPaused((p) => !p);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [finished, markKnown, setTimerPaused, setFlipped]);

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: 'linear-gradient(135deg, #4f46e5, #8b5cf6, #db2777)',
          color: 'white',
          fontWeight: '600',
          fontSize: 24,
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        Loading flashcards...
      </Box>
    );
  }

  if (!cards.length) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: 'linear-gradient(135deg, #4f46e5, #8b5cf6, #db2777)',
          color: 'white',
          fontWeight: '600',
          fontSize: 24,
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        No flashcards found.
      </Box>
    );
  }

  const current = cards[Math.min(index, cards.length - 1)];

  const handleRestart = () => {
    resetTimer();
    fetchCards();
    setFlipped(false);
    setTimerPaused(false);
  };

  const handleExit = () => {
    router.push(`/decks/${deckId}`);
  };

  // Fix flip animation classes and styles for correct front/back card display
  // Using inline styles for backface-visibility & transform

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          py: 12,
          px: 4,
          background: 'linear-gradient(135deg, #4f46e5, #8b5cf6, #db2777)',
          fontFamily: "'Roboto', sans-serif",
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Header */}
        <Container maxWidth="md" sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" fontWeight="bold" color="white">
            Study Mode
          </Typography>
          <Tooltip title="Exit Study Mode">
            <IconButton onClick={handleExit} size="large" sx={{ color: 'white' }}>
              <ExitToAppIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Container>

        {/* Progress Bar */}
        <Container maxWidth="md" sx={{ width: '100%', mb: 4 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min((index / cards.length) * 100, 100)}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#db2777',
              },
            }}
          />
        </Container>

        {/* Stats */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 6 }}
          color="rgba(255,255,255,0.9)"
          mb={6}
          fontWeight="600"
          fontSize="1.1rem"
        >
          <Box>
            <Typography>Progress</Typography>
            <Typography fontWeight="bold" fontSize="1.5rem" color="#f9a8d4">
              {Math.min(index, cards.length)} / {cards.length}
            </Typography>
          </Box>
          <Box>
            <Typography>Known</Typography>
            <Typography fontWeight="bold" fontSize="1.5rem" color="#f9a8d4">
              {knownCards.size}
            </Typography>
          </Box>
          <Box>
            <Typography>Max Streak</Typography>
            <Typography fontWeight="bold" fontSize="1.5rem" color="#f9a8d4">
              {maxStreak}
            </Typography>
          </Box>
          <Box>
            <Typography>Elapsed</Typography>
            <Typography fontWeight="bold" fontSize="1.5rem" color="#f9a8d4">
              {Math.floor(elapsedTime / 60)}:{elapsedTime % 60 < 10 ? '0' : ''}{elapsedTime % 60}
            </Typography>
          </Box>
          <Box>
            <Typography>Timer</Typography>
            <Typography
              fontWeight="bold"
              fontSize="1.5rem"
              sx={{
                color: cardTimer <= 5 ? '#f9a8d4' : '#c4b5fd',
                animation: cardTimer <= 5 ? 'pulse 1s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                },
              }}
            >
              {cardTimer}s
            </Typography>
          </Box>
        </Stack>

        {/* Flashcard */}
        {!finished && (
          <Box
            sx={{
              perspective: 1000,
              width: '100%',
              maxWidth: 520,
              height: 320,
              mb: 6,
              cursor: 'pointer',
            }}
            onClick={() => setFlipped((f) => !f)}
            aria-label="Flip flashcard"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFlipped((f) => !f); }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: 4,
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                transition: 'transform 0.7s',
                transformStyle: 'preserve-3d',
                transform: flipped ? 'rotateY(180deg)' : 'none',
                backgroundColor: 'white',
              }}
            >
              {/* Front */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                  backfaceVisibility: 'hidden',
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  userSelect: 'none',
                  boxSizing: 'border-box',
                }}
              >
                {current.question}
              </Box>

              {/* Back */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: '#fce7f3',
                  color: '#be185d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                  backfaceVisibility: 'hidden',
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  transform: 'rotateY(180deg)',
                  userSelect: 'none',
                  boxSizing: 'border-box',
                }}
              >
                {current.answer}
              </Box>
            </Box>
          </Box>
        )}

        {finished && (
          <FinalStatsCard
            total={cards.length}
            known={knownCards.size}
            elapsed={elapsedTime}
            maxStreak={maxStreak}
            onRestart={handleRestart}
          />
        )}

        {/* Controls */}
        {!finished && (
          <Stack spacing={3} maxWidth={520} width="100%" mb={4}>
            {/* Navigation Buttons */}
            <Stack direction="row" spacing={3} justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={prev}
                disabled={index === 0}
                sx={{ flex: 1, py: 2, fontWeight: '700', fontSize: '1.1rem', borderRadius: 3 }}
              >
                ← Prev
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={next}
                disabled={index >= cards.length - 1}
                sx={{ flex: 1, py: 2, fontWeight: '700', fontSize: '1.1rem', borderRadius: 3 }}
              >
                Next →
              </Button>
            </Stack>

            {/* Known / Unknown Buttons */}
            <Stack direction="row" spacing={3} justifyContent="space-between">
              <Button
                variant="contained"
                sx={{
                  flex: 1,
                  py: 2,
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  backgroundColor: '#db2777',
                  '&:hover': { backgroundColor: '#be185d' },
                }}
                onClick={() => {
                  markKnown(true);
                  setFlipped(false);
                  setCardTimer(30);
                }}
              >
                Known (K)
              </Button>
              <Button
                variant="contained"
                sx={{
                  flex: 1,
                  py: 2,
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  backgroundColor: '#db2777',
                  '&:hover': { backgroundColor: '#be185d' },
                }}
                onClick={() => {
                  markKnown(false);
                  setFlipped(false);
                  setCardTimer(30);
                }}
              >
                Unknown (U)
              </Button>
            </Stack>

            {/* Shortcuts info */}
            <Typography
              color="rgba(255, 255, 255, 0.8)"
              fontSize="0.9rem"
              textAlign="center"
              fontWeight={500}
            >
              Shortcuts: <kbd style={{ padding: '4px 8px', backgroundColor: 'rgba(55, 48, 163, 0.8)', borderRadius: 4, color: 'white', fontWeight: 'bold' }}>K</kbd> = Known,{' '}
              <kbd style={{ padding: '4px 8px', backgroundColor: 'rgba(55, 48, 163, 0.8)', borderRadius: 4, color: 'white', fontWeight: 'bold' }}>U</kbd> = Unknown,{' '}
              <kbd style={{ padding: '4px 8px', backgroundColor: 'rgba(55, 48, 163, 0.8)', borderRadius: 4, color: 'white', fontWeight: 'bold' }}>P</kbd> = Pause
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
