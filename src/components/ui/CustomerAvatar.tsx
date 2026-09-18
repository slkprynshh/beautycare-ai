import React from 'react';
import { cn, getInitials, getAvatarColor } from '@/lib/utils';

interface CustomerAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showIndicator?: boolean;
  indicatorStatus?: 'online' | 'due' | 'lapsed';
}

export function CustomerAvatar({
  name,
  avatarUrl,
  size = 'md',
  className,
  showIndicator = false,
  indicatorStatus = 'online',
}: CustomerAvatarProps) {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm font-medium',
    lg: 'w-12 h-12 text-base font-semibold',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const indicatorSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-3.5 h-3.5',
  };

  const indicatorColors = {
    online: 'bg-emerald-500 ring-surface',
    due: 'bg-amber-500 ring-surface',
    lapsed: 'bg-rose-500 ring-surface',
  };

  return (
    <div className={cn('relative inline-flex shrink-0 select-none items-center justify-center', className)}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={cn('rounded-full object-cover border shadow-subtle', sizeClasses[size])}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center border font-sans tracking-wider shadow-subtle',
            sizeClasses[size],
            colorClass
          )}
        >
          {initials}
        </div>
      )}
      {showIndicator && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2',
            indicatorSizeClasses[size],
            indicatorColors[indicatorStatus]
          )}
        />
      )}
    </div>
  );
}
