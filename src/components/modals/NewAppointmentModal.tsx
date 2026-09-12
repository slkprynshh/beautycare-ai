'use client';

import React, { useState } from 'react';
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
  AlertCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { formatINR, cn } from '@/lib/utils';
import { format, addMinutes } from 'date-fns';
import { useRouter } from 'next/navigation';

export function NewAppointmentModal() {
  const router = useRouter();
  const {
    isNewAppointmentOpen,
    setNewAppointmentOpen,
    customers,
    services,
    staff,
    appointments,
    addAppointment,
    addCustomer,
  } = useStore();

  const { toast } = useToast();

  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || '');
  const [appointmentDate, setAppointmentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [appointmentTime, setAppointmentTime] = useState('14:30');
  const [notes, setNotes] = useState('');
  const [sendWhatsAppReminder, setSendWhatsAppReminder] = useState(true);
  const [enableRebookingNudge, setEnableRebookingNudge] = useState(true);

  if (!isNewAppointmentOpen) return null;

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const currentStaff = staff.find((s) => s.id === selectedStaffId) || staff[0];
  const currentCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Check collision / double-booking simulation
  const proposedStart = `${appointmentDate}T${appointmentTime}:00`;
  const isConflict = appointments.some(
    (apt) =>
      apt.staffId === selectedStaffId &&
      apt.startTime.startsWith(appointmentDate) &&
      apt.startTime.slice(11, 16) === appointmentTime &&
      apt.status !== 'cancelled'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let customerId = selectedCustomerId;
    let customerName = currentCustomer?.name || 'Walk-in Client';
    let customerPhone = currentCustomer?.phone || '+91 98000 00000';

    if (customerMode === 'new') {
      if (!newCustomerName || !newCustomerPhone) {
        toast({
          title: 'Missing customer details',
          description: 'Please enter name and phone number for the new customer.',
          type: 'error',
        });
        return;
      }
      const newCust = addCustomer({
        name: newCustomerName,
        phone: newCustomerPhone,
        tags: ['New Client'],
        lastVisit: appointmentDate,
        nextDueDate: format(addMinutes(new Date(appointmentDate), currentService.typicalReturnDays * 24 * 60), 'yyyy-MM-dd'),
        preferredService: currentService.name,
        preferredStaff: currentStaff.name,
        typicalReturnDays: currentService.typicalReturnDays,
        totalVisits: 1,
        totalSpend: currentService.price,
        status: 'active',
        notes: notes || 'First time visitor',
      });
      customerId = newCust.id;
      customerName = newCust.name;
      customerPhone = newCust.phone;
    }

    const startDateTime = new Date(`${appointmentDate}T${appointmentTime}:00`);
    const endDateTime = addMinutes(startDateTime, currentService.durationMinutes);

    addAppointment({
      customerId,
      customerName,
      customerPhone,
      serviceId: currentService.id,
      serviceName: currentService.name,
      staffId: currentStaff.id,
      staffName: currentStaff.name,
      staffInitials: currentStaff.initials,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      durationMinutes: currentService.durationMinutes,
      status: 'confirmed',
      price: currentService.price,
      notes,
    });

    setNewAppointmentOpen(false);

    toast({
      title: `Appointment Booked for ${customerName}`,
      description: `${currentService.name} on ${appointmentDate} at ${appointmentTime} with ${currentStaff.name}. Automated WhatsApp reminder scheduled.`,
      type: 'success',
      action: {
        label: 'View in Calendar',
        onClick: () => {
          router.push('/calendar');
        },
      },
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setNewAppointmentOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-2xl bg-surface border border-border rounded-apple-2xl shadow-floating overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-surface-muted/30">
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                New Salon Appointment
              </h2>
              <p className="text-xs text-muted-foreground">
                Book a service and automatically schedule WhatsApp reminders
              </p>
            </div>
            <button
              onClick={() => setNewAppointmentOpen(false)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {/* Customer Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Customer
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomerMode('existing')}
                    className={cn(
                      'text-xs font-semibold px-2.5 py-1 rounded-apple transition-colors',
                      customerMode === 'existing'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Select Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerMode('new')}
                    className={cn(
                      'text-xs font-semibold px-2.5 py-1 rounded-apple transition-colors',
                      customerMode === 'new'
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    + Add New
                  </button>
                </div>
              </div>

              {customerMode === 'existing' ? (
                <Select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  aria-label="Select Customer"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) — {c.preferredService}
                    </option>
                  ))}
                </Select>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Customer Full Name"
                    placeholder="E.g. Meera Kapoor"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    required
                  />
                  <Input
                    label="WhatsApp Mobile Phone"
                    placeholder="+91 98200 XXXXX"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {/* Service & Staff Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Service
                </label>
                <Select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  aria-label="Select Service"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.durationMinutes} min • {formatINR(s.price)})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Stylist / Specialist
                </label>
                <Select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  aria-label="Select Staff Member"
                >
                  {staff.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role.split('&')[0]})
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Appointment Date"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
              <Input
                label="Start Time"
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              />
            </div>

            {/* Collision warning if any */}
            {isConflict && (
              <div className="p-3 rounded-apple bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div>
                  <span className="font-semibold">{currentStaff.name} already has an appointment at this time.</span>
                  <p className="mt-0.5 text-[11px] opacity-90">
                    Suggested open slots today: 15:30, 16:15, or 18:00.
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            <Textarea
              label="Service Notes or Formula (Optional)"
              placeholder="E.g. Wants cool ash highlights, extra scalp massage..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />

            {/* WhatsApp Automation Toggles */}
            <div className="rounded-apple-xl border border-border/80 bg-surface-muted/40 p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-foreground">Send 24h WhatsApp Reminder</span>
                </div>
                <input
                  type="checkbox"
                  checked={sendWhatsAppReminder}
                  onChange={(e) => setSendWhatsAppReminder(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-semibold text-foreground">
                    Auto-nudge when due for next visit (in {currentService.typicalReturnDays} days)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableRebookingNudge}
                  onChange={(e) => setEnableRebookingNudge(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
              </div>
            </div>

            {/* Summary & Actions */}
            <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs">
                <span className="text-muted-foreground">Estimated Total: </span>
                <span className="text-base font-bold text-foreground tabular-nums">
                  {formatINR(currentService.price)}
                </span>
                <span className="text-muted-foreground ml-1">({currentService.durationMinutes} mins)</span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setNewAppointmentOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  Confirm & Schedule
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
