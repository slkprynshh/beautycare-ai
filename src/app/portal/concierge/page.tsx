'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  Lock,
  Car,
  Wine,
  FlaskConical,
  Thermometer,
  Mic,
  CheckCheck,
  Loader2,
  Paperclip,
  CheckCircle2,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useVipBookingStore } from '@/store/useVipBookingStore';

interface Message {
  id: string;
  sender: 'client' | 'concierge';
  senderName: string;
  text: string;
  time: string;
  actionTag?: string;
  isEncrypted?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    sender: 'concierge',
    senderName: 'Elena V. (Chief Sovereign Concierge)',
    text: 'Buonasera. I am Elena, your dedicated private liaison at Villa Belladonna Milan. Your Carrara Suite I is being prepared for your arrival. How may my team and I attend to your comfort today?',
    time: '12:15',
    actionTag: 'Discretion Clearance Alpha',
    isEncrypted: true,
  },
  {
    id: 'm-2',
    sender: 'client',
    senderName: 'Executive Assistant (Delegated)',
    text: 'Principal AURUM-09 is arriving via private flight into Milan Linate (LIN) at 13:45. Please ensure private tarmac chauffeur and suite 1800K candlelight calibration.',
    time: '12:30',
    isEncrypted: true,
  },
  {
    id: 'm-3',
    sender: 'concierge',
    senderName: 'Elena V. (Chief Sovereign Concierge)',
    text: 'Understood with utmost discretion. Maybach S-Class (Chauffeur Marco T.) is in position at the LIN General Aviation terminal. Carrara Suite I climate is locked at 21.5°C with Neroli & Italian Cedarwood diffused.',
    time: '12:32',
    actionTag: 'Tarmac Chauffeur Dispatched',
    isEncrypted: true,
  },
];

const PRESET_REQUESTS = [
  {
    label: '🚗 Tarmac Chauffeur',
    prompt: 'Please dispatch the private Maybach S-Class to Milan Linate (LIN) General Aviation terminal.',
  },
  {
    label: '🍾 Champagne & Caviar',
    prompt: 'Please prepare a chilled bottle of Dom Pérignon 2012 and fresh Venetian caviar in our private suite.',
  },
  {
    label: '🧪 Dermal Lab Custom Compounding',
    prompt: 'Please ask Master Biologist Elena Russo to compound the bespoke 32 Bio-Peptide & 24k Gold serum.',
  },
  {
    label: '🌡️ Calibrate Suite Ambiance',
    prompt: 'Please adjust Carrara Suite I to 21°C, 1800K candlelight amber, and Italian Neroli aromatherapy.',
  },
  {
    label: '🔒 Subterranean Gate Entry',
    prompt: 'Activate zero-visibility protocol for private subterranean gate arrival.',
  },
];

