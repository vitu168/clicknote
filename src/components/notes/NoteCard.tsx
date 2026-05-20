'use client';

import type { NoteInfo } from '@/lib/types';
import { FileText, Star, Trash2, Clock, Archive, ArchiveRestore } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: NoteInfo;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (note: NoteInfo) => void;
  onClick?: (note: NoteInfo) => void;
  onArchive?: (note: NoteInfo) => void;
  onUnarchive?: (note: NoteInfo) => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function NoteCard({ note, onDelete, onToggleFavorite, onClick, onArchive, onUnarchive }: NoteCardProps) {
  return (
    <div
      onClick={() => onClick?.(note)}
      className={cn(
        'group relative flex flex-col gap-2 rounded-2xl bg-white dark:bg-slate-800 p-4 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        onClick && 'cursor-pointer',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400">
            <FileText className="h-4 w-4" />
          </div>
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {note.name ?? 'Untitled'}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(note); }}
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
          {onArchive && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onArchive(note); }}
              aria-label="Archive note"
              title="Archive"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
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
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete?.(note.id); }}
            aria-label="Delete note"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
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
