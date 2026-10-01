'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Clock, Check, Shield, Droplets } from 'lucide-react';

export interface TreatmentProps {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  priceEUR: number;
  description: string;
  highlights: string[];
  batchProvenance: string;
  isPopular?: boolean;
}

export function TreatmentSelectionCard({
  treatment,
  isSelected,
  onSelect,
}: {
  treatment: TreatmentProps;
  isSelected: boolean;
  onSelect: (treatment: TreatmentProps) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(-1000);
        mouseY.set(-1000);
      }}
      onClick={() => onSelect(treatment)}
      whileTap={{ scale: 0.985 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-palazzo cursor-pointer select-none transition-all duration-300 p-[1.5px] overflow-hidden ${
        isSelected
          ? 'bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/60 to-[#D4AF37]/20 shadow-gold-glow'
          : 'bg-white/10 hover:bg-[#D4AF37]/30'
      }`}
    >
      {/* Dynamic Specular Gold Spotlight (Mouse Follower) */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-palazzo opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(212, 175, 55, 0.4),
              transparent 80%
            )
          `,
        }}
      />

      {/* Main Card Body */}
      <div className="relative h-full w-full rounded-[17px] bg-[#110F0C] p-6 sm:p-7 flex flex-col justify-between space-y-6 backdrop-blur-xl">
        
        {/* Top Meta Bar */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
                {treatment.subtitle}
              </span>
              {treatment.isPopular && (
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[9px] font-mono uppercase text-[#D4AF37] font-bold">
                  Palazzo Signature
                </span>
              )}
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#FAF9F6] tracking-tight group-hover:text-[#D4AF37] transition-colors duration-200">
              {treatment.title}
            </h3>
          </div>

          {/* Selection Radio Indicator */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-200 shrink-0 ${
              isSelected
                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0A0A0A] scale-110 shadow-sm'
                : 'border-white/20 bg-[#171411] group-hover:border-[#D4AF37]/50'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
          {treatment.description}
        </p>

        {/* Botanical & Mineral Highlights */}
        <div className="flex flex-wrap gap-2 pt-1">
          {treatment.highlights.map((h, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171411] border border-[#D4AF37]/15 text-[11px] font-mono text-neutral-300"
            >
              <Droplets className="w-3 h-3 text-[#D4AF37]" />
              {h}
            </span>
          ))}
        </div>

        {/* Footer: Provenance, Duration & Price */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4 text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{treatment.durationMinutes} Min Ceremony</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-neutral-500">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>{treatment.batchProvenance}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase text-neutral-500 block font-sans">Investment</span>
            <span className="font-serif text-lg font-bold text-[#FAF9F6]">
              €{treatment.priceEUR}
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
