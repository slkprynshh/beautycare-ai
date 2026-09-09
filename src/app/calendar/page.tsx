'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CustomerAvatar } from '@/components/ui/CustomerAvatar';
import { useStore } from '@/store/useStore';
import { formatINR, formatIndianDate, formatTimeOnly, cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Clock,
  Sparkles,
  User,
  Scissors,
  CheckCircle2,
  CalendarDays,
  Check,
  MessageCircle,
} from 'lucide-react';
import { format, addDays, subDays, startOfWeek, isSameDay } from 'date-fns';

export default function CalendarPage() {
  const {
    staff,
    services,
    appointments,
    setNewAppointmentOpen,
    setSelectedAppointment,
  } = useStore();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 9)); // Sep 9, 2026 (Wednesday)
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'agenda'>('day');
  const [selectedStaffFilter, setSelectedStaffFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchCustomer, setSearchCustomer] = useState('');

  const currentDateStr = format(currentDate, 'yyyy-MM-dd');

  const filteredStaff = selectedStaffFilter === 'all'
    ? staff
    : staff.filter((s) => s.id === selectedStaffFilter);

  // Filter appointments for Day / Agenda views
  const filteredAppointments = appointments.filter((apt) => {
    const matchesDate = apt.startTime.startsWith(currentDateStr);
    const matchesStaff = selectedStaffFilter === 'all' || apt.staffId === selectedStaffFilter;
    const matchesStatus = selectedStatusFilter === 'all' || apt.status === selectedStatusFilter;
    const matchesSearch = !searchCustomer.trim() ||
      apt.customerName.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchCustomer.toLowerCase());

    return matchesDate && matchesStaff && matchesStatus && matchesSearch;
  });

  // Calculate Week Days for Week View
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const nextDay = () => {
    if (viewMode === 'week') {
      setCurrentDate((prev) => addDays(prev, 7));
    } else {
      setCurrentDate((prev) => addDays(prev, 1));
    }
  };

  const prevDay = () => {
    if (viewMode === 'week') {
      setCurrentDate((prev) => subDays(prev, 7));
    } else {
      setCurrentDate((prev) => subDays(prev, 1));
    }
  };

  const setToday = () => setCurrentDate(new Date(2026, 8, 9));

  // Helper for WhatsApp status color indicator
  const getWhatsAppBadge = (status: string) => {
    switch (status) {
      case 'read':
        return <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">WA: Read ✓✓</span>;
      case 'replied':
        return <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">WA: Replied 💬</span>;
      case 'delivered':
        return <span className="text-[11px] text-muted-foreground font-medium">WA: Delivered ✓✓</span>;
      case 'sent':
        return <span className="text-[11px] text-muted-foreground font-medium">WA: Sent ✓</span>;
      default:
        return <span className="text-[11px] text-muted-foreground capitalize">WA: {status}</span>;
    }
  };

  return (
    <AppShell pageTitle="Booking Calendar">
      {/* Calendar Header */}
      <PageHeader
        title="Staff & Service Calendar"
        subtitle="Manage daily bookings, monitor WhatsApp confirmations, and handle no-shows."
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Segmented Control */}
            <Tabs
              options={[
                { id: 'day', label: 'Day View' },
                { id: 'week', label: 'Week View' },
                { id: 'agenda', label: 'Agenda List' },
              ]}
              activeId={viewMode}
              onChange={(id) => setViewMode(id as any)}
              size="sm"
            />

            <Button
              variant="primary"
              size="md"
              onClick={() => setNewAppointmentOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Book Appointment
            </Button>
          </div>
        }
      />

      {/* Date Navigation & Filters Toolbar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-3.5 rounded-apple-xl bg-surface border border-border shadow-subtle">
        {/* Left: Date Stepper */}
        <div className="flex items-center gap-2">
          <button
            onClick={setToday}
            className="px-3 py-1.5 rounded-apple text-xs font-semibold bg-surface-muted hover:bg-surface-elevated border border-border text-foreground transition-colors min-h-[36px]"
          >
            Today
          </button>
          <div className="flex items-center border border-border rounded-apple overflow-hidden bg-surface">
            <button
              onClick={prevDay}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Previous date range"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs sm:text-sm font-bold text-foreground tabular-nums select-none min-w-[200px] text-center">
              {viewMode === 'week'
                ? `${format(weekDays[0], 'dd MMM')} – ${format(weekDays[6], 'dd MMM yyyy')}`
                : format(currentDate, 'EEEE, dd MMMM yyyy')}
            </span>
            <button
              onClick={nextDay}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Next date range"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Search & Staff Filter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter by customer..."
              value={searchCustomer}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-apple border border-border bg-surface text-foreground focus:outline-none focus:border-primary min-h-[36px]"
            />
          </div>

          {/* Staff Filter */}
          <select
            value={selectedStaffFilter}
            onChange={(e) => setSelectedStaffFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-apple border border-border bg-surface text-xs font-medium text-foreground focus:outline-none focus:border-primary min-h-[36px] cursor-pointer"
            aria-label="Filter by staff member"
          >
            <option value="all">All Staff ({staff.length})</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.role.split('&')[0]})
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-apple border border-border bg-surface text-xs font-medium text-foreground focus:outline-none focus:border-primary min-h-[36px] cursor-pointer"
            aria-label="Filter by booking status"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="reminder_sent">Reminder Sent</option>
            <option value="no_show">No-Show</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* VIEW 1: Agenda List View */}
      {viewMode === 'agenda' && (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border/70">
            {filteredAppointments.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium text-foreground">No appointments match your filters.</p>
                <p className="text-xs text-muted-foreground mt-1">Try resetting the filters or book a new appointment.</p>
              </div>
            ) : (
              filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => setSelectedAppointment(apt)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-muted/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-20 shrink-0 text-left">
                      <span className="text-sm font-bold text-foreground tabular-nums block">
                        {formatTimeOnly(apt.startTime)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {apt.durationMinutes} mins
                      </span>
                    </div>

                    <CustomerAvatar name={apt.customerName} size="md" />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-foreground">
                          {apt.customerName}
                        </span>
                        {apt.isRecovered && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
                            Recovered
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {apt.serviceName} • Stylist: <span className="text-foreground font-medium">{apt.staffName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 sm:justify-end">
                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground tabular-nums block">
                        {formatINR(apt.price)}
                      </span>
                      {getWhatsAppBadge(apt.whatsappStatus)}
                    </div>
                    <StatusBadge status={apt.status} type="appointment" size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* VIEW 2: Staff Columns Day View (Default) */}
      {viewMode === 'day' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {filteredStaff.map((st) => {
            const staffApts = filteredAppointments.filter((a) => a.staffId === st.id);

            return (
              <div
                key={st.id}
                className="rounded-apple-2xl border border-border bg-surface shadow-soft overflow-hidden flex flex-col"
              >
                {/* Opaque Staff Column Header */}
                <div className="p-3.5 border-b border-border bg-surface-muted flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-subtle shrink-0"
                      style={{ backgroundColor: st.color }}
                    >
                      {st.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-foreground truncate">{st.name}</h3>
                      <p className="text-[10px] text-muted-foreground truncate">{st.role.split('&')[0]}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-surface border border-border text-foreground tabular-nums shadow-xs shrink-0">
                    {staffApts.length} {staffApts.length === 1 ? 'apt' : 'apts'}
                  </span>
                </div>

                {/* Column Body: Appointment Cards */}
                <div className="p-3 space-y-3 bg-surface/50 min-h-[380px] flex flex-col justify-between">
                  <div className="space-y-3">
                    {staffApts.length === 0 ? (
                      <div
                        onClick={() => setNewAppointmentOpen(true)}
                        className="h-32 rounded-apple-xl border border-dashed border-border/80 flex flex-col items-center justify-center text-center p-4 hover:border-primary/50 hover:bg-surface-muted/30 cursor-pointer transition-colors group"
                      >
                        <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary mb-1 transition-colors" />
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                          Click to book {st.name.split(' ')[0]}
                        </span>
                      </div>
                    ) : (
                      staffApts.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className={cn(
                            'p-3.5 rounded-apple-xl border transition-all duration-150 cursor-pointer shadow-subtle hover:shadow-elevated hover:scale-[1.01] active:scale-[0.99] space-y-2.5',
                            apt.isRecovered
                              ? 'bg-gradient-to-br from-amber-500/10 via-surface to-surface border-amber-400/60 ring-1 ring-amber-400/20'
                              : 'bg-surface border-border hover:border-primary/50'
                          )}
                        >
                          {/* Card Top Row: Customer info + Status Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <CustomerAvatar name={apt.customerName} size="sm" />
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-foreground block truncate">
                                  {apt.customerName}
                                </span>
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-muted-foreground/70" />
                                  {formatTimeOnly(apt.startTime)} ({apt.durationMinutes}m)
                                </span>
                              </div>
                            </div>
                            <StatusBadge status={apt.status} type="appointment" size="sm" />
                          </div>

                          {/* Service Name */}
                          <div className="text-xs font-medium text-foreground truncate pl-0.5 flex items-center gap-1.5">
                            <Scissors className="w-3 h-3 text-primary/70 shrink-0" />
                            <span className="truncate">{apt.serviceName}</span>
                          </div>

                          {/* Recovery indicator if applicable */}
                          {apt.isRecovered && (
                            <div className="px-2 py-1 rounded bg-amber-500/15 border border-amber-500/20 flex items-center justify-between text-[10px] font-bold text-amber-700 dark:text-amber-300">
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Recovered Booking
                              </span>
                              <span className="tabular-nums">+{formatINR(apt.price)}</span>
                            </div>
                          )}

                          {/* Card Bottom Row: Price & WhatsApp Delivery */}
                          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-foreground tabular-nums">
                              {formatINR(apt.price)}
                            </span>
                            <div>{getWhatsAppBadge(apt.whatsappStatus)}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Empty Slot Placeholder to Book */}
                  <button
                    onClick={() => setNewAppointmentOpen(true)}
                    className="w-full py-2.5 rounded-apple border border-dashed border-border/80 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-surface-muted hover:border-primary/40 transition-all flex items-center justify-center gap-1.5 min-h-[40px] mt-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-primary" />
                    <span>Book slot for {st.name.split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: Week View (7 Days Horizon) */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayApts = appointments.filter((a) => {
              const matchesDate = a.startTime.startsWith(dayStr);
              const matchesStaff = selectedStaffFilter === 'all' || a.staffId === selectedStaffFilter;
              const matchesStatus = selectedStatusFilter === 'all' || a.status === selectedStatusFilter;
              const matchesSearch = !searchCustomer.trim() ||
                a.customerName.toLowerCase().includes(searchCustomer.toLowerCase()) ||
                a.serviceName.toLowerCase().includes(searchCustomer.toLowerCase());
              return matchesDate && matchesStaff && matchesStatus && matchesSearch;
            });

            const isToday = isSameDay(day, currentDate);
            const dayRevenue = dayApts.reduce((sum, a) => sum + (a.status !== 'cancelled' ? a.price : 0), 0);

            return (
              <div
                key={dayStr}
                className={cn(
                  'rounded-apple-xl border bg-surface shadow-soft overflow-hidden flex flex-col min-h-[420px]',
                  isToday ? 'border-primary ring-1 ring-primary/30' : 'border-border'
                )}
              >
                {/* Day Header */}
                <div
                  className={cn(
                    'p-3 border-b text-center flex flex-col items-center justify-center transition-colors cursor-pointer',
                    isToday
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'bg-surface-muted border-border text-foreground hover:bg-surface-muted/80'
                  )}
                  onClick={() => {
                    setCurrentDate(day);
                    setViewMode('day');
                  }}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {format(day, 'EEE')}
                  </span>
                  <span className={cn('text-lg font-extrabold tabular-nums', isToday && 'text-primary')}>
                    {format(day, 'dd')}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-semibold text-muted-foreground">
                      {dayApts.length} apts
                    </span>
                    {dayRevenue > 0 && (
                      <span className="text-[10px] font-bold text-foreground">
                        • {formatINR(dayRevenue)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Day Appointments List */}
                <div className="p-2 space-y-2 flex-1 overflow-y-auto max-h-[500px]">
                  {dayApts.length === 0 ? (
                    <div
                      onClick={() => setNewAppointmentOpen(true)}
                      className="h-28 rounded-apple border border-dashed border-border/70 flex flex-col items-center justify-center text-center p-2 hover:border-primary/40 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4 text-muted-foreground/60 mb-1" />
                      <span className="text-[11px] text-muted-foreground">No bookings</span>
                    </div>
                  ) : (
                    dayApts.map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className={cn(
                          'p-2.5 rounded-apple border text-left transition-all hover:shadow-subtle cursor-pointer space-y-1',
                          apt.isRecovered
                            ? 'bg-amber-500/10 border-amber-400/40'
                            : 'bg-surface-elevated border-border/80 hover:border-primary/40'
                        )}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-foreground truncate">
                            {apt.customerName}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground tabular-nums shrink-0">
                            {formatTimeOnly(apt.startTime)}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {apt.serviceName}
                        </div>
                        <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/40">
                          <span className="font-semibold text-foreground">{formatINR(apt.price)}</span>
                          <span className="text-muted-foreground truncate max-w-[80px]">
                            {apt.staffName.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

