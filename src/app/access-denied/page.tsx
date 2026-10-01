// ============================================================================
// File: src/app/access-denied/page.tsx
// Description: Access Denied / 403 Page for Villa Belladonna Milan
// ============================================================================

import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen bg-[#0E0C0A] text-[#E8E4D9] flex items-center justify-center p-6">
      <div className="max-w-md w-full border border-amber-900/30 bg-[#161412] p-8 rounded-2xl text-center shadow-2xl backdrop-blur-md">
        <div className="w-16 h-16 bg-amber-950/50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-400 border border-amber-800/40">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-serif tracking-wide text-amber-200 mb-2">
          Restricted Sanctuary
        </h1>
        
        <p className="text-sm text-neutral-400 leading-relaxed mb-8">
          Your account credentials do not hold the required clearance level for this private salon zone. If you believe this is an error, please consult the Director.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-medium text-sm transition shadow-lg shadow-amber-950/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Sanctuary Home
          </Link>
        </div>
      </div>
    </main>
  );
}
