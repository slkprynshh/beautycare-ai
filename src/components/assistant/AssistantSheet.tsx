'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/Toast';
import {
  Bot,
  X,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { formatINR, cn } from '@/lib/utils';
import { CustomerAvatar } from '@/components/ui/CustomerAvatar';
import Link from 'next/link';

interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dataCard?: {
    type: 'recovery_summary' | 'overdue_list' | 'message_draft' | 'no_show_alert';
    title: string;
    items?: { id: string; label: string; detail: string; value?: string }[];
    actions?: { label: string; actionId: string; variant?: 'primary' | 'secondary' }[];
  };
}

export function AssistantSheet() {
  const { isAssistantOpen, setAssistantOpen, customers, appointments, recoveryEvents, sendManualNudgeToCustomer } = useStore();
  const { toast } = useToast();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Good morning Priyanshu. I am your VertOps Revenue Assistant. How can I help you recover bookings or review salon performance today?',
      timestamp: new Date().toISOString(),
    },
  ]);

  if (!isAssistantOpen) return null;

  const quickPrompts = [
    'How much revenue did we recover this month?',
    'Which customers are overdue this week?',
    'Show no-shows from yesterday',
    'Draft a rebooking message for Riya',
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent response based on query
    setTimeout(() => {
      let reply: AssistantMessage;
      const lower = q.toLowerCase();

      if (lower.includes('revenue') || lower.includes('recover') || lower.includes('how much')) {
        reply = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: 'This month, VertOps has helped recover an estimated ₹38,500 across 59 rebooked customer visits (+30.9% compared to August).',
          timestamp: new Date().toISOString(),
          dataCard: {
            type: 'recovery_summary',
            title: 'Monthly Recovery Breakdown',
            items: [
              { id: '1', label: 'Lapsed Customers Re-engaged', detail: '47 customers returned', value: '₹31,150' },
              { id: '2', label: 'No-Shows Rescheduled', detail: '12 appointments recovered', value: '₹7,350' },
              { id: '3', label: 'Average Recovery Value', detail: 'Per rebooked client', value: '₹820' },
            ],
            actions: [
              { label: 'View Full Recovery Funnel', actionId: 'view_recovery', variant: 'primary' },
            ],
          },
        };
      } else if (lower.includes('overdue') || lower.includes('due') || lower.includes('lapsed')) {
        const overdueCusts = customers.filter((c) => c.status === 'overdue' || c.status === 'lapsed');
        reply = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: `I found ${overdueCusts.length} regular customers who have exceeded their typical return cycle and are due for service.`,
          timestamp: new Date().toISOString(),
          dataCard: {
            type: 'overdue_list',
            title: 'Customers Due for Follow-up',
            items: overdueCusts.slice(0, 3).map((c) => ({
              id: c.id,
              label: c.name,
              detail: `Last visit ${c.lastVisit} (${c.preferredService})`,
              value: `Due ${c.nextDueDate}`,
            })),
            actions: [
              { label: 'Send WhatsApp Nudge to All 3', actionId: 'nudge_all', variant: 'primary' },
              { label: 'Review Customer List', actionId: 'view_customers', variant: 'secondary' },
            ],
          },
        };
      } else if (lower.includes('riya') || lower.includes('draft') || lower.includes('message')) {
        reply = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: 'Here is a polite, personalized rebooking draft for Riya Shah based on her last Hydra-Glow Facial visit with Meera Sen.',
          timestamp: new Date().toISOString(),
          dataCard: {
            type: 'message_draft',
            title: 'WhatsApp Message Draft for Riya Shah',
            items: [
              {
                id: 'd1',
                label: 'Suggested WhatsApp Copy',
                detail: '“Hi Riya, Meera and the team at Luxe Aura hope you are having a wonderful week! It has been 30 days since your Hydra-Glow Facial. Would you like to reserve a relaxing slot this Friday or Saturday?”',
              },
            ],
            actions: [
              { label: 'Send WhatsApp Message Now', actionId: 'send_riya_nudge', variant: 'primary' },
              { label: 'Edit Draft', actionId: 'edit_draft', variant: 'secondary' },
            ],
          },
        };
      } else {
        reply = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: `I have analyzed your salon operations. 18 appointments are scheduled for today with ₹21,400 expected revenue. 1 customer reply is waiting for review in Messages.`,
          timestamp: new Date().toISOString(),
          dataCard: {
            type: 'no_show_alert',
            title: 'Today’s Operational Health',
            items: [
              { id: '1', label: 'Confirmed for Today', detail: '7 visits verified', value: '18 total' },
              { id: '2', label: 'Replies Needing Review', detail: 'Sneha Reddy (Balayage slot request)', value: '1 pending' },
            ],
            actions: [
              { label: 'Go to WhatsApp Inbox', actionId: 'view_messages', variant: 'primary' },
            ],
          },
        };
      }

      setMessages((prev) => [...prev, reply]);
    }, 400);
  };

  const handleCardAction = (actionId: string) => {
    if (actionId === 'send_riya_nudge') {
      const riya = customers.find((c) => c.name.toLowerCase().includes('riya'));
      if (riya) {
        sendManualNudgeToCustomer(riya.id);
        toast({
          title: 'WhatsApp Nudge Dispatched to Riya',
          description: 'Rebooking message sent via Gupshup WhatsApp API.',
          type: 'success',
        });
      }
    } else if (actionId === 'nudge_all') {
      toast({
        title: 'Batch Rebooking Nudges Dispatched',
        description: 'WhatsApp messages sent to 3 overdue customers.',
        type: 'success',
      });
    } else if (actionId === 'view_recovery') {
      setAssistantOpen(false);
      if (typeof window !== 'undefined') window.location.href = '/recovery';
    } else if (actionId === 'view_customers') {
      setAssistantOpen(false);
      if (typeof window !== 'undefined') window.location.href = '/customers';
    } else if (actionId === 'view_messages') {
      setAssistantOpen(false);
      if (typeof window !== 'undefined') window.location.href = '/messages';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAssistantOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-lg h-full bg-surface border-l border-border shadow-floating flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-surface/90 glass-surface">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-apple bg-primary/15 text-primary">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">VertOps Assistant</h3>
                <p className="text-[11px] text-muted-foreground">Revenue intelligence & automations</p>
              </div>
            </div>
            <button
              onClick={() => setAssistantOpen(false)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversation History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex flex-col',
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-apple-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-subtle',
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                      : 'bg-surface-muted border border-border/80 text-foreground rounded-tl-none'
                  )}
                >
                  {msg.text}
                </div>

                {/* Structured Assistant Data Card */}
                {msg.dataCard && (
                  <div className="mt-2.5 w-full max-w-[95%] rounded-apple-xl border border-primary/20 bg-surface p-4 shadow-soft space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-foreground">{msg.dataCard.title}</span>
                    </div>

                    {msg.dataCard.items && (
                      <div className="space-y-2 text-xs">
                        {msg.dataCard.items.map((it) => (
                          <div
                            key={it.id}
                            className="p-2.5 rounded-apple bg-surface-muted/60 border border-border/60 flex items-center justify-between"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-semibold text-foreground truncate">{it.label}</p>
                              <p className="text-[11px] text-muted-foreground">{it.detail}</p>
                            </div>
                            {it.value && (
                              <span className="font-bold text-foreground tabular-nums shrink-0">
                                {it.value}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.dataCard.actions && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        {msg.dataCard.actions.map((act) => (
                          <Button
                            key={act.actionId}
                            variant={act.variant || 'secondary'}
                            size="sm"
                            onClick={() => handleCardAction(act.actionId)}
                          >
                            {act.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="p-3 border-t border-border/60 bg-surface-muted/30">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Suggested Questions
            </p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1.5 rounded-apple bg-surface border border-border text-[11px] font-medium text-foreground hover:bg-surface-elevated hover:border-primary/40 whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Query Input */}
          <div className="p-4 border-t border-border bg-surface flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about salon bookings or revenue..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 min-h-[44px] rounded-apple border border-border bg-surface px-3.5 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:border-primary"
            />
            <Button
              variant="primary"
              size="icon"
              onClick={() => handleSend()}
              aria-label="Send message to assistant"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
