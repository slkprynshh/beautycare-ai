'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, ArrowRight, CheckCircle2, Star } from 'lucide-react';

export interface Treatment {
  id: string;
  title: string;
  frenchTitle: string;
  category: 'facials' | 'body' | 'hair' | 'nails' | 'packages';
  priceEUR: number;
  priceINR: number;
  priceUSD: number;
  durationMinutes: number;
  description: string;
  highlights: string[];
  image: string;
  tag?: string;
}

export const TREATMENTS: Treatment[] = [
  {
    id: 'signature-facial',
    title: 'The Signature Parisian Facial',
    frenchTitle: 'Soin Signature Haute Couture',
    category: 'facials',
    priceEUR: 240,
    priceINR: 21500,
    priceUSD: 260,
    durationMinutes: 90,
    description: 'A transformative multi-step ritual featuring gentle diamond micro-exfoliation, 24k gold peptide infusion, and cryogenic lymphatic drainage for an ethereal glow.',
    highlights: ['Diamond Micro-Peel', '24k Gold Peptides', 'Cryo Sculpting Massages'],
    image: '/images/facial.jpg',
    tag: 'Maison Favorite',
  },
  {
    id: 'aromatherapy-massage',
    title: 'Parisian Aromatherapy & Hot Stone Massage',
    frenchTitle: 'Massage Relaxant aux Pierres Chaudes',
    category: 'body',
    priceEUR: 195,
    priceINR: 17500,
    priceUSD: 210,
    durationMinutes: 60,
    description: 'Therapeutic full-body relaxation utilizing warm lavender and Neroli botanical oils hand-pressed in Provence, tailored to melt deep muscle tension.',
    highlights: ['Warm Provencal Oils', 'Volcanic Basalt Stones', 'Acupressure Alignment'],
    image: '/images/massage.jpg',
    tag: 'Bestseller',
  },
  {
    id: 'haute-coiffure',
    title: 'Haute Coiffure & French Balayage',
    frenchTitle: 'Balayage Parisien & Soin Kératine',
    category: 'hair',
    priceEUR: 150,
    priceINR: 13500,
    priceUSD: 165,
    durationMinutes: 75,
    description: 'Hand-painted dimensional French balayage paired with caviar-infused restorative hair gloss and signature Parisian effortless wavy blowout.',
    highlights: ['Custom Color Mixing', 'Caviar Hair Mask', 'Iconic Parisian Waves'],
    image: '/images/hair.jpg',
    tag: 'Editorial Pick',
  },
  {
    id: 'mani-pedi-luxe',
    title: 'Mani-Pedi Carrara Luxe',
    frenchTitle: 'Beauté des Mains & Pieds Impériale',
    category: 'nails',
    priceEUR: 90,
    priceINR: 8000,
    priceUSD: 98,
    durationMinutes: 45,
    description: 'Comprehensive nail care including rose quartz exfoliation, warm paraffin hydration glove, cuticles perfecting, and long-wear sheer French enamel.',
    highlights: ['Rose Quartz Scrub', 'Paraffin Infusion', 'Gel / Breathable Enamel'],
    image: '/images/manicure.jpg',
    tag: 'VIP Essential',
  },
  {
    id: 'eye-contour',
    title: 'Eye Contour Micro-Sculpt & Brightening',
    frenchTitle: 'Soin Éclat Contour des Yeux',
    category: 'facials',
    priceEUR: 75,
    priceINR: 6700,
    priceUSD: 82,
    durationMinutes: 30,
    description: 'Targeted cooling eye therapy utilizing peptides, micro-current lifting, and organic cornflower compresses to erase dark circles and puffiness.',
    highlights: ['Micro-current Lifting', 'Organic Cornflower Mask', 'Caffeine Serum Glow'],
    image: '/images/facial.jpg',
  },
  {
    id: 'spa-day-package',
    title: 'Imperial Parisian Spa Day Ritual',
    frenchTitle: 'Journée d’Évasion Impériale',
    category: 'packages',
    priceEUR: 350,
    priceINR: 31500,
    priceUSD: 385,
    durationMinutes: 150,
    description: 'The ultimate half-day private retreat: Signature facial, 60-min warm stone massage, luxury manicure, accompanied by Laurent-Perrier Champagne and French macarons.',
    highlights: ['Full 150-min Private Suite', 'Signature Facial & Massage', 'Champagne & Macaron Service'],
    image: '/images/hero_salon.jpg',
    tag: 'Ultra-Exclusive',
  },
];

