'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Star, FileText, RefreshCw } from 'lucide-react';
import NoteCard from '@/components/notes/NoteCard';
import NoteForm from '@/components/notes/NoteForm';
import { noteService } from '@/lib/services/noteService';
import type { NoteInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session';
import { archiveNote, getArchivedIds } from '@/lib/archive';
import { useRouter } from 'next/navigation';

type Filter = 'all' | 'favorites';

export default function NotesPage() {
  const { user } = useSession();
  const router = useRouter();
  const userId = user?.userId ?? '';
  const [notes, setNotes] = useState<NoteInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<NoteInfo | null>(null);
  const [, setTotalCount] = useState(0);

  const fetchNotes = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await noteService.getNotes({
        userId,
        search: search || undefined,
        isFavorites: filter === 'favorites' ? true : undefined,
        pageSize: 50,
      });
      // Hide anything archived locally
      const archived = getArchivedIds();
      const visible = res.items.filter((n) => !archived.has(n.id));
      setNotes(visible);
      setTotalCount(visible.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, [search, filter, userId]);

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
    if (!confirm('Delete this note?')) return;
    await noteService.deleteNote(id);
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search notes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-200 dark:focus:ring-violet-900/40 transition"
          />
        </div>

        {/* Filter — icon only */}
        <div className="flex h-8 items-center gap-px rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-0.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            title="All Notes"
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-md transition-colors',
              filter === 'all'
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-white/6 dark:hover:text-white/80',
            )}
          >
            <FileText className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => setFilter('favorites')}
            title="Favorites"
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-md transition-colors',
              filter === 'favorites'
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20',
            )}
          >
            <Star className="h-3 w-3" fill={filter === 'favorites' ? 'currentColor' : 'none'} />
          </button>
        </div>

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
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      {error && (
        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm font-medium text-rose-600 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-900/50">
          {error}
        </div>
      )}

      {loading && notes.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            <FileText className="h-7 w-7" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {search ? 'No notes match your search.' : filter === 'favorites' ? 'No favorite notes yet.' : 'No notes yet.'}
          </p>
          {!search && filter === 'all' && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create your first note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
              onArchive={handleArchive}
              onClick={openDetail}
            />
          ))}
        </div>
      )}

      {/* Create form modal */}
      {showForm && (
        <NoteForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          submitLabel="Create Note"
        />
      )}

      {/* Edit form modal */}
      {editing && (
        <NoteForm
          initial={{ name: editing.name, description: editing.description }}
          onSubmit={handleEdit}
          onCancel={() => setEditing(null)}
          submitLabel="Update Note"
        />
      )}
    </div>
  );
}
