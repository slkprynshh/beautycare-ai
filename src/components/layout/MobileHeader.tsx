'use client';

import React from 'react';
import { Bell, Search, Moon, Sun } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface MobileHeaderProps {
  title?: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const {
    notifications,
    setNotificationDrawerOpen,
    setCommandMenuOpen,
    theme,
    toggleTheme,
    salonProfile,
  } = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="md:hidden sticky top-0 z-40 h-14 border-b border-border bg-surface/90 glass-surface px-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-apple bg-primary text-primary-foreground font-bold text-xs shadow-sm shrink-0">
          V
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-foreground truncate tracking-tight">
            {title || salonProfile.name}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Search / Command Menu */}
        <button
          onClick={() => setCommandMenuOpen(true)}
          aria-label="Search and command menu"
          className="p-2 rounded-apple text-muted-foreground hover:text-foreground hover:bg-surface-muted min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="p-2 rounded-apple text-muted-foreground hover:text-foreground hover:bg-surface-muted min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setNotificationDrawerOpen(true)}
          aria-label="View notifications"
          className="p-2 rounded-apple text-muted-foreground hover:text-foreground hover:bg-surface-muted min-h-[44px] min-w-[44px] flex items-center justify-center relative transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-surface" />
          )}
        </button>
      </div>
    </header>
  );
}