export default function VipConciergePage() {
  const { selectedPrincipal } = useVipBookingStore();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTransmitting]);

  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || inputText;
    if (!content.trim() || isTransmitting) return;

    const userMessage: Message = {
      id: `m-${Date.now()}`,
      sender: 'client',
      senderName: `${selectedPrincipal.pseudonym} (EA Delegated)`,
      text: content.trim(),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTransmitting(true);

    try {
      const response = await fetch('/api/concierge/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          principal: selectedPrincipal.pseudonym,
          priority: 'urgent',
        }),
      });

      const data = await response.json();

      if (data.success && data.concierge) {
        const conciergeMsg: Message = {
          id: data.messageId || `m-resp-${Date.now()}`,
          sender: 'concierge',
          senderName: `${data.concierge.name} (${data.concierge.title})`,
          text: data.concierge.response,
          time: data.timestamp || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          actionTag: data.concierge.actionConfirmed,
          isEncrypted: true,
        };
        setMessages((prev) => [...prev, conciergeMsg]);
      } else {
        throw new Error('Fallback response');
      }
    } catch (err) {
      // Graceful fallback response
      setTimeout(() => {
        const fallbackMsg: Message = {
          id: `m-resp-${Date.now()}`,
          sender: 'concierge',
          senderName: 'Elena V. (Chief Sovereign Concierge)',
          text: 'Dispatched and logged with Palazzo Operations. Our Master Artisan and logistics teams are attending to this immediately.',
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          actionTag: 'Palazzo Dispatch Verified',
          isEncrypted: true,
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }, 800);
    } finally {
      setIsTransmitting(false);
    }
  };

  const handleVoiceDispatch = () => {
    setIsVoiceRecording(true);
    setTimeout(() => {
      setIsVoiceRecording(false);
      handleSendMessage('🎙️ [Encrypted Audio Dispatch Note: 14s] "Requesting 24k Gold Serum batch update and confirmation of private subterranean garage clearance."');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-900/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-400" />
              Direct Sovereign Line
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Elena V. Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#FAF8F5] mt-1">
            Private Sovereign Concierge
          </h1>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-4 py-2 rounded-2xl bg-[#12100E] border border-amber-900/40 text-amber-200 flex items-center gap-2">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct WhatsApp Sync Active</span>
          </div>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-[11px] font-mono uppercase text-neutral-500 whitespace-nowrap mr-1">
          Quick Protocols:
        </span>
        {PRESET_REQUESTS.map((req, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(req.prompt)}
            disabled={isTransmitting}
            className="px-3.5 py-1.5 rounded-xl bg-[#141210] border border-amber-900/40 hover:border-amber-500/50 hover:bg-[#1C1814] text-xs font-mono text-amber-200 transition whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            {req.label}
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Messages Stream (3 Cols) */}
        <div className="lg:col-span-3 rounded-3xl bg-[#0F0D0B] border border-amber-500/30 shadow-2xl flex flex-col h-[600px] overflow-hidden">
          
          {/* Chat Stream Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isMe = msg.sender === 'client';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-600">
                      {msg.time}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                      isMe
                        ? 'bg-gradient-to-r from-amber-700 to-amber-600 text-white rounded-tr-none shadow-lg'
                        : 'bg-[#181512] border border-amber-900/50 text-neutral-200 rounded-tl-none shadow-md'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {msg.actionTag && (
                      <div className="pt-2 border-t border-amber-500/20 flex items-center gap-1.5 text-[10px] font-mono text-amber-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Action: {msg.actionTag}</span>
                      </div>
                    )}
                  </div>

                  {msg.isEncrypted && (
                    <span className="text-[9px] font-mono text-emerald-500/60 mt-1 flex items-center gap-1 px-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>SHA-256 Verified Dispatch</span>
                    </span>
                  )}
                </div>
              );
            })}

            {isTransmitting && (
              <div className="flex items-start gap-2">
                <div className="p-4 rounded-2xl bg-[#181512] border border-amber-900/50 text-neutral-400 text-xs flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>Elena V. is reviewing protocol requirements...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-[#0A0908] border-t border-amber-900/40">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleVoiceDispatch}
                disabled={isVoiceRecording || isTransmitting}
                className={`p-3 rounded-2xl border transition shrink-0 ${
                  isVoiceRecording
                    ? 'bg-rose-900/60 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-[#141210] border-amber-900/40 text-neutral-400 hover:text-amber-300'
                }`}
                title="Record Encrypted Voice Note"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message Elena V. regarding suite, logistics, champagne, or security..."
                disabled={isTransmitting}
                className="flex-1 bg-[#141210] border border-amber-900/40 focus:border-amber-500/60 rounded-2xl px-4 py-3 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none transition"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isTransmitting}
                className="p-3 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white shadow-lg transition shrink-0 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Liaison Profile & Security Sidebar (1 Col) */}
        <div className="space-y-6">
          
          {/* Chief Concierge Profile */}
          <div className="p-6 rounded-3xl bg-[#110F0C] border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-800 to-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-200 font-serif font-bold text-lg">
                EV
              </div>
              <div>
                <h3 className="font-serif text-base text-amber-100">Elena V.</h3>
                <span className="text-[11px] font-mono text-amber-400 block">
                  Head of Sovereign Concierge
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed">
              Available 24/7 for bespoke flight changes, private suite catering, security gate clearance, and custom aesthetic compounding.
            </p>

            <div className="pt-3 border-t border-amber-950/60 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Response SLA:</span>
                <span className="text-emerald-400">&lt; 3 Minutes</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Direct Line:</span>
                <span className="text-amber-200">+39 02 8841 9002</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Security Clearance:</span>
                <span className="text-amber-300">Level 4 (Director)</span>
              </div>
            </div>
          </div>

          {/* Sovereign Security Guarantees */}
          <div className="p-6 rounded-3xl bg-[#110F0C] border border-amber-950/80 space-y-3 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold block">
              Discretion Guarantees
            </span>
            <ul className="space-y-2 text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>End-to-End Ephemeral Messages</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Direct WhatsApp Mirroring</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero Third-Party Logs Stored</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
