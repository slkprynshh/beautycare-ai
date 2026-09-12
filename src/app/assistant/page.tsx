'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/Toast';
import { formatINR, cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  AlertTriangle,
  Calendar,
  MessageSquare,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  dataCard?: {
    type: string;
    title: string;
    items?: { id: string; label: string; detail: string; value?: string }[];
    actions?: { label: string; actionId: string; variant?: 'primary' | 'secondary' }[];
  };
}

export default function AssistantPage() {
  const router = useRouter();
  const { customers, appointments, sendManualNudgeToCustomer } = useStore();
  const { toast } = useToast();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Good morning Priyanshu. I am your VertOps Revenue Assistant. Ask me anything about your salon bookings, overdue customers, or monthly recovered revenue.',
      timestamp: new Date().toISOString(),
    },
  ]);

  const quickPrompts = [
    'How much revenue did we recover this month?',
    'Which customers are overdue this week?',
    'Show no-shows from yesterday',
    'Draft a polite rebooking message for Riya',
    'Who usually comes back for facials after 30 days?',
    'What should I follow up on today?',
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

    setTimeout(() => {
      let reply: AssistantMessage;
      const lower = q.toLowerCase();

      if (lower.includes('revenue') || lower.includes('recover') || lower.includes('how much')) {
        reply = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: 'This month (September 2026), VertOps has recovered an estimated ₹38,500 across 59 rebooked customer visits (+30.9% growth).',
          timestamp: new Date().toISOString(),
          dataCard: {
            type: 'recovery_summary',
            title: 'Recovered Revenue Attribution',
            items: [
              { id: '1', label: 'Lapsed Customers Re-engaged', detail: '47 customers returned', value: '₹31,150' },
              { id: '2', label: 'No-Shows Rescheduled', detail: '12 missed appointments saved', value: '₹7,350' },
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
          text: `Found ${overdueCusts.length} regular clients overdue for their return cycle.`,
          timestamp: new Date().toISOString(),
          dataCard: {
            type: 'overdue_list',
            title: 'Overdue Customers for Follow-Up',
            items: overdueCusts.slice(0, 3).map((c) => ({
              id: c.id,
              label: c.name,
              detail: `Last visit: ${c.lastVisit} (${c.preferredService})`,
              value: `Due: ${c.nextDueDate}`,
            })),
            actions: [
              { label: 'Send WhatsApp Nudge to All 3', actionId: 'nudge_all', variant: 'primary' },
            ],
          },
        };
      } else if (lower.includes('riya') || lower.includes('draft') || lower.includes('message')) {
        reply = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: 'Prepared a personalized, friendly rebooking draft for Riya Shah based on her last Hydra-Glow Facial with Meera Sen.',
          timestamp: new Date().toISOString(),
          dataCard: {
            type: 'message_draft',
            title: 'WhatsApp Message Draft for Riya Shah',
            items: [
              {
                id: 'd1',
                label: 'Suggested Message Body',
                detail: '“Hi Riya, Meera and the team at Luxe Aura hope you are having a wonderful week! It has been 30 days since your Hydra-Glow Facial. Would you like to reserve a relaxing slot this Friday or Saturday?”',
              },
            ],
            actions: [
              { label: 'Send WhatsApp Message Now', actionId: 'send_riya_nudge', variant: 'primary' },
            ],
          },
        };
      } else {
        reply = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: 'Today at Luxe Aura, 18 appointments are scheduled. 1 customer reply from Sneha Reddy needs your review for a Saturday Balayage slot.',
          timestamp: new Date().toISOString(),
          dataCard: {
            type: 'daily_brief',
            title: 'Daily Briefing & Actions',
            items: [
              { id: '1', label: 'Appointments Today', detail: '7 confirmed via WhatsApp', value: '18 total' },
              { id: '2', label: 'Pending Reply Review', detail: 'Sneha Reddy (Balayage slot request)', value: '1 review' },
            ],
            actions: [
              { label: 'Review WhatsApp Messages', actionId: 'view_messages', variant: 'primary' },
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
          title: 'WhatsApp Message Dispatched to Riya',
          description: 'Rebooking nudge sent successfully via Gupshup WhatsApp API.',
          type: 'success',
        });
      }
    } else if (actionId === 'nudge_all') {
      toast({
        title: 'Batch Rebooking Nudges Sent',
        description: 'WhatsApp messages delivered to 3 overdue clients.',
        type: 'success',
      });
    } else if (actionId === 'view_recovery') {
      router.push('/recovery');
    } else if (actionId === 'view_messages') {
      router.push('/messages');
    }
  };

  return (
    <AppShell pageTitle="VertOps AI Assistant">
      <PageHeader
        title="VertOps Revenue Intelligence Assistant"
        subtitle="Ask questions in plain English to query salon performance, check overdue clients, or draft rebooking copy."
      />

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Quick Prompts Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-apple bg-surface border border-border text-xs font-medium text-foreground hover:bg-surface-elevated hover:border-primary/50 whitespace-nowrap transition-colors shadow-subtle"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Container */}
        <Card className="min-h-[500px] flex flex-col justify-between overflow-hidden">
          {/* Conversation History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[600px]">
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
                    'max-w-[85%] rounded-apple-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-subtle',
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                      : 'bg-surface-muted border border-border/80 text-foreground rounded-tl-none'
                  )}
                >
                  {msg.text}
                </div>

                {/* Structured Data Card */}
                {msg.dataCard && (
                  <div className="mt-3 w-full max-w-[90%] rounded-apple-xl border border-primary/20 bg-surface p-4 shadow-soft space-y-3">
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

          {/* Input Box */}
          <div className="p-4 border-t border-border bg-surface flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about salon bookings, no-shows, or revenue..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 min-h-[44px] rounded-apple border border-border bg-surface px-4 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:border-primary"
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => handleSend()}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Ask Assistant
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
