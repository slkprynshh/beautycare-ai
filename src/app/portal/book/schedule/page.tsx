'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, UserCheck, Calendar as CalendarIcon, Clock, Crown, Shield } from 'lucide-react';
import { useVipWizardStore } from '@/store/useVipWizardStore';

const ARTISANS = [
  {
    id: 'artisan-elena-russo',
    name: 'Elena Russo',
    title: 'Master Aesthetician & Biologist',
    suite: 'Carrara Marble Suite I',
    focus: 'Cellular Infusion & 24k Gold',
    badge: 'Lead Aesthetician',
  },
  {
    id: 'artisan-alessia-belladonna',
    name: 'Alessia V.',
    title: 'Director of Longevity Aesthetics',
    suite: 'Palazzo Gold Suite II',
    focus: 'Neuromuscular & Cryo Contouring',
    badge: 'Director Practice',
  },
  {
    id: 'artisan-chiara-s',
    name: 'Chiara Spada',
    title: 'Senior Clinical Trichologist',
    suite: 'Venetian Suite III',
    focus: 'Haute Hair & Caviar Matrix',
    badge: 'Trichology Specialist',
  },
];

const TIME_SLOTS = [
  '10:00 - 11:30',
  '12:00 - 13:30',
  '14:00 - 15:30',
  '16:00 - 17:30',
  '18:30 - 20:00 (Evening Exclusive)',
];

const DATES = [
  { date: '2026-10-15', label: 'Thu, 15 Oct' },
  { date: '2026-10-16', label: 'Fri, 16 Oct' },
  { date: '2026-10-17', label: 'Sat, 17 Oct' },
  { date: '2026-10-18', label: 'Sun, 18 Oct' },
  { date: '2026-10-19', label: 'Mon, 19 Oct' },
];

export default function Step3SchedulePage() {
  const {
    selectedArtisanId,
    bookingDate,
    bookingSlot,
    setSchedule,
  } = useVipWizardStore();

  const currentArtisan = ARTISANS.find((a) => a.id === selectedArtisanId) || ARTISANS[0];

  const handleSelectArtisan = (artisan: (typeof ARTISANS)[0]) => {
    setSchedule(
      artisan.id,
      artisan.name,
      artisan.suite,
      bookingDate || '2026-10-15',
      bookingSlot || '14:00 - 15:30'
    );
  };

  const handleSelectDate = (date: string) => {
    setSchedule(
      currentArtisan.id,
      currentArtisan.name,
      currentArtisan.suite,
      date,
      bookingSlot || '14:00 - 15:30'
    );
  };

  const handleSelectSlot = (slot: string) => {
    setSchedule(
      currentArtisan.id,
      currentArtisan.name,
      currentArtisan.suite,
      bookingDate || '2026-10-15',
      slot
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-semibold">
          Step 03 of 05 • Artisan &amp; Suite Pairing
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF9F6]">
          Master Artisan &amp; Private Suite Schedule
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl">
          Palazzo Belladonna guarantees dedicated one-on-one practitioner allocation with zero room turnover during your reservation window.
        </p>
      </div>

      {/* Artisan Selection Cards */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase text-neutral-500 tracking-wider">
          1. Select Certified Master Practitioner
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ARTISANS.map((a) => {
            const isSelected = selectedArtisanId === a.id;
            return (
              <div
                key={a.id}
                onClick={() => handleSelectArtisan(a)}
                className={`p-5 rounded-2xl border cursor-pointer select-none transition space-y-3 ${
                  isSelected
                    ? 'bg-[#181511] border-[#D4AF37] shadow-gold-glow'
                    : 'bg-[#110F0C] border-white/10 hover:border-[#D4AF37]/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[9px] font-mono uppercase text-[#D4AF37] font-bold">
                    {a.badge}
                  </span>
                  <Crown className={`w-4 h-4 ${isSelected ? 'text-[#D4AF37]' : 'text-neutral-600'}`} />
                </div>

                <div>
                  <h4 className="font-serif text-base text-[#FAF9F6]">{a.name}</h4>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">{a.title}</p>
                </div>

                <div className="pt-2 border-t border-white/5 text-[11px] font-mono text-neutral-400">
                  <span className="text-neutral-500 block text-[9px] uppercase">Assigned Suite:</span>
                  <span className="text-amber-200 font-bold">{a.suite}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Selection */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase text-neutral-500 tracking-wider">
          2. Select Reservation Date
        </span>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {DATES.map((d) => {
            const isSelected = bookingDate === d.date;
            return (
              <button
                key={d.date}
                type="button"
                onClick={() => handleSelectDate(d.date)}
                className={`px-5 py-3 rounded-2xl border font-mono text-xs transition whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold shadow-md'
                    : 'bg-[#110F0C] border-white/10 text-neutral-300 hover:border-[#D4AF37]/40'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase text-neutral-500 tracking-wider">
          3. Private Suite Time Window
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TIME_SLOTS.map((slot) => {
            const isSelected = bookingSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => handleSelectSlot(slot)}
                className={`p-4 rounded-2xl border font-mono text-xs text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#181511] border-[#D4AF37] text-[#D4AF37] font-bold shadow-sm'
                    : 'bg-[#110F0C] border-white/10 text-neutral-300 hover:border-[#D4AF37]/40'
                }`}
              >
                <span>{slot}</span>
                <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D4AF37]' : 'text-neutral-600'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <Link
          href="/portal/book/add-ons"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#141210] border border-white/10 text-neutral-400 hover:text-white text-xs font-mono transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </Link>

        <Link
          href="/portal/book/logistics"
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-mono text-xs uppercase tracking-widest font-bold shadow-xl transition"
        >
          <span>Continue to Logistics</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
