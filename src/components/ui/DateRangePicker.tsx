import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

interface DateRangePickerProps {
  value: 'this_week' | 'this_month' | 'last_month' | 'custom';
  onChange: (value: 'this_week' | 'this_month' | 'last_month' | 'custom') => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const options = [
    { id: 'this_week', label: 'This Week' },
    { id: 'this_month', label: 'This Month (Sep 2026)' },
    { id: 'last_month', label: 'Last Month (Aug 2026)' },
    { id: 'custom', label: 'Custom Range' },
  ];

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <div className="flex items-center gap-2 rounded-apple border border-border/80 bg-surface px-3 py-1.5 shadow-subtle min-h-[40px]">
        <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as any)}
          aria-label="Filter date range"
          className="bg-transparent text-xs sm:text-sm font-medium text-foreground focus:outline-none cursor-pointer pr-4 appearance-none"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id} className="bg-surface text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground pointer-events-none -ml-4" />
      </div>
    </div>
  );
}
