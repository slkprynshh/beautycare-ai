'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronRight,
  LayoutDashboard,
  Moon,
  Sun,
  Award,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { ParisianHero } from '@/components/parisian/ParisianHero';
import { TreatmentMenu, Treatment, TREATMENTS } from '@/components/parisian/TreatmentMenu';
import { TherapistSection } from '@/components/parisian/TherapistSection';
import { VipBookingModal } from '@/components/parisian/VipBookingModal';
import { useStore } from '@/store/useStore';

export default function ParisianSpaPage() {
  const { theme, toggleTheme } = useStore();
  const [currency, setCurrency] = useState<'EUR' | 'INR' | 'USD'>('EUR');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);

  const handleOpenBooking = (treatment?: Treatment) => {
    setSelectedTreatment(treatment || TREATMENTS[0]);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-gold/30">
      {/* Top Haute Couture VIP Announcement & Quick Switch Bar */}
      <div className="bg-charcoal text-white text-[11px] py-2 px-4 border-b border-white/10 flex items-center justify-between font-label">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span className="tracking-widest uppercase text-gold">Maison Fleurie Paris</span>
          <span className="hidden sm:inline text-white/60">•</span>
          <span className="hidden sm:inline text-white/80">34 Rue du Faubourg Saint-Honoré, 75008 Paris</span>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-gold" />
            <span>Salon Operations Portal</span>
          </Link>
        </div>
      </div>

      {/* Luxury Navigation Header */}
      <header className="sticky top-0 z-40 bg-surface/90 glass-surface border-b border-border/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-surface border border-gold-border text-gold font-serif font-bold text-lg shadow-sm">
              MF
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-foreground block leading-tight">
                Maison Fleurie
              </span>
              <span className="text-[10px] uppercase font-label tracking-widest text-muted-foreground block">
                Haute Parfumerie & Beauté • Paris
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase font-label tracking-widest text-muted-foreground">
            <a href="#treatments" className="hover:text-gold transition-colors">
              Treatments
            </a>
            <a href="#artisans" className="hover:text-gold transition-colors">
              Master Artisans
            </a>
            <a href="#reviews" className="hover:text-gold transition-colors">
              Editorial Reviews
            </a>
            <a href="#location" className="hover:text-gold transition-colors">
              Location
            </a>
          </nav>

          {/* Actions: Theme Toggle + Book VIP CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => handleOpenBooking()}
              className="shimmer-effect px-4 sm:px-5 py-2.5 rounded-full bg-champagne-gold bg-champagne-gold-hover text-charcoal font-semibold text-xs tracking-wider uppercase shadow-gold-glow transition-all active:scale-95"
            >
              Book VIP
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <ParisianHero
          onBookClick={() => handleOpenBooking()}
          selectedCurrency={currency}
          onCurrencyChange={(curr) => setCurrency(curr)}
        />

        {/* Treatment Menu Catalog */}
        <div id="treatments">
          <TreatmentMenu
            onSelectTreatment={(treatment) => handleOpenBooking(treatment)}
            currency={currency}
          />
        </div>

        {/* Master Artisans Section */}
        <div id="artisans">
          <TherapistSection onBookSpecialist={() => handleOpenBooking()} />
        </div>

        {/* Editorial Press & VIP Testimonials */}
        <section id="reviews" className="py-10 space-y-8 border-t border-border">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-widest text-gold-hover">
              <Star className="w-3.5 h-3.5 text-gold" />
              <span>Editorial Acclaim</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground tracking-tight">
              Celebrated by Parisian Tastemakers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-surface border border-border p-6 space-y-4 shadow-luxury">
              <span className="font-serif italic text-2xl text-gold font-bold">VOGUE Paris</span>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                “The gold standard in French skin longevity. Maison Fleurie seamlessly blends historic Parisian discretion with state-of-the-art peptide cryo rituals.”
              </p>
              <div className="pt-2 border-t border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-[11px] font-semibold text-foreground">Summer Beauty Issue</span>
              </div>
            </div>

            <div className="rounded-3xl bg-surface border border-border p-6 space-y-4 shadow-luxury">
              <span className="font-serif italic text-2xl text-gold font-bold">ELLE France</span>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                “An oasis of tranquil beauty in the 8th Arrondissement. The 3-tap VIP reservation experience sets an unprecedented standard of effortless luxury.”
              </p>
              <div className="pt-2 border-t border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-[11px] font-semibold text-foreground">Top 10 Spas in Paris</span>
              </div>
            </div>

            <div className="rounded-3xl bg-surface border border-border p-6 space-y-4 shadow-luxury">
              <span className="font-serif italic text-2xl text-gold font-bold">Harper’s BAZAAR</span>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                “From the Laurent-Perrier welcome to the immaculate Carrara private suites, Maison Fleurie provides the ultimate VIP wellness sanctuary.”
              </p>
              <div className="pt-2 border-t border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-[11px] font-semibold text-foreground">Luxury Travel & Spa Guide</span>
              </div>
            </div>
          </div>
        </section>

        {/* Location & Concierge Reception Bar */}
        <section id="location" className="rounded-3xl bg-surface-muted border border-border p-6 sm:p-10 shadow-luxury flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border text-xs font-label uppercase tracking-widest text-foreground">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>Private Salons in Paris</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif text-foreground">
              Visit Maison Fleurie Paris
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Conveniently located near Place de la Madeleine and Rue Royale. Valet parking and private entrance available upon request for VIP clientele.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold" />
                <span>Mon–Sat: 09:30 – 20:00</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-gold" />
                <span>+33 1 42 68 55 00</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => handleOpenBooking()}
              className="shimmer-effect w-full sm:w-auto px-8 py-4 rounded-full bg-champagne-gold bg-champagne-gold-hover text-charcoal font-bold text-xs uppercase tracking-wider shadow-gold-glow transition-all"
            >
              Reserve VIP Suite
            </button>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto text-center px-6 py-4 rounded-full bg-surface border border-border hover:bg-surface-elevated text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Salon Admin View
            </Link>
          </div>
        </section>
      </main>

      {/* Haute Couture Footer */}
      <footer className="border-t border-border mt-16 py-12 bg-surface text-center space-y-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold-surface border border-gold-border text-gold font-serif font-bold text-sm flex items-center justify-center">
            MF
          </div>
          <span className="font-serif text-base font-medium text-foreground">Maison Fleurie</span>
        </div>
        <p className="max-w-md mx-auto text-[11px] leading-relaxed">
          Haute Couture Beauty, Spa & Aesthetic Wellness. 34 Rue du Faubourg Saint-Honoré, 75008 Paris, France.
        </p>
        <p className="text-[10px] text-muted-foreground/60">
          © 2026 Maison Fleurie Paris. Powered by VertOps Beauty Care AI.
        </p>
      </footer>

      {/* Frictionless 3-Tap VIP Booking Modal */}
      <VipBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialTreatment={selectedTreatment}
        currency={currency}
      />
    </div>
  );
}
