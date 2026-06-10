'use client';

import { useCallback, useEffect, useState } from 'react';
import { Archive as ArchiveIcon, RefreshCw } from 'lucide-react';
import SearchInput from '@/components/ui/SearchInput';
import ViewToggle, { type ViewMode } from '@/components/ui/ViewToggle';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Pagination from '@/components/ui/Pagination';
import { useI18n } from '@/lib/i18n';
import NoteCard, { NoteListHeader } from '@/components/notes/NoteCard';
import { noteService } from '@/lib/services/noteService';
import type { NoteInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session';
import { getArchivedIds, onArchiveChange, unarchiveNote } from '@/lib/archive';

export default function ArchivePage() {
  const { user } = useSession();
  const { t } = useI18n();
  const userId = user?.userId ?? '';

  const [notes, setNotes] = useState<NoteInfo[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetcher: state updates happen after await
    void fetchArchived();
    return onArchiveChange(fetchArchived);
  }, [fetchArchived]);

  function handleUnarchive(note: NoteInfo) {
    unarchiveNote(note.id);
  }

  async function handleDelete(id: number) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (deleteId === null) return;
    await noteService.deleteNote(deleteId);
    unarchiveNote(deleteId);
    setDeleteId(null);
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

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="h-full overflow-hidden flex flex-col gap-4">
      {/* Toolbar — fixed */}
      <div className="shrink-0 flex items-center gap-2">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder={t('action.search')}
          className="w-56"
        />
        <div className="flex-1" />
        <ViewToggle view={view} onChange={setView} />
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

      {/* Error — fixed */}
      {error && (
        <div className="shrink-0 rounded-xl bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-900/50">
          {error}
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && filtered.length === 0 ? (
          view === 'list' ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 last:border-0" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          )
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 dark:bg-accent-950/30 text-accent-500 dark:text-accent-400">
              <ArchiveIcon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {search ? t('archive.no_match') : t('archive.empty')}
            </p>
          </div>
        ) : view === 'list' ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
            <NoteListHeader />
            {paged.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                view="list"
                onUnarchive={handleUnarchive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-2">
            {paged.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                view="grid"
                onUnarchive={handleUnarchive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination — fixed at bottom */}
      <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 pt-4">
        {!loading && filtered.length > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalCount={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title={t('dialog.delete_note_title')}
        description={t('dialog.delete_note_desc')}
        confirmLabel={t('dialog.delete')}
        variant="danger"
      />
    </div>
  );
}
