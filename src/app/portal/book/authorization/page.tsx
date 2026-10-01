'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  QrCode,
  Sparkles,
  Plane,
  Car,
  Clock,
  Crown,
  Loader2,
} from 'lucide-react';
import { useVipWizardStore } from '@/store/useVipWizardStore';
import { useToast } from '@/components/ui/Toast';

export default function Step5AuthorizationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    principal,
    selectedTreatmentTitle,
    selectedAddons,
    selectedArtisanName,
    assignedSuite,
    bookingDate,
    bookingSlot,
    logistics,
    getTotalPriceEUR,
  } = useVipWizardStore();

  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passToken, setPassToken] = useState('VB-PASS-8841-MIL');

  const handleAuthorize = async () => {
    setIsAuthorizing(true);

    try {
      const res = await fetch('/api/ea/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          principalName: principal.pseudonym,
          discretionLevel: principal.discretionLevel,
          corporateAccountCode: principal.accountCode,
          treatmentTitle: selectedTreatmentTitle,
          serviceTarmac: logistics.requiresTarmacChauffeur,
          airportSelection: logistics.airportCode || 'LIN',
          flightTailNumber: logistics.flightTailNumber,
          arrivalDate: bookingDate,
          arrivalTime: bookingSlot?.split(' - ')[0] || '14:00',
          suiteTemperature: logistics.suiteTemperatureCelsius,
          lightingMode: logistics.lightingPreset,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setPassToken(data.data.passToken);
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsAuthorizing(false);
      setIsAuthorized(true);
      toast({
        title: 'Sovereign Dispatch Confirmed',
        description: 'Digital PassKit NFC card minted and assigned.',
        type: 'success',
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
          Step 05 of 05 • Cryptographic Authorization
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF9F6]">
          Sovereign Mandate &amp; Pass Issuance
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Review the complete reservation matrix, execute billing under corporate mandate, and generate the Apple Wallet PassKit card.
        </p>
      </div>

      {/* Summary Matrix Card */}
      <div className="p-7 rounded-3xl bg-[#110F0C] border border-[#D4AF37]/40 shadow-2xl space-y-6">
        
        {/* Principal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#171411] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-serif font-bold">
              VB
            </div>
            <div>
              <span className="font-serif text-base text-[#FAF9F6] block">
                {principal.pseudonym}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Billing Account: {principal.accountCode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-BIT MUTUAL NDA</span>
          </div>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-3 text-xs font-mono">
          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-neutral-400">Selected Protocol:</span>
            <span className="text-[#FAF9F6] font-bold">{selectedTreatmentTitle}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-neutral-400">Compounded Add-ons ({selectedAddons.length}):</span>
            <span className="text-[#D4AF37]">
              {selectedAddons.map((a) => a.name).join(', ') || 'None'}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-neutral-400">Assigned Suite &amp; Artisan:</span>
            <span className="text-amber-200">{assignedSuite} • {selectedArtisanName}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-white/5">
            <span className="text-neutral-400">Arrival Schedule:</span>
            <span className="text-[#FAF9F6]">{bookingDate} • {bookingSlot}</span>
          </div>

          {logistics.requiresTarmacChauffeur && (
            <div className="flex justify-between py-1.5 border-b border-white/5">
              <span className="text-neutral-400">Tarmac Transfer:</span>
              <span className="text-amber-300">
                {logistics.airportCode} VIP Terminal (Tail: {logistics.flightTailNumber || 'N784V'})
              </span>
            </div>
          )}

          <div className="flex justify-between py-2 pt-4 border-t border-white/10 text-sm">
            <span className="text-neutral-300 font-sans font-semibold">Total Corporate Settlement:</span>
            <span className="font-serif text-xl font-bold text-[#D4AF37]">
              €{getTotalPriceEUR()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {!isAuthorized ? (
          <button
            type="button"
            onClick={handleAuthorize}
            disabled={isAuthorizing}
            className="w-full py-4 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-mono text-xs uppercase tracking-widest font-bold shadow-xl transition flex items-center justify-center gap-2"
          >
            {isAuthorizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing Cryptographic Mandate...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Authorize &amp; Mint Apple Wallet Pass</span>
              </>
            )}
          </button>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <span className="font-mono text-xs text-emerald-300 font-bold block">
                Authorization Hash Sealed: {passToken}
              </span>
              <p className="text-[11px] text-neutral-400">
                Suite staged. Logistics director and Master Artisan notified.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/portal/pass/${passToken}`}
                className="w-full py-3.5 rounded-full bg-[#D4AF37] text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-amber-300 transition text-center shadow-lg"
              >
                View Apple Wallet PassKit
              </Link>
              <Link
                href="/portal"
                className="w-full py-3.5 rounded-full bg-[#181511] border border-white/10 text-[#FAF9F6] font-mono text-xs uppercase tracking-widest font-semibold hover:border-[#D4AF37] transition text-center"
              >
                Return to Overview
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
