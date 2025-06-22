// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

module.exports = clerkMiddleware({
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)'],
});

module.exports.config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
