'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Key,
  Lock,
  Calendar,
  MessageCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ConciergeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSpaBooking: () => void;
  onOpenPrivateOffice: () => void;
}

export function ConciergeHubModal({
  isOpen,
  onClose,
  onOpenSpaBooking,
  onOpenPrivateOffice,
}: ConciergeHubModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-xl rounded-t-[32px] sm:rounded-[36px] bg-[#0C0B0A] border border-gold/30 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-white overflow-hidden"
        >
          {/* Top Status Header */}
          <div className="bg-[#141210] border-b border-gold/20 px-6 py-3.5 flex items-center justify-between text-xs font-label uppercase tracking-widest text-[#D4AF37]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Milan Concierge Desk • Online</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-gold transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Modal Title */}
            <div className="space-y-1.5 text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-label uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Villa Belladonna Concierge Portal</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                Select Your <span className="italic font-serif font-light text-gold">Service Pathway</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans">
                Please designate whether you require aesthetic ceremonies or private office lifestyle management.
              </p>
            </div>

            {/* Two Primary Routing Cards */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* Option A: Spa & Aesthetic Reservations */}
              <div className="group relative rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-gold/60 p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_4px_25px_rgba(212,175,55,0.15)] space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gold-surface border border-gold-border text-gold flex items-center justify-center shrink-0 shadow-subtle group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-label uppercase tracking-widest text-gold font-bold block">
                        Option A • Palazzo Salon &amp; Spa
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-white font-medium group-hover:text-gold transition-colors">
                        Spa &amp; Aesthetic Reservations
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-label uppercase">
                    Palazzo
                  </span>
                </div>

                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  24k gold cellular facials, volcanic hot stone therapies, Milanese balayage, and private Carrara suite appointments.
                </p>

                {/* Sub-actions for Spa */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSpaBooking();
                    }}
                    className="flex-1 min-w-[140px] py-2.5 px-4 rounded-full bg-gold text-charcoal font-label text-xs uppercase tracking-wider font-bold hover:bg-gold-light active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>VIP Booking (3-Tap)</span>
                  </button>

                  <a
                    href="https://wa.me/390289004500?text=Hello%20Villa%20Belladonna%2C%20I%20would%20like%20to%20inquire%20about%20a%20VIP%20reservation."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-label text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-gold" />
                    <span>WhatsApp Line</span>
                  </a>
                </div>
              </div>

              {/* Option B: The Belladonna Private Office */}
              <div className="group relative rounded-2xl bg-[#12100E] border border-gold/40 hover:border-gold p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_4px_30px_rgba(212,175,55,0.25)] space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gold/15 border border-gold/40 text-gold flex items-center justify-center shrink-0 shadow-subtle group-hover:scale-105 transition-transform">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-label uppercase tracking-widest text-gold font-bold block">
                        Option B • UHNW Division
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl text-white font-medium group-hover:text-gold transition-colors">
                        The Belladonna Private Office
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-gold/15 border border-gold/40 text-[10px] text-gold font-label uppercase font-semibold">
                    Black Card
                  </span>
                </div>

                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  Private aviation charters, Mediterranean yacht itineraries, multi-estate staffing, and off-market luxury acquisitions.
                </p>

                {/* Sub-actions for Private Office */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPrivateOffice();
                    }}
                    className="w-full py-3 px-5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-gold/50 text-gold font-label text-xs uppercase tracking-widest font-bold hover:border-gold active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Submit Private Office Mandate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Direct Contact & Discretion Footer */}
            <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                <span>Strict Non-Disclosure Protocol</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-zinc-300">
                <Phone className="w-3 h-3 text-gold" />
                <span>+39 02 8900 4500</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
