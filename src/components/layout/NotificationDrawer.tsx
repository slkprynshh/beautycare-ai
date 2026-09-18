'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import {
  Bell,
  X,
  TrendingUp,
  MessageSquare,
  Calendar,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatIndianDate } from '@/lib/utils';

export function NotificationDrawer() {
  const router = useRouter();
  const {
    isNotificationDrawerOpen,
    setNotificationDrawerOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useStore();

  if (!isNotificationDrawerOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'recovery':
        return <TrendingUp className="w-4 h-4 text-amber-500" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-sky-500" />;
      case 'billing':
        return <CreditCard className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleAction = (notif: (typeof notifications)[0]) => {
    markNotificationRead(notif.id);
    setNotificationDrawerOpen(false);
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setNotificationDrawerOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative z-10 w-full max-w-md h-full bg-surface border-l border-border shadow-floating flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Notifications</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                {notifications.filter((n) => !n.read).length} new
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-muted-foreground hover:text-foreground font-medium p-1 transition-colors"
                title="Mark all as read"
              >
                Mark all read
              </button>
              <button
                onClick={() => setNotificationDrawerOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    'p-3.5 rounded-apple-lg border transition-colors relative',
                    notif.read
                      ? 'bg-surface border-border/70 opacity-80'
                      : 'bg-surface-elevated border-primary/20 shadow-subtle'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-surface-muted shrink-0 mt-0.5">
                      {getIcon(notif.iconType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {notif.description}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">
                          {formatIndianDate(notif.timestamp)}
                        </span>
                        {notif.actionLabel && (
                          <button
                            onClick={() => handleAction(notif)}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            {notif.actionLabel} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
