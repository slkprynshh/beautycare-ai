'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/Toast';
import { formatINR, cn } from '@/lib/utils';
import {
  Building2,
  MessageSquare,
  Clock,
  Sparkles,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Send,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const { salonProfile } = useStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'whatsapp' | 'reminders' | 'rebooking' | 'billing' | 'privacy'
  >('profile');

  // Profile Form state
  const [name, setName] = useState(salonProfile.name);
  const [ownerName, setOwnerName] = useState(salonProfile.ownerName);
  const [city, setCity] = useState(salonProfile.city);
  const [address, setAddress] = useState(salonProfile.address);
  const [phone, setPhone] = useState(salonProfile.phone);

  // WhatsApp Form state
  const [provider, setProvider] = useState<'Gupshup' | 'Interakt' | 'Twilio'>(salonProfile.whatsappProvider);
  const [waNumber, setWaNumber] = useState(salonProfile.whatsappPhoneNumber);
  const [testNumber, setTestNumber] = useState('+91 98201 12345');

  // Automation Form state
  const [reminderAdvance, setReminderAdvance] = useState(String(salonProfile.reminderAdvanceHours));
  const [noShowDelay, setNoShowDelay] = useState(String(salonProfile.noShowFollowupMinutes));
  const [maxAttempts, setMaxAttempts] = useState(String(salonProfile.maxFollowupAttempts));
  const [quietStart, setQuietStart] = useState(salonProfile.quietHoursStart);
  const [quietEnd, setQuietEnd] = useState(salonProfile.quietHoursEnd);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Salon Profile Saved',
      description: 'Business information updated successfully.',
      type: 'success',
    });
  };

  const handleTestWhatsApp = () => {
    toast({
      title: 'Test WhatsApp Dispatched',
      description: `Sample reminder delivered to ${testNumber} via ${provider} API.`,
      type: 'success',
    });
  };

  const handleSaveAutomation = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Automation Rules Updated',
      description: `Reminders set to ${reminderAdvance}h in advance, no-show follow-up at ${noShowDelay} mins.`,
      type: 'success',
    });
  };

  return (
    <AppShell pageTitle="Settings">
      <PageHeader
        title="Salon Settings & Automations"
        subtitle="Manage WhatsApp API connections, reminder timings, quiet hours, and billing."
      />

      {/* Settings Navigation Tabs */}
      <div className="mb-6">
        <Tabs
          options={[
            { id: 'profile', label: 'Salon Profile', icon: <Building2 className="w-4 h-4" /> },
            { id: 'whatsapp', label: 'WhatsApp Setup', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'reminders', label: 'Reminder Rules', icon: <Clock className="w-4 h-4" /> },
            { id: 'rebooking', label: 'Rebooking Engine', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'billing', label: 'Plans & Pricing', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'privacy', label: 'Data & Privacy', icon: <ShieldCheck className="w-4 h-4" /> },
          ]}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as any)}
        />
      </div>

      <div className="max-w-4xl space-y-6">
        {/* TAB 1: Salon Profile */}
        {activeTab === 'profile' && (
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <CardTitle>Salon & Owner Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Salon Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Owner / Manager Name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Primary Salon Contact Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="City & Landmark"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>

                <Textarea
                  label="Full Salon Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                />

                <div className="pt-3 border-t border-border flex justify-end">
                  <Button variant="primary" size="md" type="submit">
                    Save Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* TAB 2: WhatsApp Setup */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle>WhatsApp Business API Provider</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Official Meta Business Solution Partner (BSP) configuration
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  API Active & Verified
                </span>
              </CardHeader>

              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="WhatsApp Messaging Provider"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as any)}
                  >
                    <option value="Gupshup">Gupshup Enterprise (Recommended for India)</option>
                    <option value="Interakt">Interakt / Jio Haptik</option>
                    <option value="Twilio">Twilio WhatsApp Business</option>
                  </Select>

                  <Input
                    label="Connected Business Phone Number"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    helperText="Official green-badge verified number"
                  />
                </div>

                <div className="p-4 rounded-apple-xl bg-surface-muted/60 border border-border space-y-2">
                  <span className="text-xs font-semibold text-foreground block">
                    Webhook Health Status
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Status</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">100% Operational</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Latency</span>
                      <span className="font-bold text-foreground tabular-nums">142 ms</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Delivery Rate</span>
                      <span className="font-bold text-foreground tabular-nums">99.4%</span>
                    </div>
                  </div>
                </div>

                {/* Test Message Box */}
                <div className="p-4 rounded-apple-xl border border-primary/20 bg-primary/5 space-y-3">
                  <span className="text-xs font-bold text-primary block">
                    Test Live WhatsApp Dispatch
                  </span>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="text"
                      value={testNumber}
                      onChange={(e) => setTestNumber(e.target.value)}
                      placeholder="+91 98201 XXXXX"
                      className="flex-1 w-full px-3.5 py-2 text-xs rounded-apple border border-border bg-surface text-foreground focus:outline-none focus:border-primary min-h-[44px]"
                    />
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleTestWhatsApp}
                      leftIcon={<Send className="w-4 h-4" />}
                      className="w-full sm:w-auto"
                    >
                      Send Test Reminder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: Reminder Rules */}
        {activeTab === 'reminders' && (
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <CardTitle>Deterministic Reminder Timing</CardTitle>
              <p className="text-xs text-muted-foreground">
                Set exact trigger rules for appointment confirmations and missed-slot follow-ups.
              </p>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSaveAutomation} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Pre-Appointment Reminder Window"
                    type="number"
                    value={reminderAdvance}
                    onChange={(e) => setReminderAdvance(e.target.value)}
                    helperText="Hours before booking (e.g. 24 hours)"
                    required
                  />

                  <Input
                    label="No-Show Follow-Up Delay"
                    type="number"
                    value={noShowDelay}
                    onChange={(e) => setNoShowDelay(e.target.value)}
                    helperText="Minutes after missed appointment to send reschedule link"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Quiet Hours Start"
                    type="time"
                    value={quietStart}
                    onChange={(e) => setQuietStart(e.target.value)}
                    helperText="No automated messages sent after this time"
                    required
                  />

                  <Input
                    label="Quiet Hours End"
                    type="time"
                    value={quietEnd}
                    onChange={(e) => setQuietEnd(e.target.value)}
                    helperText="Queued messages resume after this time"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end">
                  <Button variant="primary" size="md" type="submit">
                    Save Reminder Rules
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* TAB 4: Rebooking Rules */}
        {activeTab === 'rebooking' && (
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <CardTitle>Lapsed Customer Rebooking Engine</CardTitle>
              <p className="text-xs text-muted-foreground">
                Automated re-engagement rules that prevent customers from forgetting to return.
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="p-4 rounded-apple-xl bg-surface-muted/60 border border-border space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-foreground block">Max Follow-Up Messages per Lapsed Customer</span>
                    <span className="text-muted-foreground text-[11px]">Send at most 1 reminder, then stop if no response.</span>
                  </div>
                  <span className="font-bold text-foreground tabular-nums px-2.5 py-1 rounded bg-surface border border-border">
                    1 message limit
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <div>
                    <span className="font-semibold text-foreground block">Exclude Customers with Upcoming Appointments</span>
                    <span className="text-muted-foreground text-[11px]">Never nudge someone who already has a slot booked.</span>
                  </div>
                  <span className="text-emerald-600 font-bold">Enabled</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <Button variant="primary" size="md" onClick={() => toast({ title: 'Rebooking Rules Saved', type: 'success' })}>
                  Save Rebooking Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 5: Plans & Pricing */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-foreground">Transparent Salon Pricing</h3>
              <p className="text-xs text-muted-foreground">
                Easily justified by the ₹38,500 monthly recovered revenue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Starter */}
              <Card className="p-5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Starter</span>
                  <div className="mt-2 text-2xl font-extrabold text-foreground tabular-nums">
                    ₹999 <span className="text-xs font-normal text-muted-foreground">/ month</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>1 Staff Calendar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Reminders</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Customer History</span>
                    </li>
                  </ul>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Current Plan
                </Button>
              </Card>

              {/* Growth */}
              <Card className="p-5 flex flex-col justify-between space-y-4 border-primary/40 bg-gradient-to-br from-teal-500/5 via-surface to-surface shadow-elevated relative">
                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  Recommended
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Growth</span>
                  <div className="mt-2 text-2xl font-extrabold text-foreground tabular-nums">
                    ₹1,999 <span className="text-xs font-normal text-muted-foreground">/ month</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Up to 5 Staff Calendars</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Automated Rebooking Nudges</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>No-Show Recovery Engine</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Revenue Dashboard</span>
                    </li>
                  </ul>
                </div>
                <Button variant="primary" size="sm" className="w-full">
                  Upgrade to Growth
                </Button>
              </Card>

              {/* Studio */}
              <Card className="p-5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Studio / Pro</span>
                  <div className="mt-2 text-2xl font-extrabold text-foreground tabular-nums">
                    ₹2,999 <span className="text-xs font-normal text-muted-foreground">/ month</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Unlimited Staff & Locations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Priority WhatsApp Route</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Dedicated Account Manager</span>
                    </li>
                  </ul>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 6: Data & Privacy */}
        {activeTab === 'privacy' && (
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <CardTitle>Data Security & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-apple-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground block">
                    India DPDP Act (2023) Compliant
                  </span>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">
                    Customer data is encrypted at rest and in transit. Customer consent for WhatsApp notifications is stored with opt-out mechanisms.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-muted-foreground">Export complete salon database as CSV</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast({ title: 'Exporting Database', description: 'Your encrypted zip file will download shortly.', type: 'info' })}
                >
                  Download Full Export
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
