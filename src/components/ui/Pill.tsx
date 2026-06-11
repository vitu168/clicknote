import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PillTone = 'emerald' | 'sky' | 'amber' | 'rose' | 'violet' | 'slate';
export type PillVariant = 'solid' | 'soft';

const solid: Record<PillTone, string> = {
  emerald: 'bg-emerald-600 text-white',
  sky:     'bg-sky-500 text-white',
  amber:   'bg-amber-500 text-white',
  rose:    'bg-rose-500 text-white',
  violet:  'bg-violet-500 text-white',
  slate:   'bg-slate-500 text-white',
};

const soft: Record<PillTone, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  sky:     'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  amber:   'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  rose:    'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  violet:  'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  slate:   'bg-slate-100 text-slate-500 dark:bg-slate-700/70 dark:text-slate-300',
};

export default function Pill({
  tone = 'slate',
  variant = 'soft',
  icon: Icon,
  children,
  className,
}: {
  tone?: PillTone;
  variant?: PillVariant;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none',
        variant === 'solid' ? solid[tone] : soft[tone],
        className,
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span className="truncate">{children}</span>
    </span>
  );
}
