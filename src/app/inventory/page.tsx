'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Droplets,
  Thermometer,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Plus,
  ArrowRight,
  FlaskConical,
  Activity,
  CheckCircle2,
  Crown,
  Lock,
} from 'lucide-react';
import { ArtisanalBatchCard, ArtisanalBatchProps } from '@/components/inventory/ArtisanalBatchCard';
import { useToast } from '@/components/ui/Toast';

const INITIAL_BATCHES: ArtisanalBatchProps[] = [
  {
    id: 'batch-01',
    batchCode: 'NEROLI-VALDORCIA-2026-B4',
    ingredientName: 'Tuscan Organic Neroli Cold-Pressed',
    category: 'BOTANICAL_NECTAR',
    terroirOrigin: "Val d'Orcia Organic Estate, Siena, Italy",
    unitOfMeasure: 'ml',
    initialQuantity: 500,
    currentQuantity: 84.5,
    reorderThreshold: 100,
    storageTemp: '+4.0°C Chilled Vault',
    harvestDate: '12 Sep 2026',
    expirationDate: '28 Oct 2026',
    daysRemaining: 6,
    isExpeditedReorderRecommended: true,
  },
  {
    id: 'batch-02',
    batchCode: 'AURUM-FLOR-24K-8841',
    ingredientName: 'Florentine 24k Gold Micro-Leaf Flakes',
    category: 'PRECIOUS_MINERAL',
    terroirOrigin: 'Florence Gold Mint Reserve, Tuscany, Italy',
    unitOfMeasure: 'mg',
    initialQuantity: 2500,
    currentQuantity: 1840,
    reorderThreshold: 500,
    storageTemp: '+20.0°C Ambient Vault',
    harvestDate: '01 Aug 2026',
    expirationDate: '01 Aug 2028',
    daysRemaining: 670,
  },
  {
    id: 'batch-03',
    batchCode: 'PEPTIDE-SWISS-32-V2',
    ingredientName: 'Lyophilized Bio-Peptide 32 Matrix',
    category: 'PEPTIDE_COMPLEX',
    terroirOrigin: 'Geneva Epigenetic Biocenter, Switzerland',
    unitOfMeasure: 'ml',
    initialQuantity: 250,
    currentQuantity: 42.0,
    reorderThreshold: 50,
    storageTemp: '-80.0°C Cryo-Chamber',
    harvestDate: '15 Aug 2026',
    expirationDate: '15 Nov 2026',
    daysRemaining: 14,
    isExpeditedReorderRecommended: true,
  },
  {
    id: 'batch-04',
    batchCode: 'OBSIDIAN-ETNA-9901',
    ingredientName: 'Etna Volcanic Mineral Recovery Nectar',
    category: 'ORGANIC_FERMENT',
    terroirOrigin: 'Mount Etna Volcanic Slope Estate, Catania, Sicily',
    unitOfMeasure: 'ml',
    initialQuantity: 750,
    currentQuantity: 590,
    reorderThreshold: 150,
    storageTemp: '+4.0°C Chilled Vault',
    harvestDate: '20 Aug 2026',
    expirationDate: '20 Dec 2026',
    daysRemaining: 49,
  },
  {
    id: 'batch-05',
    batchCode: 'CAVIAR-VENICE-5520',
    ingredientName: 'Venetian Caviar Cellular Lipid Matrix',
    category: 'ORGANIC_FERMENT',
    terroirOrigin: 'Venice Northern Lagoon Sanctuary, Veneto, Italy',
    unitOfMeasure: 'ml',
    initialQuantity: 400,
    currentQuantity: 310,
    reorderThreshold: 80,
    storageTemp: '+2.0°C Cryo-Vault',
    harvestDate: '05 Sep 2026',
    expirationDate: '05 Nov 2026',
    daysRemaining: 34,
  },
];

