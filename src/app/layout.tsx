// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import '../styles/globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Your App',
  description: 'App description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
