'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, Archive as ArchiveIcon, RefreshCw } from 'lucide-react';
import NoteCard from '@/components/notes/NoteCard';
import { noteService } from '@/lib/services/noteService';
import type { NoteInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session';
import { getArchivedIds, onArchiveChange, unarchiveNote } from '@/lib/archive';

export default function ArchivePage() {
  const { user } = useSession();
  const userId = user?.userId ?? '';

  const [notes, setNotes] = useState<NoteInfo[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArchived = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const archived = getArchivedIds();
      if (archived.size === 0) {
        setNotes([]);
        return;
      }
      const res = await noteService.getNotes({ userId, pageSize: 500 });
      setNotes(res.items.filter((n) => archived.has(n.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^Exception:\s*/, '') : 'Failed to load archive.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchArchived();
    return onArchiveChange(fetchArchived);
  }, [fetchArchived]);

  function handleUnarchive(note: NoteInfo) {
    unarchiveNote(note.id);
  }

  async function handleDelete(id: number) {
    if (!confirm('Permanently delete this note?')) return;
    await noteService.deleteNote(id);
    unarchiveNote(id);
    fetchArchived();
  }

  const filtered = notes.filter((n) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      (n.name ?? '').toLowerCase().includes(q) ||
      (n.description ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search archive…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200 dark:focus:ring-violet-900/40 transition"
          />
        </div>
        <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
          {notes.length} archived
        </span>
        <button
          type="button"
          onClick={fetchArchived}
          aria-label="Refresh"
          title="Refresh"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-300 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-900/50">
          {error}
        </div>
      )}

      {loading && filtered.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-500 dark:text-violet-400">
            <ArchiveIcon className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {search ? 'No archived notes match your search.' : 'Nothing archived yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onUnarchive={handleUnarchive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
