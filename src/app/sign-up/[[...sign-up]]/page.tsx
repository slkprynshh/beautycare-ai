// ============================================================================
// File: src/app/sign-up/[[...sign-up]]/page.tsx
// Description: Clerk Catch-All Sign-Up Page
// ============================================================================

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0E0C0A] flex items-center justify-center p-4">
      <SignUp
        appearance={{
          elements: {
            card: "bg-[#161412] border border-amber-900/30 text-white shadow-2xl",
            headerTitle: "text-amber-200 font-serif",
            formButtonPrimary: "bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-medium",
            socialButtonsBlockButton: "border-amber-900/40 text-neutral-200 hover:bg-amber-950/30",
          },
        }}
      />
    </div>
  );
}
