// ============================================================================
// File: src/components/portal/VipBookingFlow.tsx
// Purpose: Complete Multi-Step Sovereign VIP & EA Booking Funnel
// ============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Plane,
  Car,
  Thermometer,
  Flame,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Crown,
  User,
  Sliders,
  CreditCard,
  QrCode,
  Download,
} from 'lucide-react';
import { useVipBookingStore, PrincipalProfile } from '@/store/useVipBookingStore';
import { TreatmentCard, TreatmentItem } from './TreatmentCard';
import { useToast } from '@/components/ui/Toast';

const VIP_TREATMENTS: TreatmentItem[] = [
  {
    id: 'signature-facial',
    title: 'The Signature 24k Gold Bio-Peptide Facial',
    subtitle: 'Cellular Longevity & Gold Infusion',
    durationMinutes: 90,
    priceEUR: 280,
    priceUSD: 310,
    description:
      'A multi-phase Milanese aesthetic ceremony featuring diamond dermabrasion, suspended 24k gold leaf micro-infusion, and cryogenic lymphatic contouring.',
    highlights: ['Pure 24k Gold Flakes', 'Bio-Peptides 32', 'Cryo Sculpting'],
    imageUrl: '/images/facial.jpg',
    tag: 'Villa Signature',
  },
  {
    id: 'volcanic-stone-massage',
    title: 'Volcanic Hot Stone & Botanical Cellular Recovery',
    subtitle: 'Amalfi Basalt & Mediterranean Nectar',
    durationMinutes: 75,
    priceEUR: 220,
    priceUSD: 245,
    description:
      'Deep neuromuscular recovery incorporating heated volcanic basalt stones from Pantelleria, organic cold-pressed Tuscan neroli oil, and acupressure alignment.',
    highlights: ['Pantelleria Basalt', 'Tuscan Neroli Oil', 'Deep Recovery'],
    imageUrl: '/images/massage.jpg',
    tag: 'Tarmac Recovery',
  },
  {
    id: 'haute-coiffure-caviar',
    title: 'Haute Hair Sculpture & Venetian Caviar Gloss',
    subtitle: 'Dimensional Color & Pure Keratin Matrix',
    durationMinutes: 75,
    priceEUR: 180,
    priceUSD: 200,
    description:
      'Hand-painted dimensional balayage gloss paired with wild Venetian caviar lipid infusion and signature palazzo blowout for galas and fashion week.',
    highlights: ['Venetian Caviar Nectar', 'Keratin Lipid Balm', 'Bespoke Tonal Gloss'],
    imageUrl: '/images/hair.jpg',
    tag: 'Fashion Week VIP',
  },
  {
    id: 'carrara-manicure-ceremony',
    title: 'Carrara Rose Quartz Manicure & Hand Therapy',
    subtitle: 'Thermal Paraffin & Silk Polish',
    durationMinutes: 45,
    priceEUR: 110,
    priceUSD: 125,
    description:
      'Diamond dust cuticle refinement, rose quartz crystal lymphatic hand massage, and warm botanical paraffin glove treatment with long-wear porcelain enamel.',
    highlights: ['Rose Quartz Crystal', 'Warm Paraffin Cocoon', 'Porcelain Enamel'],
    imageUrl: '/images/manicure.jpg',
    tag: 'Essential Express',
  },
];

const ARTISANS = [
  {
    id: 'artisan-elena-russo',
    name: 'Elena Russo',
    title: 'Master Aesthetician & Biologist',
    suite: 'Private Suite 1 (Carrara)',
    experience: '12+ Years Luxury Practice',
    avatar: '/images/belladonna_artisan_alessia.jpg',
  },
  {
    id: 'artisan-chiara-belladonna',
    name: 'Chiara Belladonna',
    title: 'Lead Facialist & Co-Founder',
    suite: 'Private Suite 2 (Marble & Gold)',
    experience: '10+ Years Milanese Spa Practice',
    avatar: '/images/belladonna_artisan_chiara.jpg',
  },
  {
    id: 'artisan-matteo-romano',
    name: 'Matteo Romano',
    title: 'Amalfi Wellness & Recovery Specialist',
    suite: 'Private Suite 3 (Obsidian)',
    experience: '10+ Years 5-Star Spa Practice',
    avatar: '/images/belladonna_artisan_matteo.jpg',
  },
];

const TIME_SLOTS = [
  '10:00 - 11:30 AM',
  '12:00 - 13:30 PM',
  '14:00 - 15:30 PM',
  '16:00 - 17:30 PM',
  '18:00 - 19:30 PM',
];

const PRINCIPALS_VAULT: PrincipalProfile[] = [
  {
    id: 'p-01',
    pseudonym: 'AURUM-09',
    legalNameAlias: 'Lady H. (Sovereign)',
    billingCode: 'FO-MIL-8841',
    discretionLevel: 'STRICT_NDA',
  },
  {
    id: 'p-02',
    pseudonym: 'SOVEREIGN-44',
    legalNameAlias: 'Lord Julian V.',
    billingCode: 'FO-LON-9921',
    discretionLevel: 'SOVEREIGN',
  },
  {
    id: 'p-03',
    pseudonym: 'PALAZZO-VIP-12',
    legalNameAlias: 'Madame Sophie D.',
    billingCode: 'FO-PAR-1044',
    discretionLevel: 'STANDARD',
  },
];

