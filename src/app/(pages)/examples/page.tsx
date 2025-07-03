'use client';

import { useState } from 'react';
import { Box, Typography, Paper, Divider, Stack, Button } from '@mui/material';
import FlashcardGenerator from '../../../../components/FlashcardGenerator'; // Adjust path

export default function FlashcardDemo() {
  // Example 1: Basic flip flashcard
  const [flipped, setFlipped] = useState(false);

  // Example 2: Multiple flashcards side by side
  const initialCards = [
    { id: 1, question: 'Capital of France?', answer: 'Paris' },
    { id: 2, question: '2 + 2 = ?', answer: '4' },
    { id: 3, question: 'Color of sky?', answer: 'Blue' },
  ];
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});

  const toggleCard = (id: number) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Example 3: Flashcard with progress counter
  const [progressIndex, setProgressIndex] = useState(0);
  const progressFlashcards = [
    { question: 'What is React?', answer: 'A JS library for UI' },
    { question: 'UseState hook does?', answer: 'Manage state in components' },
    { question: 'Next question?', answer: 'This is the last flashcard!' },
  ];
  const [progressFlipped, setProgressFlipped] = useState(false);

  const toggleProgressCard = () => {
    setProgressFlipped((prev) => !prev);
  };

  const nextProgressCard = () => {
    if (progressIndex < progressFlashcards.length - 1) {
      setProgressIndex((i) => i + 1);
      setProgressFlipped(false);
    }
  };

  const prevProgressCard = () => {
    if (progressIndex > 0) {
      setProgressIndex((i) => i - 1);
      setProgressFlipped(false);
    }
  };

  // Example 4: Accessibility demo (keyboard only flipping)
  const [accessFlipped, setAccessFlipped] = useState(false);
  const handleAccessKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setAccessFlipped((prev) => !prev);
    }
  };

  return (
    <Box
      className="min-h-screen flex bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans"
      sx={{
        px: { xs: 6, sm: 10, md: 14 },
        py: { xs: 6, sm: 8, md: 10 },
        overflowY: 'auto',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        maxWidth: '100vw',
        minHeight: '100vh',
      }}
    >
      {/* Title */}
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
        Study Mode Flashcard Demo
      </Typography>

    <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.3)', width: '100%' }} />

      {/* === Example 1: Basic Flip Flashcard === */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center', maxWidth: 600 }}>
        Basic Flip Flashcard
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 3, maxWidth: 600, textAlign: 'center', color: 'rgba(255 255 255 / 0.85)' }}
      >
        Click or press Enter/Space on the flashcard to flip between question and answer.
      </Typography>
      <Box
        tabIndex={0}
        role="button"
        aria-label="Flip flashcard"
        onClick={() => setFlipped(!flipped)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setFlipped((prev) => !prev);
          }
        }}
        sx={{
          width: { xs: 380, sm: 450, md: 520 },
          height: { xs: 260, sm: 300, md: 350 },
          perspective: 1200,
          cursor: 'pointer',
          outline: 'none',
          userSelect: 'none',
          mb: 3,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 4,
            bgcolor: 'background.paper',
            color: flipped ? 'black' : 'pink.700',
            backgroundColor: flipped ? 'pink.100' : 'pink.600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: { xs: 26, sm: 28, md: 32 },
            fontWeight: 700,
            textAlign: 'center',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s',
            transform: flipped ? 'rotateY(180deg)' : 'none',
            boxShadow: flipped
              ? '0 14px 28px rgba(219, 39, 119, 0.7)'
              : '0 14px 28px rgba(219, 39, 119, 0.3)',
            userSelect: 'none',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              px: 4,
              color: 'inherit',
            }}
          >
            {!flipped && 'What is the capital of France?'}
          </Box>

          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              px: 4,
              color: 'inherit',
              transform: 'rotateY(180deg)',
            }}
          >
            {flipped && 'Paris'}
          </Box>
        </Paper>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            textAlign: 'center',
            color: 'rgba(255 255 255 / 0.85)',
            userSelect: 'none',
          }}
        >
          Click or press Enter/Space to flip
        </Typography>

      {/* === Divider === */}
      </Box>
      <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.3)', my: 5, width: '100%' }} />

      {/* === Example 2: Multiple Flashcards Side by Side === */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center', maxWidth: 600 }}>
        Multiple Flashcards Side by Side
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 3, maxWidth: 600, textAlign: 'center', color: 'rgba(255 255 255 / 0.85)' }}
      >
        Flip any card individually by clicking or keyboard. Useful for practicing multiple facts.
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={4}
        justifyContent="center"
        flexWrap="wrap"
        sx={{ maxWidth: 1200, width: '100%', mb: 3 }}
      >
        {initialCards.map(({ id, question, answer }) => {
          const isFlipped = flippedCards[id] || false;
          return (
            <Box
              key={id}
              tabIndex={0}
              role="button"
              aria-label={`Flip flashcard ${id}`}
              onClick={() => toggleCard(id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleCard(id);
                }
              }}
              sx={{
                width: 300,
                height: 200,
                perspective: 1000,
                cursor: 'pointer',
                outline: 'none',
                userSelect: 'none',
              }}
            >
              <Paper
                elevation={8}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  color: isFlipped ? 'black' : 'pink.700',
                  backgroundColor: isFlipped ? 'pink.100' : 'pink.600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  fontWeight: 600,
                  textAlign: 'center',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.8s',
                  transform: isFlipped ? 'rotateY(180deg)' : 'none',
                  boxShadow: isFlipped
                    ? '0 8px 16px rgba(219, 39, 119, 0.7)'
                    : '0 8px 16px rgba(219, 39, 119, 0.3)',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                    px: 2,
                    color: 'inherit',
                  }}
                >
                  {!isFlipped && question}
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 3,
                    px: 2,
                    color: 'inherit',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {answer}
                </Box>
              </Paper>
            </Box>
          );
        })}
      </Stack>

      <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.3)', my: 5, width: '100%' }} />

      {/* === Example 3: Flashcard with Progress Counter === */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center', maxWidth: 600 }}>
        Flashcard with Progress Counter
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 3, maxWidth: 600, textAlign: 'center', color: 'rgba(255 255 255 / 0.85)' }}
      >
        Navigate through cards with next/previous buttons, and flip to see answers.
      </Typography>
      <Box
        sx={{
          width: { xs: '100%', sm: 480 },
          maxWidth: 480,
          mx: 'auto',
          mb: 3,
          perspective: 1200,
          userSelect: 'none',
        }}
      >
        <Paper
          elevation={10}
          tabIndex={0}
          role="button"
          aria-label="Flip flashcard with progress"
          onClick={toggleProgressCard}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleProgressCard();
            }
          }}
          sx={{
            width: '100%',
            height: { xs: 220, sm: 260 },
            borderRadius: 4,
            bgcolor: 'background.paper',
            color: progressFlipped ? 'black' : 'pink.700',
            backgroundColor: progressFlipped ? 'pink.100' : 'pink.600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: { xs: 20, sm: 26 },
            fontWeight: 700,
            textAlign: 'center',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s',
            transform: progressFlipped ? 'rotateY(180deg)' : 'none',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: progressFlipped
              ? '0 14px 28px rgba(219, 39, 119, 0.7)'
              : '0 14px 28px rgba(219, 39, 119, 0.3)',
            userSelect: 'none',
            mb: 1,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              px: 4,
              color: 'inherit',
            }}
          >
            {!progressFlipped && progressFlashcards[progressIndex].question}
          </Box>

          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              px: 4,
              color: 'inherit',
              transform: 'rotateY(180deg)',
            }}
          >
            {progressFlipped && progressFlashcards[progressIndex].answer}
          </Box>
        </Paper>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            disabled={progressIndex === 0}
            onClick={prevProgressCard}
          >
            Previous
          </Button>
          <Typography
            variant="body1"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              color: 'rgba(255 255 255 / 0.9)',
              userSelect: 'none',
              minWidth: 60,
            }}
          >
            {progressIndex + 1} / {progressFlashcards.length}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            disabled={progressIndex === progressFlashcards.length - 1}
            onClick={nextProgressCard}
          >
            Next
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.3)', my: 5, width: '100%' }} />

      {/* === Example 4: Accessibility Demo (keyboard only) === */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center', maxWidth: 600 }}>
        Accessibility Demo (Keyboard Only)
        </Typography>
        <Typography
        variant="body1"
        sx={{ mb: 3, maxWidth: 600, textAlign: 'center', color: 'rgba(255 255 255 / 0.85)' }}
        >
        Use Tab to focus and press Enter or Space to flip the flashcard.
        </Typography>
        <Box
          tabIndex={0}
          role="button"
          aria-label="Flip flashcard using keyboard only"
          onKeyDown={handleAccessKeyDown}
          onClick={() => setAccessFlipped(!accessFlipped)}
          sx={{
            width: { xs: '100%', sm: 480 },
            maxWidth: 480,
            height: { xs: 220, sm: 260 },
            perspective: 1200,
            cursor: 'pointer',
            outline: 'none',
            userSelect: 'none',
            mx: 'auto',
            mb: 3,
          }}
        >
        <Paper
            elevation={10}
            sx={{
            width: '100%',
            height: '100%',
            borderRadius: 4,
            bgcolor: accessFlipped ? 'pink.100' : 'pink.600',
            color: accessFlipped ? 'black' : 'pink.700',
            fontSize: 26,
            fontWeight: 700,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.8s',
            transform: accessFlipped ? 'rotateY(180deg)' : 'none',
            boxShadow: accessFlipped
                ? '0 14px 28px rgba(219, 39, 119, 0.7)'
                : '0 14px 28px rgba(219, 39, 119, 0.3)',
            userSelect: 'none',
            position: 'relative',
            }}
        >
            <Box
            sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                px: 4,
                color: 'inherit',
            }}
            >
            {!accessFlipped && 'Keyboard accessible question'}
            </Box>

            <Box
            sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                px: 4,
                color: 'inherit',
                transform: 'rotateY(180deg)',
            }}
            >
            {accessFlipped && 'Answer shown after keyboard flip'}
            </Box>
        </Paper>
        </Box>

      <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.3)', my: 5, width: '100%' }} />

      {/* === Flashcard Generator Component === */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center', maxWidth: 600 }}>
        Flashcard Generator
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, maxWidth: 600, textAlign: 'center', color: 'rgba(255 255 255 / 0.85)' }}
      >
        Create your own flashcards to practice any subject.
      </Typography>
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: 400, sm: 720 }, // slightly wider on mobile
          mx: 'auto',
          py: { xs: 3, sm: 6 },
          px: { xs: 2, sm: 5 },
          borderRadius: 4,
          bgcolor: 'rgba(255 255 255 / 0.15)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          mb: 3,
          height: { xs: 'auto', sm: 'auto' },
        }}
      >
         <FlashcardGenerator
          deckId="demo-deck"
          onGenerated={() => {}}
          sx={{ width: '100%' }} 
        />
      </Box>
    </Box>
  );
}
