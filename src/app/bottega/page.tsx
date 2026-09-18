'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowLeft, Moon, Sun } from 'lucide-react';
import { LaBottegaSection } from '@/components/belladonna/LaBottegaSection';
import { TactileVideoHero } from '@/components/belladonna/TactileVideoHero';
import { LuxuryCartDrawer, CartItem } from '@/components/belladonna/LuxuryCartDrawer';
import { RitualQuizModal } from '@/components/belladonna/RitualQuizModal';
import { VipBookingModal } from '@/components/parisian/VipBookingModal';
import { Treatment, LuxuryCurrency } from '@/components/parisian/TreatmentMenu';
import { useStore } from '@/store/useStore';

export default function BottegaPage() {
  const { theme, toggleTheme } = useStore();
  const [currency, setCurrency] = useState<LuxuryCurrency>('EUR');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);

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

  const handleBookFromQuiz = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setIsBookingOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-gold/30">
      {/* Top Banner */}
      <div className="bg-[#1A1715] text-[#FAF8F5] text-[11px] py-2.5 px-4 sm:px-8 border-b border-white/10 flex items-center justify-between font-label">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="tracking-widest uppercase text-gold font-semibold">The Skincare Boutique • Villa Belladonna Milan</span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="hidden sm:inline text-white/80">Small-Batch Artisanal Formulations &amp; Bio-Peptides</span>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/"
            className="text-white/80 hover:text-white text-xs font-sans transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sanctuary</span>
          </Link>
        </div>
      </div>

      {/* Sticky Luxury Navbar */}
      <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md border-b border-border/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-surface border border-gold-border text-gold font-serif font-bold text-xl shadow-subtle group-hover:scale-105 transition-transform duration-300">
              VB
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-foreground block leading-none">
                The Skincare Boutique
              </span>
              <span className="text-[10px] uppercase font-label tracking-[0.2em] text-muted-foreground block mt-1 font-semibold">
                Villa Belladonna • Milan
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quiz Trigger */}
            <button
              onClick={() => setIsQuizOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-wider font-semibold text-gold-hover hover:bg-gold-surface/80 transition-all shadow-subtle"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Discover Your Ritual</span>
            </button>

            {/* Currency Selector */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-surface border border-border">
              {(['EUR', 'USD', 'GBP', 'AED', 'INR'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                    currency === curr ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors border border-border/60"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-charcoal" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Cart"
              className="btn-luxury-dark px-4 sm:px-5 py-2.5 rounded-full font-label text-xs uppercase tracking-widest font-bold active:scale-95 shadow-subtle flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-gold" />
              <span>Bag ({totalCartCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-20 sm:space-y-28">
        {/* Tactile Slow-Motion Video Hero */}
        <TactileVideoHero
          onExploreProducts={() => {
            const el = document.getElementById('bottega');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* High-End Storytelling Product Page */}
        <LaBottegaSection onAddToCart={handleAddToCart} currency={currency} />
      </main>

      {/* Cart Drawer */}
      <LuxuryCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        currency={currency}
      />

      {/* Discover Your Ritual Quiz Modal */}
      <RitualQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onBookTreatment={handleBookFromQuiz}
        currency={currency}
      />

      {/* VIP Booking Modal */}
      <VipBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialTreatment={selectedTreatment}
        currency={currency}
      />
    </div>
  );
}
