import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface DashStat {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  positive?: boolean;
  icon: LucideIcon;
  color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet';
  description?: string;
}

const colorStyles = {
  indigo: {
    icon: 'bg-indigo-50 text-indigo-600',
    ring: 'ring-indigo-100',
    bar: 'bg-indigo-500',
    glow: 'shadow-indigo-100',
    text: 'text-indigo-600',
  },
  emerald: {
    icon: 'bg-emerald-50 text-emerald-600',
    ring: 'ring-emerald-100',
    bar: 'bg-emerald-500',
    glow: 'shadow-emerald-100',
    text: 'text-emerald-600',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600',
    ring: 'ring-amber-100',
    bar: 'bg-amber-400',
    glow: 'shadow-amber-100',
    text: 'text-amber-600',
  },
  rose: {
    icon: 'bg-rose-50 text-rose-600',
    ring: 'ring-rose-100',
    bar: 'bg-rose-500',
    glow: 'shadow-rose-100',
    text: 'text-rose-600',
  },
  violet: {
    icon: 'bg-violet-50 text-violet-600',
    ring: 'ring-violet-100',
    bar: 'bg-violet-500',
    glow: 'shadow-violet-100',
    text: 'text-violet-600',
  },
};

export default function StatsCard({ stat, className }: { stat: DashStat; className?: string }) {
  const Icon = stat.icon;
  const c = colorStyles[stat.color];
  const hasTrend = stat.change !== undefined;
  const TrendIcon = stat.positive ? TrendingUp : TrendingDown;
  const trendColor = stat.positive ? 'text-emerald-600' : 'text-rose-600';
  const trendBg = stat.positive ? 'bg-emerald-50' : 'bg-rose-50';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default',
        c.glow,
        className,
      )}
    >
      {/* Colored top accent bar */}
      <div className={cn('h-1 w-full rounded-t-2xl', c.bar)} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{stat.label}</p>
            <p className={cn('mt-2 text-3xl font-extrabold tracking-tight', c.text)}>{stat.value}</p>

            {hasTrend ? (
              <div className="mt-2.5 flex items-center gap-2">
                <span className={cn('inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-semibold', trendBg, trendColor)}>
                  <TrendIcon className="h-3 w-3" />
                  {stat.change}%
                </span>
                {stat.description && <span className="text-xs text-slate-400">{stat.description}</span>}
              </div>
            ) : (
              stat.description && (
                <p className="mt-1.5 text-xs text-slate-400">{stat.description}</p>
              )
            )}
          </div>

          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1', c.icon, c.ring)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
