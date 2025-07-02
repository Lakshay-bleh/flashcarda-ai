'use client';

import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';

interface UpdateEntry {
  date: string;
  title: string;
  description: string;
}

const updates: UpdateEntry[] = [
  {
    date: '2025-07-01',
    title: 'Flashcard Demo Improvements',
    description:
      'Refined flashcard flipping animations and accessibility support. Added multiple flashcard layouts and progress tracking.',
  },
  {
    date: '2025-06-20',
    title: 'Dark Mode Support',
    description:
      'Introduced dark mode across the application for better night-time usability and eye comfort.',
  },
  {
    date: '2025-06-10',
    title: 'Performance Optimizations',
    description:
      'Improved rendering speed of flashcards and reduced bundle size for faster load times.',
  },
];

export default function UpdatesPage() {
  return (
    <Box
      component="main"
      className="min-h-screen flex flex-col bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans"
      sx={{
        px: { xs: 5, sm: 8, md: 12 },
        py: { xs: 6, sm: 9, md: 12 },
        overflowY: 'auto',
        gap: 6,
        alignItems: 'center',
        maxWidth: '100vw',
      }}
    >
      {/* Title */}
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}
      >
        Updates
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 6,
          maxWidth: 600,
          textAlign: 'center',
          color: 'rgba(255 255 255 / 0.85)',
          userSelect: 'none',
        }}
      >
        Stay up-to-date with the latest improvements, features, and fixes.
      </Typography>

      <Stack spacing={5} sx={{ width: '100%', maxWidth: 700 }}>
        {updates.map(({ date, title, description }, index) => (
          <Paper
            key={index}
            elevation={8}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: 'rgba(255 255 255 / 0.1)',
              userSelect: 'text',
              '&:hover': {
                bgcolor: 'rgba(255 255 255 / 0.15)',
                boxShadow: '0 8px 24px rgba(255 192 203 / 0.4)',
                transition: 'background-color 0.3s ease',
              },
            }}
            aria-label={`Update from ${date}: ${title}`}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: 'rgba(255 255 255 / 0.6)',
                mb: 1,
                fontWeight: 600,
                letterSpacing: 0.7,
              }}
            >
              {new Date(date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, mb: 1, color: 'pink.200' }}
            >
              {title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255 255 255 / 0.9)' }}>
              {description}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
