'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  Star,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Heart,
  Sparkle,
  ChevronDown,
} from 'lucide-react';
import { LuxuryCurrency } from './TreatmentMenu';

interface ParisianHeroProps {
  onBookClick: () => void;
  onOpenQuiz?: () => void;
  selectedCurrency: LuxuryCurrency;
  onCurrencyChange: (currency: LuxuryCurrency) => void;
}

export function ParisianHero({
  onBookClick,
  onOpenQuiz,
  selectedCurrency,
  onCurrencyChange,
}: ParisianHeroProps) {
  const [heroView, setHeroView] = useState<'interior' | 'macro'>('interior');
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const currencies: { code: LuxuryCurrency; label: string; symbol: string }[] = [
    { code: 'EUR', label: 'EUR (€)', symbol: '€' },
    { code: 'USD', label: 'USD ($)', symbol: '$' },
    { code: 'GBP', label: 'GBP (£)', symbol: '£' },
    { code: 'AED', label: 'AED (AED)', symbol: 'AED' },
    { code: 'INR', label: 'INR (₹)', symbol: '₹' },
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* 50/50 Split Luxury Hero Container */}
      <section className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] border border-border/80 bg-surface shadow-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[640px]">
          
          {/* Left Column: Solid Warm Cream / Alabaster Background with High-Contrast Editorial Content */}
          <div className="lg:col-span-6 bg-[#FAF8F5] dark:bg-[#141311] p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-border/70">
            
            {/* Top Controls: Location & Minimalist Currency Dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-surface/90 border border-gold-border/60 text-xs shadow-subtle">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span className="text-foreground tracking-wider font-label uppercase text-[10px] font-semibold">
                  Milan • Via Monte Napoleone, 15
                </span>
              </div>

              {/* Minimalist 5-Currency Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-surface/90 border border-border/70 text-xs font-semibold text-foreground shadow-subtle hover:border-gold-border transition-colors font-label"
                >
                  <span>{selectedCurrency}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gold transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isCurrencyDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 z-30 w-36 rounded-2xl bg-surface border border-border shadow-luxury p-1 space-y-0.5"
                    >
                      {currencies.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            onCurrencyChange(c.code);
                            setIsCurrencyDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans transition-colors ${
                            selectedCurrency === c.code
                              ? 'bg-gold-surface text-gold font-semibold'
                              : 'text-foreground hover:bg-surface-muted'
                          }`}
                        >
                          <span>{c.label}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{c.symbol}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Main Editorial Text Hierarchy */}
            <div className="space-y-5 my-auto py-2">
              
              {/* Top Editorial Row: Brand Crest & Star Rating Anchored */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-surface border border-gold-border text-[11px] font-label uppercase tracking-widest text-gold-hover font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>Villa Belladonna • Milan</span>
                </div>

                {/* Editorial Star Rating Anchored Directly Inside Container */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border/80 shadow-subtle text-xs">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-foreground">4.99</span>
                  <span className="text-zinc-600 dark:text-zinc-400 text-[10px]">(2,800+ VIP Clients)</span>
                </div>
              </div>

              {/* High-Contrast Serif H1 Headline with Italicized Accents */}
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-serif font-normal tracking-tight text-[#1A1715] dark:text-[#FAF8F5] leading-[1.14]">
                Indulge in <span className="italic font-serif font-light text-[#A88659] dark:text-gold">Milanese Beauty</span> &amp; Longevity
              </h1>

              {/* Perspective Switcher Toggle Tags Anchored Below H1 */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[11px] uppercase font-label tracking-widest text-zinc-600 dark:text-zinc-400 font-semibold">
                  Palazzo Experience:
                </span>
                <div className="inline-flex items-center p-1 rounded-full bg-surface border border-border/80 shadow-subtle text-[11px] font-label uppercase tracking-wider">
                  <button
                    onClick={() => setHeroView('interior')}
                    className={`px-3 py-1 rounded-full transition-all ${
                      heroView === 'interior'
                        ? 'bg-charcoal text-white shadow-sm font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Palazzo
                  </button>
                  <button
                    onClick={() => setHeroView('macro')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all ${
                      heroView === 'macro'
                        ? 'bg-champagne-gold text-charcoal shadow-sm font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Sparkle className="w-3 h-3 text-gold" />
                    <span>24k Ritual</span>
                  </button>
                </div>
              </div>

              {/* Crisp Sans-Serif Body Description with High Contrast */}
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed max-w-lg font-normal">
                Bespoke Tuscan skincare rituals, 24k gold bio-peptides, and volcanic hot stone recovery delivered with the discretion and timeless elegance of an Italian palazzo near Via Monte Napoleone.
              </p>

              {/* CTA Button Group */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {/* Primary Solid Dark VIP Button */}
                <button
                  onClick={onBookClick}
                  className="btn-luxury-dark group flex items-center gap-3 px-7 py-4 rounded-full font-label text-xs uppercase tracking-widest font-bold active:scale-95 shadow-luxury"
                >
                  <Calendar className="w-4 h-4 text-gold group-hover:scale-110 transition-transform duration-300" />
                  <span>Book VIP Treatment</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>

                {/* Interactive Ritual Quiz Trigger */}
                {onOpenQuiz && (
                  <button
                    onClick={onOpenQuiz}
                    className="px-5 py-3.5 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-wider font-bold text-gold-hover hover:bg-gold-surface/80 transition-all duration-300 shadow-subtle flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    <span>Ritual Quiz</span>
                  </button>
                )}

                {/* Secondary Exploration Link */}
                <a
                  href="#treatments"
                  className="px-5 py-3.5 rounded-full bg-white dark:bg-surface border border-border hover:border-gold-border text-xs font-label uppercase tracking-wider font-semibold text-foreground hover:text-gold transition-all duration-300 shadow-subtle"
                >
                  Ceremonies
                </a>
              </div>
            </div>

            {/* Bottom Luxury Reassurance Ribbon */}
            <div className="pt-5 mt-5 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span className="font-medium">Organic Tuscan Bio-Ferments</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="font-medium">Accademia Certified Masters</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-Resolution Full-Bleed Imagery */}
          <div className="lg:col-span-6 relative min-h-[380px] lg:min-h-[640px] overflow-hidden group bg-surface-muted">
            <AnimatePresence mode="wait">
              {heroView === 'interior' ? (
                <motion.div
                  key="interior"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/belladonna_hero.jpg"
                    alt="Villa Belladonna Milan Palazzo Interior near Via Monte Napoleone"
                    fill
                    priority
                    className="object-cover object-center img-luxury-zoom"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="macro"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/belladonna_ritual.jpg"
                    alt="24k Gold Peptide Ritual at Villa Belladonna"
                    fill
                    priority
                    className="object-cover object-center img-luxury-zoom"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />

            {/* Floating Luxury Badges */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
              <div className="px-4 py-2 rounded-2xl bg-surface/90 glass-surface border border-border/80 text-xs shadow-luxury pointer-events-auto flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold animate-ping" />
                <span className="font-serif italic font-medium text-foreground">
                  {heroView === 'interior' ? 'Carrara Marble Suites' : '24k Bio-Peptide Elixirs'}
                </span>
              </div>

              <div className="px-3.5 py-1.5 rounded-full bg-charcoal/80 text-white text-[10px] font-label uppercase tracking-widest backdrop-blur-md">
                Via Monte Napoleone, 15 • Milan
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3 Interactive Feature Points with Equalized Heights and Soft Diffused Drop Shadows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        
        {/* Card 1: Private Suites */}
        <div className="group h-full flex flex-col justify-between rounded-[24px] bg-surface border border-border p-7 sm:p-8 transition-all duration-500 hover:border-gold-border hover:shadow-luxury hover:-translate-y-1.5 cursor-default">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gold-surface border border-gold-border/60 text-gold group-hover:scale-110 transition-transform duration-500 shadow-subtle">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-label uppercase tracking-widest text-gold font-bold">
                01 • Discretion
              </span>
            </div>
            <h3 className="text-xl font-serif text-foreground font-medium mb-2 group-hover:text-gold-hover transition-colors">
              Private Suites in <span className="italic font-serif font-light text-gold">Carrara Marble</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed sm:leading-loose">
              Soundproof Carrara marble suites designed for absolute privacy, acoustic calm, and bespoke Italian botanical aromatherapy.
            </p>
          </div>
        </div>

        {/* Card 2: 24k Gold & Botanical Care */}
        <div className="group h-full flex flex-col justify-between rounded-[24px] bg-surface border border-border p-7 sm:p-8 transition-all duration-500 hover:border-gold-border hover:shadow-luxury hover:-translate-y-1.5 cursor-default">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-blush-surface border border-blush text-[#B45309] dark:text-gold group-hover:scale-110 transition-transform duration-500 shadow-subtle">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-label uppercase tracking-widest text-gold font-bold">
                02 • Purity
              </span>
            </div>
            <h3 className="text-xl font-serif text-foreground font-medium mb-2 group-hover:text-gold-hover transition-colors">
              24k Gold &amp; <span className="italic font-serif font-light text-gold">Bio-Peptides</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed sm:leading-loose">
              Certified organic Tuscan bio-ferments and pure 24-karat gold leaf micro-infusions for cellular rejuvenation.
            </p>
          </div>
        </div>

        {/* Card 3: VIP Concierge */}
        <div className="group h-full flex flex-col justify-between rounded-[24px] bg-surface border border-border p-7 sm:p-8 transition-all duration-500 hover:border-gold-border hover:shadow-luxury hover:-translate-y-1.5 cursor-default">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-surface-muted border border-border text-foreground group-hover:scale-110 transition-transform duration-500 shadow-subtle">
                <Heart className="w-5 h-5 text-gold" />
              </div>
              <span className="text-[10px] font-label uppercase tracking-widest text-gold font-bold">
                03 • Bespoke Service
              </span>
            </div>
            <h3 className="text-xl font-serif text-foreground font-medium mb-2 group-hover:text-gold-hover transition-colors">
              VIP Concierge &amp; <span className="italic font-serif font-light text-gold">Sparkling Reception</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed sm:leading-loose">
              Dedicated master aesthetician, seamless WhatsApp reservation concierge, and chilled sparkling wine welcome.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

