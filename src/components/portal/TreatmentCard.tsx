// ============================================================================
// File: src/components/portal/TreatmentCard.tsx
// Purpose: Minimalist Milanese VIP Treatment Selection Card with Optical Zoom
// ============================================================================

'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Sparkles, Check, ArrowRight } from 'lucide-react';

export interface TreatmentItem {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  priceEUR: number;
  priceUSD: number;
  description: string;
  highlights: string[];
  imageUrl: string;
  tag?: string;
}

interface TreatmentCardProps {
  treatment: TreatmentItem;
  isSelected: boolean;
  currency?: 'EUR' | 'USD';
  onSelect: (id: string) => void;
  onInquireDetails?: (treatment: TreatmentItem) => void;
}

export function TreatmentCard({
  treatment,
  isSelected,
  currency = 'EUR',
  onSelect,
  onInquireDetails,
}: TreatmentCardProps) {
  const formattedPrice =
    currency === 'EUR' ? `€${treatment.priceEUR}` : `$${treatment.priceUSD}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(treatment.id)}
      className={`group relative rounded-[28px] overflow-hidden border transition-all duration-500 cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-[#181512] border-[#C5A880] shadow-[0_20px_50px_-15px_rgba(197,168,128,0.25)] ring-1 ring-[#C5A880]/50'
          : 'bg-[#141210] border-amber-900/20 hover:border-[#C5A880]/60 hover:shadow-2xl'
      }`}
    >
      {/* Top Media Showcase */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-neutral-900">
        <Image
          src={treatment.imageUrl}
          alt={treatment.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />
        
        {/* Soft Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {treatment.tag ? (
            <span className="px-3 py-1 rounded-full bg-[#161412]/80 backdrop-blur-md border border-[#C5A880]/40 text-[#C5A880] font-mono text-[9px] uppercase tracking-[0.2em] font-bold">
              {treatment.tag}
            </span>
          ) : <div />}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#FAF8F5] text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>{treatment.durationMinutes} min</span>
          </div>
        </div>

        {/* Selected Radio Indicator */}
        {isSelected && (
          <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-[#C5A880] text-black flex items-center justify-center shadow-lg animate-in zoom-in-75">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-5">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[10px] font-mono text-[#C5A880] tracking-[0.2em] uppercase">
              {treatment.subtitle}
            </span>
            <span className="font-serif text-xl sm:text-2xl text-[#FAF8F5] font-light tabular-nums">
              {formattedPrice}
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl text-[#FAF8F5] font-normal leading-tight group-hover:text-[#C5A880] transition-colors">
            {treatment.title}
          </h3>

          <p className="text-xs text-neutral-400 leading-relaxed font-sans line-clamp-2 pt-1">
            {treatment.description}
          </p>
        </div>

        {/* Botanical Key Highlights */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-amber-900/20">
          {treatment.highlights.map((h, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[11px] text-neutral-300 bg-[#1C1814] px-2.5 py-0.5 rounded-full border border-amber-900/30"
            >
              <Sparkles className="w-2.5 h-2.5 text-[#C5A880]" />
              {h}
            </span>
          ))}
        </div>

        {/* Bottom Card Actions */}
        <div className="pt-3 flex items-center justify-between gap-3">
          {onInquireDetails && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onInquireDetails(treatment);
              }}
              className="text-xs text-neutral-400 hover:text-[#C5A880] transition-colors font-sans underline underline-offset-4"
            >
              Protocol Details
            </button>
          )}

          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 ${
              isSelected
                ? 'bg-gradient-to-r from-[#C5A880] to-[#B09267] text-black shadow-lg'
                : 'bg-[#211C18] text-[#FAF8F5] border border-amber-900/40 hover:border-[#C5A880]'
            }`}
          >
            <span>{isSelected ? 'Selected for Protocol' : 'Select Treatment'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
