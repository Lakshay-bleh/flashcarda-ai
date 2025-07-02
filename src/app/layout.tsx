// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import '../styles/globals.css';
import { Toaster } from 'sonner';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'Your App',
  description: 'App description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-white`}>
          <Navbar />
          {children}
          <Toaster />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
