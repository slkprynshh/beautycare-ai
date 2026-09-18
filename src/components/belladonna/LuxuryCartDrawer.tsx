'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  Gift,
  CheckCircle2,
  Lock,
} from 'lucide-react';

import { LuxuryCurrency } from '@/components/parisian/TreatmentMenu';

export interface CartItem {
  id: string;
  title: string;
  subtitle?: string;
  italianTitle?: string;
  priceEUR: number;
  priceUSD: number;
  priceINR: number;
  priceAED: number;
  priceGBP: number;
  size: string;
  image: string;
  quantity: number;
}

interface LuxuryCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  currency: LuxuryCurrency;
}

export function LuxuryCartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  currency,
}: LuxuryCartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  const formatPrice = (item: CartItem) => {
    switch (currency) {
      case 'EUR':
        return `€${item.priceEUR * item.quantity}`;
      case 'USD':
        return `$${item.priceUSD * item.quantity}`;
      case 'INR':
        return `₹${(item.priceINR * item.quantity).toLocaleString('en-IN')}`;
      case 'AED':
        return `AED ${(item.priceAED * item.quantity).toLocaleString()}`;
      case 'GBP':
        return `£${item.priceGBP * item.quantity}`;
      default:
        return `€${item.priceEUR * item.quantity}`;
    }
  };

  const getSubtotal = () => {
    return items.reduce((acc, item) => {
      switch (currency) {
        case 'EUR':
          return acc + item.priceEUR * item.quantity;
        case 'USD':
          return acc + item.priceUSD * item.quantity;
        case 'INR':
          return acc + item.priceINR * item.quantity;
        case 'AED':
          return acc + item.priceAED * item.quantity;
        case 'GBP':
          return acc + item.priceGBP * item.quantity;
        default:
          return acc + item.priceEUR * item.quantity;
      }
    }, 0);
  };

  const subtotal = getSubtotal();
  const giftThreshold =
    currency === 'EUR'
      ? 300
      : currency === 'USD'
      ? 330
      : currency === 'INR'
      ? 26000
      : currency === 'AED'
      ? 1200
      : 260;

  const currencySymbol =
    currency === 'EUR'
      ? '€'
      : currency === 'USD'
      ? '$'
      : currency === 'INR'
      ? '₹'
      : currency === 'AED'
      ? 'AED '
      : '£';

  const progressPercent = Math.min(100, Math.round((subtotal / giftThreshold) * 100));

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingOut(false);
    setOrderComplete(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Slide-in */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-surface border-l border-border p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gold-surface border border-gold-border text-gold shadow-subtle">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-medium text-foreground">
                      The Boutique • Shopping Bag
                    </h3>
                    <span className="text-[10px] font-label uppercase tracking-widest text-muted-foreground font-semibold">
                      {items.reduce((acc, item) => acc + item.quantity, 0)} Artisanal Formulations
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close Shopping Bag"
                  className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors border border-border/70"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Complimentary VIP Gift Threshold Bar */}
              <div className="my-5 p-4 rounded-2xl bg-gold-surface/50 border border-gold-border/70 space-y-2 text-xs">
                <div className="flex items-center justify-between font-label">
                  <div className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-wider text-[11px]">
                    <Gift className="w-4 h-4" />
                    <span>Complimentary VIP Gift</span>
                  </div>
                  <span className="text-foreground/80 font-semibold text-[11px]">
                    {subtotal >= giftThreshold
                      ? 'Unlocked: 24k Mist + Macarons'
                      : `${currencySymbol}${giftThreshold - subtotal} away`}
                  </span>
                </div>

                <div className="w-full bg-surface-muted rounded-full h-2 overflow-hidden border border-gold-border/40">
                  <div
                    className="h-full bg-gradient-to-r from-gold to-[#A88659] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <p className="text-[11px] text-muted-foreground leading-tight">
                  Orders over {currencySymbol}{giftThreshold} receive our signature 24k Gold Travel Essence and custom gift box packaging.
                </p>
              </div>

              {/* Order Complete Screen */}
              {orderComplete ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-serif text-foreground">
                    Thank You! Order Placed
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Your bespoke boutique order has been scheduled for white-glove packaging. A courier tracking confirmation has been sent to your contact.
                  </p>
                  <button
                    onClick={() => {
                      setOrderComplete(false);
                      onClose();
                    }}
                    className="btn-luxury-dark px-8 py-3.5 rounded-full font-label text-xs uppercase tracking-widest font-bold"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : isCheckingOut ? (
                /* Checkout Form */
                <form onSubmit={handleCheckoutSubmit} className="space-y-4 py-4">
                  <h4 className="font-serif text-lg text-foreground">VIP White-Glove Dispatch</h4>
                  <div className="space-y-3 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email for Digital Dispatch Receipt"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp Mobile (+39 / +1 / +44 / +971)"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Delivery Address (Suite / Street / City / Postal)"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="pt-3 flex gap-3">
                    <button
                      type="submit"
                      className="btn-luxury-dark flex-1 py-4 rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-luxury flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5 text-gold" />
                      <span>Place VIP Order ({currencySymbol}{subtotal})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="px-4 py-4 rounded-full bg-surface border border-border text-xs font-label uppercase"
                    >
                      Back
                    </button>
                  </div>
                </form>
              ) : items.length === 0 ? (
                /* Empty Cart State */
                <div className="py-16 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-surface-muted text-muted-foreground flex items-center justify-center border border-border">
                    <ShoppingBag className="w-8 h-8 opacity-40" />
                  </div>
                  <h4 className="text-xl font-serif text-foreground">Your Shopping Bag is Empty</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Discover our artisanal serums, elixirs, and restorative night creams in our skincare boutique.
                  </p>
                </div>
              ) : (
                /* Cart Items List */
                <div className="divide-y divide-border/70 space-y-4 py-2">
                  {items.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 flex items-center gap-4">
                      {/* Product Thumbnail */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-surface-muted border border-border shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover object-center"
                        />
                      </div>

                      {/* Info & Quantity */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[10px] font-label uppercase tracking-widest text-gold font-semibold block truncate">
                          {item.subtitle || item.italianTitle}
                        </span>
                        <h4 className="text-sm font-serif font-medium text-foreground truncate">
                          {item.title}
                        </h4>
                        <span className="text-[11px] text-muted-foreground block">
                          Size: {item.size}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 pt-1">
                          <div className="flex items-center rounded-lg border border-border bg-surface-muted text-xs">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-muted-foreground hover:text-foreground"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 font-mono font-semibold text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-muted-foreground hover:text-foreground"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-muted-foreground hover:text-rose-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right font-serif font-semibold text-sm text-foreground">
                        {formatPrice(item)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Checkout Action */}
            {items.length > 0 && !isCheckingOut && !orderComplete && (
              <div className="pt-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-label uppercase tracking-wider text-muted-foreground text-xs font-semibold">
                    Subtotal
                  </span>
                  <span className="font-serif font-bold text-xl text-foreground">
                    {currencySymbol}{subtotal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="btn-luxury-dark w-full py-4 rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-luxury active:scale-95 flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-gold" />
                  <span>Proceed to VIP Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-sans">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                    Insured White-Glove Courier
                  </span>
                  <span>•</span>
                  <span>Complimentary Returns</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
