'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Plus, FlaskConical, Sparkles, Droplets, Shield } from 'lucide-react';
import { useVipWizardStore, TreatmentAddon } from '@/store/useVipWizardStore';

const BESPOKE_ADDONS: (TreatmentAddon & { description: string; batch: string })[] = [
  {
    id: 'addon-peptide-32',
    name: 'Colloidal Bio-Peptide 32 Matrix',
    category: 'bio_peptide',
    dosage: '1.5ml Compounded',
    priceEUR: 85,
    description: 'Concentrated synthetic bio-peptides for cellular turnover acceleration and dermal matrix tensile repair.',
    batch: 'Cryo-Vault Batch #BIO-32',
  },
  {
    id: 'addon-gold-flakes',
    name: 'Pure 24k Gold Leaf Flake Suspension',
    category: 'gold_infusion',
    dosage: '18mg Aurum Flakes',
    priceEUR: 120,
    description: 'Finely suspended 24k Florentine gold leaf flakes offering high anti-inflammatory and cellular radiance efficacy.',
    batch: 'Florentine Gold Reserve #FL-24K',
  },
  {
    id: 'addon-hyperbaric',
    name: 'Post-Treatment 99.5% Pure Oxygen Chamber',
    category: 'hyperbaric',
    dosage: '30 Min Session',
    priceEUR: 150,
    description: 'Pressurized medical-grade hyperbaric oxygen session to quadruple active nutrient absorption post-facial.',
    batch: 'Palazzo Hyperbaric Chamber II',
  },
  {
    id: 'addon-obsidian-balm',
    name: 'Obsidian Night Recovery Lipid Infusion',
    category: 'botanical',
    dosage: '5ml Compounded',
    priceEUR: 65,
    description: 'Cold-pressed Sicilian cactus seed oil with micronized black volcanic obsidian minerals for night barrier sealing.',
    batch: 'Etna Mineral Vault #OBS-90',
  },
];

export default function Step2AddonsPage() {
  const { selectedAddons, toggleAddon } = useVipWizardStore();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
          Step 02 of 05 • Bespoke Bio-Compounding
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF9F6]">
          Apothecary Lab Add-ons &amp; Infusions
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl">
          Select small-batch active compounds to be hand-formulated by the clinic biologist specifically for this session.
        </p>
      </div>

      {/* Addons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {BESPOKE_ADDONS.map((addon) => {
          const isSelected = selectedAddons.some((a) => a.id === addon.id);

          return (
            <div
              key={addon.id}
              onClick={() => toggleAddon(addon)}
              className={`p-6 rounded-2xl border cursor-pointer select-none transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-[#181511] border-[#D4AF37] shadow-gold-glow'
                  : 'bg-[#110F0C] border-white/10 hover:border-[#D4AF37]/40 hover:bg-[#14120E]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-[#D4AF37]">
                      {addon.dosage}
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {addon.batch}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-[#FAF9F6]">
                    {addon.name}
                  </h3>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition ${
                    isSelected
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold'
                      : 'border-white/20 text-neutral-500'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                </div>
              </div>

              <p className="text-neutral-400 text-xs leading-relaxed">
                {addon.description}
              </p>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-xs">
                <span className="text-[10px] uppercase text-neutral-500 font-sans">Apothecary Fee</span>
                <span className="font-bold text-[#D4AF37] text-sm">+€{addon.priceEUR}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <Link
          href="/portal/book"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#141210] border border-white/10 text-neutral-400 hover:text-white text-xs font-mono transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </Link>

        <Link
          href="/portal/book/schedule"
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-mono text-xs uppercase tracking-widest font-bold shadow-xl transition"
        >
          <span>Continue to Schedule</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
