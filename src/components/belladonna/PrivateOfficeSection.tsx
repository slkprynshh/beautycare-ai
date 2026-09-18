'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Key,
  Plane,
  Crown,
  Building2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface PrivateOfficePillar {
  id: 'viaggi' | 'accesso' | 'gestione' | 'acquisizioni';
  badgeNumber: string;
  italianTitle: string;
  englishCategory: string;
  headline: string;
  copy: string;
  icon: React.ElementType;
  highlights: string[];
  deliverables: string[];
  tag: string;
}

const PILLARS: PrivateOfficePillar[] = [
  {
    id: 'viaggi',
    badgeNumber: '01',
    italianTitle: 'Viaggi Privati',
    englishCategory: 'Luxury Travel & Aviation',
    headline: 'Seamless Global Aviation & Nautical Charters.',
    copy: 'Beyond the palazzo, our logistics directors orchestrate flawless transitions. From securing ultra-long-range private jet charters to curating bespoke super-yacht itineraries along the Amalfi Coast and French Riviera, your global footprint is managed with absolute discretion.',
    icon: Plane,
    highlights: ['Ultra-Long-Range Jet Charters', 'Amalfi & Côte d’Azur Super-Yachts', 'Discreet Tarmac VIP Transfers'],
    deliverables: ['Dedicated aviation coordinator', 'Bespoke inflight Michelin catering', 'Helicopter transfers to Lake Como'],
    tag: 'Global Mobility',
  },
  {
    id: 'accesso',
    badgeNumber: '02',
    italianTitle: 'Accesso Esclusivo',
    englishCategory: 'Exclusive Access & Culture',
    headline: 'The Keys to Milan and Beyond.',
    copy: 'Unlock the inaccessible. We secure VIP enclaves at sold-out global events, guarantee immediate reservations at elite private members\' clubs, and arrange closed-door, after-hours private tours of the world\'s most prestigious museums and galleries.',
    icon: Crown,
    highlights: ['Closed-Door Museum & Duomo Access', 'Milan Fashion Week Front-Row Enclaves', 'Private Members\' Club Privileges'],
    deliverables: ['After-hours Galleria viewings', 'Direct atelier appointments', 'Private box seating at Teatro alla Scala'],
    tag: 'Invitation Only',
  },
  {
    id: 'gestione',
    badgeNumber: '03',
    italianTitle: 'Gestione Residenziale',
    englishCategory: 'Estate Management',
    headline: 'Impeccable Household & Estate Orchestration.',
    copy: 'Ensure your sanctuaries remain pristine. Our estate directors oversee elite household staff recruitment, execute flawless white-glove home preparations prior to your arrival, and coordinate proactive, invisible maintenance for your global residences.',
    icon: Building2,
    highlights: ['Elite Household & Butler Recruitment', 'Pre-Arrival White-Glove Staging', 'Invisible Multi-Estate Maintenance'],
    deliverables: ['Private chef & sommelier staffing', 'Biometric security oversight', 'Bespoke floral & cellar provisioning'],
    tag: 'Sanctuary Care',
  },
  {
    id: 'acquisizioni',
    badgeNumber: '04',
    italianTitle: 'Acquisizioni e Benessere',
    englishCategory: 'Personal Services & Sourcing',
    headline: 'Rare Acquisitions & Bespoke Wellness.',
    copy: 'From sourcing off-market haute couture and rare vintage timepieces to curating fully staffed, private wellness retreats on Lake Como. If it is rare, we acquire it; if it requires absolute peace, we create it.',
    icon: Sparkles,
    highlights: ['Off-Market Vintage Horlogerie', 'Private Lake Como Villa Retreats', 'Haute Couture Archival Sourcing'],
    deliverables: ['Private aesthetician on-site', 'Custom botanical laboratory formulations', 'Rare vintage wine acquisition'],
    tag: 'Haute Lifestyle',
  },
];

interface PrivateOfficeSectionProps {
  onOpenInquiry: (pillarId?: 'viaggi' | 'accesso' | 'gestione' | 'acquisizioni' | 'retainer') => void;
}

