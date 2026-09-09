'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CustomerAvatar } from '@/components/ui/CustomerAvatar';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/Toast';
import { formatINR, formatIndianDate, formatIndianPhone, formatSimpleDate, cn } from '@/lib/utils';
import {
  Search,
  Plus,
  UploadCloud,
  Filter,
  MessageSquare,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Phone,
  Clock,
  Send,
  MoreVertical,
} from 'lucide-react';
import { CustomerStatus } from '@/types';

export default function CustomersPage() {
  const router = useRouter();
  const { customers, setNewAppointmentOpen, sendManualNudgeToCustomer } = useStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'spend' | 'visits' | 'overdue'>('recent');

  const tabOptions = [
    { id: 'all', label: 'All Customers', count: customers.length },
    { id: 'due_soon', label: 'Due Soon', count: customers.filter((c) => c.status === 'due_soon').length },
    { id: 'overdue', label: 'Overdue', count: customers.filter((c) => c.status === 'overdue').length },
    { id: 'lapsed', label: 'Lapsed', count: customers.filter((c) => c.status === 'lapsed').length },
    { id: 'active', label: 'Active', count: customers.filter((c) => c.status === 'active').length },
    { id: 'high_value', label: 'High Value (VIP)', count: customers.filter((c) => c.tags.includes('VIP') || c.status === 'high_value').length },
  ];

  const filteredCustomers = customers
    .filter((c) => {
      const matchesTab =
        activeTab === 'all'
          ? true
          : activeTab === 'high_value'
          ? c.tags.includes('VIP') || c.status === 'high_value'
          : c.status === activeTab;

      const matchesSearch =
        !searchQuery.trim() ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.preferredService.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'spend') return b.totalSpend - a.totalSpend;
      if (sortBy === 'visits') return b.totalVisits - a.totalVisits;
      if (sortBy === 'overdue') return new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime();
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
    });

  const handleQuickNudge = (e: React.MouseEvent, custId: string, name: string) => {
    e.stopPropagation();
    sendManualNudgeToCustomer(custId);
    toast({
      title: `WhatsApp Rebooking Nudge Dispatched`,
      description: `Personalized "you're due" message sent to ${name}.`,
      type: 'success',
    });
  };

  return (
    <AppShell pageTitle="Customers">
      <PageHeader
        title="Customer Directory"
        subtitle="Track return intervals, prevent customer churn, and re-engage lapsed clients."
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<UploadCloud className="w-4 h-4 text-primary" />}
              onClick={() => {
                toast({
                  title: 'Import Ready',
                  description: 'Select CSV or Excel file to batch import customer contacts.',
                  type: 'info',
                });
              }}
            >
              Import CSV
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setNewAppointmentOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Customer
            </Button>
          </div>
        }
      />

      {/* Category Tabs */}
      <div className="mb-6">
        <Tabs
          options={tabOptions}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id)}
        />
      </div>

      {/* Search & Sort Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3 rounded-apple-xl bg-surface border border-border shadow-subtle">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, phone (+91), service, or VIP tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-apple border border-border bg-surface text-foreground focus:outline-none focus:border-primary min-h-[40px]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-surface-muted border border-border rounded-apple px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
            aria-label="Sort customers"
          >
            <option value="recent">Recent Visit</option>
            <option value="overdue">Next Due Date</option>
            <option value="spend">Total Spend (INR)</option>
            <option value="visits">Total Visits</option>
          </select>
        </div>
      </div>

      {/* DESKTOP: Clean Apple-styled Table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="p-4 pl-5">Customer</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4">Return Cycle</th>
                <th className="p-4">Preferred Service</th>
                <th className="p-4">Visits & Spend</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    No customers found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => router.push(`/customers/${cust.id}`)}
                    className="hover:bg-surface-muted/40 transition-colors cursor-pointer group"
                  >
                    {/* Customer */}
                    <td className="p-4 pl-5">
                      <div className="flex items-center gap-3">
                        <CustomerAvatar name={cust.name} size="md" />
                        <div>
                          <span className="font-bold text-foreground block text-sm group-hover:text-primary transition-colors">
                            {cust.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {formatIndianPhone(cust.phone)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Last Visit */}
                    <td className="p-4">
                      <span className="font-semibold text-foreground block">
                        {formatSimpleDate(cust.lastVisit)}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Due: {formatSimpleDate(cust.nextDueDate)}
                      </span>
                    </td>

                    {/* Return Cycle */}
                    <td className="p-4">
                      <span className="font-bold text-foreground tabular-nums">
                        {cust.typicalReturnDays} days
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        Auto-nudge active
                      </span>
                    </td>

                    {/* Preferred Service */}
                    <td className="p-4">
                      <span className="font-medium text-foreground block">
                        {cust.preferredService}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Stylist: {cust.preferredStaff}
                      </span>
                    </td>

                    {/* Visits & Spend */}
                    <td className="p-4">
                      <span className="font-bold text-foreground tabular-nums block text-sm">
                        {formatINR(cust.totalSpend)}
                      </span>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {cust.totalVisits} completed visits
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusBadge status={cust.status} type="customer" size="sm" />
                    </td>

                    {/* Action */}
                    <td className="p-4 pr-5 text-right">
                      {cust.status === 'lapsed' || cust.status === 'overdue' ? (
                        <Button
                          variant="subtle"
                          size="sm"
                          onClick={(e) => handleQuickNudge(e, cust.id, cust.name)}
                          leftIcon={<Send className="w-3 h-3 text-primary" />}
                        >
                          Send Nudge
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewAppointmentOpen(true);
                          }}
                        >
                          Book Visit
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {/* MOBILE: Clean Cards List */}
      <div className="md:hidden space-y-3">
        {filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-surface rounded-apple-xl border border-border">
            No customers found.
          </div>
        ) : (
          filteredCustomers.map((cust) => (
            <Card
              key={cust.id}
              onClick={() => router.push(`/customers/${cust.id}`)}
              interactive
              className="p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CustomerAvatar name={cust.name} size="md" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{cust.name}</h3>
                    <p className="text-xs text-muted-foreground">{formatIndianPhone(cust.phone)}</p>
                  </div>
                </div>
                <StatusBadge status={cust.status} type="customer" size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/60">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Last Visit</span>
                  <span className="font-semibold text-foreground">{formatSimpleDate(cust.lastVisit)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Total Spend</span>
                  <span className="font-bold text-foreground tabular-nums">{formatINR(cust.totalSpend)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <span className="text-xs text-muted-foreground truncate">{cust.preferredService}</span>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={(e) => handleQuickNudge(e, cust.id, cust.name)}
                >
                  WhatsApp Nudge
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </AppShell>
  );
}
