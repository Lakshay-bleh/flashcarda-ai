'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn
        routing="path"
        path="/sign-in"
        afterSignInUrl="/dashboard"  // 👈 Redirect after successful sign-in
      />
    </div>
  );
}