interface TreatmentMenuProps {
  onSelectTreatment: (treatment: Treatment) => void;
  currency: 'EUR' | 'INR' | 'USD';
}

export function TreatmentMenu({ onSelectTreatment, currency }: TreatmentMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Treatments' },
    { id: 'facials', label: 'Facial Rituals' },
    { id: 'body', label: 'Body & Massage' },
    { id: 'hair', label: 'Haute Coiffure' },
    { id: 'nails', label: 'Nails & Glow' },
    { id: 'packages', label: 'Imperial Packages' },
  ];

  const filteredTreatments = activeCategory === 'all'
    ? TREATMENTS
    : TREATMENTS.filter((t) => t.category === activeCategory);

  const formatPrice = (treatment: Treatment) => {
    switch (currency) {
      case 'EUR':
        return `€${treatment.priceEUR}`;
      case 'INR':
        return `₹${treatment.priceINR.toLocaleString('en-IN')}`;
      case 'USD':
        return `$${treatment.priceUSD}`;
      default:
        return `€${treatment.priceEUR}`;
    }
  };

  return (
    <section className="space-y-8 py-8">
      {/* Section Header with Haute Typography */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-widest text-gold-hover">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>The Treatment Menu</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground tracking-tight">
          Curated Aesthetic Ceremonies
        </h2>
        <p className="text-sm text-muted-foreground font-sans max-w-lg mx-auto">
          Every treatment is custom formulated using pure active botanicals, French peptides, and relaxing sensory techniques.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2 px-2 no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all whitespace-nowrap min-h-[38px] ${
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

      {/* Treatments Grid with Generous Whitespace */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredTreatments.map((treatment) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              key={treatment.id}
              className="group flex flex-col rounded-3xl bg-surface border border-border hover:border-gold-border transition-all duration-300 shadow-luxury hover:shadow-luxury-hover overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden bg-surface-muted">
                <Image
                  src={treatment.image}
                  alt={treatment.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-80" />

                {/* Tag */}
                {treatment.tag && (
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-surface/90 glass-surface border border-border/80 text-[11px] font-label font-semibold uppercase tracking-wider text-gold shadow-sm">
                    {treatment.tag}
                  </div>
                )}

                {/* Duration Badge */}
                <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-charcoal/80 text-white text-[11px] font-medium backdrop-blur-md">
                  <Clock className="w-3 h-3 text-gold" />
                  <span>{treatment.durationMinutes} mins</span>
                </div>

                {/* Price in Overlay */}
                <div className="absolute bottom-3.5 right-3.5 px-3 py-1 rounded-full bg-surface/95 glass-surface text-foreground font-serif text-sm font-semibold tracking-tight shadow-sm">
                  {formatPrice(treatment)}
                </div>
              </div>

              {/* Treatment Body Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-widest text-gold font-label font-medium">
                    {treatment.frenchTitle}
                  </p>
                  <h3 className="text-xl font-serif text-foreground font-medium group-hover:text-gold-hover transition-colors">
                    {treatment.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed line-clamp-3">
                    {treatment.description}
                  </p>
                </div>

                {/* Treatment Highlights */}
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  {treatment.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-foreground/80">
                      <CheckCircle2 className="w-3 h-3 text-gold shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="pt-3">
                  <button
                    onClick={() => onSelectTreatment(treatment)}
                    className="w-full flex items-center justify-between px-5 py-3 rounded-full bg-surface-muted hover:bg-gold-surface border border-border hover:border-gold-border text-foreground font-label text-xs uppercase tracking-wider font-semibold group-hover:bg-champagne-gold group-hover:text-charcoal group-hover:border-transparent transition-all duration-300 shadow-sm"
                  >
                    <span>Discover & Book</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
