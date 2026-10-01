'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Check, ArrowRight, ShieldCheck, Crown } from 'lucide-react';
import { useVipWizardStore } from '@/store/useVipWizardStore';

const STEPS = [
  { path: '/portal/book', label: '01 Ceremony', exact: true },
  { path: '/portal/book/add-ons', label: '02 Bio-Addons' },
  { path: '/portal/book/schedule', label: '03 Artisan & Suite' },
  { path: '/portal/book/logistics', label: '04 Tarmac & Logistics' },
  { path: '/portal/book/authorization', label: '05 Sovereign Pass' },
];

export default function BookWizardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { principal, getTotalPriceEUR, selectedTreatmentTitle } = useVipWizardStore();

  const currentStepIndex = STEPS.findIndex((s) =>
    s.exact ? pathname === s.path : pathname?.startsWith(s.path)
  );

  return (
    <div className="space-y-8">
      
      {/* Wizard Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#110F0C] border border-[#D4AF37]/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1.5">
              <Crown className="w-3 h-3 text-[#D4AF37]" />
              Sovereign Reservation Wizard
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-[10px] font-mono text-emerald-400">
              Delegation: {principal.pseudonym}
            </span>
          </div>
          <h2 className="font-serif text-lg text-[#FAF9F6]">
            {selectedTreatmentTitle || 'Select Bespoke Aesthetic Protocol'}
          </h2>
        </div>

        {/* Investment Summary & Step Progress */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="text-right">
            <span className="text-[10px] uppercase text-neutral-500 block">Total Investment</span>
            <span className="font-serif text-xl font-bold text-[#D4AF37]">
              €{getTotalPriceEUR()}
            </span>
          </div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between overflow-x-auto pb-2 no-scrollbar gap-2">
        {STEPS.map((step, idx) => {
          const isActive = step.exact ? pathname === step.path : pathname?.startsWith(step.path);
          const isPassed = currentStepIndex > idx;

          return (
            <Link
              key={step.path}
              href={step.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/60 text-[#D4AF37] font-bold shadow-sm'
                  : isPassed
                  ? 'bg-[#171411] border border-emerald-500/30 text-emerald-400'
                  : 'bg-[#110F0C] border border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {isPassed ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-black/40 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
              )}
              <span>{step.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="relative">
        {children}
      </div>

    </div>
  );
}
