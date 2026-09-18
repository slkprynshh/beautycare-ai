'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Lock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Building2,
  UserCheck,
  Briefcase,
} from 'lucide-react';
import { TREATMENTS } from '@/components/parisian/TreatmentMenu';

export function EaDispatchPortal() {
  const [principalName, setPrincipalName] = useState('');
  const [discretionLevel, setDiscretionLevel] = useState<'standard' | 'pseudonym' | 'strict_nda'>('strict_nda');
  const [eaName, setEaName] = useState('');
  const [eaPhone, setEaPhone] = useState('');
  const [eaEmail, setEaEmail] = useState('');
  const [corporateAccountCode, setCorporateAccountCode] = useState('');
  
  // Multi-Service Selection Matrix
  const [serviceTreatment, setServiceTreatment] = useState(true);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState(TREATMENTS[0].id);
  const [serviceTarmac, setServiceTarmac] = useState(true);
  const [airportSelection, setAirportSelection] = useState<'LIN' | 'MXP'>('LIN');
  const [flightTailNumber, setFlightTailNumber] = useState('');
  const [serviceAviation, setServiceAviation] = useState(false);
  
  // Schedule
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('14:00');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Status
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [dispatchRef, setDispatchRef] = useState('');

  const selectedTreatment = TREATMENTS.find((t) => t.id === selectedTreatmentId) || TREATMENTS[0];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);

    setTimeout(() => {
      setIsTransmitting(false);
      setIsConfirmed(true);
      setDispatchRef(`EA-DISPATCH-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 1200);
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setPrincipalName('');
    setEaName('');
    setEaPhone('');
    setEaEmail('');
    setCorporateAccountCode('');
    setFlightTailNumber('');
    setSpecialInstructions('');
  };

  return (
    <div className="min-h-screen bg-[#070605] text-[#FAF8F5] font-sans selection:bg-gold selection:text-charcoal relative overflow-hidden">
      
      {/* Background Ambience & Fine Radial Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:36px_36px] opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Protocol Status Bar */}
      <div className="bg-[#0D0B0A] border-b border-gold/20 px-4 sm:px-8 py-3 text-xs font-mono flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-gold hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-sans uppercase text-[11px] font-semibold tracking-wider">Villa Belladonna</span>
          </Link>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span className="text-zinc-400 hidden sm:inline uppercase text-[10px] tracking-widest">
            Family Office &amp; Executive Protocol
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-gold font-semibold">256-BIT ENCRYPTED DISPATCH</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10 relative z-10">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-label uppercase tracking-widest font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Executive Assistant Fast-Track</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight">
            Family Office &amp; <span className="italic font-serif font-light text-gold">EA Dispatch Portal</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-xl mx-auto leading-relaxed">
            Friction-free coordination for Chiefs of Staff, Family Office Directors, and Executive Assistants booking dual-service ceremonies, airside tarmac transfers, and private aviation.
          </p>
        </div>

        {!isConfirmed ? (
          <form onSubmit={handleDispatch} className="space-y-8">
            
            {/* Section 1: Principal Identity & Discretion Protocol */}
            <div className="rounded-3xl bg-zinc-900/70 border border-gold/30 p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-5 h-5 text-gold" />
                  <h3 className="font-serif text-lg sm:text-xl text-white font-medium">
                    1. Principal Profile &amp; Discretion Protocol
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-gold uppercase tracking-wider">Mandatory</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    Principal Name / Pseudonym *
                  </label>
                  <input
                    type="text"
                    required
                    value={principalName}
                    onChange={(e) => setPrincipalName(e.target.value)}
                    placeholder="e.g. Principal V.B. or Conte Alessandro Rossi"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    Discretion Level
                  </label>
                  <select
                    value={discretionLevel}
                    onChange={(e) => setDiscretionLevel(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-gold text-sm focus:outline-none focus:border-gold transition-colors font-sans"
                  >
                    <option value="strict_nda">Strict NDA Agreement (Managing Director Eyes Only)</option>
                    <option value="pseudonym">High Discretion (Pseudonym on Internal Schedule)</option>
                    <option value="standard">Standard Discretion (Palazzo VIP Guest List)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Executive Assistant & Corporate Billing */}
            <div className="rounded-3xl bg-zinc-900/70 border border-zinc-800 p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-gold" />
                  <h3 className="font-serif text-lg sm:text-xl text-white font-medium">
                    2. Executive Coordinator &amp; Billing Account
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Direct Verification</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    EA / Chief of Staff Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={eaName}
                    onChange={(e) => setEaName(e.target.value)}
                    placeholder="e.g. Claire Vance"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    Corporate / Trust Invoicing Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={corporateAccountCode}
                    onChange={(e) => setCorporateAccountCode(e.target.value)}
                    placeholder="e.g. FO-MILAN-9921 or TRUST-CH-8820"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-gold font-mono text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    EA Direct Mobile (WhatsApp / Signal) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={eaPhone}
                    onChange={(e) => setEaPhone(e.target.value)}
                    placeholder="+44 7700 900123 or +1 (555) 019-2834"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    EA Secure Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={eaEmail}
                    onChange={(e) => setEaEmail(e.target.value)}
                    placeholder="executive.office@familydomain.com"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Multi-Service Integrated Dispatch Matrix */}
            <div className="rounded-3xl bg-zinc-900/70 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-gold" />
                  <h3 className="font-serif text-lg sm:text-xl text-white font-medium">
                    3. Multi-Service Coordination Matrix
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-gold uppercase tracking-wider">Synchronized</span>
              </div>

              {/* Multi-Service Checkbox Cards */}
              <div className="space-y-4">
                
                {/* Service 1: Salon Longevity Ceremony */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  serviceTreatment ? 'bg-zinc-950 border-gold/60' : 'bg-zinc-950/50 border-zinc-800'
                }`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceTreatment}
                      onChange={(e) => setServiceTreatment(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-gold focus:ring-gold bg-zinc-900 border-zinc-700"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-white font-medium text-base">
                          Aesthetic &amp; Longevity Ceremony (Private Carrara Suite)
                        </span>
                        <span className="text-xs font-mono text-gold">€240 Base</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Select ceremony for the principal upon arrival at the palazzo.
                      </p>

                      {serviceTreatment && (
                        <select
                          value={selectedTreatmentId}
                          onChange={(e) => setSelectedTreatmentId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:outline-none focus:border-gold"
                        >
                          {TREATMENTS.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title} ({t.durationMinutes} mins • €{t.priceEUR})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>
                </div>

                {/* Service 2: Airside Tarmac Ground Transfer */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  serviceTarmac ? 'bg-zinc-950 border-gold/60' : 'bg-zinc-950/50 border-zinc-800'
                }`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceTarmac}
                      onChange={(e) => setServiceTarmac(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-gold focus:ring-gold bg-zinc-900 border-zinc-700"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-white font-medium text-base">
                          Private Jet Airside Tarmac Transfer (Mercedes-Maybach)
                        </span>
                        <span className="text-xs font-mono text-gold">+€380</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Direct aircraft apron pick-up and fast-track transit to Via Monte Napoleone.
                      </p>

                      {serviceTarmac && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Terminal:</span>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setAirportSelection('LIN')}
                                className={`py-1.5 px-3 rounded-lg text-xs font-mono ${
                                  airportSelection === 'LIN'
                                    ? 'bg-gold text-charcoal font-bold'
                                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                                }`}
                              >
                                Linate (LIN) VIP
                              </button>
                              <button
                                type="button"
                                onClick={() => setAirportSelection('MXP')}
                                className={`py-1.5 px-3 rounded-lg text-xs font-mono ${
                                  airportSelection === 'MXP'
                                    ? 'bg-gold text-charcoal font-bold'
                                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                                }`}
                              >
                                Malpensa (MXP) VIP
                              </button>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Aircraft Tail / Flight #:</span>
                            <input
                              type="text"
                              value={flightTailNumber}
                              onChange={(e) => setFlightTailNumber(e.target.value)}
                              placeholder="e.g. N982VB or G-LEAP"
                              className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-gold"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Service 3: Private Aviation / Lake Como Charter Inquiry */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  serviceAviation ? 'bg-zinc-950 border-gold/60' : 'bg-zinc-950/50 border-zinc-800'
                }`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serviceAviation}
                      onChange={(e) => setServiceAviation(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-gold focus:ring-gold bg-zinc-900 border-zinc-700"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-white font-medium text-base">
                          Private Aviation or Lake Como Helipad Transit Inquiry
                        </span>
                        <span className="text-xs font-mono text-gold">Concierge Brief</span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Inquire for onward helicopter shuttle to Lake Como or private jet charter.
                      </p>
                    </div>
                  </label>
                </div>

              </div>

              {/* Arrival Date & Hour Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    Scheduled Arrival Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                    Estimated Time of Arrival (ETA Milan) *
                  </label>
                  <input
                    type="time"
                    required
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  EA Direct Mandate Notes / Special Beverage &amp; Security Requests
                </label>
                <textarea
                  rows={3}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Specify luggage volume, dietary preferences, private security team clearance, or discrete back-entrance protocol..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>

            </div>

            {/* Transmit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isTransmitting}
                className="w-full py-4 rounded-full bg-gold text-charcoal font-label text-xs uppercase tracking-widest font-bold hover:bg-gold-light active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(212,175,55,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isTransmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-charcoal" />
                    <span>Transmitting 256-Bit EA Mandate...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize &amp; Dispatch Protocol</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-zinc-500 font-mono mt-3">
                Dispatched directly to the Managing Director &amp; Private Logistics Desk • Direct Line +39 02 8900 4500 (Ext. 1)
              </p>
            </div>

          </form>
        ) : (
          /* Confirmation State */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-zinc-900/90 border border-gold/40 p-8 sm:p-12 text-center space-y-8 shadow-2xl backdrop-blur-md max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold text-gold mx-auto flex items-center justify-center shadow-gold-glow">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-block px-3.5 py-1 rounded-full bg-zinc-950 border border-gold/40 text-xs font-mono text-gold font-bold">
                Token: {dispatchRef}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif text-white font-medium">
                EA Mandate Authorized &amp; Dispatched
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-md mx-auto leading-relaxed">
                Confirmation dispatched to <span className="text-white font-semibold">{eaEmail}</span>. The Milan logistics director is executing airside permits and suite staging for <span className="text-gold font-semibold">{principalName}</span>.
              </p>
            </div>

            {/* Summary Breakdown */}
            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 text-left space-y-3 text-xs font-sans">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-400 font-mono uppercase text-[10px]">Account Code:</span>
                <span className="text-gold font-mono font-bold">{corporateAccountCode}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-400 font-mono uppercase text-[10px]">Discretion Protocol:</span>
                <span className="text-white capitalize">{discretionLevel.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="text-zinc-400 font-mono uppercase text-[10px]">Arrival Window:</span>
                <span className="text-white">{arrivalDate || 'Pending'} • {arrivalTime}</span>
              </div>
              {serviceTarmac && (
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-mono uppercase text-[10px]">Airside Transfer:</span>
                  <span className="text-gold">{airportSelection} VIP Terminal • {flightTailNumber || 'Tail TBD'}</span>
                </div>
              )}
              {serviceTreatment && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-mono uppercase text-[10px]">Carrara Suite Ceremony:</span>
                  <span className="text-white">{selectedTreatment.title}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleReset}
                className="w-full py-3.5 rounded-full bg-gold text-charcoal font-label text-xs uppercase tracking-widest font-bold hover:bg-gold-light transition-all cursor-pointer shadow-md"
              >
                Submit New EA Mandate
              </button>
              <Link
                href="/"
                className="w-full py-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-label text-xs uppercase tracking-widest font-semibold transition-all text-center"
              >
                Return to Palazzo Main
              </Link>
            </div>
          </motion.div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-600 font-mono">
        Villa Belladonna Milan • Executive Protocol • Discretion Hotline +39 02 8900 4500
      </footer>
    </div>
  );
}
