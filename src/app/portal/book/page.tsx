'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useVipWizardStore } from '@/store/useVipWizardStore';
import { TreatmentSelectionCard, TreatmentProps } from '@/components/portal/TreatmentSelectionCard';

const TREATMENTS_CATALOG: TreatmentProps[] = [
  {
    id: 'signature-24k-facial',
    title: 'The Signature 24k Gold Bio-Peptide Facial',
    subtitle: 'Cellular Longevity & Gold Infusion',
    durationMinutes: 90,
    priceEUR: 280,
    description:
      'A multi-phase Milanese aesthetic ceremony featuring diamond micro-dermabrasion, suspended 24k gold leaf micro-infusion, and cryogenic lymphatic contouring.',
    highlights: ['Pure 24k Gold Flakes', 'Bio-Peptides 32 Matrix', 'Cryo Lymphatic Sculpt'],
    batchProvenance: 'Siena Neroli & Gold Vault Batch #8841-B',
    isPopular: true,
  },
  {
    id: 'volcanic-hot-stone-recovery',
    title: 'Volcanic Hot Stone & Botanical Cellular Recovery',
    subtitle: 'Amalfi Basalt & Mediterranean Nectar',
    durationMinutes: 75,
    priceEUR: 220,
    description:
      'Deep neuromuscular recovery incorporating heated volcanic basalt stones from Pantelleria, organic cold-pressed Tuscan neroli oil, and acupressure alignment.',
    highlights: ['Pantelleria Basalt', 'Tuscan Neroli Oil', 'Deep Neuromuscular Recovery'],
    batchProvenance: 'Cold-Pressed Neroli Batch #7719-A',
  },
  {
    id: 'haute-coiffure-caviar',
    title: 'Haute Hair Sculpture & Venetian Caviar Gloss',
    subtitle: 'Dimensional Color & Pure Keratin Matrix',
    durationMinutes: 75,
    priceEUR: 180,
    description:
      'Hand-painted dimensional balayage gloss paired with wild Venetian caviar lipid infusion and signature palazzo blowout for galas and fashion week.',
    highlights: ['Venetian Caviar Nectar', 'Keratin Lipid Balm', 'Bespoke Tonal Gloss'],
    batchProvenance: 'Venetian Caviar Lipid Vault #5520',
  },
  {
    id: 'carrara-rose-quartz-manicure',
    title: 'Carrara Rose Quartz Manicure & Hand Therapy',
    subtitle: 'Thermal Paraffin & Silk Porcelain Polish',
    durationMinutes: 45,
    priceEUR: 110,
    description:
      'Diamond dust cuticle refinement, rose quartz crystal lymphatic hand massage, and warm botanical paraffin glove treatment with long-wear porcelain enamel.',
    highlights: ['Rose Quartz Crystal', 'Warm Paraffin Cocoon', 'Porcelain Silk Enamel'],
    batchProvenance: 'Carrara Botanical Wax Batch #3312',
  },
];

export default function Step1TreatmentSelectionPage() {
  const { selectedTreatmentId, setTreatment } = useVipWizardStore();

  const handleSelect = (t: TreatmentProps) => {
    setTreatment(t.id, t.title, t.priceEUR, t.durationMinutes);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
          Step 01 of 05 • Ceremony Matrix
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF9F6]">
          Select Primary Longevity Ceremony
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl">
          Each protocol is executed by a dedicated Master Aesthetician within a private, acoustic-isolated Carrara suite.
        </p>
      </div>

      {/* Grid of Treatments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TREATMENTS_CATALOG.map((t) => (
          <TreatmentSelectionCard
            key={t.id}
            treatment={t}
            isSelected={selectedTreatmentId === t.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <div className="text-xs font-mono text-neutral-400">
          <span>Selected Protocol: </span>
          <strong className="text-[#D4AF37]">
            {TREATMENTS_CATALOG.find((t) => t.id === selectedTreatmentId)?.title || 'None'}
          </strong>
        </div>

        <Link
          href="/portal/book/add-ons"
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-mono text-xs uppercase tracking-widest font-bold shadow-xl transition"
        >
          <span>Continue to Bio-Addons</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
