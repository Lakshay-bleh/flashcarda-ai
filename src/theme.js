// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4F46E5', // Tailwind indigo-600
    },
    secondary: {
      main: '#EC4899', // Tailwind pink-500
    },
    background: {
      default: '#1e1b4b',
      paper: '#2e1065',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e7ff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
