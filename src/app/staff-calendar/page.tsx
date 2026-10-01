// ============================================================================
// File: src/app/staff-calendar/page.tsx
// Portal: Master Artisan & Wellness Specialist Tablet Console
// Description: Dermal bio-metrics, botanical formulation compounding, & suite control
// ============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  User,
  Sliders,
  CheckCircle2,
  Save,
  Flame,
  Thermometer,
  Music,
  ArrowRight,
  Eye,
  Camera,
  Layers,
  Award,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface ScheduledCeremony {
  id: string;
  clientPseudonym: string;
  clientLegalNameAlias: string;
  serviceTitle: string;
  durationMinutes: number;
  timeSlot: string;
  suite: string;
  status: 'PENDING' | 'IN_SUITE' | 'COMPLETED';
  notes: string;
  dermalBioMetrics: {
    hydrationScore: number;
    elasticityScore: number;
    cellularAge: number;
    barrierStatus: 'Intact' | 'Lipid-Depleted' | 'Sensitive';
  };
  lastFormulation: string;
}

const INITIAL_CEREMONIES: ScheduledCeremony[] = [
  {
    id: 'apt-01',
    clientPseudonym: 'AURUM-09',
    clientLegalNameAlias: 'Contessa Isabella M.',
    serviceTitle: 'The Signature 24k Gold Bio-Peptide Facial',
    durationMinutes: 90,
    timeSlot: '10:00 - 11:30 AM',
    suite: 'Private Suite 1 (Carrara)',
    status: 'IN_SUITE',
    notes: 'Prefers ultra-low illumination (1800K). Focus on jawline cryo-contouring and lymphatic drainage.',
    dermalBioMetrics: {
      hydrationScore: 68,
      elasticityScore: 74,
      cellularAge: 38,
      barrierStatus: 'Lipid-Depleted',
    },
    lastFormulation: '15% 24k Gold Flakes + 4% Marine Tri-Peptides in Sicilian Neroli Nectar (Batch #084)',
  },
  {
    id: 'apt-02',
    clientPseudonym: 'SOVEREIGN-44',
    clientLegalNameAlias: 'Lord Julian V.',
    serviceTitle: 'Volcanic Hot Stone & Botanical Cellular Recovery',
    durationMinutes: 75,
    timeSlot: '14:00 - 15:15 PM',
    suite: 'Private Suite 3 (Obsidian)',
    status: 'PENDING',
    notes: 'Direct transfer from Linate Airport. Heavy shoulder tension from transatlantic travel.',
    dermalBioMetrics: {
      hydrationScore: 54,
      elasticityScore: 68,
      cellularAge: 44,
      barrierStatus: 'Intact',
    },
    lastFormulation: 'Pantelleria Obsidian Balm + 8% Volcanic Basalt Extract',
  },
  {
    id: 'apt-03',
    clientPseudonym: 'PALAZZO-VIP-12',
    clientLegalNameAlias: 'Madame Sophie D.',
    serviceTitle: 'Haute Caviar & Keratin Hair Sculpting Ceremony',
    durationMinutes: 60,
    timeSlot: '16:30 - 17:30 PM',
    suite: 'Haute Coiffure Salon Chair 2',
    status: 'PENDING',
    notes: 'Preparing for Milan Fashion Week gala. Natural honey balayage gloss application.',
    dermalBioMetrics: {
      hydrationScore: 72,
      elasticityScore: 80,
      cellularAge: 32,
      barrierStatus: 'Intact',
    },
    lastFormulation: 'Venetian Caviar Nectar + Pure Keratin Gloss Matrix',
  },
];

