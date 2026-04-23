'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Archive,
  Clock,
  Save,
  Star,
  Trash2,
  FileText,
} from 'lucide-react';
import { noteService } from '@/lib/services/noteService';
import type { NoteInfo } from '@/lib/types';
import { useSession } from '@/lib/session';
import { archiveNote } from '@/lib/archive';
import { cn } from '@/lib/utils';

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const { user } = useSession();

  const [note, setNote] = useState<NoteInfo | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  const fetchNote = useCallback(async () => {
    if (!id || Number.isNaN(id)) {
      setError('Invalid note id.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await noteService.getNoteById(id);
      setNote(data);
      setName(data.name ?? '');
      setDescription(data.description ?? '');
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^Exception:\s*/, '') : 'Failed to load note.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  async function handleSave() {
    if (!note || !user) return;
    if (!name.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await noteService.updateNote(note.id, {
        name: name.trim(),
        description: description.trim(),
        userId: note.userId ?? user.userId,
        isFavorites: note.isFavorites,
      });
      setNote({ ...note, name: name.trim(), description: description.trim() });
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^Exception:\s*/, '') : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleFavorite() {
    if (!note || !user) return;
    const next = !note.isFavorites;
    await noteService.updateNote(note.id, {
      name: note.name ?? '',
      description: note.description ?? '',
      userId: note.userId ?? user.userId,
      isFavorites: next,
    });
    setNote({ ...note, isFavorites: next });
  }

  async function handleDelete() {
    if (!note) return;
    if (!confirm('Delete this note permanently?')) return;
    await noteService.deleteNote(note.id);
    router.push('/notes');
  }

  function handleArchive() {
    if (!note) return;
    archiveNote(note.id);
    router.push('/notes');
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <FileText className="h-7 w-7" />
        </div>
        <p className="text-sm font-medium text-slate-700">{error}</p>
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to notes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push('/notes')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to notes
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleFavorite}
            title={note?.isFavorites ? 'Unfavorite' : 'Favorite'}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl border transition-colors',
              note?.isFavorites
                ? 'border-amber-200 bg-amber-50 text-amber-500'
                : 'border-slate-200 bg-white text-slate-400 hover:text-amber-500',
            )}
          >
            <Star className="h-4 w-4" fill={note?.isFavorites ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={handleArchive}
            title="Archive"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-violet-50 hover:text-violet-500 transition-colors"
          >
            <Archive className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            title="Delete"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setDirty(true); }}
          placeholder="Note title"
          className="w-full border-none bg-transparent text-xl font-bold text-slate-900 placeholder:text-slate-300 outline-none"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <Clock className="h-3 w-3" />
          <span>
            Updated {note?.updatedAt ? new Date(note.updatedAt).toLocaleString() : '—'}
          </span>
          {note?.isFavorites && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-600 font-medium">
              <Star className="h-2.5 w-2.5" fill="currentColor" /> Favorite
            </span>
          )}
        </div>

        <textarea
          value={description}
          onChange={(e) => { setDescription(e.target.value); setDirty(true); }}
          placeholder="Start writing…"
          rows={16}
          className="mt-5 w-full resize-none border-none bg-transparent text-sm leading-relaxed text-slate-700 placeholder:text-slate-300 outline-none"
        />

        {error && (
          <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">{error}</p>
        )}

        <div className="mt-5 flex items-center justify-end gap-3">
          {saved && <span className="text-xs font-medium text-emerald-600">✓ Saved</span>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm',
              'hover:bg-indigo-700 transition-colors',
              (saving || !dirty) && 'opacity-60 cursor-not-allowed',
            )}
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
