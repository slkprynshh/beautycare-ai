'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { MetricCard } from '@/components/ui/MetricCard';
import { RevenueCard } from '@/components/ui/RevenueCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CustomerAvatar } from '@/components/ui/CustomerAvatar';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { useStore } from '@/store/useStore';
import { formatINR, formatIndianDate, formatTimeOnly, cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  AlertTriangle,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  UserPlus,
  Send,
  Scissors,
  Crown,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { mockRecoveryMetrics } from '@/lib/mockData';
import Link from 'next/link';

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  const [showVipBanner, setShowVipBanner] = useState(true);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {
    salonProfile,
    appointments,
    recoveryEvents,
    activeDateRange,
    setActiveDateRange,
    setNewAppointmentOpen,
    setSelectedAppointment,
    setSelectedRecoveryEvent,
    setAssistantOpen,
  } = useStore();

  const todayAppointments = appointments.filter((a) => a.startTime.startsWith('2026-09-09'));

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-apple border border-border bg-surface p-3 shadow-floating text-xs">
          <p className="font-semibold text-foreground mb-1">{label}</p>
          <p className="text-emerald-700 dark:text-emerald-400 font-medium">
            Recovered Revenue: {formatINR(payload[0].value)}
          </p>
          <p className="text-muted-foreground text-[11px]">
            Recovered Bookings: {payload[0].payload.recoveredBookings} clients
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AppShell pageTitle="Overview">
      {/* Top Header */}
      <PageHeader
        title={`Good morning, ${salonProfile.ownerName.split(' ')[0]}`}
        subtitle={`Here is what needs attention today at ${salonProfile.name}.`}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/spa"
              className="shimmer-effect hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-champagne-gold bg-champagne-gold-hover text-charcoal font-semibold text-xs tracking-wider uppercase shadow-gold-glow transition-all"
            >
              <Crown className="w-3.5 h-3.5 text-charcoal" />
              <span>Parisian VIP Lounge</span>
            </Link>
            <DateRangePicker
              value={activeDateRange}
              onChange={setActiveDateRange}
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => setNewAppointmentOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              New Appointment
            </Button>
          </div>
        }
      />

      {/* Slim, Elegant, Dismissible Dark Banner for Parisian VIP Lounge */}
      {showVipBanner && (
        <div className="mb-6 rounded-2xl bg-charcoal text-white px-4 sm:px-6 py-3 shadow-luxury border border-white/10 flex items-center justify-between gap-4 transition-all animate-fadeIn">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-surface border border-gold-border text-gold font-serif font-bold text-xs shrink-0">
              <Crown className="w-4 h-4 text-gold" />
            </div>
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-serif tracking-wide text-xs sm:text-sm font-medium text-white uppercase truncate">
                PAVILLON DES VIP PARISIENS
              </span>
              <span className="hidden md:inline text-white/40">•</span>
              <span className="hidden md:inline text-xs text-white/80 truncate">
                High-fashion client portal, editorial treatment catalog & 3-tap concierge booking
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/spa"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-champagne-gold hover:bg-gold-hover text-charcoal font-semibold text-[11px] uppercase tracking-wider transition-all"
            >
              <span>View Portal</span>
              <ArrowRight className="w-3 h-3 text-charcoal" />
            </Link>
            <button
              onClick={() => setShowVipBanner(false)}
              aria-label="Dismiss VIP Banner"
              className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Today's Appointments"
          value={mockRecoveryMetrics.todayAppointmentsCount}
          change="+2 vs yesterday"
          changeType="positive"
          explanation="7 confirmed via WhatsApp"
          icon={CalendarIcon}
          href="/calendar"
        />

        <MetricCard
          label="No-Shows This Month"
          value={mockRecoveryMetrics.noShowsThisMonth}
          change="12 rescheduled (39%)"
          changeType="positive"
          explanation="Auto-nudges sent instantly"
          icon={AlertTriangle}
          href="/recovery"
        />

        <MetricCard
          label="Customers Recovered"
          value={mockRecoveryMetrics.customersRecovered}
          change="+30.9% vs Aug"
          changeType="positive"
          explanation="47 lapsed returned"
          icon={Users}
          href="/customers"
        />

        <MetricCard
          label="Estimated Revenue Recovered"
          value={formatINR(mockRecoveryMetrics.estimatedRevenueRecovered)}
          change="+₹9,100 growth"
          changeType="positive"
          explanation="Across 59 recovered visits"
          icon={TrendingUp}
          href="/recovery"
          highlight
        />
      </div>

      {/* Hero Recovery Engine Section with Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left: Highlight Revenue Recovery Card */}
        <div className="lg:col-span-1">
          <RevenueCard
            amount={mockRecoveryMetrics.estimatedRevenueRecovered}
            growthPercentage={mockRecoveryMetrics.growthPercentage}
            noShowsCount={mockRecoveryMetrics.noShowsRescheduled}
            lapsedCount={mockRecoveryMetrics.customersRecovered}
            className="h-full"
          />
        </div>

        {/* Right: Recovery Engine Trend Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span>Recovery Revenue Trend (September)</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    64% Rebooking Rate
                  </span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Daily revenue brought back via automated WhatsApp reminders and rebooking nudges
                </p>
              </div>
              <Link
                href="/recovery"
                className="text-xs font-semibold text-primary hover:underline hidden sm:inline-flex items-center gap-1"
              >
                <span>Full Funnel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="h-[220px] w-full">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={mockRecoveryMetrics.revenueTrend}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="recoveredGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#27735f" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#27735f" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `₹${val / 1000}k`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="recoveredRevenue"
                        stroke="#27735f"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#recoveredGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-surface-muted/30 rounded-apple-xl animate-pulse">
                    <span className="text-xs text-muted-foreground">Loading revenue analytics...</span>
                  </div>
                )}
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 pt-3 border-t border-border/60 text-center text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Total Appointments</span>
                  <span className="font-bold text-foreground tabular-nums">166 visits</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Recovered Bookings</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">48 bookings</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Avg Recovered / Day</span>
                  <span className="font-bold text-foreground tabular-nums">₹4,277</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Split: Today's Schedule & Quick Actions / Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Live Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <CardTitle>Today's Schedule ({todayAppointments.length} Bookings)</CardTitle>
              </div>
              <Link
                href="/calendar"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>View Full Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-border/60">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => setSelectedAppointment(apt)}
                  className="p-4 flex items-center justify-between hover:bg-surface-muted/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="text-right w-16 shrink-0">
                      <span className="text-xs font-bold text-foreground tabular-nums block">
                        {formatTimeOnly(apt.startTime)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {apt.durationMinutes}m
                      </span>
                    </div>

                    <CustomerAvatar name={apt.customerName} size="md" />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {apt.customerName}
                        </span>
                        {apt.isRecovered && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300">
                            Recovered
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {apt.serviceName} • {apt.staffName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-foreground tabular-nums block">
                        {formatINR(apt.price)}
                      </span>
                      <span className="text-[10px] text-muted-foreground capitalize">
                        WA: {apt.whatsappStatus}
                      </span>
                    </div>

                    <StatusBadge status={apt.status} type="appointment" size="sm" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Quick Actions & Live Activity Stream */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm">Quick Salon Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1.5">
              <button
                onClick={() => setNewAppointmentOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-apple hover:bg-surface-muted transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Book Appointment</p>
                    <p className="text-[10px] text-muted-foreground">Auto-schedules WhatsApp reminder</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              <Link
                href="/customers"
                className="w-full flex items-center justify-between p-2.5 rounded-apple hover:bg-surface-muted transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Review Lapsed Clients</p>
                    <p className="text-[10px] text-muted-foreground">Send rebooking nudges in 1 click</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>

              <Link
                href="/messages"
                className="w-full flex items-center justify-between p-2.5 rounded-apple hover:bg-surface-muted transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">WhatsApp Conversation Hub</p>
                    <p className="text-[10px] text-muted-foreground">1 client reply needs review</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </Link>

              <button
                onClick={() => setAssistantOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-apple bg-gradient-to-r from-teal-500/10 to-transparent border border-primary/20 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Ask VertOps AI</p>
                    <p className="text-[10px] text-muted-foreground">Query revenue, no-shows & overdue</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-primary" />
              </button>
            </CardContent>
          </Card>

          {/* Live Activity Stream */}
          <Card>
            <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Recovery Activity Feed</CardTitle>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live automation loop" />
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {[
                {
                  text: 'Aisha Patel confirmed appointment via WhatsApp.',
                  time: '9:15 AM today',
                  icon: CheckCircle2,
                  iconColor: 'text-emerald-600',
                },
                {
                  text: 'Riya Shah rescheduled Hydra-Glow Facial for 12:00 PM.',
                  time: 'Yesterday, 7:00 PM',
                  icon: TrendingUp,
                  iconColor: 'text-amber-600',
                },
                {
                  text: 'Neha Mehta returned after 52 days (₹6,500 Keratin).',
                  time: '6 Sep, 12:05 PM',
                  icon: Sparkles,
                  iconColor: 'text-emerald-600',
                },
                {
                  text: 'WhatsApp reminder delivered to Sunita Gupta.',
                  time: 'Yesterday, 6:00 PM',
                  icon: Send,
                  iconColor: 'text-sky-600',
                },
              ].map((act, i) => {
                const Icon = act.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <Icon className={cn('w-4 h-4 shrink-0 mt-0.5', act.iconColor)} />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground leading-snug font-medium">{act.text}</p>
                      <span className="text-[10px] text-muted-foreground">{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
