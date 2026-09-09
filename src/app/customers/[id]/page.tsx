'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CustomerAvatar } from '@/components/ui/CustomerAvatar';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/Toast';
import { formatINR, formatIndianDate, formatIndianPhone, formatSimpleDate, cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  Scissors,
  Sparkles,
  MessageSquare,
  Send,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Tag,
  Edit,
  FileText,
} from 'lucide-react';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const {
    customers,
    appointments,
    messages,
    setNewAppointmentOpen,
    setSelectedAppointment,
    sendManualNudgeToCustomer,
    updateCustomer,
  } = useStore();

  const { toast } = useToast();
  const [customNote, setCustomNote] = useState('');
  const [showNoteBox, setShowNoteBox] = useState(false);

  const customer = customers.find((c) => c.id === customerId) || customers[0];

  const customerAppointments = appointments.filter((a) => a.customerId === customer.id);
  const customerMessages = messages.filter((m) => m.customerId === customer.id);

  const handleSendNudge = () => {
    sendManualNudgeToCustomer(customer.id);
    toast({
      title: `WhatsApp Rebooking Nudge Sent`,
      description: `Dispatched customized "you're due" message to ${customer.name}.`,
      type: 'success',
    });
  };

  const handleSaveNote = () => {
    if (!customNote.trim()) return;
    updateCustomer(customer.id, {
      notes: `${customer.notes} | ${customNote}`,
    });
    setCustomNote('');
    setShowNoteBox(false);
    toast({
      title: 'Customer Note Saved',
      type: 'success',
    });
  };

  return (
    <AppShell pageTitle={customer.name}>
      {/* Top Header & Breadcrumb */}
      <PageHeader
        title={customer.name}
        breadcrumbs={[
          { label: 'Customers', href: '/customers' },
          { label: customer.name },
        ]}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Send className="w-4 h-4 text-emerald-600" />}
              onClick={handleSendNudge}
            >
              Send WhatsApp Nudge
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setNewAppointmentOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Book Next Visit
            </Button>
          </div>
        }
      />

      {/* Main 360 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Profile & Return Cycle */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-4">
              <CustomerAvatar name={customer.name} size="xl" />
              <div>
                <h2 className="text-lg font-bold text-foreground">{customer.name}</h2>
                <p className="text-xs text-muted-foreground">{formatIndianPhone(customer.phone)}</p>
                {customer.email && (
                  <p className="text-xs text-muted-foreground">{customer.email}</p>
                )}
                <div className="mt-2">
                  <StatusBadge status={customer.status} type="customer" size="sm" />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="pt-3 border-t border-border/70">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Customer Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {customer.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/70 text-xs">
              <div className="p-3 rounded-apple bg-surface-muted/60 border border-border">
                <span className="text-muted-foreground block text-[11px]">Lifetime Spend</span>
                <span className="text-base font-bold text-foreground tabular-nums">
                  {formatINR(customer.totalSpend)}
                </span>
              </div>
              <div className="p-3 rounded-apple bg-surface-muted/60 border border-border">
                <span className="text-muted-foreground block text-[11px]">Total Visits</span>
                <span className="text-base font-bold text-foreground tabular-nums">
                  {customer.totalVisits} visits
                </span>
              </div>
            </div>

            {/* Rebooking Cycle Analysis */}
            <div className="p-4 rounded-apple-xl bg-gradient-to-br from-teal-500/10 via-surface to-surface border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Sparkles className="w-4 h-4" />
                <span>Return Cycle Intelligence</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Typically returns every <span className="font-bold text-foreground">{customer.typicalReturnDays} days</span> for {customer.preferredService}.
              </p>
              <div className="pt-2 text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Last Visit</span>
                  <span className="font-semibold text-foreground">{formatSimpleDate(customer.lastVisit)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Next Due Date</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {formatSimpleDate(customer.nextDueDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Service & Formula Notes */}
            <div className="pt-3 border-t border-border/70 space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Stylist & Formula Notes
                </span>
                <p className="p-3 rounded-apple bg-surface-muted/40 border border-border text-foreground leading-relaxed">
                  {customer.formulaNotes || customer.notes}
                </p>
              </div>

              {showNoteBox ? (
                <div className="space-y-2">
                  <textarea
                    placeholder="Add color formula, drink preference, or allergy notes..."
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    className="w-full p-2.5 rounded-apple border border-border bg-surface text-xs text-foreground focus:outline-none focus:border-primary"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowNoteBox(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSaveNote}>
                      Save Note
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNoteBox(true)}
                  leftIcon={<Plus className="w-3 h-3" />}
                  className="w-full"
                >
                  Add Formula Note
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right 2 Columns: Appointment History & WhatsApp Message Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Appointment History ({customerAppointments.length})</span>
              </CardTitle>
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setNewAppointmentOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Book New
              </Button>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-border/60">
              {customerAppointments.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No upcoming appointments scheduled.
                </div>
              ) : (
                customerAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAppointment(apt)}
                    className="p-4 flex items-center justify-between hover:bg-surface-muted/40 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">{apt.serviceName}</span>
                        {apt.isRecovered && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300">
                            Recovered
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatIndianDate(apt.startTime)} • Stylist: {apt.staffName}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-foreground tabular-nums">
                        {formatINR(apt.price)}
                      </span>
                      <StatusBadge status={apt.status} type="appointment" size="sm" />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* WhatsApp Communications History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Recovery & Reminder History</span>
              </CardTitle>
              <span className="text-xs text-muted-foreground">Provider: Gupshup Verified</span>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {customerMessages.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No previous WhatsApp conversations recorded.
                </div>
              ) : (
                customerMessages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    {msg.conversationHistory.map((chat) => (
                      <div
                        key={chat.id}
                        className={cn(
                          'p-3.5 rounded-apple-xl max-w-lg text-xs leading-relaxed',
                          chat.sender === 'customer'
                            ? 'bg-surface-muted border border-border text-foreground mr-auto'
                            : 'bg-emerald-500/10 border border-emerald-500/20 text-foreground ml-auto'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-[11px] text-muted-foreground capitalize">
                            {chat.sender === 'customer' ? customer.name : 'Luxe Aura (WhatsApp)'}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatIndianDate(chat.timestamp)}
                          </span>
                        </div>
                        <p>{chat.text}</p>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
