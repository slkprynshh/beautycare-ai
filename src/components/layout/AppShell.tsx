'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { BottomNavigation } from './BottomNavigation';
import { CommandMenu } from './CommandMenu';
import { NotificationDrawer } from './NotificationDrawer';
import { NewAppointmentModal } from '@/components/modals/NewAppointmentModal';
import { AppointmentDetailDrawer } from '@/components/drawers/AppointmentDetailDrawer';
import { RecoveryDetailDrawer } from '@/components/drawers/RecoveryDetailDrawer';
import { AssistantSheet } from '@/components/assistant/AssistantSheet';
import { useStore } from '@/store/useStore';
import { Search, Bell, Plus, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  hideShell?: boolean;
}

export function AppShell({ children, pageTitle, hideShell = false }: AppShellProps) {
  const {
    setCommandMenuOpen,
    setNotificationDrawerOpen,
    setNewAppointmentOpen,
    setAssistantOpen,
    notifications,
  } = useStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Mobile Top Header */}
        <MobileHeader title={pageTitle} />

        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex h-16 border-b border-border bg-surface/80 glass-surface px-6 items-center justify-between sticky top-0 z-20">
          {/* Left: Quick Search Button & Breadcrumb hint */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCommandMenuOpen(true)}
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-apple bg-surface-muted border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all shadow-subtle min-w-[260px] text-left"
            >
              <Search className="w-3.5 h-3.5 text-primary" />
              <span className="flex-1">Search customers, bookings...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Actions, Notifications, New Appointment */}
          <div className="flex items-center gap-3">
            {/* VertOps AI Assistant Quick Trigger */}
            <button
              onClick={() => setAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-apple bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors border border-primary/20"
            >
              <Bot className="w-4 h-4" />
              <span>Assistant</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => setNotificationDrawerOpen(true)}
              aria-label="View notifications"
              className="p-2 rounded-apple text-muted-foreground hover:text-foreground hover:bg-surface-muted relative transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-transparent hover:border-border"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-surface" />
              )}
            </button>

            {/* Primary New Appointment Action */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setNewAppointmentOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-sm font-semibold"
            >
              New Appointment
            </Button>
          </div>
        </header>

        {/* Page Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Persistent Bottom Bar */}
      <BottomNavigation />

      {/* Global Overlays & Drawers */}
      <CommandMenu />
      <NotificationDrawer />
      <NewAppointmentModal />
      <AppointmentDetailDrawer />
      <RecoveryDetailDrawer />
      <AssistantSheet />
    </div>
  );
}
