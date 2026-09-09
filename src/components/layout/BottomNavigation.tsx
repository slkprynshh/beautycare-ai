'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Users,
  TrendingUp,
  MoreHorizontal,
  MessageSquare,
  Scissors,
  UserCheck,
  Settings,
  Bot,
  Plus,
  X,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export function BottomNavigation() {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const { setNewAppointmentOpen, setAssistantOpen } = useStore();

  const mainNav = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', href: '/calendar', icon: Calendar },
    { label: 'Recovery', href: '/recovery', icon: TrendingUp, highlight: true },
    { label: 'Customers', href: '/customers', icon: Users },
  ];

  const moreNav = [
    { label: 'Messages', href: '/messages', icon: MessageSquare, desc: 'WhatsApp reminder & reply inbox' },
    { label: 'Services', href: '/services', icon: Scissors, desc: 'Catalog, pricing & return intervals' },
    { label: 'Team', href: '/team', icon: UserCheck, desc: 'Staff rosters & working hours' },
    { label: 'Settings', href: '/settings', icon: Settings, desc: 'WhatsApp setup & automation rules' },
    { label: 'VertOps AI Assistant', href: '/assistant', icon: Bot, desc: 'Natural language queries & analytics' },
  ];

  return (
    <>
      {/* More Sheet Modal for Mobile */}
      <AnimatePresence>
        {showMoreMenu && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoreMenu(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 rounded-t-apple-2xl border-t border-border bg-surface p-5 pb-8 shadow-floating max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-sm font-semibold text-foreground">More Salon Operations</span>
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3 space-y-1">
                {moreNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMoreMenu(false)}
                      className={cn(
                        'flex items-center gap-3.5 p-3 rounded-apple text-left transition-colors min-h-[48px]',
                        isActive ? 'bg-primary/10 text-primary' : 'hover:bg-surface-muted text-foreground'
                      )}
                    >
                      <div className={cn('p-2 rounded-lg shrink-0', isActive ? 'bg-primary/20 text-primary' : 'bg-surface-muted text-muted-foreground')}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium">{item.label}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Floating Quick Action Button */}
              <div className="mt-4 pt-3 border-t border-border/60">
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setNewAppointmentOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-apple bg-primary text-primary-foreground font-semibold text-xs sm:text-sm shadow-sm min-h-[48px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book New Appointment</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Bar for Mobile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-border bg-surface/95 glass-surface px-2 flex items-center justify-around select-none"
        aria-label="Mobile Navigation"
      >
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-colors min-h-[44px] min-w-[44px] relative',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive && 'stroke-[2.5px]')} />
              <span className={cn('text-[10px] font-medium tracking-tight', isActive && 'font-bold')}>
                {item.label}
              </span>
              {item.highlight && (
                <span className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </Link>
          );
        })}

        {/* More Tab */}
        <button
          onClick={() => setShowMoreMenu(true)}
          className={cn(
            'flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-colors min-h-[44px] min-w-[44px]',
            showMoreMenu ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <MoreHorizontal className="h-5 w-5 shrink-0" />
          <span className="text-[10px] font-medium tracking-tight">More</span>
        </button>
      </nav>
    </>
  );
}
