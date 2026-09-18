'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Droplets,
  Crown,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';

interface ClinicalBeforeAfterSliderProps {
  onBookCeremony?: () => void;
}

export function ClinicalBeforeAfterSlider({ onBookCeremony }: ClinicalBeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(rect.width, x));
    const percent = (clampedX / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handlePointerUp]);

  return (
    <section id="clinical" className="space-y-10 sm:space-y-14 py-12 sm:py-20 scroll-mt-28">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-widest text-gold-hover">
          <Award className="w-3.5 h-3.5 text-gold" />
          <span>Clinical Longevity Verification</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground tracking-tight">
          Visual Proof: <span className="italic font-serif font-light text-gold">Before &amp; After Ritual</span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sans max-w-xl mx-auto leading-relaxed font-normal">
          High-definition dermal imaging documenting cellular rejuvenation after a single 75-minute 24k Gold Longevity Ceremony.
        </p>
      </div>

      {/* Interactive Dual-Pane Slider Card */}
      <div className="max-w-5xl mx-auto rounded-[32px] sm:rounded-[44px] bg-surface border border-border/80 p-6 sm:p-10 lg:p-12 shadow-luxury space-y-8">
        
        {/* The Comparison Slider Container */}
        <div
          ref={containerRef}
          onMouseDown={(e) => {
            setIsDragging(true);
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              setIsDragging(true);
              handleMove(e.touches[0].clientX);
            }
          }}
          className="relative h-[360px] sm:h-[480px] lg:h-[540px] w-full rounded-[28px] overflow-hidden select-none cursor-ew-resize bg-surface-muted border border-border/90 shadow-2xl"
        >
          {/* Base Layer: Post-Ceremony Glow (Right Side Image) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/images/belladonna_ritual.jpg"
              alt="Post-Ceremony Glow (24k Cellular Longevity Result)"
              fill
              priority
              className="object-cover object-center filter brightness-[1.04] saturate-[1.1]"
            />
            {/* Right Badge */}
            <div className="absolute top-5 right-5 z-10 px-4 py-1.5 rounded-full bg-charcoal/85 backdrop-blur-md border border-gold/40 text-gold text-xs font-label font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
              <span>Post-Ceremony Glow</span>
            </div>
          </div>

          {/* Top Layer: Before Ritual (Left Side Image clipped to sliderPosition) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden transition-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image
              src="/images/facial.jpg"
              alt="Before Ritual (Pre-treatment baseline)"
              fill
              priority
              className="object-cover object-center filter brightness-[0.92] contrast-[0.98]"
            />
            {/* Left Badge */}
            <div className="absolute top-5 left-5 z-10 px-4 py-1.5 rounded-full bg-charcoal/85 backdrop-blur-md border border-white/20 text-white/90 text-xs font-label font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/60" />
              <span>Before Ritual</span>
            </div>
          </div>

          {/* The Vertical Divider Line */}
          <div
            className="absolute top-0 bottom-0 z-20 pointer-events-none transition-none"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-[2.5px] h-full bg-gradient-to-b from-transparent via-gold to-transparent shadow-[0_0_12px_rgba(197,160,89,0.8)]" />
            
            {/* Centered Drag Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-[#1A1715] border-2 border-gold text-gold shadow-2xl transition-transform active:scale-110 group">
              <div className="flex items-center gap-0.5">
                <ChevronLeft className="w-4 h-4 text-gold group-hover:-translate-x-0.5 transition-transform" />
                <ChevronRight className="w-4 h-4 text-gold group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Bottom Drag Instruction Hint */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-sans text-white/80 pointer-events-none tracking-wide">
            Drag or swipe horizontally to inspect transformation
          </div>
        </div>

        {/* Clinical Proof Metric Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* Metric 1 */}
          <div className="p-5 rounded-2xl bg-gold-surface/40 border border-gold-border/70 space-y-2">
            <div className="flex items-center gap-2 text-gold">
              <Droplets className="w-4 h-4" />
              <span className="font-serif font-bold text-2xl sm:text-3xl text-foreground">+42%</span>
            </div>
            <h4 className="text-xs font-label uppercase tracking-wider font-semibold text-foreground">
              Deep Dermal Hydration
            </h4>
            <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
              Measured via bio-impedance corneometry 60 minutes post 24k gold leaf application.
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-5 rounded-2xl bg-gold-surface/40 border border-gold-border/70 space-y-2">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="w-4 h-4" />
              <span className="font-serif font-bold text-2xl sm:text-3xl text-foreground">-28%</span>
            </div>
            <h4 className="text-xs font-label uppercase tracking-wider font-semibold text-foreground">
              Fine Line Depth &amp; Tension
            </h4>
            <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
              High-resolution 3D optical profilometry across peri-orbital and forehead contours.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-5 rounded-2xl bg-gold-surface/40 border border-gold-border/70 space-y-2">
            <div className="flex items-center gap-2 text-gold">
              <Crown className="w-4 h-4" />
              <span className="font-serif font-bold text-2xl sm:text-3xl text-foreground">99.4%</span>
            </div>
            <h4 className="text-xs font-label uppercase tracking-wider font-semibold text-foreground">
              Immediate Red-Carpet Radiance
            </h4>
            <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
              Client clinical survey rating skin tone vitality, lift, and silk-satin luminescence.
            </p>
          </div>

        </div>

        {/* Footer CTA & Accreditation */}
        <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-sans text-center sm:text-left">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
            <span>Evaluated at the Milan Institute of Aesthetic Longevity • Autumn 2026 Batch</span>
          </div>

          {onBookCeremony && (
            <button
              onClick={onBookCeremony}
              className="btn-luxury-dark px-7 py-3.5 rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-luxury active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Book Signature Ceremony</span>
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
