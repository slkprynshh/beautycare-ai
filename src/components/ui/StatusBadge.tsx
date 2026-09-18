import React from 'react';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  AlertTriangle,
  XCircle,
  RefreshCw,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { AppointmentStatus, CustomerStatus, RecoveryStatus, WhatsAppStatus } from '@/types';

interface StatusBadgeProps {
  status: AppointmentStatus | CustomerStatus | RecoveryStatus | WhatsAppStatus | string;
  type?: 'appointment' | 'customer' | 'recovery' | 'whatsapp';
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, className, size = 'md' }: StatusBadgeProps) {
  let label = status;
  let colorClass = 'bg-surface-muted text-muted-foreground border-border';
  let Icon = Clock;

  // Appointment Statuses
  if (status === 'confirmed') {
    label = 'Confirmed';
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    Icon = CheckCircle2;
  } else if (status === 'checked_in') {
    label = 'Checked In';
    colorClass = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800';
    Icon = UserCheck;
  } else if (status === 'completed') {
    label = 'Completed';
    colorClass = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    Icon = CheckCircle2;
  } else if (status === 'reminder_sent') {
    label = 'Reminder Sent';
    colorClass = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
    Icon = Send;
  } else if (status === 'reminder_pending') {
    label = 'Reminder Pending';
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    Icon = Clock;
  } else if (status === 'no_show') {
    label = 'No-Show';
    colorClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    Icon = AlertTriangle;
  } else if (status === 'reschedule_requested') {
    label = 'Reschedule Requested';
    colorClass = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
    Icon = RefreshCw;
  } else if (status === 'cancelled') {
    label = 'Cancelled';
    colorClass = 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';
    Icon = XCircle;
  }

  // Customer Statuses
  if (status === 'active') {
    label = 'Active Regular';
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    Icon = CheckCircle2;
  } else if (status === 'due_soon') {
    label = 'Due This Week';
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    Icon = Clock;
  } else if (status === 'overdue') {
    label = 'Overdue for Visit';
    colorClass = 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800';
    Icon = AlertTriangle;
  } else if (status === 'lapsed') {
    label = 'Lapsed Customer';
    colorClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    Icon = RefreshCw;
  } else if (status === 'high_value') {
    label = 'High Value VIP';
    colorClass = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700';
    Icon = Sparkles;
  } else if (status === 'no_show_risk') {
    label = 'No-Show Risk';
    colorClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800';
    Icon = AlertTriangle;
  }

  // Recovery Statuses
  if (status === 'appointment_booked') {
    label = 'Rebooked';
    colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700';
    Icon = TrendingUp;
  } else if (status === 'visit_completed') {
    label = 'Recovered & Completed';
    colorClass = 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-600';
    Icon = CheckCircle2;
  } else if (status === 'message_sent') {
    label = 'Recovery Nudge Sent';
    colorClass = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
    Icon = Send;
  } else if (status === 'replied') {
    label = 'Customer Replied';
    colorClass = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800';
    Icon = MessageSquare;
  }

  // WhatsApp Statuses
  if (status === 'delivered') {
    label = 'Delivered';
    colorClass = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
    Icon = CheckCircle2;
  } else if (status === 'read') {
    label = 'Read on WhatsApp';
    colorClass = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800';
    Icon = CheckCircle2;
  } else if (status === 'failed') {
    label = 'Delivery Failed';
    colorClass = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800';
    Icon = XCircle;
  }

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1' : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border shrink-0',
        sizeClasses,
        colorClass,
        className
      )}
    >
      <Icon className={cn('shrink-0', size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      <span>{label}</span>
    </span>
  );
}
