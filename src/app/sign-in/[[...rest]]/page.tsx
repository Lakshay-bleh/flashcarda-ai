'use client';

import { SignIn } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';

export default function SignInPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
        color: 'white',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Left Branding Panel - MUI 5 */}
      <Paper
        elevation={10}
        square={false}
        sx={{
          width: { xs: '100%', md: '70%' }, // 5/8
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          bgcolor: 'transparent',
          background: 'linear-gradient(225deg, #4338ca, #7c3aed, #db2777)',
          borderTopRightRadius: 40,
          borderBottomRightRadius: 40,
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(255,255,255,0.1)',
        }}
      >
        {/* Animated Glow Layer */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.3,
            filter: 'blur(120px)',
            pointerEvents: 'none',
            zIndex: 0,
            animation: 'pulseSlow 10s ease-in-out infinite',
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 70%)',
          }}
        />
        {/* Keyframes for pulseSlow */}
        <style>{`
          @keyframes pulseSlow {
            0%, 100% {opacity: 0.3;}
            50% {opacity: 0.5;}
          }
        `}</style>

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Logo and Headline */}
          <Stack direction="row" spacing={2} alignItems="center" mb={4}>
            <SvgIcon
              sx={{ fontSize: 48, filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.5))' }}
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" fill="currentColor" />
              <circle cx="12" cy="12" r="4" fill="black" />
            </SvgIcon>
            <Typography variant="h3" fontWeight="800" letterSpacing={-1}>
              <Box component="span" color="white">
                Flash
              </Box>
              <Box component="span" fontStyle="italic" color="#f472b6" ml={0.5}>
                Decks
              </Box>
            </Typography>
          </Stack>

          {/* Gradient Headline */}
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              background:
                'linear-gradient(90deg, #ffffff, #c7d2fe, #fbcfe8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              dropShadow: '0 1px 3px rgba(0,0,0,0.4)',
              maxWidth: 560,
              lineHeight: 1.1,
            }}
            gutterBottom
          >
            Smarter studying{' '}
            <Box
              component="span"
              sx={{
                textDecorationLine: 'underline',
                textDecorationColor: 'rgba(255,255,255,0.4)',
              }}
            >
              starts here
            </Box>
          </Typography>

          {/* Paragraph */}
          <Typography
            variant="body1"
            sx={{
              color: '#c4b5fd', // indigo-100
              maxWidth: 400,
              mt: 2,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              lineHeight: 1.6,
            }}
          >
            Boost{' '}
            <Box component="span" fontWeight="600" color="white">
              memory retention
            </Box>{' '}
            with intelligent flashcards powered by spaced repetition.
            Learn{' '}
            <Box component="span" fontWeight="600" color="white">
              faster
            </Box>
            , remember{' '}
            <Box component="span" fontWeight="600" color="white">
              longer
            </Box>
            , and conquer any subject with confidence.
          </Typography>
        </Box>

        {/* Image Card */}
        <Box
          sx={{
            mt: 8,
            position: 'relative',
            width: { xs: 280, md: 320 },
            mx: 'auto',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
            transition: 'transform 0.7s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        >
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
            alt="Focused student at desk"
            sx={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'cover',
            }}
          />
          {/* Caption */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: 12,
              color: 'white',
              backdropFilter: 'blur(6px)',
              userSelect: 'none',
            }}
          >
            🎓 Focused Student
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 8,
            fontSize: 14,
            color: 'rgba(199, 210, 254, 0.8)', // indigo-100 80%
            textAlign: { xs: 'center', md: 'left' },
            opacity: 0.8,
          }}
        >
          &copy; {new Date().getFullYear()}{' '}
          <Box component="span" fontWeight="600" color="white">
            FlashDecks Inc.
          </Box>{' '}
          All rights reserved.
          <Box sx={{ mt: 0.5, fontSize: 12, opacity: 0.6 }}>
            Made with ❤️ for learners everywhere
          </Box>
        </Box>
      </Paper>
      {/* Right Sign-in Form */}
      <div className="w-full md:w-1/2 bg-white text-gray-800 flex items-center justify-center p-8 rounded-tl-3xl md:rounded-tl-none md:rounded-bl-3xl shadow-2xl">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-500">
              <Link href="/sign-up" className="text-indigo-600 hover:underline font-medium">
                create a new account
              </Link>
            </p>
          </div>

          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/profile"
            appearance={{
              elements: {
                card: 'border border-gray-200 px-4 py-6 shadow-md',
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md',
                headerTitle: 'text-xl font-semibold',
                headerSubtitle: 'text-sm text-gray-500',
              },
              variables: {
                colorPrimary: '#4F46E5', // Tailwind indigo-600
              },
            }}
          />
        </div>
      </div>
    </Box>
  );
}
