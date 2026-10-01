'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Sliders,
  ShieldCheck,
  Zap,
  RotateCw,
  Layers,
  ArrowRight,
  Crown,
  Activity,
  Droplets,
  Calendar,
  Lock,
} from 'lucide-react';
import { ChronosDermalViewport } from '@/components/chronos/ChronosDermalViewport';

export default function ChronosDermalTwinPage() {
  const [ageOffset, setAgeOffset] = useState<number>(10);
  const [isProtocolActive, setIsProtocolActive] = useState<boolean>(true);
  const [selectedLayer, setSelectedLayer] = useState<'epidermis' | 'dermis' | 'vascular' | 'volumetric'>('dermis');

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171410] via-[#12100E] to-[#1A1612] border border-[#D4AF37]/30 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              World-First AI Predictive Longevity Engine
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Zero-Knowledge Biometric Vault
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif text-[#FAF9F6] tracking-tight">
            The Chronos <span className="italic text-[#D4AF37]">Dermal Twin™</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl">
            Simulate high-precision 3D cellular aging projections over 5, 10, and 20 years. Dynamically compare natural baseline degradation against personalized Villa Belladonna 24k bio-peptide longevity protocols.
          </p>
        </div>

        <Link
          href="/portal/book"
          className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-mono text-xs uppercase tracking-widest font-bold shadow-xl transition whitespace-nowrap shrink-0"
        >
          <span>Prescribe Active Protocol</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Simulation Viewport and Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* 3D Viewport Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <ChronosDermalViewport
            ageOffsetYears={ageOffset}
            isProtocolActive={isProtocolActive}
            selectedLayer={selectedLayer}
          />

          <div className="flex items-center justify-between text-xs font-mono text-neutral-500 px-2">
            <span>FLAME Biometric Topology • Sub-Surface Scattering Approximated</span>
            <span>Cryptographic Hash: CHRONOS-MIL-8841</span>
          </div>
        </div>

        {/* Interactive Controls & Protocol Simulator (1 Col) */}
        <div className="space-y-6">
          
          {/* Age Slider Box */}
          <div className="p-6 rounded-3xl bg-[#110F0C] border border-[#D4AF37]/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
                Temporal Chronos Slider
              </span>
              <span className="font-serif text-lg text-amber-200 font-bold">
                +{ageOffset} Years Projection
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={ageOffset}
              onChange={(e) => setAgeOffset(parseInt(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
              <span>Today (Current)</span>
              <span>+5 Years</span>
              <span>+10 Years</span>
              <span>+20 Years</span>
            </div>
          </div>

          {/* Protocol Toggle Box */}
          <div className="p-6 rounded-3xl bg-[#110F0C] border border-[#D4AF37]/30 space-y-4 shadow-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
              Intervention Protocol Matrix
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsProtocolActive(true)}
                className={`p-4 rounded-2xl border text-left font-mono text-xs transition space-y-1 ${
                  isProtocolActive
                    ? 'bg-[#181511] border-[#D4AF37] text-[#D4AF37] shadow-gold-glow'
                    : 'bg-[#141210] border-white/10 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Villa Belladonna</span>
                </div>
                <p className="text-[10px] text-neutral-400 font-sans">
                  Weekly 24k Gold &amp; Bio-Peptides active.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setIsProtocolActive(false)}
                className={`p-4 rounded-2xl border text-left font-mono text-xs transition space-y-1 ${
                  !isProtocolActive
                    ? 'bg-[#181511] border-rose-500 text-rose-400 shadow-lg'
                    : 'bg-[#141210] border-white/10 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Baseline Aging</span>
                </div>
                <p className="text-[10px] text-neutral-400 font-sans">
                  Zero clinical cellular preservation.
                </p>
              </button>
            </div>
          </div>

          {/* Dermal Layer Selector */}
          <div className="p-6 rounded-3xl bg-[#110F0C] border border-[#D4AF37]/30 space-y-3 shadow-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
              Dermal Depth Visual Layer
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {(
                [
                  { id: 'epidermis', label: '1. Epidermis' },
                  { id: 'dermis', label: '2. Dermal Matrix' },
                  { id: 'vascular', label: '3. Micro-Vascular' },
                  { id: 'volumetric', label: '4. Volumetric SMAS' },
                ] as const
              ).map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer.id)}
                  className={`p-2.5 rounded-xl border transition ${
                    selectedLayer === layer.id
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37] font-bold'
                      : 'bg-[#141210] border-white/5 text-neutral-400 hover:text-white'
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
