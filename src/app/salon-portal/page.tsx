// ============================================================================
// File: src/app/salon-portal/page.tsx
// Portal: Executive Salon Director Command Center
// Description: RevPASH yield, artisanal batch inventory, & tamper-evident audit logs
// ============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  DollarSign,
  CalendarCheck,
  Package,
  Sparkles,
  Lock,
  ArrowRight,
  RefreshCw,
  Clock,
  Send,
  AlertCircle,
  Layers,
  Key,
  Download,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface AuditEntry {
  id: string;
  actorName: string;
  action: string;
  targetPseudonym: string;
  ipAddress: string;
  prevHash: string;
  recordHash: string;
  timestamp: string;
}

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'aud-01',
    actorName: 'Elena Russo (Lead Artisan)',
    action: 'VIEW_DERMAL_RECORD',
    targetPseudonym: 'AURUM-09 (Lady H.)',
    ipAddress: '192.168.10.45 [Carrara Tablet]',
    prevHash: '8f4b23c9e112d7f8a90184c718b52e39...',
    recordHash: 'a47c91e52b890f14d8721c0e9b418a22...',
    timestamp: '10:02:14 AM',
  },
  {
    id: 'aud-02',
    actorName: 'Chiara Belladonna (Co-Founder)',
    action: 'COMPOUND_FORMULATION',
    targetPseudonym: 'SOVEREIGN-44 (Lord Julian)',
    ipAddress: '192.168.10.12 [Lab Station 1]',
    prevHash: 'a47c91e52b890f14d8721c0e9b418a22...',
    recordHash: 'c901e74f812d4a5b983e201f84cb1294...',
    timestamp: '11:15:30 AM',
  },
  {
    id: 'aud-03',
    actorName: 'Matteo Rossi (Concierge Dispatch)',
    action: 'DISPATCH_EA_PASS',
    targetPseudonym: 'PALAZZO-VIP-12 (Madame Sophie)',
    ipAddress: '192.168.10.02 [Front Desk Terminal]',
    prevHash: 'c901e74f812d4a5b983e201f84cb1294...',
    recordHash: 'f182c49b01e7a54d89201cb48e710293...',
    timestamp: '12:40:05 PM',
  },
];

