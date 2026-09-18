'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Sparkles, Mail, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('9820154321');
  const [email, setEmail] = useState('priyanshu@luxeaura.in');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState(['5', '4', '3', '2']);
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 lg:p-10 selection:bg-primary/20">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-apple bg-primary text-primary-foreground font-bold text-base shadow-sm">
            V
          </div>
          <div>
            <span className="font-bold text-base text-foreground tracking-tight">VertOps</span>
            <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              India
            </span>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-surface border border-border rounded-apple px-2.5 py-1 shadow-subtle">
          <Globe className="w-3.5 h-3.5 text-primary" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer text-xs"
            aria-label="Language selection"
          >
            <option value="en">English (India)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
          </select>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-apple-2xl border border-border bg-surface p-6 sm:p-8 shadow-floating"
        >
          {/* Header Copy */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Revenue Recovery for Salons</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Recover the customers you might otherwise lose.
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Automate WhatsApp appointment reminders, no-show recovery, and rebooking nudges in seconds.
            </p>
          </div>

          {step === 'input' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="flex rounded-apple bg-surface-muted p-1 border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
                    authMethod === 'phone' ? 'bg-surface text-foreground shadow-subtle' : 'text-muted-foreground'
                  }`}
                >
                  WhatsApp Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
                    authMethod === 'email' ? 'bg-surface text-foreground shadow-subtle' : 'text-muted-foreground'
                  }`}
                >
                  Email Address
                </button>
              </div>

              {authMethod === 'phone' ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Salon Owner WhatsApp Number
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-2.5 rounded-apple bg-surface-muted border border-border text-xs font-semibold text-foreground select-none">
                      +91 (India)
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98201 54321"
                      maxLength={10}
                      className="flex-1 min-h-[44px] rounded-apple border border-border bg-surface px-3.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    We will send a 4-digit verification code to your WhatsApp.
                  </p>
                </div>
              ) : (
                <Input
                  label="Salon Owner Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@your-salon.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />
              )}

              <Button
                variant="primary"
                size="lg"
                type="submit"
                isLoading={isLoading}
                className="w-full font-semibold"
              >
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-foreground">Enter 4-Digit Code</p>
                <p className="text-xs text-muted-foreground">
                  Sent to {authMethod === 'phone' ? `+91 ${phoneNumber}` : email}
                </p>
              </div>

              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-12 h-12 text-center text-lg font-bold rounded-apple border border-border bg-surface focus:border-primary focus:outline-none text-foreground shadow-subtle tabular-nums"
                  />
                ))}
              </div>

              <div className="space-y-2.5">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  isLoading={isLoading}
                  className="w-full font-semibold"
                >
                  Verify & Open Dashboard
                </Button>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="w-full text-xs text-muted-foreground hover:text-foreground font-medium py-1"
                >
                  Change phone number or email
                </button>
              </div>
            </form>
          )}

          {/* Quick Demo Access Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/80" />
            </div>
            <span className="relative bg-surface px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Explore Product Instantly
            </span>
          </div>

          <div className="space-y-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleDemoLogin}
              isLoading={isLoading}
              className="w-full border-primary/30 text-primary hover:bg-primary/5"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Enter Luxe Aura Demo Salon
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/onboarding')}
              className="w-full text-xs text-muted-foreground"
            >
              Start 4-step onboarding setup wizard →
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-muted-foreground max-w-md mx-auto space-y-2">
        <p className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>India DPDP Act Compliant & Official WhatsApp Business API Native</span>
        </p>
        <p className="text-[11px]">
          © {new Date().getFullYear()} VertOps India Technologies. All rights reserved.
        </p>
      </div>
    </div>
  );
}
