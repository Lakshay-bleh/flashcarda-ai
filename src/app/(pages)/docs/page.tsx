'use client';

import React from 'react';
import { Box, Typography, Divider, Paper } from '@mui/material';

export default function DocsPage() {
  return (
    <Box
      component="main"
      className="min-h-screen flex flex-col bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans"
      sx={{
        px: { xs: 5, sm: 8, md: 12 },
        py: { xs: 6, sm: 9, md: 12 },
        overflowY: 'auto',
        alignItems: 'center',
        maxWidth: '100vw',
        gap: 4,
      }}
    >
      {/* Title */}
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}
      >
        Documentation
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 6,
          maxWidth: 720,
          textAlign: 'center',
          color: 'rgba(255 255 255 / 0.85)',
          userSelect: 'none',
        }}
      >
        Everything you need to get started and understand how to use our app effectively.
      </Typography>

      {/* Content Container */}
      <Paper
        elevation={8}
        sx={{
          p: { xs: 4, sm: 6 },
          borderRadius: 4,
          bgcolor: 'rgba(255 255 255 / 0.1)',
          maxWidth: 800,
          width: '100%',
          color: 'white',
          userSelect: 'text',
          overflowY: 'auto',
          maxHeight: '70vh',
        }}
      >
        {/* Section 1 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Getting Started
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'rgba(255 255 255 / 0.85)' }}>
            To begin, navigate to the flashcard demo where you can practice with pre-made cards or generate your own. Use the keyboard or mouse to flip cards and advance through progress counters.
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.3)', mb: 5 }} />

        {/* Section 2 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Features Overview
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'rgba(255 255 255 / 0.85)' }}>
            Our app supports multiple flashcards displayed side by side, progress tracking, keyboard accessibility, and a flashcard generator component. The interface is optimized for usability and visual clarity.
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.3)', mb: 5 }} />

        {/* Section 3 */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Accessibility
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'rgba(255 255 255 / 0.85)' }}>
            Keyboard navigation and screen reader support are included. Focusable elements have clear roles and aria-labels. You can flip cards using Enter or Space keys, ensuring all users can engage with content.
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.3)', mb: 5 }} />

        {/* Section 4 */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Contact & Support
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'rgba(255 255 255 / 0.85)' }}>
            If you have questions or need assistance, visit our contact page to send us a message. We strive to respond promptly to feedback and support inquiries.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
