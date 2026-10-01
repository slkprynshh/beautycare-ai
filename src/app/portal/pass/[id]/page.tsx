'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  ShieldCheck,
  Crown,
  Sparkles,
  Calendar,
  Clock,
  UserCheck,
  Thermometer,
  Flame,
  Plane,
  Car,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Smartphone,
  Radio,
  Wifi,
  Key,
} from 'lucide-react';
import { useVipBookingStore } from '@/store/useVipBookingStore';
import { useToast } from '@/components/ui/Toast';

export default function VipPassDetailPage({ params }: { params: { id: string } }) {
  const {
    selectedPrincipal,
    bookingDate,
    bookingTimeSlot,
    suiteTemperature,
    lightingMode,
    airportCode,
    flightTailNumber,
  } = useVipBookingStore();

  const { toast } = useToast();
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(58);
  const [isNfcActive, setIsNfcActive] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsUntilRefresh((prev) => (prev <= 1 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateNfc = () => {
    setIsNfcActive(true);
    setNfcSuccess(false);

    setTimeout(() => {
      setIsNfcActive(false);
      setNfcSuccess(true);
      toast({ title: 'NFC Clearance Validated', description: 'Carrara Suite I Unlocked & Calibrated', type: 'success' });
      setTimeout(() => setNfcSuccess(false), 4000);
    }, 1800);
  };

  const handleDownloadWallet = () => {
    toast({ title: 'Apple Wallet PassKit Generated', description: 'Ready to add to your Apple Wallet (.pkpass)', type: 'success' });
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Encrypted Pass Link Copied', description: 'Secure token copied to clipboard', type: 'success' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/portal"
          className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-amber-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sovereign Portal</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-[#141210] border border-amber-900/40 text-neutral-300 hover:text-amber-200 transition"
            title="Share Encrypted Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-[#141210] border border-amber-900/40 text-neutral-300 hover:text-amber-200 transition"
            title="Print Pass"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Digital Pass Card */}
      <div className="bg-gradient-to-br from-[#1F1B16] via-[#141210] to-[#0A0908] border-2 border-amber-500/60 rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-8">
        
        {/* Ambient Gold Sheen */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

        {/* Pass Header */}
        <div className="flex items-start justify-between pb-6 border-b border-amber-500/20 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-400/50 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
              VB
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-amber-100 tracking-tight">
                Villa Belladonna Milan
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block font-semibold">
                Sovereign Suite Access PassKit
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">Pass ID</span>
            <span className="font-mono text-xs font-bold text-amber-300">
              {params.id === 'latest' ? 'VB-PASS-8841-MIL' : params.id}
            </span>
          </div>
        </div>

        {/* Dynamic Encrypted QR Code & NFC Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center relative z-10">
          
          {/* Live QR Box */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#090807] border border-amber-500/40 shadow-inner space-y-3">
            <div className="relative p-2 bg-white rounded-xl shadow-md">
              <QrCode className="w-32 h-32 text-black" />
            </div>

            <div className="text-center">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Dynamic Token: {secondsUntilRefresh}s
              </span>
              <span className="text-[9px] font-mono text-neutral-500 block mt-0.5">
                Refreshes automatically
              </span>
            </div>
          </div>

          {/* NFC Tap & Gate Terminal Simulator */}
          <div className="sm:col-span-2 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                Contactless NFC Terminal Touch
              </span>
              <h3 className="font-serif text-lg text-amber-100">
                Hold Device Near Carrara Suite Reader
              </h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Palazzo Belladonna private gates, elevators, and Carrara suites utilize sovereign cryptographic NFC tokens.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSimulateNfc}
                disabled={isNfcActive}
                className={`w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-mono text-xs uppercase tracking-wider font-bold transition shadow-lg ${
                  nfcSuccess
                    ? 'bg-emerald-600 text-white'
                    : isNfcActive
                    ? 'bg-amber-600 text-white animate-pulse'
                    : 'bg-[#181512] border border-amber-500/50 text-amber-200 hover:bg-amber-500/20'
                }`}
              >
                {nfcSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Access Granted • Suite I Unlocked</span>
                  </>
                ) : isNfcActive ? (
                  <>
                    <Wifi className="w-4 h-4 animate-spin" />
                    <span>Validating 256-Bit NFC Token...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Simulate Contactless Suite Reader Tap</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Detailed Suite & Logistics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs relative z-10 pt-4 border-t border-amber-500/20">
          <div>
            <span className="text-neutral-500 block text-[10px] font-mono uppercase">Principal</span>
            <span className="font-serif text-sm text-amber-200 font-bold block mt-0.5">
              {selectedPrincipal.pseudonym}
            </span>
            <span className="text-[9px] font-mono text-neutral-400">{selectedPrincipal.billingCode}</span>
          </div>

          <div>
            <span className="text-neutral-500 block text-[10px] font-mono uppercase">Ceremony</span>
            <span className="text-amber-100 font-medium block mt-0.5 truncate">
              24k Gold Bio-Peptide Facial
            </span>
            <span className="text-[9px] font-mono text-amber-400">Elena Russo (Biologist)</span>
          </div>

          <div>
            <span className="text-neutral-500 block text-[10px] font-mono uppercase">Schedule</span>
            <span className="font-mono text-amber-200 font-bold block mt-0.5">
              {bookingTimeSlot || '14:00 - 15:30'}
            </span>
            <span className="text-[9px] font-mono text-neutral-400">{bookingDate || '2026-10-15'}</span>
          </div>

          <div>
            <span className="text-neutral-500 block text-[10px] font-mono uppercase">Suite Ambiance</span>
            <span className="font-mono text-amber-200 font-bold block mt-0.5">
              {suiteTemperature}°C • 1800K
            </span>
            <span className="text-[9px] font-mono text-neutral-400">Carrara Suite I</span>
          </div>
        </div>

        {/* Tarmac & Ground Logistics Footer */}
        <div className="p-4 rounded-2xl bg-[#0B0A08] border border-amber-900/40 flex flex-wrap items-center justify-between gap-4 text-xs font-mono relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-neutral-300">
              <Plane className="w-4 h-4 text-amber-400" />
              <span>LIN Tarmac Tail: <strong className="text-amber-200">{flightTailNumber || 'N784V'}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Car className="w-4 h-4 text-amber-400" />
              <span>Maybach Plate: <strong className="text-amber-200">MI 8841 VB</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MUTUAL SOVEREIGN NDA PROTOCOL</span>
          </div>
        </div>

        {/* Action Button: Apple Wallet */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 relative z-10">
          <button
            onClick={handleDownloadWallet}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-mono text-xs uppercase tracking-widest font-bold shadow-xl transition"
          >
            <Download className="w-4 h-4" />
            <span>Add Pass to Apple Wallet</span>
          </button>

          <Link
            href="/portal/concierge"
            className="text-xs font-mono text-amber-300 hover:underline flex items-center gap-1"
          >
            <span>Need amendments? Contact Chief Concierge</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
