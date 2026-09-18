'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  List,
  LayoutGrid,
} from 'lucide-react';

export type LuxuryCurrency = 'EUR' | 'USD' | 'INR' | 'AED' | 'GBP';

export interface Treatment {
  id: string;
  title: string;
  subtitle: string;
  italianTitle?: string; // backwards compatibility alias
  category: 'facials' | 'body' | 'hair' | 'nails' | 'packages';
  priceEUR: number;
  priceUSD: number;
  priceINR: number;
  priceAED: number;
  priceGBP: number;
  durationMinutes: number;
  description: string;
  highlights: string[];
  image: string;
  tag?: string;
}

export const TREATMENTS: Treatment[] = [
  {
    id: 'signature-facial',
    title: 'The Signature Villa Belladonna Facial',
    subtitle: 'Signature Gold Facial & Cellular Longevity',
    category: 'facials',
    priceEUR: 240,
    priceUSD: 260,
    priceINR: 21500,
    priceAED: 960,
    priceGBP: 205,
    durationMinutes: 90,
    description: 'A transformative multi-step ritual featuring gentle diamond micro-exfoliation, 24k gold peptide infusion, and cryogenic lymphatic drainage for an ethereal Milanese glow.',
    highlights: ['Diamond Micro-Peel', '24k Gold Peptides', 'Cryo Sculpting Massages'],
    image: '/images/facial.jpg',
    tag: 'Villa Favorite',
  },
  {
    id: 'aromatherapy-massage',
    title: 'Volcanic Hot Stone & Botanical Massage',
    subtitle: 'Holistic Basalt Stones & Botanical Therapy',
    category: 'body',
    priceEUR: 195,
    priceUSD: 210,
    priceINR: 17500,
    priceAED: 780,
    priceGBP: 165,
    durationMinutes: 60,
    description: 'Therapeutic full-body relaxation utilizing warm botanical oils, paired with smooth heated volcanic basalt stones and targeted acupressure.',
    highlights: ['Warm Botanical Oils', 'Volcanic Basalt Stones', 'Acupressure Alignment'],
    image: '/images/massage.jpg',
    tag: 'Bestseller',
  },
  {
    id: 'haute-coiffure',
    title: 'Haute Hair Styling & Balayage',
    subtitle: 'Dimensional Balayage & Caviar Keratin Gloss',
    category: 'hair',
    priceEUR: 150,
    priceUSD: 165,
    priceINR: 13500,
    priceAED: 600,
    priceGBP: 130,
    durationMinutes: 75,
    description: 'Hand-painted dimensional balayage paired with caviar-infused restorative hair gloss and signature luxury blowout.',
    highlights: ['Custom Color Mixing', 'Caviar Hair Mask', 'Effortless Natural Waves'],
    image: '/images/hair.jpg',
    tag: 'Editorial Pick',
  },
  {
    id: 'mani-pedi-luxe',
    title: 'Carrara Luxe Manicure & Pedicure',
    subtitle: 'Restorative Rose Quartz & Paraffin Therapy',
    category: 'nails',
    priceEUR: 90,
    priceUSD: 98,
    priceINR: 8000,
    priceAED: 360,
    priceGBP: 78,
    durationMinutes: 45,
    description: 'Comprehensive nail care including rose quartz exfoliation, warm paraffin hydration glove, cuticle perfecting, and long-wear sheer enamel.',
    highlights: ['Rose Quartz Scrub', 'Paraffin Infusion', 'Gel / Breathable Enamel'],
    image: '/images/manicure.jpg',
    tag: 'VIP Essential',
  },
  {
    id: 'eye-contour',
    title: 'Eye Contour Micro-Sculpt & Brightening',
    subtitle: 'Targeted Peptide & Micro-Current Eye Lifting',
    category: 'facials',
    priceEUR: 75,
    priceUSD: 82,
    priceINR: 6700,
    priceAED: 300,
    priceGBP: 65,
    durationMinutes: 30,
    description: 'Targeted cooling eye therapy utilizing peptides, micro-current lifting, and organic cornflower compresses to erase dark circles and puffiness.',
    highlights: ['Micro-current Lifting', 'Organic Cornflower Mask', 'Caffeine Serum Glow'],
    image: '/images/facial.jpg',
  },
  {
    id: 'spa-day-package',
    title: 'Imperial Villa Belladonna Day Ritual',
    subtitle: 'Complete Half-Day Private Suite Sanctuary',
    category: 'packages',
    priceEUR: 350,
    priceUSD: 385,
    priceINR: 31500,
    priceAED: 1400,
    priceGBP: 300,
    durationMinutes: 150,
    description: 'The ultimate half-day private retreat: Signature facial, 60-min warm volcanic stone massage, luxury manicure, accompanied by chilled sparkling wine and artisanal treats.',
    highlights: ['Full 150-min Private Suite', 'Signature Facial & Massage', 'Sparkling Wine & Treat Service'],
    image: '/images/belladonna_hero.jpg',
    tag: 'Ultra-Exclusive',
  },
];