export default function SalonPortalPage() {
  const { toast } = useToast();

  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [activeTab, setActiveTab] = useState<'overview' | 'recovery' | 'inventory' | 'security'>('overview');
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(INITIAL_AUDIT_LOGS);

  const handleTriggerRecoveryCampaign = () => {
    toast({
      title: 'VIP WhatsApp Recovery Campaign Dispatched',
      description: 'Automated 1-click reschedule prompts sent to 3 lapsed sovereign clients.',
      type: 'success',
    });
  };

  const handleReplenishBatch = (sku: string, title: string) => {
    toast({
      title: 'Small-Batch Compounding Mandate Issued',
      description: `Replenishment order sent to Tuscan bio-lab for ${title}.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-[#F5F2EB] selection:bg-amber-500/20 font-sans pb-16">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#161412]/90 backdrop-blur-xl border-b border-amber-900/30 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-900/40 to-black border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-lg">
              VB
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-medium text-amber-100">Executive Director Command Center</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/40 text-[10px] uppercase tracking-widest font-mono text-amber-300">
                  Director Clearance: Sovereign
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono tracking-wider">
                Villa Belladonna Milan • RevPASH, Autonomous Yield &amp; Security Audits
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-full bg-[#1F1B17] border border-amber-900/30">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  activeTab === 'overview' ? 'bg-amber-700 text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Executive Overview
              </button>
              <button
                onClick={() => setActiveTab('recovery')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  activeTab === 'recovery' ? 'bg-amber-700 text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Revenue Recovery Funnel
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  activeTab === 'inventory' ? 'bg-amber-700 text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Artisanal Inventory
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                  activeTab === 'security' ? 'bg-amber-700 text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Security Audit Chain
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* 4-Stat Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-[#161412] border border-amber-900/30 p-6 rounded-2xl space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs uppercase font-mono tracking-wider">Gross Salon Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-serif text-amber-100">€18,450</div>
                <span className="text-xs text-emerald-400 font-mono block">+22.4% vs Milan avg</span>
              </div>

              <div className="bg-[#161412] border border-amber-900/30 p-6 rounded-2xl space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs uppercase font-mono tracking-wider">RevPASH (Suite-Hour Yield)</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-serif text-amber-100">€245 / hr</div>
                <span className="text-xs text-amber-400 font-mono block">94% Private Suite Occupancy</span>
              </div>

              <div className="bg-[#161412] border border-amber-900/30 p-6 rounded-2xl space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs uppercase font-mono tracking-wider">Active Master Artisans</span>
                  <Users className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-3xl font-serif text-amber-100">6 Masters</div>
                <span className="text-xs text-neutral-400 font-mono block">Carrara, Obsidian &amp; Coiffure</span>
              </div>

              <div className="bg-[#161412] border border-amber-900/30 p-6 rounded-2xl space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs uppercase font-mono tracking-wider">Recovered VIP Retainers</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-serif text-amber-100">€4,820</div>
                <span className="text-xs text-purple-400 font-mono block">Via WhatsApp Autonomous Nudges</span>
              </div>

            </div>

            {/* Suite Utilization & Real-Time Booking Grid */}
            <div className="bg-[#161412] border border-amber-900/30 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-amber-900/30">
                <div>
                  <h3 className="font-serif text-xl text-amber-100">Live Treatment Suites &amp; Dispatch Timeline</h3>
                  <p className="text-xs text-neutral-400 font-mono">Real-time room status at Palazzo Milan</p>
                </div>
                <span className="text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/40 font-mono">
                  All 6 Suites Sanitized &amp; Pre-Warmed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#0E0C0A] border border-amber-900/30 p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-amber-200">Suite 1 (Carrara)</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-700">
                      IN CEREMONY
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300">Elena Russo • 24k Gold Bio-Peptide Facial</p>
                  <div className="text-[11px] text-neutral-400 font-mono flex justify-between pt-2 border-t border-amber-900/20">
                    <span>Client: AURUM-09</span>
                    <span>10:00 – 11:30 AM</span>
                  </div>
                </div>

                <div className="bg-[#0E0C0A] border border-amber-900/30 p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-amber-200">Suite 2 (Marble &amp; Gold)</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-700">
                      PREPARED
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300">Chiara Belladonna • Roman Lymphatic Sculpt</p>
                  <div className="text-[11px] text-neutral-400 font-mono flex justify-between pt-2 border-t border-amber-900/20">
                    <span>Client: VIP-8841</span>
                    <span>12:00 – 13:30 PM</span>
                  </div>
                </div>

                <div className="bg-[#0E0C0A] border border-amber-900/30 p-5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-amber-200">Suite 3 (Obsidian)</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 text-[10px] font-mono border border-sky-700">
                      TRANSIT INBOUND
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300">Matteo Romano • Volcanic Stone Recovery</p>
                  <div className="text-[11px] text-neutral-400 font-mono flex justify-between pt-2 border-t border-amber-900/20">
                    <span>Linate Maybach ETA</span>
                    <span>14:00 – 15:15 PM</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: REVENUE RECOVERY */}
        {activeTab === 'recovery' && (
          <div className="bg-[#161412] border border-amber-900/30 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-900/30">
              <div>
                <h3 className="font-serif text-xl text-amber-100">WhatsApp Autonomous Revenue Recovery Engine</h3>
                <p className="text-xs text-neutral-400 font-mono">Automated 1-click rebooking prompts for missed &amp; overdue appointments</p>
              </div>
              <button
                onClick={handleTriggerRecoveryCampaign}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-medium text-xs transition shadow-lg"
              >
                <Send className="w-4 h-4" />
                Trigger Batch Re-engagement Nudge
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-[#0E0C0A] border border-amber-900/30 p-5 rounded-xl">
                <span className="text-xs uppercase font-mono text-neutral-400 block">No-Shows Rescheduled</span>
                <div className="text-3xl font-serif text-amber-200 mt-1">12 of 14</div>
                <span className="text-xs text-emerald-400 mt-1 block">85.7% Conversion Rate</span>
              </div>
              <div className="bg-[#0E0C0A] border border-amber-900/30 p-5 rounded-xl">
                <span className="text-xs uppercase font-mono text-neutral-400 block">Lapsed VIPs Returned</span>
                <div className="text-3xl font-serif text-amber-200 mt-1">47 Clients</div>
                <span className="text-xs text-amber-400 mt-1 block">€31,150 Recovered Revenue</span>
              </div>
              <div className="bg-[#0E0C0A] border border-amber-900/30 p-5 rounded-xl">
                <span className="text-xs uppercase font-mono text-neutral-400 block">Average Recovery Value</span>
                <div className="text-3xl font-serif text-amber-200 mt-1">€820 / client</div>
                <span className="text-xs text-neutral-400 mt-1 block">Bespoke 24k Ceremonies</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ARTISANAL INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="bg-[#161412] border border-amber-900/30 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/30">
              <div>
                <h3 className="font-serif text-xl text-amber-100">Bottega Small-Batch Harvest &amp; Formulation Inventory</h3>
                <p className="text-xs text-neutral-400 font-mono">Track formulation depletion, batch harvest dates, and bio-lab reorders</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-[#0E0C0A] border border-amber-900/30 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base text-amber-200">24k Gold Cellular Longevity Elixir (50ml)</h4>
                  <p className="text-xs text-neutral-400 font-mono">SKU: VB-GOLD-01 • Batch #084 (Tuscan Autumn Harvest 2026)</p>
                  <span className="text-xs text-amber-400 mt-1 inline-block">14 Units Remaining (Reorder threshold: 10)</span>
                </div>
                <button
                  onClick={() => handleReplenishBatch('VB-GOLD-01', '24k Gold Cellular Elixir')}
                  className="px-4 py-2 rounded-full border border-amber-600 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 text-xs font-semibold"
                >
                  Order Bio-Lab Batch
                </button>
              </div>

              <div className="p-5 rounded-xl bg-[#0E0C0A] border border-amber-900/30 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base text-amber-200">Obsidian Mineral Restorative Night Balm (50ml)</h4>
                  <p className="text-xs text-neutral-400 font-mono">SKU: VB-OBSID-02 • Batch #062 (Pantelleria Harvest Reserve)</p>
                  <span className="text-xs text-emerald-400 mt-1 inline-block">19 Units Remaining (Optimal Stock)</span>
                </div>
                <button
                  onClick={() => handleReplenishBatch('VB-OBSID-02', 'Obsidian Restorative Balm')}
                  className="px-4 py-2 rounded-full border border-amber-600 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 text-xs font-semibold"
                >
                  Order Bio-Lab Batch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY AUDIT CHAIN */}
        {activeTab === 'security' && (
          <div className="bg-[#161412] border border-amber-900/30 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/30">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-serif text-xl text-amber-100">Tamper-Evident SHA-256 Chained Security Log</h3>
                </div>
                <p className="text-xs text-neutral-400 font-mono">Immutable cryptographic audit trail tracking all sovereign client PII &amp; dermal history accesses</p>
              </div>
              <span className="text-xs text-emerald-400 font-mono bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-700/40">
                Audit Chain Integrity: 100% Verified
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-[#0E0C0A] border border-amber-900/30 space-y-2">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="font-bold text-amber-300">{log.action}</span>
                    <span className="text-neutral-500">{log.timestamp}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
                    <span>Actor: {log.actorName}</span>
                    <span>Target: {log.targetPseudonym}</span>
                    <span>Origin: {log.ipAddress}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[10px] text-neutral-500 truncate">
                    <span className="truncate">Hash: {log.recordHash}</span>
                    <span className="text-emerald-500 font-bold ml-2 shrink-0">CHAIN VERIFIED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
