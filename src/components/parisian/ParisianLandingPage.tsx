'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  Clock,
  Phone,
  LayoutDashboard,
  Moon,
  Sun,
  Star,
  ArrowRight,
  Menu,
  X,
  ShieldCheck,
  ShoppingBag,
  MessageCircle,
  Key,
} from 'lucide-react';
import { ParisianHero } from '@/components/parisian/ParisianHero';
import { TreatmentMenu, Treatment, TREATMENTS, LuxuryCurrency } from '@/components/parisian/TreatmentMenu';
import { TherapistSection } from '@/components/parisian/TherapistSection';
import { VipBookingModal } from '@/components/parisian/VipBookingModal';
import { RitualQuizModal } from '@/components/belladonna/RitualQuizModal';
import { LaBottegaSection } from '@/components/belladonna/LaBottegaSection';
import { TactileVideoHero } from '@/components/belladonna/TactileVideoHero';
import { ClinicalBeforeAfterSlider } from '@/components/belladonna/ClinicalBeforeAfterSlider';
import { PalazzoAmbiencePlayer } from '@/components/belladonna/PalazzoAmbiencePlayer';
import { LuxuryCartDrawer, CartItem } from '@/components/belladonna/LuxuryCartDrawer';
import { PrivateOfficeSection } from '@/components/belladonna/PrivateOfficeSection';
import { PrivateOfficeInquiryModal } from '@/components/belladonna/PrivateOfficeInquiryModal';
import { ConciergeHubModal } from '@/components/belladonna/ConciergeHubModal';
import { useStore } from '@/store/useStore';

