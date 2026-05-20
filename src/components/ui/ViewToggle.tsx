'use client';

import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'grid' | 'list';

interface ViewToggleProps {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
  className?: string;
}

export default function ViewToggle({ view, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn(
      'flex h-8 items-center gap-px rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-0.5',
      className,
    )}>
      <button
        type="button"
        title="Grid view"
        onClick={() => onChange('grid')}
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-md transition-colors',
          view === 'grid'
            ? 'bg-accent-600 text-white'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
        )}
      >
        <LayoutGrid className="h-3 w-3" />
      </button>
      <button
        type="button"
        title="List view"
        onClick={() => onChange('list')}
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-md transition-colors',
          view === 'list'
            ? 'bg-accent-600 text-white'
            : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
        )}
      >
        <List className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
