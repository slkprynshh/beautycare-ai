'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/Toast';
import {
  X,
  Calendar,
  Clock,
  User,
  Scissors,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
  Phone,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CustomerAvatar } from '@/components/ui/CustomerAvatar';
import { formatINR, formatIndianDate, formatIndianPhone, cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function AppointmentDetailDrawer() {
  const router = useRouter();
  const {
    selectedAppointment,
    setSelectedAppointment,
    updateAppointmentStatus,
    markNoShowAndTriggerRecovery,
    customers,
  } = useStore();

  const { toast } = useToast();
  const [showNoShowConfirm, setShowNoShowConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!selectedAppointment) return null;

  const customer = customers.find((c) => c.id === selectedAppointment.customerId);

  const handleCheckIn = () => {
    updateAppointmentStatus(selectedAppointment.id, 'checked_in');
    toast({
      title: 'Customer Checked In',
      description: `${selectedAppointment.customerName} has arrived and is checked in.`,
      type: 'success',
    });
  };

  const handleComplete = () => {
    updateAppointmentStatus(selectedAppointment.id, 'completed');
    toast({
      title: 'Visit Completed',
      description: `Appointment marked complete. Rebooking nudge will be scheduled automatically based on service cycle.`,
      type: 'success',
    });
  };

  const handleNoShowConfirm = () => {
    setShowNoShowConfirm(false);
    markNoShowAndTriggerRecovery(selectedAppointment.id);
    toast({
      title: 'No-Show Recovery Triggered',
      description: `WhatsApp reschedule prompt dispatched to ${selectedAppointment.customerName}.`,
      type: 'info',
    });
  };

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    updateAppointmentStatus(selectedAppointment.id, 'cancelled');
    toast({
      title: 'Appointment Cancelled',
      description: 'Slot is now freed on the calendar.',
      type: 'info',
    });
  };

  const handleSendReminderNow = () => {
    toast({
      title: 'WhatsApp Reminder Dispatched',
      description: `Reminder sent to ${selectedAppointment.customerName} (${selectedAppointment.customerPhone}).`,
      type: 'success',
    });
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAppointment(null)}
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
              <div className="flex items-center gap-2.5">
                <StatusBadge status={selectedAppointment.status} type="appointment" />
                {selectedAppointment.isRecovered && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    <Sparkles className="w-3 h-3" />
                    Recovered Booking
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Close appointment details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 flex-1">
              {/* Customer Profile Banner */}
              <div className="flex items-start justify-between gap-4 p-4 rounded-apple-xl bg-surface-muted/40 border border-border/70">
                <div className="flex items-center gap-3.5">
                  <CustomerAvatar name={selectedAppointment.customerName} size="lg" />
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {selectedAppointment.customerName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatIndianPhone(selectedAppointment.customerPhone)}
                    </p>
                    {customer && (
                      <p className="mt-1 text-[11px] font-medium text-primary">
                        {customer.totalVisits} visits • {formatINR(customer.totalSpend)} lifetime spend
                      </p>
                    )}
                  </div>
                </div>

                {customer && (
                  <button
                    onClick={() => {
                      setSelectedAppointment(null);
                      router.push(`/customers/${customer.id}`);
                    }}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Service & Time Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Booking Details
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-apple border border-border bg-surface">
                    <span className="text-muted-foreground block text-[11px]">Service</span>
                    <span className="font-semibold text-foreground mt-0.5 block text-sm">
                      {selectedAppointment.serviceName}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {selectedAppointment.durationMinutes} mins
                    </span>
                  </div>

                  <div className="p-3 rounded-apple border border-border bg-surface">
                    <span className="text-muted-foreground block text-[11px]">Price (INR)</span>
                    <span className="font-bold text-foreground mt-0.5 block text-sm tabular-nums">
                      {formatINR(selectedAppointment.price)}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">
                      Pay at counter / UPI
                    </span>
                  </div>

                  <div className="p-3 rounded-apple border border-border bg-surface">
                    <span className="text-muted-foreground block text-[11px]">Stylist / Staff</span>
                    <span className="font-semibold text-foreground mt-0.5 block text-sm">
                      {selectedAppointment.staffName}
                    </span>
                    <span className="text-muted-foreground text-[11px]">Assigned Specialist</span>
                  </div>

                  <div className="p-3 rounded-apple border border-border bg-surface">
                    <span className="text-muted-foreground block text-[11px]">Date & Time</span>
                    <span className="font-semibold text-foreground mt-0.5 block text-sm">
                      {formatIndianDate(selectedAppointment.startTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Status Card */}
              <div className="p-4 rounded-apple-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>WhatsApp Delivery Status</span>
                  </div>
                  <StatusBadge status={selectedAppointment.whatsappStatus} type="whatsapp" size="sm" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Automated appointment reminder & 1-click confirmation workflow is active.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <Button
                    variant="subtle"
                    size="sm"
                    onClick={handleSendReminderNow}
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Send Instant WhatsApp Reminder
                  </Button>
                </div>
              </div>

              {/* Notes */}
              {selectedAppointment.notes && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Appointment Notes
                  </h4>
                  <div className="p-3 rounded-apple bg-surface-muted/50 border border-border text-xs text-foreground leading-relaxed">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}

              {/* Actions Matrix */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Actions
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedAppointment.status !== 'checked_in' && selectedAppointment.status !== 'completed' && (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleCheckIn}
                      leftIcon={<UserCheck className="w-4 h-4" />}
                    >
                      Mark Checked In
                    </Button>
                  )}

                  {selectedAppointment.status !== 'completed' && (
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={handleComplete}
                      leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    >
                      Mark Completed
                    </Button>
                  )}

                  {selectedAppointment.status !== 'no_show' && (
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setShowNoShowConfirm(true)}
                      leftIcon={<AlertTriangle className="w-4 h-4 text-rose-600" />}
                      className="border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-400"
                    >
                      Mark No-Show & Recover
                    </Button>
                  )}

                  {selectedAppointment.status !== 'cancelled' && (
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => setShowCancelConfirm(true)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Cancel Appointment
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* No-Show Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showNoShowConfirm}
        onClose={() => setShowNoShowConfirm(false)}
        onConfirm={handleNoShowConfirm}
        title="Mark as No-Show & Trigger Recovery?"
        description={`This will mark ${selectedAppointment.customerName}'s appointment as missed and immediately send an automated, friendly WhatsApp rebooking prompt with 1-click reschedule options.`}
        confirmLabel="Mark No-Show & Send Nudge"
        variant="destructive"
      />

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel this appointment?"
        description="This will free up the time slot on the calendar. Are you sure you want to proceed?"
        confirmLabel="Cancel Appointment"
        variant="destructive"
      />
    </>
  );
}
