import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface DashStat {
  id: string;
  label: string;
  value: string | number;
  change?: number;        // % change vs previous period (undefined → no trend shown)
  positive?: boolean;
  icon: LucideIcon;
  color: 'sky' | 'amber' | 'rose' | 'violet';
  description?: string;
  spark?: number[];       // optional mini trend series
}

const colorStyles = {
  sky: {
    card: 'bg-sky-100/60 dark:bg-sky-500/10',
    icon: 'bg-sky-200/70 dark:bg-sky-500/20 text-sky-600 dark:text-sky-300',
    hex: '#0ea5e9',
  },
  violet: {
    card: 'bg-violet-100/60 dark:bg-violet-500/10',
    icon: 'bg-violet-200/70 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300',
    hex: '#8b5cf6',
  },
  amber: {
    card: 'bg-amber-100/60 dark:bg-amber-500/10',
    icon: 'bg-amber-200/70 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300',
    hex: '#f59e0b',
  },
  rose: {
    card: 'bg-rose-100/60 dark:bg-rose-500/10',
    icon: 'bg-rose-200/70 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300',
    hex: '#f43f5e',
  },
};

function Sparkline({ values, color, id }: { values: number[]; color: string; id: string }) {
  const W = 80;
  const H = 36;
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 6) - 3;
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const gid = `spark-${id}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-9 w-20" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>
      <path
        d={line}
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function StatsCard({ stat, className }: { stat: DashStat; className?: string }) {
  const Icon = stat.icon;
  const c = colorStyles[stat.color];
  const hasTrend = stat.change !== undefined;
  const flat = stat.change === 0;
  const TrendIcon = flat ? Minus : stat.positive ? TrendingUp : TrendingDown;
  const trendColor = flat
    ? 'text-slate-500 dark:text-slate-400'
    : stat.positive
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl p-5 ring-1 ring-inset ring-black/5 dark:ring-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-default',
        c.card,
        className,
      )}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between gap-2">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', c.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        {hasTrend && (
          <span className={cn('inline-flex items-center gap-1 text-xs font-semibold', trendColor)}>
            <TrendIcon className="h-3.5 w-3.5" />
            {flat ? '0' : `${stat.change! > 0 ? '+' : ''}${stat.change}`}%
          </span>
        )}
      </div>

      {/* Label */}
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>

      {/* Value + sparkline */}
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
          {stat.value}
        </p>
        {stat.spark && stat.spark.length > 1 && (
          <Sparkline values={stat.spark} color={c.hex} id={stat.id} />
        )}
      </div>
    </div>
  );
}