export default function StaffCalendarPage() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'roster' | 'dermal_vault' | 'compounding'>('roster');
  const [ceremonies, setCeremonies] = useState<ScheduledCeremony[]>(INITIAL_CEREMONIES);
  const [selectedCeremony, setSelectedCeremony] = useState<ScheduledCeremony>(INITIAL_CEREMONIES[0]);

  // Suite Ambience controls
  const [suiteTemp, setSuiteTemp] = useState(21.5);
  const [lightingPreset, setLightingPreset] = useState<'candlelight' | 'clinical' | 'ambient'>('candlelight');
  const [isPlayingAmbience, setIsPlayingAmbience] = useState(true);

  // Dermal Compounding state for active client
  const [goldRatio, setGoldRatio] = useState(15);
  const [peptideRatio, setPeptideRatio] = useState(5);
  const [neroliDrops, setNeroliDrops] = useState(4);
  const [activeBatch, setActiveBatch] = useState('Batch #084 • Autumn Harvest 2026');
  const [artisanNotes, setArtisanNotes] = useState(selectedCeremony.notes);
  const [hydrationScore, setHydrationScore] = useState(selectedCeremony.dermalBioMetrics.hydrationScore);

  const handleSelectCeremony = (c: ScheduledCeremony) => {
    setSelectedCeremony(c);
    setArtisanNotes(c.notes);
    setHydrationScore(c.dermalBioMetrics.hydrationScore);
  };

  const handleStatusChange = (id: string, newStatus: 'PENDING' | 'IN_SUITE' | 'COMPLETED') => {
    setCeremonies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (selectedCeremony.id === id) {
      setSelectedCeremony((prev) => ({ ...prev, status: newStatus }));
    }
    toast({
      title: `Ceremony Status: ${newStatus}`,
      description: `Suite schedule updated for ${selectedCeremony.clientPseudonym}.`,
      type: 'success',
    });
  };

  const handleSaveFormulation = () => {
    const updatedRecipe = `${goldRatio}% Pure 24k Gold Leaf + ${peptideRatio}% Bio-Peptides + ${neroliDrops} Neroli Drops (${activeBatch})`;
    setCeremonies((prev) =>
      prev.map((c) =>
        c.id === selectedCeremony.id
          ? {
              ...c,
              lastFormulation: updatedRecipe,
              dermalBioMetrics: { ...c.dermalBioMetrics, hydrationScore },
              notes: artisanNotes,
            }
          : c
      )
    );
    toast({
      title: 'Botanical Formulation Saved to Vault',
      description: `Logged compounding recipe for ${selectedCeremony.clientPseudonym}.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-[#F5F2EB] selection:bg-amber-500/20 font-sans pb-16">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#161412]/90 backdrop-blur-xl border-b border-amber-900/30 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-900/40 to-black border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-lg">
              VB
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-medium text-amber-100">Master Artisan Suite</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/40 text-[10px] uppercase tracking-widest font-mono text-amber-300">
                  Elena Russo • Lead Aesthetician
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono tracking-wider">
                Villa Belladonna Milan • Carrara Suite Tablet Console
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#1F1B17] border border-amber-900/30">
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'roster'
                  ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-amber-200'
              }`}
            >
              Today&apos;s Ceremonies
            </button>
            <button
              onClick={() => setActiveTab('dermal_vault')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'dermal_vault'
                  ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-amber-200'
              }`}
            >
              Dermal Bio-Metrics
            </button>
            <button
              onClick={() => setActiveTab('compounding')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'compounding'
                  ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-amber-200'
              }`}
            >
              Botanical Compounding Lab
            </button>
          </div>
        </div>
      </header>

      {/* Main Suite Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Top Suite Automation Bar */}
        <section className="bg-[#161412] border border-amber-900/30 rounded-2xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono block">Private Suite Controls</span>
              <span className="font-serif text-amber-100 text-base font-medium">{selectedCeremony.suite}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            {/* Temperature Preset */}
            <div className="flex items-center gap-2 bg-[#0E0C0A] px-3.5 py-1.5 rounded-full border border-amber-900/30">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span className="text-neutral-400">Temp:</span>
              <span className="font-mono font-bold text-amber-200">{suiteTemp}°C</span>
              <div className="flex gap-1 ml-1">
                <button
                  onClick={() => setSuiteTemp((t) => Math.max(19, +(t - 0.5).toFixed(1)))}
                  className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-amber-300"
                >
                  -
                </button>
                <button
                  onClick={() => setSuiteTemp((t) => Math.min(25, +(t + 0.5).toFixed(1)))}
                  className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-amber-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lighting Preset */}
            <div className="flex items-center gap-2 bg-[#0E0C0A] px-3.5 py-1.5 rounded-full border border-amber-900/30">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-neutral-400">Lighting:</span>
              <select
                value={lightingPreset}
                onChange={(e) => setLightingPreset(e.target.value as any)}
                className="bg-transparent text-amber-200 font-medium focus:outline-none"
              >
                <option value="candlelight" className="bg-[#161412]">1800K Candlelight</option>
                <option value="ambient" className="bg-[#161412]">2700K Warm Milanese</option>
                <option value="clinical" className="bg-[#161412]">4000K Clinical Dermal</option>
              </select>
            </div>

            {/* Audio Ambience Preset */}
            <button
              onClick={() => setIsPlayingAmbience(!isPlayingAmbience)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all ${
                isPlayingAmbience
                  ? 'bg-amber-950/40 border-amber-700 text-amber-300'
                  : 'bg-[#0E0C0A] border-amber-900/30 text-neutral-400'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>{isPlayingAmbience ? 'Palazzo Ambience: Active' : 'Palazzo Ambience: Muted'}</span>
            </button>
          </div>
        </section>

        {/* 2-Column Split: Appointments Queue + Detailed Active Suite Management */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Scheduled Ceremonies (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-900/30">
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-400">Assigned Schedule</span>
              <span className="text-xs text-amber-400 font-medium">{ceremonies.length} Ceremonies</span>
            </div>

            <div className="space-y-3">
              {ceremonies.map((c) => {
                const isSelected = c.id === selectedCeremony.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCeremony(c)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-950/40 via-[#1A1715] to-[#161412] border-amber-500/70 shadow-lg'
                        : 'bg-[#161412] border-amber-900/30 hover:border-amber-700/50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-800/40 text-[10px] font-mono text-amber-300 font-bold">
                        {c.clientPseudonym}
                      </span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                          c.status === 'IN_SUITE'
                            ? 'bg-emerald-950/60 border border-emerald-700 text-emerald-300 animate-pulse'
                            : c.status === 'COMPLETED'
                            ? 'bg-neutral-800 text-neutral-400'
                            : 'bg-amber-950/40 border border-amber-800/30 text-amber-400'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-serif text-amber-100 text-sm font-medium leading-snug">{c.serviceTitle}</h3>
                    <p className="text-xs text-neutral-400 mt-1">{c.clientLegalNameAlias}</p>

                    <div className="mt-3 pt-3 border-t border-amber-900/20 flex items-center justify-between text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5 font-mono text-amber-300 text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{c.timeSlot}</span>
                      </div>
                      <span className="text-[11px] truncate max-w-[130px]">{c.suite}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Client Protocol & Compounding Console (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active Ceremony Header Card */}
            <div className="bg-[#161412] border border-amber-900/40 rounded-2xl p-6 shadow-2xl space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-amber-900/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-2xl text-amber-100 font-medium">
                      {selectedCeremony.clientPseudonym}
                    </span>
                    <span className="text-xs text-neutral-400">({selectedCeremony.clientLegalNameAlias})</span>
                  </div>
                  <p className="text-xs text-amber-400 font-mono mt-0.5">{selectedCeremony.serviceTitle}</p>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedCeremony.id, 'PENDING')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedCeremony.status === 'PENDING'
                        ? 'bg-amber-700 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedCeremony.id, 'IN_SUITE')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedCeremony.status === 'IN_SUITE'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    In Suite
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedCeremony.id, 'COMPLETED')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedCeremony.status === 'COMPLETED'
                        ? 'bg-neutral-700 text-neutral-200'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Dermal Bio-Metrics Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-[#0E0C0A] border border-amber-900/30 p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-mono">Hydration Score</span>
                  <div className="text-2xl font-serif text-amber-200 mt-1">{hydrationScore} / 100</div>
                  <span className="text-[10px] text-emerald-400 mt-0.5 block">Optimal Barrier Function</span>
                </div>

                <div className="bg-[#0E0C0A] border border-amber-900/30 p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-mono">Cellular Elasticity</span>
                  <div className="text-2xl font-serif text-amber-200 mt-1">{selectedCeremony.dermalBioMetrics.elasticityScore} %</div>
                  <span className="text-[10px] text-amber-400 mt-0.5 block">+6% after last cryo</span>
                </div>

                <div className="bg-[#0E0C0A] border border-amber-900/30 p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-mono">Cellular Age Index</span>
                  <div className="text-2xl font-serif text-amber-200 mt-1">{selectedCeremony.dermalBioMetrics.cellularAge} Yrs</div>
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">Micro-circulated</span>
                </div>

                <div className="bg-[#0E0C0A] border border-amber-900/30 p-4 rounded-xl">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-mono">Barrier State</span>
                  <div className="text-lg font-serif text-amber-200 mt-1">{selectedCeremony.dermalBioMetrics.barrierStatus}</div>
                  <span className="text-[10px] text-amber-400 mt-0.5 block">Tuscan Lipid Protocol</span>
                </div>
              </div>

              {/* Interactive Compounding Form */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-serif text-base text-amber-100 font-medium">Bespoke Compounding Lab</span>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">{activeBatch}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Gold Ratio Slider */}
                  <div className="bg-[#0E0C0A] border border-amber-900/30 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300">24k Gold Flakes</span>
                      <span className="font-mono text-amber-300 font-bold">{goldRatio}%</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={35}
                      value={goldRatio}
                      onChange={(e) => setGoldRatio(+e.target.value)}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-neutral-400">Suspended in bio-ferment</p>
                  </div>

                  {/* Peptide Ratio Slider */}
                  <div className="bg-[#0E0C0A] border border-amber-900/30 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300">Bio-Peptides 32</span>
                      <span className="font-mono text-amber-300 font-bold">{peptideRatio}%</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={15}
                      value={peptideRatio}
                      onChange={(e) => setPeptideRatio(+e.target.value)}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-neutral-400">Cryogenic lifting complex</p>
                  </div>

                  {/* Neroli Drops */}
                  <div className="bg-[#0E0C0A] border border-amber-900/30 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300">Neroli Terpene Essence</span>
                      <span className="font-mono text-amber-300 font-bold">{neroliDrops} Drops</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={neroliDrops}
                      onChange={(e) => setNeroliDrops(+e.target.value)}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <p className="text-[10px] text-neutral-400">Cold-pressed aroma balance</p>
                  </div>

                </div>

                {/* Artisan Clinical Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400 uppercase font-mono tracking-wider">
                    Artisan Clinical & Formulation Log
                  </label>
                  <textarea
                    rows={3}
                    value={artisanNotes}
                    onChange={(e) => setArtisanNotes(e.target.value)}
                    className="w-full rounded-xl bg-[#0E0C0A] border border-amber-900/30 p-3 text-xs text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    placeholder="Log client dermal reaction, pressure preferences, and custom compounding ratios..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={handleSaveFormulation}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-medium text-xs transition shadow-lg shadow-amber-950/50"
                  >
                    <Save className="w-4 h-4" />
                    Save Protocol to Client Vault
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