interface TreatmentMenuProps {
  onSelectTreatment: (treatment: Treatment) => void;
  currency: LuxuryCurrency;
}

export function TreatmentMenu({ onSelectTreatment, currency }: TreatmentMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<'editorial' | 'cards'>('editorial');

  const categories = [
    { id: 'all', label: 'All Ceremonies' },
    { id: 'facials', label: 'Facial Longevity' },
    { id: 'body', label: 'Body & Hot Stones' },
    { id: 'hair', label: 'Haute Hair Styling' },
    { id: 'nails', label: 'Nails & Hand Care' },
    { id: 'packages', label: 'Imperial Retreats' },
  ];

  const filteredTreatments = activeCategory === 'all'
    ? TREATMENTS
    : TREATMENTS.filter((t) => t.category === activeCategory);

  const formatPrice = (treatment: Treatment) => {
    switch (currency) {
      case 'EUR':
        return `€${treatment.priceEUR}`;
      case 'USD':
        return `$${treatment.priceUSD}`;
      case 'INR':
        return `₹${treatment.priceINR.toLocaleString('en-IN')}`;
      case 'AED':
        return `AED ${treatment.priceAED.toLocaleString()}`;
      case 'GBP':
        return `£${treatment.priceGBP}`;
      default:
        return `€${treatment.priceEUR}`;
    }
  };

  return (
    <section className="space-y-10 sm:space-y-12 py-12 sm:py-16 scroll-mt-28">
      {/* Section Header with Elevated Typography */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-widest text-gold-hover">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>The Treatment Menu</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground tracking-tight">
          Curated <span className="italic font-serif font-light text-gold">Aesthetic Ceremonies</span> &amp; Rituals
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sans max-w-xl mx-auto leading-relaxed font-normal">
          Each ceremony is individually formulated using active Mediterranean bio-peptides, 24k gold, and restorative tension release techniques.
        </p>
      </div>

      {/* Control Bar: Categories & Layout Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 px-2 no-scrollbar w-full sm:w-auto justify-start sm:justify-center">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-label uppercase tracking-wider font-semibold transition-all whitespace-nowrap min-h-[40px] ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-gold-border'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Layout Mode Switcher (Editorial Menu vs Cards) */}
        <div className="flex items-center p-1 rounded-full bg-surface border border-border shadow-subtle text-xs font-label">
          <button
            onClick={() => setLayoutMode('editorial')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              layoutMode === 'editorial'
                ? 'bg-charcoal text-white shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Editorial Menu List"
          >
            <List className="w-3.5 h-3.5 text-gold" />
            <span className="hidden sm:inline">Editorial List</span>
          </button>
          <button
            onClick={() => setLayoutMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              layoutMode === 'cards'
                ? 'bg-charcoal text-white shadow-sm font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Visual Cards"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-gold" />
            <span className="hidden sm:inline">Visual Cards</span>
          </button>
        </div>
      </div>

      {/* Main Treatment Listings */}
      <AnimatePresence mode="wait">
        {layoutMode === 'editorial' ? (
          /* Editorial Menu Layout */
          <motion.div
            key="editorial-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="rounded-[28px] sm:rounded-[36px] bg-surface border border-border p-6 sm:p-12 shadow-luxury divide-y divide-border/70"
          >
            {filteredTreatments.map((treatment, idx) => (
              <motion.div
                key={treatment.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="group py-8 sm:py-10 first:pt-2 last:pb-2 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-surface-muted/30 -mx-4 sm:-mx-8 px-4 sm:px-8 rounded-2xl transition-all duration-300"
              >
                {/* Left Side */}
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs uppercase tracking-widest font-label font-bold text-gold">
                      {treatment.subtitle}
                    </span>
                    {treatment.tag && (
                      <span className="px-2.5 py-0.5 rounded-full bg-gold-surface border border-gold-border/80 text-[10px] font-label font-semibold uppercase tracking-wider text-gold-hover">
                        {treatment.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-serif text-foreground font-medium group-hover:text-gold-hover transition-colors">
                    {treatment.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                    {treatment.description}
                  </p>

                  {/* Highlights Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {treatment.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-muted border border-border text-[11px] text-foreground/80 font-sans"
                      >
                        <CheckCircle2 className="w-3 h-3 text-gold" />
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/60">
                  <div className="text-left lg:text-right space-y-1">
                    <div className="text-2xl sm:text-3xl font-serif font-semibold text-foreground tracking-tight transition-all duration-300">
                      {formatPrice(treatment)}
                    </div>
                    <div className="flex items-center lg:justify-end gap-1.5 text-xs text-muted-foreground font-sans">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      <span>{treatment.durationMinutes} Minutes</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTreatment(treatment)}
                    className="btn-luxury-dark group/btn flex items-center gap-2.5 px-6 py-3 rounded-full font-label text-xs uppercase tracking-wider font-semibold active:scale-95 shadow-sm"
                  >
                    <span>Reserve VIP</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Visual Cards Layout */
          <motion.div
            key="cards-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
          >
            {filteredTreatments.map((treatment) => (
              <motion.div
                layout
                key={treatment.id}
                className="group flex flex-col rounded-[26px] bg-surface border border-border hover:border-gold-border transition-all duration-500 shadow-luxury hover:shadow-luxury-hover hover:-translate-y-1.5 overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden bg-surface-muted">
                  <Image
                    src={treatment.image}
                    alt={treatment.title}
                    fill
                    className="object-cover object-center img-luxury-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-80 pointer-events-none" />

                  {treatment.tag && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface/90 glass-surface border border-border/80 text-[10px] font-label font-bold uppercase tracking-wider text-gold shadow-sm">
                      {treatment.tag}
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal/80 text-white text-[11px] font-medium backdrop-blur-md">
                    <Clock className="w-3 h-3 text-gold" />
                    <span>{treatment.durationMinutes} mins</span>
                  </div>

                  <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-surface/95 glass-surface text-foreground font-serif text-base font-semibold tracking-tight shadow-sm">
                    {formatPrice(treatment)}
                  </div>
                </div>

                {/* Treatment Body Content */}
                <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <p className="text-[11px] uppercase tracking-widest text-gold font-label font-semibold">
                      {treatment.subtitle}
                    </p>
                    <h3 className="text-2xl font-serif text-foreground font-medium group-hover:text-gold-hover transition-colors">
                      {treatment.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-sans leading-relaxed line-clamp-3">
                      {treatment.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-border/60">
                    {treatment.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onSelectTreatment(treatment)}
                      className="btn-luxury-dark w-full flex items-center justify-between px-6 py-3.5 rounded-full font-label text-xs uppercase tracking-wider font-semibold group-hover:border-transparent active:scale-95 shadow-sm"
                    >
                      <span>Discover &amp; Book</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


