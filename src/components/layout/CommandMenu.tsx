'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import {
  Search,
  Calendar,
  Users,
  TrendingUp,
  MessageSquare,
  Scissors,
  UserCheck,
  Settings,
  Plus,
  Bot,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomerAvatar } from '@/components/ui/CustomerAvatar';
import { formatINR } from '@/lib/utils';

export function CommandMenu() {
  const router = useRouter();
  const {
    isCommandMenuOpen,
    setCommandMenuOpen,
    setNewAppointmentOpen,
    setAssistantOpen,
    customers,
    appointments,
    services,
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandMenuOpen(!isCommandMenuOpen);
      }
      if (e.key === 'Escape' && isCommandMenuOpen) {
        setCommandMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandMenuOpen, setCommandMenuOpen]);

  useEffect(() => {
    if (isCommandMenuOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandMenuOpen]);

  if (!isCommandMenuOpen) return null;

  const filteredCustomers = query.trim()
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.phone.includes(query) ||
          c.preferredService.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredServices = query.trim()
    ? services.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const navigate = (path: string) => {
    setCommandMenuOpen(false);
    router.push(path);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCommandMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Command Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.15 }}
          className="relative z-10 w-full max-w-xl rounded-apple-2xl border border-border bg-surface shadow-floating overflow-hidden"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground mr-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search customers, appointments, services, or commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={() => setCommandMenuOpen(false)}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3">
            {/* Direct AI Assistant Prompt */}
            <button
              onClick={() => {
                setCommandMenuOpen(false);
                setAssistantOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-apple bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-primary/20 text-left hover:bg-primary/15 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">Ask VertOps Assistant</p>
                  <p className="text-[11px] text-muted-foreground">
                    {query ? `Ask about "${query}"` : 'E.g. "Who is overdue for a haircut this week?"'}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary" />
            </button>

            {/* Quick Actions */}
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                Quick Actions
              </p>
              <button
                onClick={() => {
                  setCommandMenuOpen(false);
                  setNewAppointmentOpen(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-apple text-xs sm:text-sm text-foreground hover:bg-surface-muted transition-colors text-left"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span>Book New Appointment</span>
              </button>
              <button
                onClick={() => navigate('/recovery')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-apple text-xs sm:text-sm text-foreground hover:bg-surface-muted transition-colors text-left"
              >
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span>View Revenue Recovery Engine</span>
              </button>
            </div>

            {/* Matching Customers */}
            {filteredCustomers.length > 0 && (
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                  Customers ({filteredCustomers.length})
                </p>
                {filteredCustomers.slice(0, 5).map((cust) => (
                  <button
                    key={cust.id}
                    onClick={() => navigate(`/customers/${cust.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-apple hover:bg-surface-muted transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CustomerAvatar name={cust.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{cust.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{cust.phone} • {cust.preferredService}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-foreground tabular-nums shrink-0">
                      {formatINR(cust.totalSpend)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Matching Services */}
            {filteredServices.length > 0 && (
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                  Services ({filteredServices.length})
                </p>
                {filteredServices.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => navigate('/services')}
                    className="w-full flex items-center justify-between p-2.5 rounded-apple hover:bg-surface-muted transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Scissors className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-foreground">{srv.name}</p>
                        <p className="text-[11px] text-muted-foreground">{srv.durationMinutes} mins • Rebooking every {srv.typicalReturnDays} days</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-foreground tabular-nums">
                      {formatINR(srv.price)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Navigation Pages */}
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                Navigation
              </p>
              {[
                { label: 'Overview Dashboard', href: '/dashboard', icon: Calendar },
                { label: 'Staff Booking Calendar', href: '/calendar', icon: Calendar },
                { label: 'Customer Directory', href: '/customers', icon: Users },
                { label: 'WhatsApp Message Center', href: '/messages', icon: MessageSquare },
                { label: 'Service Catalog', href: '/services', icon: Scissors },
                { label: 'Team & Rosters', href: '/team', icon: UserCheck },
                { label: 'Settings & WhatsApp API', href: '/settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-apple text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors text-left"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2 border-t border-border bg-surface-muted/50 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Navigation: Click or Enter</span>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono">ESC</kbd> to close
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
