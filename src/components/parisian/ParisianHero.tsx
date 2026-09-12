'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Star, Calendar, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface ParisianHeroProps {
  onBookClick: () => void;
  selectedCurrency: 'EUR' | 'INR' | 'USD';
  onCurrencyChange: (currency: 'EUR' | 'INR' | 'USD') => void;
}

export function ParisianHero({ onBookClick, selectedCurrency, onCurrencyChange }: ParisianHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-luxury">
      {/* Background Editorial Image & Ambient Gradient */}
      <div className="relative h-[420px] sm:h-[500px] lg:h-[580px] w-full overflow-hidden">
        <Image
          src="/images/hero_salon.jpg"
          alt="Maison Fleurie Paris Salon Interior"
          fill
          priority
          className="object-cover object-center transform scale-105 transition-transform duration-1000 ease-out hover:scale-100"
        />
        {/* Soft diffused editorial overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-charcoal/20 mix-blend-multiply" />

        {/* Currency & Salon Location Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/90 glass-surface border border-border/60 text-xs font-medium shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            <span className="text-foreground tracking-wide font-label uppercase text-[11px]">
              Paris • 8ème Arrondissement
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-full bg-surface/90 glass-surface border border-border/60 shadow-sm">
            {(['EUR', 'INR', 'USD'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => onCurrencyChange(curr)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                  selectedCurrency === curr
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {curr === 'EUR' ? '€ EUR' : curr === 'INR' ? '₹ INR' : '$ USD'}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-4"
          >
            {/* Editorial Brand Crest */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-widest text-gold-hover">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Maison Fleurie • Haute Parfumerie & Beauté</span>
            </div>

            {/* Typography: Haute Couture Serif */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal tracking-tight text-foreground leading-[1.15]">
              Indulge in <span className="italic font-serif font-light text-gold">Haute Couture</span> Beauty & Wellness
            </h1>

            <p className="text-xs sm:text-sm text-foreground/80 font-sans max-w-lg leading-relaxed">
              Bespoke skincare rituals, Parisian balayage, and restorative massages delivered with the discretion and elegance of a private salon in Paris.
            </p>

            {/* CTA & Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onBookClick}
                className="shimmer-effect group flex items-center gap-3 px-6 py-3.5 rounded-full bg-champagne-gold bg-champagne-gold-hover text-charcoal font-semibold text-xs sm:text-sm tracking-wider uppercase shadow-gold-glow transition-all duration-300 transform active:scale-95"
              >
                <Calendar className="w-4 h-4 text-charcoal" />
                <span>Reserve VIP Treatment</span>
                <ArrowRight className="w-4 h-4 text-charcoal group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-surface/85 glass-surface border border-border/80 text-xs">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-foreground">4.98</span>
                <span className="text-muted-foreground text-[11px]">(2,400+ VIP Clients)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Editorial Value Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border border-t border-border bg-surface-muted/40 p-4 sm:p-6 text-center sm:text-left">
        <div className="px-4 py-2 flex items-center justify-center sm:justify-start gap-3">
          <div className="p-2.5 rounded-full bg-gold-surface border border-gold-border text-gold shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-label text-foreground">Private Suites</h4>
            <p className="text-[11px] text-muted-foreground">Soundproof marble treatment boudoirs</p>
          </div>
        </div>

        <div className="px-4 py-2 flex items-center justify-center sm:justify-start gap-3">
          <div className="p-2.5 rounded-full bg-blush-surface border border-blush text-rose-600 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-label text-foreground">Clean Botanical Care</h4>
            <p className="text-[11px] text-muted-foreground">Certified organic French formulations</p>
          </div>
        </div>

        <div className="px-4 py-2 flex items-center justify-center sm:justify-start gap-3">
          <div className="p-2.5 rounded-full bg-surface border border-border text-foreground shrink-0">
            <Heart className="w-4 h-4 text-gold" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider font-label text-foreground">VIP Concierge Service</h4>
            <p className="text-[11px] text-muted-foreground">Dedicated aesthetician & champagne reception</p>
          </div>
        </div>
      </div>
    </section>
  );
}
