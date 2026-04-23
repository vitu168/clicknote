import { cn } from '@/lib/utils';

type BadgeVariant = 'active' | 'inactive' | 'pending' | 'completed' | 'failed' | 'refunded' |
  'admin' | 'editor' | 'developer' | 'viewer';

const variantStyles: Record<BadgeVariant, string> = {
  active:     'bg-emerald-50 text-emerald-700 ring-emerald-200',
  inactive:   'bg-slate-100 text-slate-600 ring-slate-200',
  pending:    'bg-amber-50 text-amber-700 ring-amber-200',
  completed:  'bg-emerald-50 text-emerald-700 ring-emerald-200',
  failed:     'bg-red-50 text-red-700 ring-red-200',
  refunded:   'bg-violet-50 text-violet-700 ring-violet-200',
  admin:      'bg-indigo-50 text-indigo-700 ring-indigo-200',
  editor:     'bg-blue-50 text-blue-700 ring-blue-200',
  developer:  'bg-violet-50 text-violet-700 ring-violet-200',
  viewer:     'bg-slate-100 text-slate-600 ring-slate-200',
};

const dotStyles: Record<BadgeVariant, string> = {
  active:    'bg-emerald-500',
  inactive:  'bg-slate-400',
  pending:   'bg-amber-500',
  completed: 'bg-emerald-500',
  failed:    'bg-red-500',
  refunded:  'bg-violet-500',
  admin:     'bg-indigo-500',
  editor:    'bg-blue-500',
  developer: 'bg-violet-500',
  viewer:    'bg-slate-400',
};

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  showDot?: boolean;
  className?: string;
}

export default function Badge({ variant, children, showDot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
        variantStyles[variant],
        className,
      )}
    >
      {showDot && <span className={cn('h-1.5 w-1.5 rounded-full', dotStyles[variant])} />}
      {children}
    </span>
  );
}
