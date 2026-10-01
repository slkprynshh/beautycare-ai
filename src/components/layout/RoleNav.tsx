// ============================================================================
// File: src/components/layout/RoleNav.tsx
// Purpose: Role-Aware Luxury Navigation Server Component for Villa Belladonna
// ============================================================================

import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { ShieldCheck, Calendar, Crown, User as UserIcon } from "lucide-react";
import type { UserRole } from "@/types/clerk";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkActive = Boolean(
  clerkKey && 
  clerkKey.trim() !== "" && 
  clerkKey.startsWith("pk_") && 
  !clerkKey.includes("Y2xlcms") && 
  !clerkKey.includes("mock")
);

export async function RoleNav() {
  let user: any = null;
  let role: UserRole = "client";

  if (isClerkActive) {
    try {
      user = await currentUser();
      role = ((user?.publicMetadata as { role?: string })?.role?.toLowerCase() || "client") as UserRole;
    } catch {
      user = null;
      role = "client";
    }
  }

  const isDirector = role === "director";
  const isArtisan = role === "artisan" || isDirector;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-900/20 bg-[#0E0C0A]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-amber-500/40 flex items-center justify-center bg-gradient-to-br from-amber-900/40 to-black text-amber-300 group-hover:border-amber-400 transition">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif tracking-widest text-lg text-[#F5F2EB] uppercase block leading-none">
              Villa Belladonna
            </span>
            <span className="text-[10px] tracking-[0.25em] text-amber-400/80 uppercase font-sans">
              Milano • Clinic & Salon
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs uppercase tracking-widest font-medium text-neutral-300">
          <Link href="/portal" className="text-amber-300 hover:text-amber-200 font-semibold transition py-1 flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP Portal</span>
          </Link>
          <Link href="/services" className="hover:text-amber-300 transition py-1">
            Treatments
          </Link>
          <Link href="/bottega" className="hover:text-amber-300 transition py-1">
            Boutique
          </Link>
          <Link href="/calendar" className="hover:text-amber-300 transition py-1">
            Appointments
          </Link>
          <Link href="/dashboard" className="hover:text-amber-300 transition py-1">
            Dashboard
          </Link>

          {/* Conditional: Staff Calendar */}
          {isArtisan && (
            <Link
              href="/staff-calendar"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-700/40 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 hover:text-amber-200 transition"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Artisan Console</span>
            </Link>
          )}

          {/* Conditional: Salon Operations Portal */}
          {isDirector && (
            <Link
              href="/salon-portal"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/60 bg-gradient-to-r from-amber-900/50 to-amber-800/40 text-amber-200 hover:border-amber-400 shadow-sm shadow-amber-900/20 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Salon Portal</span>
            </Link>
          )}
        </nav>

        {/* Right: Auth Controls & Profile */}
        <div className="flex items-center gap-4">
          {isClerkActive && user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#1C1814] text-amber-300 border border-amber-800/30">
                {isDirector ? "Director" : isArtisan ? "Master Artisan" : "VIP Guest"}
              </span>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border border-amber-500/40",
                  },
                }}
              />
            </div>
          ) : isClerkActive ? (
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="text-xs uppercase tracking-wider text-neutral-300 hover:text-amber-300 transition font-medium px-3 py-2">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-xs uppercase tracking-wider px-4 py-2 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-medium transition shadow-md shadow-amber-950/40">
                  Join VIP Club
                </button>
              </SignUpButton>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs uppercase tracking-wider text-neutral-300 hover:text-amber-300 transition font-medium px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/onboarding"
                className="text-xs uppercase tracking-wider px-4 py-2 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-medium transition shadow-md shadow-amber-950/40"
              >
                Launch Salon
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
