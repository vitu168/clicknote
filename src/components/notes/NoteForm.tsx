'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
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
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Title is required.');
      return;
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <p className="text-sm font-semibold text-slate-900">
            {initial ? 'Edit Note' : 'New Note'}
          </p>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="note-title" className="text-xs font-semibold text-slate-700">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              ref={nameRef}
              id="note-title"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Note title…"
              className={cn(
                'rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none',
                'placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition',
              )}
              maxLength={200}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="note-desc" className="text-xs font-semibold text-slate-700">
              Description
            </label>
            <textarea
              id="note-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your note…"
              rows={6}
              className={cn(
                'resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none',
                'placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition',
              )}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm',
                'hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors',
                loading && 'opacity-60 cursor-not-allowed',
              )}
            >
              {loading ? 'Saving…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