export function PrivateOfficeSection({ onOpenInquiry }: PrivateOfficeSectionProps) {
  const [activePillarId, setActivePillarId] = useState<'viaggi' | 'accesso' | 'gestione' | 'acquisizioni'>('viaggi');

  const activePillar = PILLARS.find((p) => p.id === activePillarId) || PILLARS[0];

  return (
    <section
      id="private-office"
      className="scroll-mt-28 relative rounded-[36px] sm:rounded-[48px] bg-[#0A0908] border border-gold/30 text-white overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.9)] p-8 sm:p-14 lg:p-20 space-y-12 sm:space-y-16"
    >
      {/* Background Ambience & Fine Gold Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-900/15 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header with Black-Card / Gated Discretion Aesthetic */}
      <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/40 text-xs font-label uppercase tracking-widest text-[#E5C158] shadow-subtle">
          <Lock className="w-3.5 h-3.5 text-gold" />
          <span>The Belladonna Private Office • By Invitation</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight">
          Ultra-High-Net-Worth <span className="italic font-serif font-light text-gold">Lifestyle Management</span>
        </h2>

        <p className="text-sm sm:text-base text-zinc-400 font-sans max-w-2xl mx-auto leading-relaxed">
          Extending beyond the palazzo walls into an exclusive lifestyle division for global families, family offices, and distinguished principals.
        </p>

        {/* Gated Assurance Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>Strict NDA Discretion</span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            <span>24/7 Global Dispatch</span>
          </div>
          <span className="text-zinc-700">•</span>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-gold" />
            <span>Dedicated Managing Director</span>
          </div>
        </div>
      </div>

      {/* Hero Visual Card: Lake Como & Private Aviation Asset */}
      <div className="relative z-10 rounded-[28px] overflow-hidden border border-gold/20 shadow-2xl h-[280px] sm:h-[380px] lg:h-[440px] group">
        <Image
          src="/images/belladonna_private_office.jpg"
          alt="The Belladonna Private Office UHNW Lifestyle Management in Milan and Lake Como"
          fill
          priority
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.88] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-black/40 to-transparent" />
        
        {/* Floating Editorial Watermark */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-label uppercase tracking-widest text-gold font-bold block">
              Private Office Headquarters • Milan
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-white">
              Sovereign Lifestyle &amp; Asset Discretion
            </h3>
          </div>

          <button
            onClick={() => onOpenInquiry(activePillarId)}
            className="px-6 py-3 rounded-full bg-gold text-charcoal font-label text-xs uppercase tracking-widest font-bold hover:bg-gold-light active:scale-95 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.35)] flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Request Private Office Access</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars Interactive Smooth Accordion & Feature Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left Column: Accordion Navigation Tabs */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-label uppercase tracking-widest text-zinc-500 font-semibold block px-2 mb-3">
            Core Mandate Pillars
          </span>

          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = pillar.id === activePillarId;

            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillarId(pillar.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900/90 border-gold shadow-[0_4px_25px_rgba(212,175,55,0.15)] ring-1 ring-gold/50'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                      isActive
                        ? 'bg-gold/20 border-gold text-gold'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 group-hover:text-gold'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gold font-bold">
                        {pillar.badgeNumber}
                      </span>
                      <span className="font-serif text-base sm:text-lg font-medium text-white group-hover:text-gold transition-colors">
                        {pillar.italianTitle}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-sans mt-0.5">{pillar.englishCategory}</p>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                    isActive ? 'bg-gold text-charcoal rotate-90' : 'text-zinc-500 group-hover:text-gold'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep-Dive Active Pillar Details Panel with Razor-Thin Gold Lines */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePillar.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-zinc-900/80 border border-gold/30 p-7 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle Ambient Gold Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

              {/* Pillar Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gold/15 border border-gold/40 text-gold">
                    <activePillar.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-label tracking-widest text-gold font-bold block">
                      Pillar {activePillar.badgeNumber} • {activePillar.englishCategory}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-white font-medium">
                      {activePillar.italianTitle}
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] font-label uppercase tracking-widest font-semibold">
                  {activePillar.tag}
                </span>
              </div>

              {/* Main Headline & Rich Copy */}
              <div className="space-y-3">
                <h4 className="text-lg sm:text-xl font-serif text-[#F3E5AB] font-normal">
                  {activePillar.headline}
                </h4>
                <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
                  {activePillar.copy}
                </p>
              </div>

              {/* Razor-Thin Gold Dividing Line */}
              <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

              {/* Key Highlights & Deliverables Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
                <div className="space-y-2.5">
                  <span className="font-label uppercase tracking-wider text-gold text-[11px] font-bold block">
                    Discreet Capabilities
                  </span>
                  <ul className="space-y-2 text-zinc-300">
                    {activePillar.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2.5">
                  <span className="font-label uppercase tracking-wider text-gold text-[11px] font-bold block">
                    Exclusive Deliverables
                  </span>
                  <ul className="space-y-2 text-zinc-300">
                    {activePillar.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom CTA Strip */}
              <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-zinc-400 font-sans">
                  Direct Mandate Protocol: <span className="text-gold font-mono">+39 02 8900 4500 (Ext. 1)</span>
                </div>

                <button
                  onClick={() => onOpenInquiry(activePillar.id)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gold text-charcoal font-label text-xs uppercase tracking-widest font-bold hover:bg-gold-light active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Submit Private Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Bottom Global Concierge Retainer Banner */}
      <div className="relative z-10 rounded-2xl bg-zinc-950/80 border border-gold/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center shrink-0">
            <Key className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-lg text-white font-medium">
              Annual Private Office Retainer
            </h4>
            <p className="text-xs text-zinc-400 font-sans max-w-xl">
              Strictly limited to 25 global families annually. Unrestricted 24/7 access to our Milanese logistics directors and worldwide asset network.
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenInquiry('retainer')}
          className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-label text-xs uppercase tracking-widest font-semibold transition-all whitespace-nowrap cursor-pointer"
        >
          Inquire for Retainer
        </button>
      </div>
    </section>
  );
}
