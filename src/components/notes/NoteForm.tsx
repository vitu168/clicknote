'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NoteInfo } from '@/lib/types';

interface NoteFormProps {
  initial?: Pick<NoteInfo, 'name' | 'description'>;
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function NoteForm({ initial, onSubmit, onCancel, submitLabel = 'Save' }: NoteFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    });
    setTimeout(() => nameRef.current?.focus(), 50);
  }, []);

  function close() {
    setVisible(false);
    setTimeout(onCancel, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Title is required.'); return; }
    setError(null);
    setLoading(true);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex">
      {/* Backdrop */}
      <div
        onClick={close}
        className={cn(
          'flex-1 transition-all duration-300',
          visible ? 'bg-black/25 backdrop-blur-[2px]' : 'bg-transparent',
        )}
      />

      {/* Drawer sheet */}
      <div
        className={cn(
          'flex h-full w-100 shrink-0 flex-col bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-slate-900',
          visible ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow shadow-indigo-200">
            <StickyNote className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {initial ? 'Edit Note' : 'New Note'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {initial ? 'Make changes to your note' : 'Capture your idea'}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="note-title" className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Title <span className="text-rose-400">*</span>
              </label>
              <input
                ref={nameRef}
                id="note-title"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What's this note about?"
                maxLength={200}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/50 transition-all"
              />
              <p className="text-right text-[11px] text-slate-400 dark:text-slate-600">
                {name.length} / 200
              </p>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="note-desc" className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Description
              </label>
              <textarea
                id="note-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details, ideas, or anything you want to remember…"
                rows={9}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/50 transition-all"
              />
            </div>

            {/* Tip when empty */}
            {!name && !description && (
              <div className="flex items-start gap-3 rounded-xl bg-indigo-50 px-4 py-3 dark:bg-indigo-950/30">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                <p className="text-xs text-indigo-600 dark:text-indigo-400">
                  Your note will appear in the list once saved.
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                {error}
              </div>
            )}
          </div>

          {/* Sticky footer */}
          <div className="shrink-0 border-t border-slate-100 px-5 py-4 dark:border-slate-800">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={close}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'flex-1 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition-all',
                  'hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:shadow-indigo-900/30',
                  loading && 'cursor-not-allowed opacity-60',
                )}
              >
                {loading ? 'Saving…' : submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}