export function VipBookingFlow() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const {
    selectedPrincipal,
    setSelectedPrincipal,
    selectedTreatmentId,
    setSelectedTreatmentId,
    selectedArtisanId,
    setSelectedArtisanId,
    bookingDate,
    bookingTimeSlot,
    setSchedule,
    needsChauffeur,
    setNeedsChauffeur,
    airportCode,
    flightTailNumber,
    setLogistics,
    suiteTemperature,
    lightingMode,
    setAmbience,
    currency,
    setCurrency,
  } = useVipBookingStore();

  const selectedTreatment =
    VIP_TREATMENTS.find((t) => t.id === selectedTreatmentId) || VIP_TREATMENTS[0];
  const selectedArtisan =
    ARTISANS.find((a) => a.id === selectedArtisanId) || ARTISANS[0];

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedTreatmentId) {
      toast({ title: 'Please select a luxury ceremony', type: 'error' });
      return;
    }
    if (currentStep === 2 && (!bookingDate || !bookingTimeSlot)) {
      toast({ title: 'Please choose an artisan and time slot', type: 'error' });
      return;
    }
    setCurrentStep((prev) => (Math.min(4, prev + 1) as any));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (Math.max(1, prev - 1) as any));
  };

  const handleAuthorizePass = () => {
    toast({
      title: 'Digital Suite Key & NFC Pass Dispatched',
      description: `Protocol authorized under billing code ${selectedPrincipal.billingCode}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Top Multi-Step Progress Tracker */}
      <div className="bg-[#141210] border border-amber-900/30 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Principal Selector Pill */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-300">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block">
              Active Principal
            </span>
            <select
              value={selectedPrincipal.id}
              onChange={(e) => {
                const found = PRINCIPALS_VAULT.find((p) => p.id === e.target.value);
                if (found) setSelectedPrincipal(found);
              }}
              className="bg-transparent font-serif text-sm font-medium text-amber-200 focus:outline-none cursor-pointer"
            >
              {PRINCIPALS_VAULT.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#161412]">
                  {p.pseudonym} — {p.legalNameAlias}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          {[
            { step: 1, label: '01. Ceremony' },
            { step: 2, label: '02. Artisan & Slot' },
            { step: 3, label: '03. Logistics & Suite' },
            { step: 4, label: '04. Encrypted Pass' },
          ].map((s) => (
            <div
              key={s.step}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                currentStep === s.step
                  ? 'bg-amber-950 border border-amber-600 text-amber-300 font-bold'
                  : currentStep > s.step
                  ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-400'
                  : 'text-neutral-500'
              }`}
            >
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#0E0C0A] border border-amber-900/30">
          {(['EUR', 'USD'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-0.5 rounded-full text-xs font-mono font-semibold transition ${
                currency === c ? 'bg-amber-700 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: CEREMONY SELECTION */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Step 01 • Curated Ritual</span>
            <h2 className="text-3xl font-serif text-amber-100">Select Bespoke Treatment Ceremony</h2>
            <p className="text-xs text-neutral-400">
              Formulated with organic Tuscan bio-ferments, 24k gold leaf, and mineral volcanic lipids.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VIP_TREATMENTS.map((treatment) => (
              <TreatmentCard
                key={treatment.id}
                treatment={treatment}
                isSelected={selectedTreatmentId === treatment.id}
                currency={currency}
                onSelect={(id) => setSelectedTreatmentId(id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: ARTISAN & SCHEDULE */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Step 02 • Master Artisan &amp; Suite</span>
            <h2 className="text-3xl font-serif text-amber-100">Assign Certified Specialist &amp; Timeline</h2>
          </div>

          {/* Artisan Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {ARTISANS.map((artisan) => {
              const isSelected = selectedArtisanId === artisan.id;
              return (
                <div
                  key={artisan.id}
                  onClick={() => setSelectedArtisanId(artisan.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 shadow-xl ring-1 ring-amber-500/50'
                      : 'bg-[#141210] border-amber-900/30 hover:border-amber-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-amber-200">{artisan.name}</span>
                    <span className="text-[10px] font-mono text-amber-400">{artisan.suite}</span>
                  </div>
                  <p className="text-xs text-neutral-400">{artisan.title}</p>
                  <span className="text-[11px] text-neutral-500 font-mono block">{artisan.experience}</span>
                </div>
              );
            })}
          </div>

          {/* Date & Time Slot Grid */}
          <div className="bg-[#141210] border border-amber-900/30 rounded-2xl p-6 space-y-4">
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-400 block">
              Available Time Slots • Milan Time (CET)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {TIME_SLOTS.map((slot) => {
                const isSelected = bookingTimeSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSchedule(bookingDate || '2026-10-15', slot)}
                    className={`py-3 px-3 rounded-xl border text-xs font-mono transition ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white border-amber-500 font-bold shadow-lg'
                        : 'bg-[#0E0C0A] border-amber-900/30 text-neutral-300 hover:border-amber-600'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: LOGISTICS & SUITE AMBIENCE */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Step 03 • Tarmac &amp; Suite Protocols</span>
            <h2 className="text-3xl font-serif text-amber-100">Coordinate Inbound Valet &amp; Ambience</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tarmac Logistics Box */}
            <div className="bg-[#141210] border border-amber-900/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-amber-900/30">
                <Plane className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif text-lg text-amber-100">Private Aviation Arrival</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Arrival Airport</label>
                  <select
                    value={airportCode || 'LIN'}
                    onChange={(e) => setLogistics(e.target.value as any, flightTailNumber)}
                    className="w-full rounded-xl bg-[#0E0C0A] border border-amber-900/30 p-3 text-xs text-amber-200 focus:outline-none"
                  >
                    <option value="LIN">Milan Linate Prime (LIN) - VIP Terminal</option>
                    <option value="MXP">Milan Malpensa Prime (MXP) - Terminal 2</option>
                    <option value="BGY">Bergamo BGY Prime</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Jet Tail Number (Optional for Live Sync)</label>
                  <input
                    type="text"
                    value={flightTailNumber}
                    onChange={(e) => setLogistics(airportCode, e.target.value)}
                    placeholder="e.g. NetJets Tail #N784V"
                    className="w-full rounded-xl bg-[#0E0C0A] border border-amber-900/30 p-3 text-xs text-amber-200 focus:outline-none font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-neutral-300">Maybach S680 Chauffeur Meet &amp; Greet</span>
                  <input
                    type="checkbox"
                    checked={needsChauffeur}
                    onChange={(e) => setNeedsChauffeur(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Suite Ambience Presets */}
            <div className="bg-[#141210] border border-amber-900/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-amber-900/30">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif text-lg text-amber-100">Private Suite Ambience Presets</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Pre-Warmed Suite Temperature</span>
                    <span className="font-mono text-amber-300 font-bold">{suiteTemperature}°C</span>
                  </div>
                  <input
                    type="range"
                    min={19}
                    max={25}
                    step={0.5}
                    value={suiteTemperature}
                    onChange={(e) => setAmbience(+e.target.value, lightingMode)}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Suite Lighting Mode</label>
                  <select
                    value={lightingMode}
                    onChange={(e) => setAmbience(suiteTemperature, e.target.value as any)}
                    className="w-full rounded-xl bg-[#0E0C0A] border border-amber-900/30 p-3 text-xs text-amber-200 focus:outline-none"
                  >
                    <option value="candlelight_1800k">1800K Intimate Candlelight (Recommended)</option>
                    <option value="warm_2700k">2700K Warm Milanese Dusk</option>
                    <option value="clinical_4000k">4000K Clinical Dermal Daylight</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* STEP 4: ENCRYPTED CONFIRMATION & PASS */}
      {currentStep === 4 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Step 04 • Encrypted Authorization</span>
            <h2 className="text-3xl font-serif text-amber-100">Dispatched VIP Digital Suite Pass</h2>
          </div>

          {/* Digital NFC Pass Mockup */}
          <div className="bg-gradient-to-br from-[#1E1B17] via-[#161412] to-black border-2 border-amber-500/60 rounded-3xl p-7 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold">
                  VB
                </div>
                <div>
                  <span className="font-serif text-base text-amber-100 block">Villa Belladonna Milan</span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                    Sovereign Suite Access Pass
                  </span>
                </div>
              </div>
              <QrCode className="w-8 h-8 text-amber-300" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-mono">Principal</span>
                <span className="font-serif text-base text-amber-200">{selectedPrincipal.pseudonym}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-mono">Billing Account</span>
                <span className="font-mono text-amber-200 font-bold">{selectedPrincipal.billingCode}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-mono">Ceremony &amp; Suite</span>
                <span className="text-amber-100">{selectedTreatment.title}</span>
                <span className="text-[10px] text-amber-400 font-mono block mt-0.5">{selectedArtisan.suite}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-mono">Schedule</span>
                <span className="font-mono text-amber-200 font-bold">{bookingTimeSlot || '14:00 - 15:30'}</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">{bookingDate || '2026-10-15'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>256-BIT ENCRYPTED • MUTUAL NDA ACTIVE</span>
              </div>
              <button
                onClick={handleAuthorizePass}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 text-white font-medium text-xs shadow-lg hover:from-amber-600 hover:to-amber-500 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Add to Apple Wallet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Step Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-amber-900/30">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#141210] border border-amber-900/40 text-xs font-mono uppercase tracking-widest text-neutral-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>
        ) : <div />}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white text-xs font-mono uppercase tracking-widest font-bold shadow-xl transition"
          >
            <span>Continue to Step 0{currentStep + 1}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href="/portal/dashboard"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 text-white text-xs font-mono uppercase tracking-widest font-bold shadow-xl transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Return to Executive Dashboard</span>
          </Link>
        )}
      </div>

    </div>
  );
}
