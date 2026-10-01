'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  Calendar,
  MessageSquare,
  QrCode,
  Plane,
  ArrowLeft,
  Lock,
  Crown,
  Layers,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { useVipBookingStore } from '@/store/useVipBookingStore';

const NAV_ITEMS = [
  { href: '/portal', label: 'Overview', icon: Crown, exact: true },
  { href: '/portal/chronos', label: 'Chronos Dermal Twin™', icon: Activity },
  { href: '/portal/book', label: 'Bespoke Ceremony', icon: Sparkles },
  { href: '/portal/concierge', label: 'Private Concierge', icon: MessageSquare },
  { href: '/portal/pass/latest', label: 'Digital Suite Pass', icon: QrCode },
  { href: '/ea-portal', label: 'EA Dispatch Hub', icon: Plane },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { selectedPrincipal } = useVipBookingStore();

  return (
    <div className="min-h-screen bg-[#080706] text-[#FAF8F5] selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden font-sans">
      {/* Background Lighting & Atmospheric Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(197,168,128,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <div className="fixed -top-32 -left-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 -right-32 w-96 h-96 bg-amber-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Sovereign Security & Discretion Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0A08]/90 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-8 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Brand & Context */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2 text-neutral-400 hover:text-amber-200 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition" />
              <span className="font-serif text-sm tracking-wide text-amber-100 font-semibold">
                Villa Belladonna
              </span>
            </Link>
            <span className="text-neutral-700 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-amber-300/80 font-mono text-[11px] uppercase tracking-widest">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Sovereign Client &amp; Family Office Portal</span>
            </div>
          </div>

          {/* Principal & Security Status */}
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-200">
              <span className="text-neutral-400">Principal:</span>
              <span className="font-semibold text-amber-300">{selectedPrincipal.pseudonym}</span>
              <span className="text-[10px] text-neutral-500">({selectedPrincipal.billingCode})</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <ShieldCheck className="w-3 h-3" />
              <span className="tracking-wider uppercase text-[10px]">256-Bit NDA Active</span>
            </div>
          </div>

        </div>

        {/* Portal Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-amber-900/30 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          <nav className="flex items-center gap-1 sm:gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-100 shadow-sm'
                      : 'text-neutral-400 hover:text-amber-200 hover:bg-neutral-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-amber-300/70">
            <PhoneCall className="w-3 h-3 text-amber-400" />
            <span>Palazzo VIP Line: +39 02 8841 9000</span>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {children}
      </main>

      {/* Footer Discretion Tag */}
      <footer className="border-t border-amber-950/60 py-6 text-center text-xs font-mono text-neutral-600">
        <p className="tracking-widest uppercase text-[10px]">
          Villa Belladonna Milan • Sovereign Private Client Architecture • Strict Confidentiality
        </p>
      </footer>
    </div>
  );
}
