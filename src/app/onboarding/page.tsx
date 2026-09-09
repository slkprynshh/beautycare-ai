'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import {
  CheckCircle2,
  Building2,
  Scissors,
  Users,
  UploadCloud,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatINR } from '@/lib/utils';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Salon Details
  const [salonName, setSalonName] = useState('Luxe Aura Salon & Spa');
  const [city, setCity] = useState('Mumbai (Bandra West)');
  const [ownerName, setOwnerName] = useState('Priyanshu Sharma');
  const [category, setCategory] = useState('Hair, Beauty & Wellness Spa');
  const [language, setLanguage] = useState('en');

  // Step 2: Services
  const [services, setServices] = useState([
    { name: 'Signature Haircut & Style', duration: '45', price: '850', interval: '30' },
    { name: 'Balayage & Hair Colour', duration: '150', price: '4200', interval: '45' },
    { name: 'Hydra-Glow Radiance Facial', duration: '60', price: '2400', interval: '30' },
  ]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');

  // Step 3: Team
  const [team, setTeam] = useState([
    { name: 'Priya Nair', role: 'Master Stylist' },
    { name: 'Meera Sen', role: 'Lead Esthetician' },
    { name: 'Rohan Deshmukh', role: 'Senior Colorist' },
  ]);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');

  // Step 4: Customers
  const [csvUploaded, setCsvUploaded] = useState(false);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleAddService = () => {
    if (!newServiceName) return;
    setServices((prev) => [
      ...prev,
      { name: newServiceName, duration: '45', price: newServicePrice || '999', interval: '30' },
    ]);
    setNewServiceName('');
    setNewServicePrice('');
  };

  const handleAddStaff = () => {
    if (!newStaffName) return;
    setTeam((prev) => [...prev, { name: newStaffName, role: newStaffRole || 'Stylist' }]);
    setNewStaffName('');
    setNewStaffRole('');
  };

  const steps = [
    { num: 1, label: 'Salon Details', icon: Building2 },
    { num: 2, label: 'Services & Intervals', icon: Scissors },
    { num: 3, label: 'Team', icon: Users },
    { num: 4, label: 'Customers', icon: UploadCloud },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 lg:p-10">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-apple bg-primary text-primary-foreground font-bold text-sm shadow-sm">
            V
          </div>
          <span className="font-bold text-sm text-foreground tracking-tight">VertOps Setup</span>
        </div>

        {currentStep < 5 && (
          <button
            onClick={() => setCurrentStep(5)}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip to finish →
          </button>
        )}
      </div>

      {/* Main Form Container */}
      <div className="max-w-2xl w-full mx-auto my-6">
        {/* Progress Bar */}
        {currentStep < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {steps.map((s) => {
                const Icon = s.icon;
                const isCompleted = currentStep > s.num;
                const isCurrent = currentStep === s.num;
                return (
                  <div key={s.num} className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-surface-muted text-muted-foreground border border-border'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                    </div>
                    <span className="hidden sm:inline text-xs font-medium text-foreground">
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className="rounded-apple-2xl border border-border bg-surface p-6 sm:p-8 shadow-floating"
        >
          {/* STEP 1: Salon Details */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  Tell us about your salon or spa
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  We customize the automated WhatsApp reminders and messaging tone to your brand.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Salon / Spa Business Name"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  placeholder="E.g. Luxe Aura Hair Studio"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="City / Location"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="E.g. Bandra West, Mumbai"
                    required
                  />
                  <Input
                    label="Owner / Manager Name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="E.g. Priyanshu Sharma"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Business Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Hair, Beauty & Wellness Spa">Hair, Beauty & Wellness Spa</option>
                    <option value="Premium Hair Salon">Premium Hair Salon</option>
                    <option value="Nail & Lash Bar">Nail & Lash Bar</option>
                    <option value="Men's Grooming Lounge">Men's Grooming Lounge</option>
                    <option value="Ayurvedic Wellness Spa">Ayurvedic Wellness Spa</option>
                  </Select>

                  <Select
                    label="Default WhatsApp Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English (India)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="mr">Marathi (मराठी)</option>
                  </Select>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" size="lg" onClick={nextStep} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Services
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Services */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  Add your popular services & return cycles
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  VertOps uses the return cycle to automatically know when a customer is due for their next visit.
                </p>
              </div>

              {/* Service list */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-apple border border-border bg-surface-muted/40 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-semibold text-foreground block truncate">{srv.name}</span>
                      <span className="text-muted-foreground">
                        {srv.duration} mins • ₹{srv.price} • Rebooking nudge in {srv.interval} days
                      </span>
                    </div>
                    <button
                      onClick={() => setServices(services.filter((_, i) => i !== idx))}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors ml-2"
                      aria-label="Remove service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add service inline */}
              <div className="p-3.5 rounded-apple-lg border border-dashed border-border bg-surface space-y-3">
                <span className="text-xs font-semibold text-foreground block">+ Add another service</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    placeholder="Service Name (e.g. Keratin)"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                  />
                  <Input
                    placeholder="Price in INR (e.g. 3500)"
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                  />
                  <Button variant="secondary" size="md" onClick={handleAddService}>
                    Add Service
                  </Button>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" size="md" onClick={prevStep} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button variant="primary" size="lg" onClick={nextStep} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Team
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Team */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  Add your stylists and specialists
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Customers love booking with their favorite stylists. VertOps personalizes reminders with staff names.
                </p>
              </div>

              <div className="space-y-2.5">
                {team.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-apple border border-border bg-surface-muted/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
                        {st.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block">{st.name}</span>
                        <span className="text-muted-foreground">{st.role}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setTeam(team.filter((_, i) => i !== idx))}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove staff"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add staff inline */}
              <div className="p-3.5 rounded-apple-lg border border-dashed border-border bg-surface space-y-3">
                <span className="text-xs font-semibold text-foreground block">+ Add staff member</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    placeholder="Staff Full Name"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                  />
                  <Input
                    placeholder="Role (e.g. Master Stylist)"
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                  />
                  <Button variant="secondary" size="md" onClick={handleAddStaff}>
                    Add Staff
                  </Button>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" size="md" onClick={prevStep} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button variant="primary" size="lg" onClick={nextStep} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Customers
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Customers Import */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground tracking-tight">
                  Import your existing customer list
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Upload your Excel / CSV export or let VertOps initialize with 10 sample regular clients.
                </p>
              </div>

              <div
                onClick={() => setCsvUploaded(true)}
                className={`p-8 rounded-apple-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                  csvUploaded
                    ? 'border-emerald-500 bg-emerald-500/5'
                    : 'border-border hover:border-primary/50 bg-surface-muted/30'
                }`}
              >
                <div className="flex justify-center mb-3">
                  {csvUploaded ? (
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                  )}
                </div>

                {csvUploaded ? (
                  <div>
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 block">
                      salon_customers_mumbai.csv loaded
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      148 customer phone numbers mapped. Initial return dates calculated.
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-semibold text-foreground block">
                      Click to upload CSV or Excel sheet
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Columns: Name, WhatsApp Phone, Last Visit Date, Favorite Service
                    </p>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-apple bg-surface-muted/50 border border-border flex items-start gap-2.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Your customer records remain strictly private and encrypted under India's Digital Personal Data Protection (DPDP) Act.
                </span>
              </div>

              <div className="pt-4 flex justify-between">
                <Button variant="ghost" size="md" onClick={prevStep} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button variant="primary" size="lg" onClick={nextStep} rightIcon={<Sparkles className="w-4 h-4" />}>
                  Finalize Recovery Setup
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: Finish Screen */}
          {currentStep === 5 && (
            <div className="text-center space-y-6 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto shadow-subtle">
                <Sparkles className="w-8 h-8 text-emerald-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  Your recovery system is ready.
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  VertOps is now configured for <span className="font-semibold text-foreground">{salonName}</span>.
                </p>
              </div>

              {/* First Automated Loop Preview */}
              <div className="p-5 rounded-apple-xl border border-primary/20 bg-primary/5 text-left space-y-3 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>First Recovery Workflow Configured</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-apple bg-surface border border-border">
                    <span className="font-semibold block text-foreground">1. 24-Hour WhatsApp Reminder</span>
                    <span className="text-muted-foreground text-[11px]">
                      Dispatched at 9:00 AM day before visit with 1-click confirm/reschedule buttons.
                    </span>
                  </div>
                  <div className="p-2.5 rounded-apple bg-surface border border-border">
                    <span className="font-semibold block text-foreground">2. 30-Day "You're Due" Nudge</span>
                    <span className="text-muted-foreground text-[11px]">
                      Triggered automatically when a regular client reaches their return threshold.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/dashboard')}
                  className="w-full max-w-md mx-auto font-semibold"
                >
                  Open My Dashboard →
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground">
        VertOps India • Built for modern salons & spas
      </div>
    </div>
  );
}
