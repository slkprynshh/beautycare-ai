import React from 'react';
import { cn, formatINR } from '@/lib/utils';
import { Sparkles, TrendingUp, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RevenueCardProps {
  amount: number;
  comparisonAmount?: number;
  growthPercentage?: number;
  noShowsCount?: number;
  lapsedCount?: number;
  onExploreDetails?: () => void;
  className?: string;
}

export function RevenueCard({
  amount,
  growthPercentage = 30.9,
  noShowsCount = 12,
  lapsedCount = 47,
  onExploreDetails,
  className,
}: RevenueCardProps) {
  return (
    <div
      className={cn(
        'card relative overflow-hidden p-6 transition-all duration-300',
        'bg-gradient-to-br from-amber-500/10 via-surface to-surface border-amber-400/40 dark:from-amber-950/40 dark:border-amber-700/50',
        className
      )}
    >
      {/* Subtle gold decorative glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-amber-400/15 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300 border border-amber-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Revenue Recovery Engine</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-muted-foreground" title="Calculated based on successfully completed rebooked appointments and confirmed visits">
              <span>Estimated Value</span>
              <HelpCircle className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="mt-4">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Estimated Revenue Recovered This Month
            </span>
            <div className="mt-1 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground tabular-nums">
                {formatINR(amount)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="h-3.5 w-3.5" />
                +{growthPercentage}% vs last month
              </span>
            </div>
          </div>

          <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
            Money brought back into your salon through automatic WhatsApp reminders, missed-appointment reschedules, and re-engaging lapsed customers.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground tabular-nums">{lapsedCount}</span> lapsed returned
            </div>
            <span className="text-border">•</span>
            <div>
              <span className="font-semibold text-foreground tabular-nums">{noShowsCount}</span> no-shows saved
            </div>
          </div>

          {onExploreDetails ? (
            <button
              onClick={onExploreDetails}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-hover transition-colors group"
            >
              <span>View full recovery audit</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <Link
              href="/recovery"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-hover transition-colors group"
            >
              <span>View full recovery audit</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
