'use client';

import { useCallback, useEffect, useState } from 'react';
import { Star, RefreshCw } from 'lucide-react';
import SearchInput from '@/components/ui/SearchInput';
import { useRouter } from 'next/navigation';
import NoteCard from '@/components/notes/NoteCard';
import { noteService } from '@/lib/services/noteService';
import type { NoteInfo } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session';
import { archiveNote, getArchivedIds } from '@/lib/archive';

export default function FavoritesPage() {
  const { user } = useSession();
  const router = useRouter();
  const userId = user?.userId ?? '';

  const [notes, setNotes] = useState<NoteInfo[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await noteService.getNotes({
        userId,
        isFavorites: true,
        search: search || undefined,
        pageSize: 100,
      });
      const archived = getArchivedIds();
      setNotes(res.items.filter((n) => !archived.has(n.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^Exception:\s*/, '') : 'Failed to load favorites.');
    } finally {
      setLoading(false);
    }
  }, [userId, search]);

  useEffect(() => {
    const t = setTimeout(fetchFavorites, 300);
    return () => clearTimeout(t);
  }, [fetchFavorites]);

  async function handleToggleFavorite(note: NoteInfo) {
    if (!userId) return;
    await noteService.updateNote(note.id, {
      name: note.name ?? '',
      description: note.description ?? '',
      userId: note.userId ?? userId,
      isFavorites: !note.isFavorites,
    });
    fetchFavorites();
  }

  async function handleDelete(id: number) {
    if (!confirm('Remove this favorite note?')) return;
    await noteService.deleteNote(id);
    fetchFavorites();
  }

  function handleArchive(note: NoteInfo) {
    archiveNote(note.id);
    fetchFavorites();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search favorites…"
          className="flex-1"
        />
        <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
          {notes.length} starred
        </span>
        <button
          type="button"
          onClick={fetchFavorites}
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

      {loading && notes.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400">
            <Star className="h-7 w-7" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {search ? 'No favorites match your search.' : 'You have not starred any notes yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
              onArchive={handleArchive}
              onClick={(n) => router.push(`/notes/${n.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
