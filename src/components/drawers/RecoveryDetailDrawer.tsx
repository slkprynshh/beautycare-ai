'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import {
  X,
  TrendingUp,
  Sparkles,
  Calendar,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CustomerAvatar } from '@/components/ui/CustomerAvatar';
import { formatINR, formatIndianDate, formatIndianPhone } from '@/lib/utils';

export function RecoveryDetailDrawer() {
  const { selectedRecoveryEvent, setSelectedRecoveryEvent, customers, appointments } = useStore();

  if (!selectedRecoveryEvent) return null;

  const customer = customers.find((c) => c.id === selectedRecoveryEvent.customerId);
  const appointment = appointments.find((a) => a.id === selectedRecoveryEvent.appointmentId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedRecoveryEvent(null)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-lg h-full bg-surface border-l border-border shadow-floating flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-surface/90 glass-surface z-20">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Recovery Revenue Audit
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Traceable calculation & journey
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedRecoveryEvent(null)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground"
              aria-label="Close recovery audit"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 flex-1">
            {/* Value Highlight */}
            <div className="p-5 rounded-apple-2xl bg-gradient-to-br from-amber-500/15 via-surface to-surface border border-amber-400/30 text-center space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                Recovered Amount
              </span>
              <div className="text-3xl font-extrabold text-foreground tabular-nums">
                {formatINR(selectedRecoveryEvent.estimatedRevenue)}
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {selectedRecoveryEvent.isActual ? 'Verified Completed Visit' : 'Estimated Rebooked Value'}
                </span>
              </div>
            </div>

            {/* Customer Summary */}
            <div className="flex items-center gap-3.5 p-4 rounded-apple-xl bg-surface-muted/50 border border-border">
              <CustomerAvatar name={selectedRecoveryEvent.customerName} size="md" />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-foreground truncate">
                  {selectedRecoveryEvent.customerName}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {formatIndianPhone(selectedRecoveryEvent.customerPhone)}
                </p>
              </div>
              <StatusBadge status={selectedRecoveryEvent.status} type="recovery" size="sm" />
            </div>

            {/* Recovery Logic & Event Chain */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                How this was recovered
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 rounded-apple border border-border bg-surface space-y-1">
                  <span className="text-muted-foreground font-medium">Trigger Event:</span>
                  <p className="text-foreground font-semibold">
                    {selectedRecoveryEvent.source === 'no_show'
                      ? 'Missed Appointment (No-Show)'
                      : selectedRecoveryEvent.source === 'lapsed_customer'
                      ? `Lapsed Customer (${selectedRecoveryEvent.daysLapsed} days without visit)`
                      : 'Automatic Due-for-Service Rebooking Nudge'}
                  </p>
                </div>

                <div className="p-3.5 rounded-apple border border-border bg-surface space-y-1.5">
                  <span className="text-muted-foreground font-medium">Automated WhatsApp Message Sent:</span>
                  <p className="p-2.5 rounded-apple bg-emerald-500/5 border border-emerald-500/20 text-foreground text-xs leading-relaxed italic">
                    "{selectedRecoveryEvent.messagePreview}"
                  </p>
                  <span className="text-[11px] text-muted-foreground block">
                    Sent at: {formatIndianDate(selectedRecoveryEvent.messageSentAt)}
                  </span>
                </div>

                {selectedRecoveryEvent.replyPreview && (
                  <div className="p-3.5 rounded-apple border border-border bg-surface space-y-1.5">
                    <span className="text-muted-foreground font-medium">Customer WhatsApp Reply:</span>
                    <p className="p-2.5 rounded-apple bg-surface-muted border border-border text-foreground text-xs leading-relaxed font-medium">
                      "{selectedRecoveryEvent.replyPreview}"
                    </p>
                    {selectedRecoveryEvent.responseAt && (
                      <span className="text-[11px] text-muted-foreground block">
                        Received at: {formatIndianDate(selectedRecoveryEvent.responseAt)}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-3.5 rounded-apple border border-border bg-surface space-y-1">
                  <span className="text-muted-foreground font-medium">Service & Calculation Basis:</span>
                  <p className="text-foreground font-semibold">
                    {selectedRecoveryEvent.serviceName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Standard catalog price of {formatINR(selectedRecoveryEvent.estimatedRevenue)}.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom explanation */}
            <div className="p-3 rounded-apple bg-surface-muted/50 border border-border/80 flex items-start gap-2 text-[11px] text-muted-foreground">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
              <p>
                VertOps attributes revenue only when a customer confirms an appointment or completes a visit prompted by an automated reminder or nudge.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
