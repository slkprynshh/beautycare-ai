'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Plane,
  Car,
  Thermometer,
  Flame,
  MessageSquare,
  QrCode,
  ArrowRight,
  Crown,
  Lock,
  Activity,
  Droplets,
  Sliders,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useVipBookingStore, PrincipalProfile } from '@/store/useVipBookingStore';

const PRINCIPALS_LIST: PrincipalProfile[] = [
  {
    id: 'p-01',
    pseudonym: 'AURUM-09',
    legalNameAlias: 'Lady H. (Sovereign)',
    billingCode: 'FO-MIL-8841',
    discretionLevel: 'STRICT_NDA',
  },
  {
    id: 'p-02',
    pseudonym: 'SOLARIS-44',
    legalNameAlias: 'Family Office Geneve',
    billingCode: 'FO-GVA-3022',
    discretionLevel: 'SOVEREIGN',
  },
  {
    id: 'p-03',
    pseudonym: 'NOVA-07',
    legalNameAlias: 'Private Principal London',
    billingCode: 'FO-LDN-9910',
    discretionLevel: 'STANDARD',
  },
];

export default function VipPortalOverviewPage() {
  const {
    selectedPrincipal,
    setSelectedPrincipal,
    selectedTreatmentId,
    bookingDate,
    bookingTimeSlot,
    suiteTemperature,
    lightingMode,
    needsChauffeur,
    airportCode,
    flightTailNumber,
  } = useVipBookingStore();

  const [activeTab, setActiveTab] = useState<'reservation' | 'biometrics' | 'concierge'>('reservation');

  return (
    <div className="space-y-8">
      
      {/* Top Banner: Sovereign Welcome & Principal Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171410] via-[#12100E] to-[#1A1612] border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-amber-400" />
              Sovereign VIP Experience
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Mutual NDA Enforced
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif text-[#FAF8F5] tracking-tight">
            Welcome to <span className="italic text-amber-300">Villa Belladonna</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-xl">
            Sovereign biological aesthetic sanctuary and longevity retreat in Milan. Private subterranean suites, tailored 24k gold compounding, and private tarmac aviation logistics.
          </p>
        </div>

        {/* Principal Delegation Switcher */}
        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#0A0908]/80 p-3.5 rounded-2xl border border-amber-900/40 relative z-10">
          <div className="text-xs">
            <span className="text-neutral-500 block text-[10px] font-mono uppercase tracking-wider">Active Delegation</span>
            <span className="font-serif text-amber-100 font-medium">{selectedPrincipal.pseudonym}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {PRINCIPALS_LIST.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPrincipal(p)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono transition ${
                  selectedPrincipal.id === p.id
                    ? 'bg-amber-500/20 border border-amber-500/60 text-amber-200 font-bold'
                    : 'bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {p.pseudonym}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Ceremony & Live Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Confirmed Ceremony (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#110F0C] border border-amber-500/30 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-amber-900/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
                    Next Sovereign Reservation
                  </span>
                  <h2 className="text-lg sm:text-xl font-serif text-amber-100">
                    The Signature 24k Gold Bio-Peptide Facial
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  CONFIRMED &amp; DISPATCHED
                </span>
              </div>
            </div>

            {/* Reservation Key Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#171411] border border-amber-950/60">
                <span className="text-neutral-500 block text-[10px] font-mono uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  Date
                </span>
                <span className="font-mono text-amber-100 font-bold text-sm block mt-1">
                  {bookingDate || '2026-10-15'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#171411] border border-amber-950/60">
                <span className="text-neutral-500 block text-[10px] font-mono uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Time Window
                </span>
                <span className="font-mono text-amber-100 font-bold text-sm block mt-1">
                  {bookingTimeSlot || '14:00 - 15:30'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#171411] border border-amber-950/60">
                <span className="text-neutral-500 block text-[10px] font-mono uppercase flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-amber-400" />
                  Master Artisan
                </span>
                <span className="font-serif text-amber-100 font-bold text-sm block mt-1">
                  Elena Russo
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#171411] border border-amber-950/60">
                <span className="text-neutral-500 block text-[10px] font-mono uppercase flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  Assigned Suite
                </span>
                <span className="font-mono text-amber-100 font-bold text-xs block mt-1 truncate">
                  Carrara Suite I
                </span>
              </div>
            </div>

            {/* Suite Environmental Calibration Status */}
            <div className="p-4 rounded-2xl bg-[#0C0B09] border border-amber-900/30 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-neutral-300 font-mono">
                  <Thermometer className="w-4 h-4 text-amber-400" />
                  <span>Climate: <strong className="text-amber-200">{suiteTemperature}°C</strong></span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300 font-mono">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Lighting: <strong className="text-amber-200">1800K Candlelight</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
                <Droplets className="w-3.5 h-3.5 text-amber-400" />
                <span>Aromatherapy: Tuscan Neroli &amp; Cedarwood</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Link
                href="/portal/pass/latest"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30 text-xs font-mono font-semibold transition"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Display Apple Wallet NFC Pass</span>
              </Link>

              <Link
                href="/portal/concierge"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-200 hover:text-white hover:border-amber-500/40 text-xs font-medium transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact Private Concierge</span>
              </Link>
            </div>
          </div>

          {/* Tarmac & Chauffeur Coordination Hub */}
          <div className="p-6 rounded-3xl bg-[#110F0C] border border-amber-950/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plane className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg text-amber-100">Private Tarmac &amp; Aviation Logistics</h3>
              </div>
              <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
                Active Chauffeur Dispatch
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-[#171411] border border-amber-950/40">
                <span className="text-neutral-500 block text-[10px] uppercase">Arrival Hub</span>
                <span className="text-amber-200 font-bold block mt-1">
                  {airportCode || 'LIN'} (Milan Linate Private Jet Terminal)
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#171411] border border-amber-950/40">
                <span className="text-neutral-500 block text-[10px] uppercase">Aviation Tail</span>
                <span className="text-amber-200 font-bold block mt-1">
                  {flightTailNumber || 'N784V (Gulfstream G650)'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#171411] border border-amber-950/40">
                <span className="text-neutral-500 block text-[10px] uppercase">Chauffeur &amp; Security</span>
                <span className="text-amber-200 font-bold block mt-1">
                  Mercedes Maybach (Marco T. • Alpha)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio-metrics & Quick Protocol Launch (1 Col) */}
        <div className="space-y-6">
          
          {/* Dermal Bio-metrics & Longevity Tracker */}
          <div className="p-6 rounded-3xl bg-[#110F0C] border border-amber-500/30 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif text-base text-amber-100">Dermal Bio-Metrics</h3>
              </div>
              <span className="text-[10px] font-mono text-amber-400 uppercase">Live Biometric Feed</span>
            </div>

            <div className="space-y-4">
              {/* Metric 1 */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-neutral-400">Cellular Elasticity Index</span>
                  <span className="text-amber-300 font-bold">94.2% (Peak)</span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" style={{ width: '94.2%' }} />
                </div>
              </div>

              {/* Metric 2 */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-neutral-400">Lipid Barrier Hydration</span>
                  <span className="text-amber-300 font-bold">88.7%</span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-600 to-emerald-400 rounded-full" style={{ width: '88.7%' }} />
                </div>
              </div>

              {/* Metric 3 */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-neutral-400">Cryo Regeneration Phase</span>
                  <span className="text-amber-300 font-bold">Phase 3 / 4</span>
                </div>
                <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>

            {/* Apothecary Lab Status */}
            <div className="p-3.5 rounded-2xl bg-[#090807] border border-amber-900/40 text-xs space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block font-semibold">
                🧪 Palazzo Compounding Lab
              </span>
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                Batch <strong>#8841-B</strong> (24k Gold Flakes + 32 Bio-Peptides) compounded by Master Biologist Russo today at 09:30.
              </p>
            </div>
          </div>

          {/* Quick Protocol Navigation */}
          <div className="p-6 rounded-3xl bg-[#110F0C] border border-amber-950/80 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
              Sovereign Protocol Shortcuts
            </span>

            <div className="space-y-2">
              <Link
                href="/portal/book"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#171411] border border-amber-950/40 hover:border-amber-500/40 hover:bg-[#1E1A15] transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-serif text-sm text-amber-100 block">Book Bespoke Treatment</span>
                    <span className="text-[10px] font-mono text-neutral-500">24k Gold, Hyperbaric, Cryo</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                href="/portal/concierge"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#171411] border border-amber-950/40 hover:border-amber-500/40 hover:bg-[#1E1A15] transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-serif text-sm text-amber-100 block">VIP Encrypted Concierge</span>
                    <span className="text-[10px] font-mono text-neutral-500">Direct Line with Elena V.</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                href="/ea-portal"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#171411] border border-amber-950/40 hover:border-amber-500/40 hover:bg-[#1E1A15] transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-serif text-sm text-amber-100 block">Family Office Dispatch</span>
                    <span className="text-[10px] font-mono text-neutral-500">Multi-Service Tarmac Protocol</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                href="/salon-portal"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#171411] border border-amber-950/40 hover:border-amber-500/40 hover:bg-[#1E1A15] transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-serif text-sm text-amber-100 block">Director's Command Center</span>
                    <span className="text-[10px] font-mono text-neutral-500">RevPASH &amp; Small-Batch Vault</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
