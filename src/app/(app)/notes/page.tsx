'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Star, FileText, RefreshCw } from 'lucide-react';
import NoteCard from '@/components/notes/NoteCard';
import NotesTable from '@/components/notes/NotesTable';
import NoteForm from '@/components/notes/NoteForm';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import SearchInput from '@/components/ui/SearchInput';
import ViewToggle, { type ViewMode } from '@/components/ui/ViewToggle';
import Pagination from '@/components/ui/Pagination';
import { useI18n } from '@/lib/i18n';
import { noteService } from '@/lib/services/noteService';
import type { NoteInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session';
import { archiveNote, getArchivedIds } from '@/lib/archive';
import { useRouter } from 'next/navigation';

type Filter = 'all' | 'favorites';

export default function NotesPage() {
  const { user } = useSession();
  const { t } = useI18n();
  const router = useRouter();
  const userId = user?.userId ?? '';
  const [notes, setNotes] = useState<NoteInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [view, setView] = useState<ViewMode>('grid');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NoteInfo | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchNotes = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await noteService.getNotes({
        userId,
        search: search || undefined,
        isFavorites: filter === 'favorites' ? true : undefined,
        page,
        pageSize,
      });
      // Hide anything archived locally
      const archived = getArchivedIds();
      const visible = res.items.filter((n) => !archived.has(n.id));
      setNotes(visible);
      setTotalCount(res.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, [search, filter, userId, page, pageSize]);

  useEffect(() => {
    const timer = setTimeout(fetchNotes, 300);
    return () => clearTimeout(timer);
  }, [fetchNotes]);

  async function handleCreate(data: { name: string; description: string }) {
    if (!userId) return;
    await noteService.createNote({
      name: data.name,
      description: data.description || undefined,
      userId,
    });
    setShowForm(false);
    fetchNotes();
  }

  async function handleEdit(data: { name: string; description: string }) {
    if (!editing || !userId) return;
    await noteService.updateNote(editing.id, {
      name: data.name,
      description: data.description || undefined,
      userId: editing.userId ?? userId,
      isFavorites: editing.isFavorites,
    });
    setEditing(null);
    fetchNotes();
  }

  async function handleDelete(id: number) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (deleteId === null) return;
    await noteService.deleteNote(deleteId);
    setDeleteId(null);
    fetchNotes();
  }

  async function handleToggleFavorite(note: NoteInfo) {
    if (!userId) return;
    await noteService.updateNote(note.id, {
      name: note.name ?? '',
      description: note.description ?? '',
      userId: note.userId ?? userId,
      isFavorites: !note.isFavorites,
    });
    fetchNotes();
  }

  function handleArchive(note: NoteInfo) {
    archiveNote(note.id);
    fetchNotes();
  }

  function openDetail(note: NoteInfo) {
    router.push(`/notes/${note.id}`);
  }


  return (
    <div className="h-full overflow-hidden flex flex-col gap-4">
      {/* Toolbar — fixed, never scrolls */}
      <div className="shrink-0 flex items-center gap-2">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder={t('action.search')}
          className="w-56"
        />
        <div className="flex-1" />

        {/* Filter — icon only */}
        <div className="flex h-8 items-center gap-px rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-0.5">
          <button
            type="button"
            onClick={() => { setFilter('all'); setPage(1); }}
            title="All Notes"
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-md transition-colors',
              filter === 'all'
                ? 'bg-accent-600 text-white'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-white/6 dark:hover:text-white/80',
            )}
          >
            <FileText className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => { setFilter('favorites'); setPage(1); }}
            title="Favorites"
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-md transition-colors',
              filter === 'favorites'
                ? 'bg-accent-600 text-white'
                : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20',
            )}
          >
            <Star className="h-3 w-3" fill={filter === 'favorites' ? 'currentColor' : 'none'} />
          </button>
        </div>

        <ViewToggle view={view} onChange={setView} />

        {/* Refresh */}
        <button
          type="button"
          onClick={fetchNotes}
          aria-label="Refresh"
          title="Refresh"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-slate-300 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
        </button>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          title="New Note"
          aria-label="New Note"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-white hover:bg-accent-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Error — fixed, never scrolls */}
      {error && (
        <div className="shrink-0 rounded-xl bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-900/50">
          {error}
        </div>
      )}

      {/* Scrollable content area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && notes.length === 0 ? (
          view === 'list' ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 last:border-0" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
              ))}
            </div>
          )
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
              <FileText className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {search ? t('notes.no_match') : filter === 'favorites' ? t('notes.no_favorites') : t('notes.empty')}
            </p>
            {!search && filter === 'all' && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {t('notes.create_first')}
              </button>
            )}
          </div>
        ) : view === 'list' ? (
          <NotesTable
            notes={notes}
            onOpen={openDetail}
            onToggleFavorite={handleToggleFavorite}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-2">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                view="grid"
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onArchive={handleArchive}
                onClick={openDetail}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination — fixed at bottom, never scrolls */}
      <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 pt-4">
        {!loading && totalCount > 0 && (
          <Pagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        )}
      </div>

      {/* Create form modal */}
      {showForm && (
        <NoteForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          submitLabel={t('notes.create')}
        />
      )}

      {/* Edit form modal */}
      {editing && (
        <NoteForm
          initial={{ name: editing.name, description: editing.description }}
          onSubmit={handleEdit}
          onCancel={() => setEditing(null)}
          submitLabel={t('notes.update')}
        />
      )}

      {/* Delete confirm */}
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
