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
  Crown,
} from 'lucide-react';
import { useStore } from '@/store/useStore';

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme, salonProfile, setAssistantOpen } = useStore();

  const navItems = [
    {
      label: 'Customer Landing Page',
      href: '/',
      icon: Crown,
      badge: 'Public',
      badgeClass: 'bg-gold-surface text-gold border border-gold-border font-label font-bold text-[9px] tracking-wider uppercase px-2 py-0.5',
    },
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', href: '/calendar', icon: Calendar },
    { label: 'Customers', href: '/customers', icon: Users },
    {
      label: 'Recovery',
      href: '/recovery',
      icon: TrendingUp,
      badge: '₹38.5k',
      badgeClass: 'bg-gold-surface text-gold-hover border border-gold-border/60 font-semibold font-sans text-[10px] px-2 py-0.5',
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      badge: '1 VIP',
      badgeClass: 'bg-surface-muted text-foreground border border-border font-medium text-[10px] px-1.5 py-0.5',
    },
    { label: 'Services', href: '/services', icon: Scissors },
    { label: 'Team', href: '/team', icon: UserCheck },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r border-border bg-surface transition-all duration-300 z-30 shrink-0 select-none relative',
        collapsed ? 'w-[76px]' : 'w-72'
      )}
    >
      {/* Brand Header & Workspace Switcher with Haute Typography */}
      <div className="h-20 px-5 flex items-center justify-between border-b border-border/70">
        {!collapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-surface border border-gold-border text-gold font-serif font-bold text-base shadow-sm shrink-0">
              MF
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-medium text-base text-foreground tracking-tight">Maison Fleurie</span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-label tracking-widest truncate">
                Paris • Haute Beauté SaaS
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-surface border border-gold-border text-gold font-serif font-bold text-base shadow-sm">
            MF
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-colors border border-transparent hover:border-border',
            collapsed && 'absolute -right-3 top-6 bg-surface border border-border shadow-subtle z-50 rounded-full w-6 h-6 flex items-center justify-center'
          )}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-gold" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items with Spacious Layout */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 relative min-h-[46px]',
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface-muted/70'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0 transition-colors', isActive ? 'text-primary-foreground' : 'text-gold')} />
              {!collapsed && (
                <span className="flex-1 truncate text-left tracking-wide font-sans">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className={cn('rounded-full tabular-nums shrink-0 ml-1', item.badgeClass)}>
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Assistant & Theme Footer */}
      <div className="p-4 border-t border-border/70 space-y-3 bg-surface-muted/30">
        {/* Assistant launcher */}
        <button
          onClick={() => setAssistantOpen(true)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold bg-gold-surface text-gold-hover border border-gold-border hover:border-gold hover:shadow-subtle transition-all min-h-[44px]',
            collapsed ? 'justify-center px-0' : 'justify-start'
          )}
        >
          <Bot className="w-4 h-4 text-gold shrink-0" />
          {!collapsed && <span className="font-label uppercase tracking-wider text-[11px]">Ask VertOps AI</span>}
        </button>

        {/* User profile & Theme toggle */}
        <div className={cn('flex items-center justify-between pt-1', collapsed && 'flex-col gap-2')}>
          {!collapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-serif font-bold shrink-0">
                PS
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{salonProfile.ownerName}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-label tracking-wider truncate">Directeur</p>
              </div>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-serif font-bold shrink-0" title={salonProfile.ownerName}>
              PS
            </div>
          )}

          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center border border-border/60"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-charcoal" /> : <Sun className="w-4 h-4 text-gold" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
