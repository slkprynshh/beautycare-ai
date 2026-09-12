'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon, Info } from 'lucide-react';
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
        'group relative overflow-hidden rounded-3xl p-6 sm:p-7 transition-all duration-300',
        'bg-surface border border-border shadow-luxury hover:shadow-luxury-hover hover:border-gold-border',
        highlight && 'border-gold/40 bg-gradient-to-br from-gold-surface/60 via-surface to-surface',
        (href || onClick) && 'cursor-pointer active:scale-[0.99]',
        className
      )}
      onClick={onClick}
    >
      {/* Top Row: Label and sleek minimalist icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase font-label tracking-widest text-muted-foreground group-hover:text-foreground transition-colors font-medium">
          {label}
        </span>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted/60 text-muted-foreground group-hover:text-gold group-hover:bg-gold-surface transition-all duration-300">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Center: Expansive Whitespace & Prominent Primary Number */}
      <div className="my-3 sm:my-4">
        <span className="text-3xl sm:text-4xl lg:text-4xl font-serif font-normal tracking-tight text-foreground tabular-nums block">
          {value}
        </span>
      </div>

      {/* Bottom: Minimalist subtle badge with hover explanation */}
      <div className="flex items-center justify-between text-xs pt-1">
        {change ? (
          <span
            className={cn(
              'inline-flex items-center gap-1 font-medium text-[11px] px-2.5 py-0.5 rounded-full transition-colors',
              changeType === 'positive' && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold',
              changeType === 'negative' && 'bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold',
              changeType === 'neutral' && 'bg-surface-muted text-muted-foreground'
            )}
          >
            {changeType === 'positive' && <ArrowUpRight className="h-3 w-3" />}
            {changeType === 'negative' && <ArrowDownRight className="h-3 w-3" />}
            {changeType === 'neutral' && <Minus className="h-2.5 w-2.5" />}
            {change}
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground font-medium">Active</span>
        )}

        {explanation && (
          <span
            title={explanation}
            className="text-[10px] text-muted-foreground/70 group-hover:text-muted-foreground transition-colors flex items-center gap-1 max-w-[140px] truncate"
          >
            <Info className="w-3 h-3 opacity-60 shrink-0" />
            <span className="truncate">{explanation}</span>
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }

  return content;
}
