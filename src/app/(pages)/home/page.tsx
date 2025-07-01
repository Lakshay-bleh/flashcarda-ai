'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Typography,
  Stack,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
} from '@mui/material';
import { Dashboard, School, Info, Lightbulb, Article } from '@mui/icons-material';

// Import your Sidebar from wherever you keep it
import Sidebar from '../../../../components/Sidebar';  // Adjust this import path as needed

const motivationalQuotes: string[] = [
  'The journey of a thousand miles begins with one step. – Lao Tzu',
  'Practice makes permanent.',
  'Review today what you learned yesterday.',
  'Small progress each day adds up to big results.',
  'Consistency is the key to mastery.',
  'Focus on progress, not perfection.',
];

const studyTips: string[] = [
  'Set clear goals for each study session.',
  'Take regular breaks to boost retention.',
  'Use active recall to strengthen memory.',
  'Teach someone else what you learned.',
  'Organize your materials before you start.',
];

// Replacing recent articles with "Quick Facts" for better engagement
const quickFacts = [
  { icon: <Lightbulb />, text: 'Active recall is proven to improve memory retention.' },
  { icon: <Lightbulb />, text: 'Spacing out study sessions helps long-term learning.' },
  { icon: <Lightbulb />, text: 'Teaching others is one of the best ways to master a topic.' },
  { icon: <Lightbulb />, text: 'Consistency beats intensity for sustained progress.' },
];

const HomeAfterLogin: React.FC = () => {
  const { user } = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [quote, setQuote] = useState<string>(motivationalQuotes[0]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/sign-in');
    } else {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setQuote(motivationalQuotes[randomIndex]);
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'transparent',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen flex flex-col sm:flex-row bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-sans">
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 3, sm: 6, md: 8 },
          py: { xs: 5, sm: 7, md: 9 },
          overflowY: 'auto',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          maxWidth: '100%',
          mx: 'auto',
          width: '100%',
        }}
      >
        {/* Welcome & Quote */}
        <Box sx={{ mb: 4, maxWidth: 800, mx: 'auto', textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: 700, mb: 1, textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
          >
            Welcome back, {user?.firstName || 'User'}! 👋
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.85)',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
              mx: 'auto',
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            &quot;{quote}&quot;
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          justifyContent="center"
          sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}
        >
          <Link href="/dashboard" passHref legacyBehavior>
            <Button
              component="a"
              variant="contained"
              startIcon={<Dashboard />}
              sx={{
                py: 1.8,
                fontSize: 18,
                fontWeight: 700,
                borderRadius: 30,
                flexGrow: 1,
                textTransform: 'none',
                bgcolor: 'rgba(255 255 255 / 0.25)',
                color: 'white',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 6px 20px rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255 255 255 / 0.4)',
                },
              }}
            >
              Go to Dashboard
            </Button>
          </Link>

          <Link href="/decks" passHref legacyBehavior>
            <Button
              component="a"
              variant="outlined"
              startIcon={<School />}
              sx={{
                py: 1.8,
                fontSize: 18,
                fontWeight: 700,
                borderRadius: 30,
                flexGrow: 1,
                textTransform: 'none',
                borderColor: 'rgba(255 255 255 / 0.5)',
                color: 'rgba(255 255 255 / 0.9)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  bgcolor: 'rgba(255 255 255 / 0.2)',
                  borderColor: 'rgba(255 255 255 / 0.8)',
                },
              }}
            >
              View My Decks
            </Button>
          </Link>
        </Stack>

        <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.3)', my: 4 }} />

        <Box
          sx={{
            maxWidth: 900,
            mx: 'auto',
            mb: 8,
            mt: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 'bold',
              color: 'rgba(255 255 255 / 0.95)',
              textShadow: '0 1px 5px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              justifyContent: 'center',
            }}
          >
            <Lightbulb fontSize="large" sx={{ color: 'white' }} />
            Study Tips
          </Typography>

          {/* Replace Grid with Box flex container */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            {studyTips.map((tip, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: '1 1 45%', // similar to xs=12 sm=6
                  maxWidth: 400,
                  display: 'flex',
                  justifyContent: idx % 2 === 0 ? 'flex-start' : 'flex-end',
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(255 255 255 / 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    userSelect: 'text',
                    cursor: 'default',
                    transition: 'background-color 0.3s ease',
                    '&:hover': { bgcolor: 'rgba(255 255 255 / 0.25)' },
                    width: '100%',
                  }}
                >
                  <Info sx={{ color: 'white', fontSize: 30 }} />
                  <Typography variant="body1" sx={{ flex: 1, fontWeight: 600, color: '#fff' }}>
                    {tip}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255 255 255 / 0.3)', my: 4 }} />

        {/* Quick Facts */}
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: 'rgba(255 255 255 / 0.95)',
              textShadow: '0 1px 5px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              justifyContent: 'center',
            }}
          >
            <Article fontSize="large" />
            Quick Facts
          </Typography>

          <List sx={{ bgcolor: 'rgba(255 255 255 / 0.1)', borderRadius: 3 }}>
            {quickFacts.map(({ icon, text }, idx) => (
              <ListItem key={idx} sx={{ px: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'rgba(255 255 255 / 0.25)', color: 'white' }}>
                    {icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{ fontWeight: 600, color: 'white' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: 10,
            maxWidth: 600,
            color: 'rgba(255 255 255 / 0.7)',
            userSelect: 'none',
            fontWeight: 500,
            textAlign: 'center',
            mx: 'auto',
          }}
        >
          Stay consistent, keep learning, and make every study session count!
        </Typography>
      </Box>
    </Box>
  );
};

export default HomeAfterLogin;
