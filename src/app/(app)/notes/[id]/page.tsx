'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Archive, Clock, Save, Star, Trash2, FileText,
  CalendarPlus, Hash, Type, AlignLeft,
} from 'lucide-react';
import { noteService } from '@/lib/services/noteService';
import type { NoteInfo } from '@/lib/types';
import { useSession } from '@/lib/session';
import { archiveNote } from '@/lib/archive';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';
import Pill from '@/components/ui/Pill';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import type { LucideIcon } from 'lucide-react';

function fmt(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);
  const { user } = useSession();
  const { t } = useI18n();

  const [note, setNote] = useState<NoteInfo | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetcher: state updates happen after await
    void fetchNote();
  }, [fetchNote]);

  const wordCount = useMemo(
    () => description.trim() ? description.trim().split(/\s+/).length : 0,
    [description],
  );

  async function handleSave() {
    if (!note || !user) return;
    if (!name.trim()) { setError(t('note.title_required')); return; }
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

  async function confirmDelete() {
    if (!note) return;
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
      <div className="flex h-full flex-col gap-4">
        <div className="h-9 w-48 shrink-0 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="flex flex-1 min-h-0 gap-5">
          <div className="flex-1 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="hidden w-80 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800 lg:block" />
        </div>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
          <FileText className="h-7 w-7" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{error}</p>
        <Link href="/notes" className="inline-flex items-center gap-1.5 rounded-xl bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700 transition-colors">
          <ArrowLeft className="h-4 w-4" /> {t('note.back')}
        </Link>
      </div>
    );
  }

  const isFav = !!note?.isFavorites;

  return (
    <div className="flex h-full flex-col gap-4">
      {/* ── Header bar ── */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push('/notes')}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t('note.back')}
        </button>

        <div className="flex items-center gap-2">
          {saved && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t('note.saved')}</span>}
          <IconBtn
            icon={Star}
            onClick={handleToggleFavorite}
            title={isFav ? t('note.unfavorite_title') : t('note.favorite_title')}
            active={isFav}
            activeClass="border-amber-200 bg-amber-50 text-amber-500 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
            fill={isFav}
          />
          <IconBtn icon={Archive} onClick={handleArchive} title={t('note.archive_title')} hover="accent" />
          <IconBtn icon={Trash2} onClick={() => setDeleteOpen(true)} title={t('note.delete_title')} hover="rose" />
          <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !dirty}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl bg-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-700',
              (saving || !dirty) && 'cursor-not-allowed opacity-60',
            )}
          >
            <Save className="h-4 w-4" />
            {saving ? t('note.saving') : t('note.save_changes')}
          </button>
        </div>
      </div>

      {/* ── Two-pane content ── */}
      <div className="flex flex-1 min-h-0 flex-col gap-5 lg:flex-row">
        {/* Editor */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
          <div className="shrink-0 border-b border-slate-100 px-6 pt-6 pb-4 dark:border-slate-700/60">
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setDirty(true); }}
              placeholder={t('note.title_placeholder')}
              className="w-full border-none bg-transparent text-2xl font-bold tracking-tight text-slate-900 outline-none placeholder:text-slate-300 dark:text-slate-100 dark:placeholder:text-slate-600"
            />
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
              <Clock className="h-3 w-3" />
              <span>{t('note.updated')} {fmt(note?.updatedAt ?? note?.createdAt)}</span>
            </div>
          </div>

          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); setDirty(true); }}
            placeholder={t('note.write_placeholder')}
            className="min-h-0 w-full flex-1 resize-none border-none bg-transparent px-6 py-5 text-sm leading-relaxed text-slate-700 outline-none placeholder:text-slate-300 dark:text-slate-300 dark:placeholder:text-slate-600"
          />

          {error && (
            <div className="shrink-0 border-t border-slate-100 px-6 py-3 dark:border-slate-700/60">
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">{error}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto lg:w-80">
          {/* Details */}
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm dark:bg-slate-800 dark:ring-slate-700">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{t('note.details')}</p>

            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('table.status')}</span>
              {isFav
                ? <Pill tone="amber" variant="soft" icon={Star}>{t('badge.favorite')}</Pill>
                : <Pill tone="slate" variant="soft">{t('badge.note')}</Pill>}
            </div>

            <div className="space-y-2.5">
              <DetailRow icon={CalendarPlus} label={t('note.created')} value={fmt(note?.createdAt)} />
              <DetailRow icon={Clock} label={t('note.last_updated')} value={fmt(note?.updatedAt ?? note?.createdAt)} />
              <DetailRow icon={Type} label={t('note.words')} value={String(wordCount)} />
              <DetailRow icon={AlignLeft} label={t('note.characters')} value={String(description.length)} />
              <DetailRow icon={Hash} label={t('note.note_id')} value={`#${note?.id ?? '—'}`} />
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl bg-white p-2 ring-1 ring-slate-200 shadow-sm dark:bg-slate-800 dark:ring-slate-700">
            <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{t('note.actions')}</p>
            <ActionRow icon={Star} label={isFav ? t('note.unfavorite_title') : t('note.favorite_title')} onClick={handleToggleFavorite} active={isFav} />
            <ActionRow icon={Archive} label={t('note.archive_title')} onClick={handleArchive} />
            <ActionRow icon={Trash2} label={t('note.delete_title')} onClick={() => setDeleteOpen(true)} danger />
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t('dialog.delete_note_title')}
        description={t('dialog.delete_note_desc')}
        confirmLabel={t('dialog.delete')}
        variant="danger"
      />
    </div>
  );
}

/* ── Helpers ── */

function IconBtn({ icon: Icon, onClick, title, active, activeClass, fill, hover }: {
  icon: LucideIcon;
  onClick: () => void;
  title: string;
  active?: boolean;
  activeClass?: string;
  fill?: boolean;
  hover?: 'accent' | 'rose';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xl border transition-colors',
        active
          ? activeClass
          : cn(
              'border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500',
              hover === 'accent' && 'hover:bg-accent-50 hover:text-accent-500 dark:hover:bg-accent-950/30 dark:hover:text-accent-400',
              hover === 'rose' && 'hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400',
              !hover && 'hover:text-amber-500',
            ),
      )}
    >
      <Icon className="h-4 w-4" fill={fill ? 'currentColor' : 'none'} />
    </button>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
        {label}
      </span>
      <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  );
}

function ActionRow({ icon: Icon, label, onClick, danger, active }: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  danger?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors',
        danger
          ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30'
          : active
            ? 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30'
            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/50',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" fill={active ? 'currentColor' : 'none'} />
      {label}
    </button>
  );
}
