'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { Button } from '@/components/ui/Button';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CustomerAvatar } from '@/components/ui/CustomerAvatar';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/Toast';
import { formatINR, formatIndianDate } from '@/lib/utils';
import {
  TrendingUp,
  Sparkles,
  Users,
  AlertTriangle,
  Download,
  ArrowRight,
} from 'lucide-react';
import { mockRecoveryMetrics } from '@/lib/mockData';

export default function RecoveryPage() {
  const {
    recoveryEvents,
    activeDateRange,
    setActiveDateRange,
    setSelectedRecoveryEvent,
  } = useStore();

  const { toast } = useToast();
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const filteredEvents = recoveryEvents.filter((ev) => {
    if (sourceFilter === 'all') return true;
    return ev.source === sourceFilter;
  });

  const handleExport = () => {
    toast({
      title: 'Recovery Audit Exported',
      description: 'Downloaded vertops_revenue_recovery_sep2026.csv for your accounting records.',
      type: 'success',
    });
  };

  return (
    <AppShell pageTitle="Revenue Recovery">
      {/* Top Header */}
      <PageHeader
        title="Revenue Recovery Command Center"
        subtitle="See which customers came back because VertOps automatically followed up."
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <DateRangePicker
              value={activeDateRange}
              onChange={setActiveDateRange}
            />
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Download className="w-4 h-4 text-primary" />}
              onClick={handleExport}
            >
              Export Report
            </Button>
          </div>
        }
      />

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Estimated Revenue Recovered"
          value={formatINR(mockRecoveryMetrics.estimatedRevenueRecovered)}
          change="+30.9% growth"
          changeType="positive"
          explanation="Verified appointments & rebooks"
          icon={TrendingUp}
          highlight
        />

        <MetricCard
          label="Lapsed Customers Returned"
          value={mockRecoveryMetrics.customersRecovered}
          change="47 returned"
          changeType="positive"
          explanation="After receiving automated nudge"
          icon={Users}
        />

        <MetricCard
          label="No-Shows Rescheduled"
          value={mockRecoveryMetrics.noShowsRescheduled}
          change="12 of 31 recovered"
          changeType="positive"
          explanation="Via 1-click WhatsApp prompt"
          icon={AlertTriangle}
        />

        <MetricCard
          label="Average Recovery Value"
          value={formatINR(mockRecoveryMetrics.avgRecoveryValue)}
          change="Per client visit"
          changeType="neutral"
          explanation="Based on service ticket size"
          icon={Sparkles}
        />
      </div>

      {/* Interactive Recovery Funnel */}
      <Card className="mb-8 overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Automated Recovery Conversion Funnel</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              How VertOps converts overdue and missed salon visits into paid bookings
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            32.1% Overall Recovery Rate
          </span>
        </CardHeader>

        <CardContent className="p-6">
          {/* Horizontal Desktop Funnel */}
          <div className="hidden md:grid grid-cols-5 gap-3">
            {mockRecoveryMetrics.funnelData.map((stage, idx) => (
              <div
                key={idx}
                className="relative rounded-apple-xl border border-border bg-surface-muted/40 p-4 flex flex-col justify-between space-y-2 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                  <span>Step {idx + 1}</span>
                  <span className="text-primary font-bold">{stage.dropoff}</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-foreground tabular-nums block">
                    {stage.count}
                  </span>
                  <span className="text-xs font-medium text-foreground">{stage.stage}</span>
                </div>
                {idx < 4 && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 hidden lg:flex h-6 w-6 items-center justify-center rounded-full bg-surface border border-border shadow-subtle text-muted-foreground">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Vertical Mobile Funnel */}
          <div className="md:hidden space-y-2.5">
            {mockRecoveryMetrics.funnelData.map((stage, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-apple-xl border border-border bg-surface-muted/40 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Step {idx + 1}: {stage.stage}
                  </span>
                  <span className="text-lg font-bold text-foreground tabular-nums">
                    {stage.count} clients
                  </span>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">
                  {stage.dropoff}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recovery Source Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-apple-xl border border-border bg-surface shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">No-Show Recovery</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">₹7,350</div>
          <p className="text-[11px] text-muted-foreground">
            12 appointments saved within 2 hours of missed slot.
          </p>
        </div>

        <div className="p-4 rounded-apple-xl border border-border bg-surface shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Lapsed Customer Recovery</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">₹24,650</div>
          <p className="text-[11px] text-muted-foreground">
            47 customers re-engaged after 30–60 days of inactivity.
          </p>
        </div>

        <div className="p-4 rounded-apple-xl border border-border bg-surface shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Due-for-Service Nudges</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-foreground tabular-nums">₹6,500</div>
          <p className="text-[11px] text-muted-foreground">
            Regular customers prompted right on their typical cycle.
          </p>
        </div>
      </div>

      {/* Customer Recovery Event Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div>
            <CardTitle>Recovered Customers & Booking Events</CardTitle>
            <p className="text-xs text-muted-foreground">
              Click any record to inspect the exact message, customer response, and revenue attribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-1.5 rounded-apple border border-border bg-surface text-xs font-medium text-foreground focus:outline-none cursor-pointer"
              aria-label="Filter by recovery channel"
            >
              <option value="all">All Channels</option>
              <option value="no_show">No-Show Reschedule</option>
              <option value="lapsed_customer">Lapsed Customers</option>
              <option value="due_nudge">Due-Date Nudges</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="p-4 pl-5">Customer</th>
                <th className="p-4">Recovery Source</th>
                <th className="p-4">Message Date</th>
                <th className="p-4">Service</th>
                <th className="p-4">Estimated Value</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-5 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No recovery events match this filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => (
                  <tr
                    key={ev.id}
                    onClick={() => setSelectedRecoveryEvent(ev)}
                    className="hover:bg-surface-muted/40 transition-colors cursor-pointer group"
                  >
                    <td className="p-4 pl-5">
                      <div className="flex items-center gap-3">
                        <CustomerAvatar name={ev.customerName} size="md" />
                        <div>
                          <span className="font-bold text-foreground block text-sm group-hover:text-primary transition-colors">
                            {ev.customerName}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {ev.customerPhone}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-foreground capitalize block">
                        {ev.source.replace('_', ' ')}
                      </span>
                      {ev.daysLapsed !== undefined && ev.daysLapsed > 0 && (
                        <span className="text-[11px] text-muted-foreground">
                          Lapsed {ev.daysLapsed} days
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {formatIndianDate(ev.messageSentAt)}
                    </td>

                    <td className="p-4 font-medium text-foreground">
                      {ev.serviceName}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-foreground tabular-nums block text-sm">
                        {formatINR(ev.estimatedRevenue)}
                      </span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                        {ev.isActual ? 'Verified Visit' : 'Estimated Value'}
                      </span>
                    </td>

                    <td className="p-4">
                      <StatusBadge status={ev.status} type="recovery" size="sm" />
                    </td>

                    <td className="p-4 pr-5 text-right">
                      <Button
                        variant="subtle"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecoveryEvent(ev);
                        }}
                      >
                        Inspect Audit →
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
