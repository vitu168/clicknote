'use client';

import { Star, UserCheck, FileStack, CalendarClock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

export interface InsightInput {
  favRate: number;      // 0–100
  activeRate: number;   // 0–100
  avgNotes: number;     // notes per member
  newThisWeek: number;  // count
}

interface Tone {
  icon: string;
  bar: string;
  text: string;
}

const TONES: Record<string, Tone> = {
  amber:   { icon: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',       bar: 'bg-amber-400',   text: 'text-amber-600 dark:text-amber-400' },
  emerald: { icon: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  accent:  { icon: 'bg-accent-50 dark:bg-accent-950/40 text-accent-600 dark:text-accent-400',    bar: 'bg-accent-500',  text: 'text-accent-600 dark:text-accent-400' },
  sky:     { icon: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400',                bar: 'bg-sky-500',     text: 'text-sky-600 dark:text-sky-400' },
};

function InsightCard({ icon: Icon, label, value, hint, pct, tone }: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
  pct?: number;
  tone: Tone;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white dark:bg-slate-800 p-4 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', tone.icon)}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 leading-tight">{label}</p>
      </div>

      <div className="flex items-end justify-between gap-2">
        <p className={cn('text-2xl font-extrabold tracking-tight', tone.text)}>{value}</p>
      </div>

      {pct !== undefined ? (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div className={cn('h-full rounded-full transition-all duration-500', tone.bar)} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
        </div>
      ) : (
        <div className="h-1.5" />
      )}

      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">{hint}</p>
    </div>
  );
}

export default function Insights({ data }: { data: InsightInput }) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <InsightCard
        icon={Star}
        label={t('insight.fav_rate')}
        value={`${Math.round(data.favRate)}%`}
        hint={t('insight.fav_hint')}
        pct={data.favRate}
        tone={TONES.amber}
      />
      <InsightCard
        icon={UserCheck}
        label={t('insight.active_rate')}
        value={`${Math.round(data.activeRate)}%`}
        hint={t('insight.active_hint')}
        pct={data.activeRate}
        tone={TONES.emerald}
      />
      <InsightCard
        icon={FileStack}
        label={t('insight.avg_notes')}
        value={data.avgNotes.toFixed(1)}
        hint={t('insight.avg_hint')}
        tone={TONES.accent}
      />
      <InsightCard
        icon={CalendarClock}
        label={t('insight.new_week')}
        value={String(data.newThisWeek)}
        hint={t('insight.new_hint')}
        tone={TONES.sky}
      />
    </div>
  );
}
