'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Key,
  ShieldCheck,
  Plane,
  Building2,
  Crown,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export interface PrivateOfficeInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPillar?: 'viaggi' | 'accesso' | 'gestione' | 'acquisizioni' | 'retainer';
}

export function PrivateOfficeInquiryModal({
  isOpen,
  onClose,
  defaultPillar = 'retainer',
}: PrivateOfficeInquiryModalProps) {
  const [role, setRole] = useState<'principal' | 'ea'>('principal');
  const [selectedPillar, setSelectedPillar] = useState<string>(defaultPillar);
  const [name, setName] = useState('');
  const [eaName, setEaName] = useState('');
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'signal' | 'phone' | 'email'>('whatsapp');
  const [contactValue, setContactValue] = useState('');
  const [mandateDetails, setMandateDetails] = useState('');
  const [urgency, setUrgency] = useState<'immediate' | 'standard' | 'in_person'>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mandateId, setMandateId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setMandateId(`VB-OFFICE-${Math.floor(1000 + Math.random() * 9000)}`);
    }, 1200);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setEaName('');
    setContactValue('');
    setMandateDetails('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Deep Onyx Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl rounded-[32px] bg-[#0C0B0A] border border-gold/30 shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-white overflow-hidden my-auto"
        >
          {/* Top Security Banner */}
          <div className="bg-[#141210] border-b border-gold/20 px-6 py-3 flex items-center justify-between text-xs font-label uppercase tracking-widest text-[#D4AF37]">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-gold" />
              <span>256-Bit Encrypted Mandate Protocol</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Milan Private Desk Active</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-gold hover:border-gold/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-6 sm:p-10 max-h-[85vh] overflow-y-auto no-scrollbar">
            {!isSubmitted ? (
              <div className="space-y-6">
                
                {/* Header Title */}
                <div className="space-y-2 text-center max-w-lg mx-auto">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[11px] font-label uppercase tracking-widest">
                    <Key className="w-3.5 h-3.5" />
                    <span>The Belladonna Private Office</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                    Submit <span className="italic font-serif font-light text-gold">Private Mandate</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                    Discreet UHNW lifestyle management, private aviation charters, estate orchestration, and off-market acquisitions.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Role Selector: Principal vs. Executive Assistant */}
                  <div className="space-y-2">
                    <label className="text-xs font-label uppercase tracking-wider text-zinc-400 font-semibold block">
                      Inquirer Status
                    </label>
                    <div className="grid grid-cols-2 gap-3 p-1 rounded-2xl bg-white/5 border border-white/10">
                      <button
                        type="button"
                        onClick={() => setRole('principal')}
                        className={`py-2.5 px-4 rounded-xl text-xs font-label uppercase tracking-wider font-semibold transition-all ${
                          role === 'principal'
                            ? 'bg-gold text-charcoal shadow-md font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Principal Direct
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('ea')}
                        className={`py-2.5 px-4 rounded-xl text-xs font-label uppercase tracking-wider font-semibold transition-all ${
                          role === 'ea'
                            ? 'bg-gold text-charcoal shadow-md font-bold'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Executive Assistant / Family Office
                      </button>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-label uppercase tracking-wider text-zinc-400 font-semibold block">
                        {role === 'principal' ? 'Principal Full Name' : 'Principal Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Conte Alessandro Rossi"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold transition-colors font-sans"
                      />
                    </div>

                    {role === 'ea' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-label uppercase tracking-wider text-zinc-400 font-semibold block">
                          Assistant / Director Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={eaName}
                          onChange={(e) => setEaName(e.target.value)}
                          placeholder="e.g. Claire Vance (Chief of Staff)"
                          className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold transition-colors font-sans"
                        />
                      </div>
                    )}
                  </div>

                  {/* Mandate Pillar Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-label uppercase tracking-wider text-zinc-400 font-semibold block">
                      Primary Area of Engagement
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans">
                      {[
                        { id: 'viaggi', label: 'Viaggi Privati (Aviation & Yachts)', icon: Plane },
                        { id: 'accesso', label: 'Accesso Esclusivo (VIP & Closed-Door)', icon: Crown },
                        { id: 'gestione', label: 'Gestione Residenziale (Estates & Staff)', icon: Building2 },
                        { id: 'acquisizioni', label: 'Acquisizioni & Lake Como Retreats', icon: Sparkles },
                        { id: 'retainer', label: 'Full Private Office Retainer', icon: ShieldCheck },
                      ].map((p) => {
                        const Icon = p.icon;
                        const isSelected = selectedPillar === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedPillar(p.id)}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-gold/15 border-gold text-gold font-medium'
                                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-gold' : 'text-zinc-500'}`} />
                            <span className="truncate">{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Confidential Contact Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-label uppercase tracking-wider text-zinc-400 font-semibold block">
                        Confidential VIP Channel
                      </label>
                      <div className="flex gap-2 text-[11px] text-zinc-400">
                        {(['whatsapp', 'signal', 'phone', 'email'] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setContactMethod(m)}
                            className={`capitalize px-2 py-0.5 rounded transition-colors ${
                              contactMethod === m
                                ? 'bg-gold/20 text-gold font-semibold'
                                : 'hover:text-white'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={contactValue}
                        onChange={(e) => setContactValue(e.target.value)}
                        placeholder={
                          contactMethod === 'email'
                            ? 'vip.office@familydomain.com'
                            : '+39 02 8900 4500 or +1 (555) 019-2834'
                        }
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold transition-colors font-sans"
                      />
                    </div>
                  </div>

                  {/* Mandate Description / Parameters */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-label uppercase tracking-wider text-zinc-400 font-semibold block">
                      Mandate Specifications &amp; Parameters (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={mandateDetails}
                      onChange={(e) => setMandateDetails(e.target.value)}
                      placeholder="Specify dates, aircraft requirements, estate locations, guest count, or acquisition parameters with complete discretion..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-gold transition-colors font-sans leading-relaxed resize-none"
                    />
                  </div>

                  {/* Response Protocol */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Protocol:</span>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value as any)}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-gold text-xs focus:outline-none"
                      >
                        <option value="standard">Confidential Review (Under 24h)</option>
                        <option value="immediate">Urgent Dispatch (Under 2h)</option>
                        <option value="in_person">In-Person Palazzo Briefing</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-gold text-charcoal font-label text-xs uppercase tracking-widest font-bold hover:bg-gold-light active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-charcoal" />
                        <span>Transmitting Encrypted Mandate...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Submit Private Mandate</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-zinc-500 font-sans">
                    All communications are bound by rigorous non-disclosure agreements (NDAs) and managed directly by the Managing Director of The Belladonna Private Office.
                  </p>
                </form>
              </div>
            ) : (
              /* Success State */
              <div className="py-8 text-center space-y-6 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/40 text-gold mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-gold">
                    Mandate Ref: {mandateId}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white font-medium">
                    Mandate Received with <span className="italic font-serif font-light text-gold">Discretion</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                    Your mandate has been routed to our Managing Director in Milan. A dedicated private logistics officer will make contact via your selected channel ({contactMethod}) shortly.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2 text-zinc-300">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Direct Private Office Line:</span>
                    <span className="text-gold font-mono">+39 02 8900 4500 (Ext. 1)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Palazzo Reception:</span>
                    <span>Via Monte Napoleone, 15 • Milan</span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="w-full py-3.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 font-label text-xs uppercase tracking-widest font-semibold transition-all"
                >
                  Return to Palazzo
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
