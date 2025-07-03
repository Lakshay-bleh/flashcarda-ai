import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',                        // homepage
  '/sign-in(.*)',             // sign-in pages
  '/sign-up(.*)',             // sign-up pages
  '/decks/(.*)/shared/(.*)',  // public shared decks

  // Footer-linked public pages only
  '/features',
  '/examples',
  '/updates',
  '/pricing',
  '/docs',
  '/contact',
  '/help',
  '/about',
  '/blog',
  '/careers',
  '/privacy',
  '/terms',
  '/cookies',
  '/for-her',
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      // Use absolute URL for redirect
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
});

export const config = {
  matcher: [
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
