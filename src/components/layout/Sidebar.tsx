'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Sparkles,
  MessageSquare,
  Scissors,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Sun,
  Moon,
  Bot,
  Building2,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme, salonProfile, setAssistantOpen } = useStore();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', href: '/calendar', icon: Calendar },
    { label: 'Customers', href: '/customers', icon: Users },
    {
      label: 'Recovery',
      href: '/recovery',
      icon: TrendingUp,
      badge: '₹38.5k',
      badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold',
    },
    { label: 'Messages', href: '/messages', icon: MessageSquare, badge: '1', badgeClass: 'bg-primary/15 text-primary font-semibold' },
    { label: 'Services', href: '/services', icon: Scissors },
    { label: 'Team', href: '/team', icon: UserCheck },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-border bg-surface transition-all duration-300 z-30 shrink-0 select-none relative',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Brand Header & Workspace Switcher */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-border/70">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-apple bg-primary text-primary-foreground font-bold text-base shadow-sm shrink-0">
              V
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-foreground tracking-tight">VertOps</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary">India</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate font-medium">
                {salonProfile.name}
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-apple bg-primary text-primary-foreground font-bold text-base shadow-sm">
            V
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors',
            collapsed && 'absolute -right-3 top-5 bg-surface border border-border shadow-subtle z-50 rounded-full w-6 h-6 flex items-center justify-center'
          )}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-apple text-xs sm:text-sm font-medium transition-all duration-150 relative min-h-[44px]',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-muted'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
              {!collapsed && (
                <span className="flex-1 truncate text-left">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className={cn('px-2 py-0.5 rounded-full text-[11px] tabular-nums', item.badgeClass)}>
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Assistant & Theme Footer */}
      <div className="p-3 border-t border-border/70 space-y-2">
        {/* Assistant launcher */}
        <button
          onClick={() => setAssistantOpen(true)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-apple text-xs font-semibold bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-primary border border-primary/20 hover:bg-primary/15 transition-all min-h-[44px]',
            collapsed ? 'justify-center px-0' : 'justify-start'
          )}
        >
          <Bot className="w-4 h-4 text-primary shrink-0" />
          {!collapsed && <span>Ask VertOps AI</span>}
        </button>

        {/* User profile & Theme toggle */}
        <div className={cn('flex items-center justify-between pt-1', collapsed && 'flex-col gap-2')}>
          {!collapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                PS
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{salonProfile.ownerName}</p>
                <p className="text-[10px] text-muted-foreground truncate">Salon Owner</p>
              </div>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0" title={salonProfile.ownerName}>
              PS
            </div>
          )}

          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="p-2 rounded-apple text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