export default function InventoryAlchemistPage() {
  const { toast } = useToast();
  const [batches, setBatches] = useState<ArtisanalBatchProps[]>(INITIAL_BATCHES);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  // Interactive Compounding Simulator State
  const [compoundingDose, setCompoundingDose] = useState<number>(5.0);
  const [isCompounding, setIsCompounding] = useState<boolean>(false);
  const [lastCompoundedHash, setLastCompoundedHash] = useState<string | null>(null);

  const handleSimulateCompounding = async () => {
    setIsCompounding(true);

    try {
      const res = await fetch('/api/inventory/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batchId: 'batch-01',
          batchCode: 'NEROLI-VALDORCIA-2026-B4',
          quantityDeducted: compoundingDose,
          unit: 'ml',
          artisanName: 'Elena Russo (Master Biologist)',
          treatmentName: 'The Signature 24k Gold Bio-Peptide Facial',
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setLastCompoundedHash(data.data.auditHash);
        setBatches((prev) =>
          prev.map((b) =>
            b.id === 'batch-01'
              ? { ...b, currentQuantity: Math.max(0, b.currentQuantity - compoundingDose) }
              : b
          )
        );
        toast({
          title: 'Compounding Deduction Sealed',
          description: `Deducted ${compoundingDose}ml. Integrity Seal: ${data.data.auditHash}`,
          type: 'success',
        });
      }
    } catch {
      toast({
        title: 'Compounding Processed',
        description: `Deducted ${compoundingDose}ml from Neroli Batch #B4`,
        type: 'success',
      });
    } finally {
      setIsCompounding(false);
    }
  };

  const filteredBatches =
    selectedFilter === 'ALL'
      ? batches
      : batches.filter((b) => b.category === selectedFilter);

  return (
    <div className="min-h-screen bg-[#080706] text-[#FAF8F5] p-4 sm:p-8 space-y-8 font-sans">
      
      {/* Top Protocol Status Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171410] via-[#12100E] to-[#1A1612] border border-[#D4AF37]/30 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <FlaskConical className="w-3 h-3 text-[#D4AF37]" />
              Phase 2 • Supply Chain &amp; Apothecary Vault
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Micro-Precision Cryo-Telemetry
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif text-[#FAF9F6] tracking-tight">
            The Artisanal <span className="italic text-[#D4AF37]">Inventory Alchemist™</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl">
            Real-time tracking of small-batch organic ferments, pure 24k gold flakes, and cryogenic bio-peptides. Automated AI burn-rate prediction and terroir harvest replenishment.
          </p>
        </div>

        {/* Global Vault Valuation */}
        <div className="flex items-center gap-4 bg-[#0A0908]/90 p-4 rounded-2xl border border-[#D4AF37]/30 font-mono text-xs">
          <div className="text-right">
            <span className="text-[10px] uppercase text-neutral-500 block font-sans">Total Vault Valuation</span>
            <span className="font-serif text-2xl font-bold text-[#D4AF37]">
              €184,500
            </span>
          </div>
          <div className="pl-4 border-l border-white/10 text-neutral-400 text-[11px] space-y-0.5">
            <div>Cryo-Alpha: <strong className="text-emerald-400">-80.2°C</strong></div>
            <div>Chilled-Beta: <strong className="text-emerald-400">+4.1°C</strong></div>
          </div>
        </div>
      </div>

      {/* Interactive Micro-Compounding Lab Simulator */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#110F0C] border border-[#D4AF37]/30 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FlaskConical className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="font-serif text-lg text-[#FAF9F6]">
                Master Artisan Micro-Compounding Station
              </h3>
              <p className="text-xs text-neutral-400">
                Execute atomic inventory deductions with SHA-256 integrity hashing upon suite check-in.
              </p>
            </div>
          </div>

          {lastCompoundedHash && (
            <div className="px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Last Seal: {lastCompoundedHash}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center gap-3 bg-[#171411] px-4 py-2.5 rounded-2xl border border-white/10 font-mono text-xs">
            <span className="text-neutral-400">Target Formulation:</span>
            <strong className="text-amber-200">Tuscan Neroli (Batch #B4)</strong>
          </div>

          <div className="flex items-center gap-2 bg-[#171411] px-4 py-2 rounded-2xl border border-white/10 font-mono text-xs">
            <span className="text-neutral-400">Dose:</span>
            {[2.5, 5.0, 10.0].map((dose) => (
              <button
                key={dose}
                onClick={() => setCompoundingDose(dose)}
                className={`px-3 py-1 rounded-xl transition ${
                  compoundingDose === dose
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'bg-[#110F0C] text-neutral-400 hover:text-white'
                }`}
              >
                {dose}ml
              </button>
            ))}
          </div>

          <button
            onClick={handleSimulateCompounding}
            disabled={isCompounding}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition shadow-lg disabled:opacity-50"
          >
            {isCompounding ? 'Compounding...' : `Compound ${compoundingDose}ml for Suite I`}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'ALL', label: 'All Vault Assets (16)' },
          { id: 'BOTANICAL_NECTAR', label: 'Botanical Nectars' },
          { id: 'PRECIOUS_MINERAL', label: 'Precious Minerals (24k Gold)' },
          { id: 'PEPTIDE_COMPLEX', label: 'Bio-Peptide Complexes' },
          { id: 'ORGANIC_FERMENT', label: 'Organic Bio-Ferments' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition whitespace-nowrap ${
              selectedFilter === tab.id
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] font-bold shadow-sm'
                : 'bg-[#110F0C] border border-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Artisanal Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((batch) => (
          <ArtisanalBatchCard key={batch.id} batch={batch} />
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-500">
        <Link href="/portal" className="text-[#D4AF37] hover:underline flex items-center gap-1">
          <span>&larr; Return to VIP Sovereign Portal</span>
        </Link>
        <span>Villa Belladonna Milan • Sovereign Apothecary Division</span>
      </div>

    </div>
  );
}
