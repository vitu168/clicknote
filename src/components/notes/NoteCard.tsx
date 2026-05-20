'use client';

import type { NoteInfo } from '@/lib/types';
import { FileText, Star, Trash2, Clock, Archive, ArchiveRestore } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewMode } from '@/components/ui/ViewToggle';

interface NoteCardProps {
  note: NoteInfo;
  view?: ViewMode;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (note: NoteInfo) => void;
  onClick?: (note: NoteInfo) => void;
  onArchive?: (note: NoteInfo) => void;
  onUnarchive?: (note: NoteInfo) => void;
}

const LIST_COLS = 'grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_128px_96px_auto]';

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

/* ── Table header for list view ── */
export function NoteListHeader() {
  return (
    <div className={cn('sticky top-0 z-10 grid gap-4 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 select-none', LIST_COLS)}>
      {(['NAME', 'DESCRIPTION', 'UPDATED', 'STATUS', ''] as const).map((h) => (
        <span key={h} className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {h}
        </span>
      ))}
    </div>
  );
}

/* ── Shared action buttons ── */
function Actions({ note, onToggleFavorite, onArchive, onUnarchive, onDelete }: Omit<NoteCardProps, 'view' | 'onClick'>) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {onToggleFavorite && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(note); }}
          aria-label={note.isFavorites ? 'Remove from favorites' : 'Add to favorites'}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
            note.isFavorites
              ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-500'
              : 'bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-amber-500 dark:hover:text-amber-400',
          )}
        >
          <Star className="h-3.5 w-3.5" fill={note.isFavorites ? 'currentColor' : 'none'} />
        </button>
      )}
      {onArchive && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onArchive(note); }}
          aria-label="Archive note"
          title="Archive"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-accent-50 dark:hover:bg-accent-950/30 hover:text-accent-500 dark:hover:text-accent-400 transition-colors"
        >
          <Archive className="h-3.5 w-3.5" />
        </button>
      )}
      {onUnarchive && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onUnarchive(note); }}
          aria-label="Restore from archive"
          title="Restore"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
        >
          <ArchiveRestore className="h-3.5 w-3.5" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
          aria-label="Delete note"
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export default function NoteCard({ note, view = 'grid', onDelete, onToggleFavorite, onClick, onArchive, onUnarchive }: NoteCardProps) {

  /* ── LIST ROW (table-style) ── */
  if (view === 'list') {
    return (
      <div
        onClick={() => onClick?.(note)}
        className={cn(
          'group grid gap-4 px-4 py-3 items-center',
          LIST_COLS,
          'bg-white dark:bg-slate-800',
          'border-b border-slate-100 dark:border-slate-700/60 last:border-0',
          'hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors',
          onClick && 'cursor-pointer',
        )}
      >
        {/* Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-50 dark:bg-accent-950/30 text-accent-600 dark:text-accent-400">
            <FileText className="h-3.5 w-3.5" />
          </div>
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {note.name ?? 'Untitled'}
          </p>
        </div>

        {/* Description */}
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">
          {note.description || '—'}
        </p>

        {/* Date */}
        <span className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <Clock className="h-3 w-3 shrink-0" />
          {formatDate(note.updatedAt ?? note.createdAt)}
        </span>

        {/* Status badge */}
        {note.isFavorites ? (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
            <Star className="h-2.5 w-2.5" fill="currentColor" />
            Favorite
          </span>
        ) : (
          <span className="inline-flex w-fit items-center rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Note
          </span>
        )}

        {/* Actions */}
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <Actions
            note={note}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
          />
        </div>
      </div>
    );
  }

  /* ── GRID CARD ── */
  return (
    <div
      onClick={() => onClick?.(note)}
      className={cn(
        'group relative flex flex-col gap-2 rounded-2xl bg-white dark:bg-slate-800 p-4',
        'ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        onClick && 'cursor-pointer',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-950/30 text-accent-600 dark:text-accent-400">
            <FileText className="h-4 w-4" />
          </div>
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {note.name ?? 'Untitled'}
          </p>
        </div>
        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Actions
            note={note}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
          />
        </div>
      </div>

      {/* Description */}
      {note.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {note.description}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
        <Clock className="h-3 w-3 shrink-0" />
        <span>{formatDate(note.updatedAt ?? note.createdAt)}</span>
        {note.isFavorites && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
            <Star className="h-2.5 w-2.5" fill="currentColor" /> Favorite
          </span>
        )}
      </div>
    </div>
  );
}
