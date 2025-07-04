// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import '../styles/globals.css';
import { Toaster } from 'sonner';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Inter } from 'next/font/google';
import GlobalEffects from '../../components/GlobalEffects';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'FlashDecks',
  description: 'The smart way to study and retain information using scientifically proven techniques.',
  keywords: ['flashcards', 'AI', 'study tool', 'learning', 'dedication', 'Riya'],
  authors: [{ name: 'Lakshay Riya Jain' }],
  openGraph: {
    title: 'FlashDecks - AI Flashcard Generator',
    description: 'Dedicated to Riya 💖. The smart way to study and retain info.',
    url: 'https://flashcards.vercel.app',
    siteName: 'FlashDecks',
    images: [
      {
        url: 'https://flashcards.vercel.app/og-image.png',
        width: 800,
        height: 600,
        alt: 'FlashDecks Logo',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  Instagram: {
    card: 'summary_large_image',
    title: 'FlashDecks - AI Flashcard Generator',
    description: 'Dedicated to Riya 💖. The smart way to study and retain info.',
    images: ['https://flashcards.vercel.app/instagram-image.png'],
    creator: '@_lakshay.yx',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white`}>
        <ClerkProvider>
          <Navbar />
          <GlobalEffects />
          {children}
          <Toaster />
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}

