import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  explanation?: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
  className?: string;
  highlight?: boolean;
}

export function MetricCard({
  label,
  value,
  change,
  changeType = 'positive',
  explanation,
  icon: Icon,
  href,
  onClick,
  className,
  highlight = false,
}: MetricCardProps) {
  const content = (
    <div
      className={cn(
        'card group relative overflow-hidden p-5 transition-all duration-200',
        highlight
          ? 'bg-gradient-to-br from-emerald-500/10 via-surface to-surface border-emerald-500/30 dark:from-emerald-950/40'
          : 'hover:border-primary/40',
        (href || onClick) && 'cursor-pointer active:scale-[0.99]',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-muted-foreground tracking-tight">{label}</span>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-apple bg-surface-muted text-muted-foreground group-hover:text-primary transition-colors">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums">
          {value}
        </span>
      </div>

      {(change || explanation) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {change && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium',
                changeType === 'positive' && 'text-emerald-600 dark:text-emerald-400',
                changeType === 'negative' && 'text-rose-600 dark:text-rose-400',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {changeType === 'positive' && <ArrowUpRight className="h-3.5 w-3.5" />}
              {changeType === 'negative' && <ArrowDownRight className="h-3.5 w-3.5" />}
              {changeType === 'neutral' && <Minus className="h-3 w-3" />}
              {change}
            </span>
          )}
          {explanation && (
            <span className="text-muted-foreground truncate">{explanation}</span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }

  return content;
}