export function ParisianLandingPage() {
  const { theme, toggleTheme } = useStore();
  const [currency, setCurrency] = useState<LuxuryCurrency>('EUR');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConciergeHubOpen, setIsConciergeHubOpen] = useState(false);
  const [isPrivateOfficeInquiryOpen, setIsPrivateOfficeInquiryOpen] = useState(false);
  const [selectedPrivateOfficePillar, setSelectedPrivateOfficePillar] = useState<'viaggi' | 'accesso' | 'gestione' | 'acquisizioni' | 'retainer'>('retainer');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);

  const handleOpenBooking = (treatment?: Treatment) => {
    setSelectedTreatment(treatment || TREATMENTS[0]);
    setIsBookingOpen(true);
    setIsOffCanvasOpen(false);
    setIsQuizOpen(false);
    setIsConciergeHubOpen(false);
  };

  const handleOpenPrivateOfficeInquiry = (pillar?: 'viaggi' | 'accesso' | 'gestione' | 'acquisizioni' | 'retainer') => {
    setSelectedPrivateOfficePillar(pillar || 'retainer');
    setIsPrivateOfficeInquiryOpen(true);
    setIsConciergeHubOpen(false);
    setIsOffCanvasOpen(false);
  };

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i)));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-gold/30 relative">
      {/* Top Haute Couture VIP Announcement */}
      <div className="bg-[#1A1715] text-[#FAF8F5] text-[11px] py-2.5 px-4 sm:px-8 border-b border-white/10 flex items-center justify-between font-label">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span className="tracking-widest uppercase text-gold font-semibold">Villa Belladonna Milan</span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="hidden sm:inline text-white/80">Via Monte Napoleone, 15, 20121 Milan, Italy</span>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/ea-portal"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 hover:bg-gold/20 text-gold text-xs font-sans transition-colors border border-gold/30"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span className="font-medium tracking-wide">Family Office &amp; EA Protocol</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-sans transition-colors border border-white/10"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-gold" />
            <span className="font-medium">Director / Salon Portal</span>
          </Link>
        </div>
      </div>

      {/* Streamlined Sticky Header with Subtle Glassmorphism Blur & z-50 Stacking Context */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border/80 px-4 sm:px-8 py-4 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand Monogram */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-surface border border-gold-border text-gold font-serif font-bold text-xl shadow-subtle group-hover:scale-105 transition-transform duration-300">
              VB
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-foreground block leading-none">
                Villa Belladonna
              </span>
              <span className="text-[10px] uppercase font-label tracking-[0.2em] text-muted-foreground block mt-1 font-semibold">
                Haute Beauty &amp; Longevity • Milan
              </span>
            </div>
          </Link>

          {/* Streamlined Navigation: [Palazzo Ambience] [Ritual Quiz] [The Boutique] [Clinical Proof] [VIP Booking] */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* [Palazzo Ambience] Discrete Sensory Ambience Audio Player */}
            <PalazzoAmbiencePlayer />

            {/* [Ritual Quiz] Interactive Quiz Trigger */}
            <button
              onClick={() => setIsQuizOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-wider font-semibold text-gold-hover hover:bg-gold-surface/80 transition-all shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Ritual Quiz</span>
            </button>

            {/* [The Boutique] */}
            <a
              href="#bottega"
              className="hidden md:inline-flex items-center text-xs font-label uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors font-semibold px-2 py-1"
            >
              The Boutique
            </a>

            {/* [Clinical Proof] */}
            <a
              href="#clinical"
              className="hidden lg:inline-flex items-center text-xs font-label uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors font-semibold px-2 py-1"
            >
              Clinical Proof
            </a>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Shopping Bag"
              className="relative p-2.5 rounded-full bg-surface border border-border hover:border-gold-border text-foreground hover:text-gold transition-colors shadow-subtle flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-charcoal">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors border border-border/60"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-charcoal" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* [VIP Booking] Primary Solid Dark VIP Button with Generous Tactile Padding */}
            <button
              onClick={() => handleOpenBooking()}
              className="btn-luxury-dark px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-label text-xs uppercase tracking-widest font-bold active:scale-95 shadow-subtle"
            >
              VIP Booking
            </button>

            {/* Off-Canvas Hamburger Menu Button */}
            <button
              onClick={() => setIsOffCanvasOpen(true)}
              aria-label="Open Navigation Menu"
              className="p-2.5 rounded-full bg-surface border border-border hover:border-gold-border text-foreground hover:text-gold transition-colors shadow-subtle flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Off-Canvas Sliding Drawer (AnimatePresence) */}
      <AnimatePresence>
        {isOffCanvasOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOffCanvasOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-surface border-l border-border p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              {/* Drawer Top Header */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-surface border border-gold-border text-gold font-serif font-bold text-lg">
                      VB
                    </div>
                    <div>
                      <span className="font-serif text-lg font-medium text-foreground block">
                        Villa Belladonna
                      </span>
                      <span className="text-[10px] uppercase font-label tracking-widest text-muted-foreground">
                        Milanese Luxury Beauty
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOffCanvasOpen(false)}
                    aria-label="Close Menu"
                    className="p-2 rounded-full hover:bg-surface-muted text-muted-foreground hover:text-foreground transition-colors border border-border/70"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links with High-End Styling */}
                <nav className="py-6 space-y-2">
                  <button
                    onClick={() => {
                      setIsOffCanvasOpen(false);
                      setIsQuizOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gold-surface/60 border border-gold-border hover:bg-gold-surface transition-colors group text-left"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold" />
                        <span className="font-serif text-lg text-foreground font-medium group-hover:text-gold transition-colors">
                          Discover Your Ritual Quiz
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Interactive bespoke 2-step consultation</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-all" />
                  </button>

                  {/* The Belladonna Private Office (UHNW Division) */}
                  <a
                    href="#private-office"
                    onClick={() => setIsOffCanvasOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#12100E] border border-gold/40 hover:border-gold transition-colors group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-gold" />
                        <span className="font-serif text-lg text-gold font-medium group-hover:text-gold-light transition-colors">
                          The Private Office
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-[9px] font-label font-bold uppercase text-gold">
                          UHNW
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">Global aviation, estate orchestration &amp; rare acquisitions</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-all" />
                  </a>

                  {/* Family Office & EA Dispatch Protocol */}
                  <Link
                    href="/ea-portal"
                    onClick={() => setIsOffCanvasOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-gold/30 hover:border-gold transition-colors group"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-gold" />
                        <span className="font-serif text-lg text-gold font-medium group-hover:text-gold-light transition-colors">
                          Family Office &amp; EA Portal
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-gold/15 border border-gold/30 text-[9px] font-label font-bold uppercase text-gold">
                          DIRECT
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">Fast-track principal booking, billing codes &amp; NDAs</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-all" />
                  </Link>

                  <a
                    href="#treatments"
                    onClick={() => setIsOffCanvasOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-muted transition-colors group"
                  >
                    <div className="space-y-0.5">
                      <span className="font-serif text-xl text-foreground font-medium group-hover:text-gold transition-colors">
                        The Treatment Menu
                      </span>
                      <p className="text-xs text-muted-foreground">24k gold facials, volcanic hot stone &amp; balayage</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </a>

                  <a
                    href="#clinical"
                    onClick={() => setIsOffCanvasOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-muted transition-colors group"
                  >
                    <div className="space-y-0.5">
                      <span className="font-serif text-xl text-foreground font-medium group-hover:text-gold transition-colors">
                        Clinical Proof (Before &amp; After)
                      </span>
                      <p className="text-xs text-muted-foreground">High-definition dermal imaging &amp; longevity data</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </a>

                  <a
                    href="#bottega"
                    onClick={() => setIsOffCanvasOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-muted transition-colors group"
                  >
                    <div className="space-y-0.5">
                      <span className="font-serif text-xl text-foreground font-medium group-hover:text-gold transition-colors">
                        The Skincare Boutique
                      </span>
                      <p className="text-xs text-muted-foreground">24k gold serums, obsidian night nectar &amp; elixirs</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </a>

                  <a
                    href="#artisans"
                    onClick={() => setIsOffCanvasOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-muted transition-colors group"
                  >
                    <div className="space-y-0.5">
                      <span className="font-serif text-xl text-foreground font-medium group-hover:text-gold transition-colors">
                        Master Artisans of Beauty
                      </span>
                      <p className="text-xs text-muted-foreground">Meet certified Italian aesthetic specialists</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </a>

                  <a
                    href="#reviews"
                    onClick={() => setIsOffCanvasOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-muted transition-colors group"
                  >
                    <div className="space-y-0.5">
                      <span className="font-serif text-xl text-foreground font-medium group-hover:text-gold transition-colors">
                        Press &amp; Editorial Acclaim
                      </span>
                      <p className="text-xs text-muted-foreground">Featured in Vogue Italia, Vanity Fair &amp; L’Officiel</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </a>

                  <a
                    href="#location"
                    onClick={() => setIsOffCanvasOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-muted transition-colors group"
                  >
                    <div className="space-y-0.5">
                      <span className="font-serif text-xl text-foreground font-medium group-hover:text-gold transition-colors">
                        Private Sanctuary &amp; Valet
                      </span>
                      <p className="text-xs text-muted-foreground">Via Monte Napoleone access &amp; hours</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                  </a>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsOffCanvasOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-gold-surface border border-gold-border hover:bg-gold-surface/80 transition-colors group mt-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-gold" />
                        <span className="font-serif text-lg text-foreground font-medium">
                          Director / Salon Portal
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Live appointments, AI recovery &amp; staff roster</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-all" />
                  </Link>
                </nav>
              </div>

              {/* Drawer Bottom Controls: Ambience, Currency, Reception Phone, Primary CTA */}
              <div className="pt-4 border-t border-border space-y-4">
                {/* Ambience & Currency Controls */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground font-label uppercase tracking-wider text-[11px] font-semibold">
                    Palazzo Ambience
                  </span>
                  <PalazzoAmbiencePlayer />
                </div>

                {/* 5-Currency Switcher */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-label uppercase tracking-wider font-semibold">
                    Display Currency
                  </span>
                  <div className="flex items-center gap-1 p-1 rounded-full bg-surface-muted border border-border flex-wrap">
                    {(['EUR', 'USD', 'GBP', 'AED', 'INR'] as const).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setCurrency(curr)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          currency === curr
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary CTA Button */}
                <button
                  onClick={() => handleOpenBooking()}
                  className="btn-luxury-dark w-full py-4 rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-luxury active:scale-95"
                >
                  Book VIP Treatment
                </button>

                <p className="text-[11px] text-center text-muted-foreground">
                  Concierge Desk: +39 02 8900 4500 • Mon–Sat 09:30–20:00
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area with Generous Header Clearance and 30%+ Whitespace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 lg:pt-14 pb-16 sm:pb-24 lg:pb-32 space-y-20 sm:space-y-28 lg:space-y-36">
        
        {/* 50/50 Split Hero Section */}
        <ParisianHero
          onBookClick={() => handleOpenBooking()}
          onOpenQuiz={() => setIsQuizOpen(true)}
          selectedCurrency={currency}
          onCurrencyChange={(curr) => setCurrency(curr)}
        />

        {/* Treatment Menu Catalog with scroll-mt-28 */}
        <div id="treatments" className="scroll-mt-28">
          <TreatmentMenu
            onSelectTreatment={(treatment) => handleOpenBooking(treatment)}
            currency={currency}
          />
        </div>

        {/* Interactive Clinical Before/After Longevity Slider */}
        <div id="clinical" className="scroll-mt-28">
          <ClinicalBeforeAfterSlider onBookCeremony={() => handleOpenBooking()} />
        </div>

        {/* Tactile Slow-Motion Skincare Video Feature */}
        <TactileVideoHero
          onExploreProducts={() => {
            const el = document.getElementById('bottega');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* High-End E-Commerce Product Storytelling Section (La Bottega) */}
        <LaBottegaSection
          onAddToCart={handleAddToCart}
          currency={currency}
        />

        {/* Master Artisans Section with scroll-mt-28 */}
        <div id="artisans" className="scroll-mt-28">
          <TherapistSection onBookSpecialist={() => handleOpenBooking()} />
        </div>

        {/* Editorial Press & VIP Testimonials with High-Contrast Typography */}
        <section id="reviews" className="py-12 sm:py-16 space-y-10 sm:space-y-14 border-t border-border scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-widest text-gold-hover">
              <Star className="w-3.5 h-3.5 text-gold" />
              <span>Press &amp; Editorial Acclaim</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground tracking-tight">
              Celebrated by <span className="italic font-serif font-light text-gold">Milanese Tastemakers</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sans max-w-lg mx-auto leading-relaxed font-normal">
              Consistently ranked among the most distinguished beauty and wellness sanctuaries in Milan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            
            {/* Vogue Italia */}
            <div className="rounded-[28px] bg-surface border border-border p-8 sm:p-9 space-y-5 shadow-luxury hover:shadow-luxury-hover hover:border-gold-border hover:-translate-y-1.5 transition-all duration-500">
              <span className="font-serif italic text-3xl text-gold font-bold block">VOGUE Italia</span>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                “The undeniable gold standard in Milanese skin longevity. Villa Belladonna seamlessly blends historic discretion with state-of-the-art bio-peptide rituals.”
              </p>
              <div className="pt-4 border-t border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-xs font-semibold text-foreground">Haute Beauty Issue</span>
              </div>
            </div>

            {/* Vanity Fair Italia */}
            <div className="rounded-[28px] bg-surface border border-border p-8 sm:p-9 space-y-5 shadow-luxury hover:shadow-luxury-hover hover:border-gold-border hover:-translate-y-1.5 transition-all duration-500">
              <span className="font-serif italic text-3xl text-gold font-bold block">Vanity Fair Italia</span>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                “An oasis of tranquil beauty near Via Monte Napoleone. The VIP concierge experience sets an unprecedented standard of effortless Italian luxury.”
              </p>
              <div className="pt-4 border-t border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-xs font-semibold text-foreground">Top Sanctuary in Milan</span>
              </div>
            </div>

            {/* L'Officiel Italia */}
            <div className="rounded-[28px] bg-surface border border-border p-8 sm:p-9 space-y-5 shadow-luxury hover:shadow-luxury-hover hover:border-gold-border hover:-translate-y-1.5 transition-all duration-500">
              <span className="font-serif italic text-3xl text-gold font-bold block">L’OFFICIEL Italia</span>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                “From the Franciacorta welcome to the immaculate Carrara suites, this is Italy's ultimate wellness sanctuary.”
              </p>
              <div className="pt-4 border-t border-border flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-xs font-semibold text-foreground">Luxury Wellness &amp; Spa Guide</span>
              </div>
            </div>

          </div>
        </section>

        {/* The Belladonna Private Office (UHNW Lifestyle Management Division) */}
        <PrivateOfficeSection onOpenInquiry={handleOpenPrivateOfficeInquiry} />

        {/* Location & Concierge Reception Bar with Refined Layout */}
        <section id="location" className="rounded-[32px] sm:rounded-[40px] bg-surface-muted border border-border p-8 sm:p-14 shadow-luxury flex flex-col lg:flex-row items-center justify-between gap-10 scroll-mt-28">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-xs font-label uppercase tracking-widest text-foreground">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>Private Palazzo in Milan</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-serif text-foreground">
              Visit <span className="italic font-serif font-light text-gold">Villa Belladonna</span> Milan
            </h3>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans font-normal">
              Discreetly located on Via Monte Napoleone in the heart of Milan&apos;s fashion district. Private entrance and dedicated concierge valet parking available upon reservation for VIP clientele.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs font-semibold text-foreground pt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold" />
                <span>Mon–Sat: 09:30 – 20:00</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>+39 02 8900 4500</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <button
              onClick={() => handleOpenBooking()}
              className="btn-luxury-dark w-full sm:w-auto px-9 py-4 rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-luxury active:scale-95"
            >
              Reserve VIP Suite
            </button>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto text-center px-7 py-4 rounded-full bg-surface border border-border hover:border-gold-border hover:bg-surface-elevated text-xs font-label uppercase tracking-wider font-semibold transition-all duration-300 shadow-subtle"
            >
              Salon Operations View
            </Link>
          </div>
        </section>

      </main>

      {/* Haute Couture Footer */}
      <footer className="border-t border-border mt-20 py-16 bg-surface text-center space-y-6 text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gold-surface border border-gold-border text-gold font-serif font-bold text-base flex items-center justify-center">
            VB
          </div>
          <span className="font-serif text-xl font-medium text-foreground">Villa Belladonna Milan</span>
        </div>
        <p className="max-w-md mx-auto text-xs leading-relaxed">
          Haute Beauty, Spa &amp; Aesthetic Longevity. Via Monte Napoleone, 15, 20121 Milan, Italy.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-muted-foreground pt-2">
          <Link href="/bottega" className="hover:text-gold transition-colors">
            The Skincare Boutique
          </Link>
          <span>•</span>
          <Link href="/ea-portal" className="text-gold/90 hover:text-gold transition-colors font-medium">
            Family Office &amp; EA Dispatch
          </Link>
          <span>•</span>
          <Link href="/dashboard" className="hover:text-gold transition-colors">
            Salon Dashboard
          </Link>
          <span>•</span>
          <Link href="/calendar" className="hover:text-gold transition-colors">
            Staff Calendar
          </Link>
          <span>•</span>
          <Link href="/login" className="hover:text-gold transition-colors">
            Staff Login
          </Link>
        </div>
        <p className="text-[11px] text-muted-foreground/60 pt-2">
          © 2026 Villa Belladonna Milan. Powered by VertOps Beauty Care AI.
        </p>
      </footer>

      {/* Floating Bottom-Right VIP Concierge Hub Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsConciergeHubOpen(true)}
          aria-label="Open Concierge & Private Office Hub"
          className="group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-zinc-900 dark:bg-[#1A1715] text-white border border-gold/40 shadow-xl hover:shadow-2xl hover:border-gold hover:scale-105 transition-all duration-300 transform active:scale-95 cursor-pointer"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-zinc-800 border border-gold/30 text-white shadow-sm shrink-0 group-hover:border-gold transition-colors">
            <MessageCircle className="w-4 h-4 text-gold fill-gold/20" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold animate-ping" />
          </div>
          <div className="overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-xs transition-all duration-500 ease-in-out">
            <span className="text-xs font-label uppercase tracking-widest font-bold text-gold pr-1">
              Concierge &amp; Private Office
            </span>
          </div>
          <span className="hidden sm:inline group-hover:hidden text-xs font-label uppercase tracking-wider font-semibold text-white">
            Concierge
          </span>
        </button>
      </div>

      {/* Dynamic 2-Way Concierge Hub Modal */}
      <ConciergeHubModal
        isOpen={isConciergeHubOpen}
        onClose={() => setIsConciergeHubOpen(false)}
        onOpenSpaBooking={() => handleOpenBooking()}
        onOpenPrivateOffice={() => handleOpenPrivateOfficeInquiry()}
      />

      {/* Encrypted UHNW Private Office Mandate Modal */}
      <PrivateOfficeInquiryModal
        isOpen={isPrivateOfficeInquiryOpen}
        onClose={() => setIsPrivateOfficeInquiryOpen(false)}
        defaultPillar={selectedPrivateOfficePillar}
      />

      {/* Discover Your Ritual Quiz Concierge Modal */}
      <RitualQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onBookTreatment={(treatment) => handleOpenBooking(treatment)}
        currency={currency}
      />

      {/* Interactive Luxury Cart Drawer */}
      <LuxuryCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        currency={currency}
      />

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



