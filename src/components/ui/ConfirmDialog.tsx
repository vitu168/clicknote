'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  variant      = 'default',
}: ConfirmDialogProps) {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  /* Focus cancel button when opened */
  useEffect(() => {
    if (open) {
      const timerId = setTimeout(() => cancelRef.current?.focus(), 50);
      return () => clearTimeout(timerId);
    }
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open && !loading) onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, loading, onClose]);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  }

  if (!open) return null;

  const isDanger = variant === 'danger';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-title"
      aria-describedby={description ? 'confirm-desc' : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-fade-in"
        onClick={() => { if (!loading) onClose(); }}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm animate-pop-in">
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl ring-1 ring-black/8 dark:ring-white/10">

          {/* Header */}
          <div className="flex items-start gap-3.5 px-5 pt-5 pb-4">
            {/* Icon badge */}
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                isDanger
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500'
                  : 'bg-accent-50 dark:bg-accent-950/40 text-accent-500',
              )}
            >
              {isDanger
                ? <AlertTriangle className="h-5 w-5" />
                : <Info className="h-5 w-5" />}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <p
                id="confirm-title"
                className="text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                {title}
              </p>
              {description && (
                <p
                  id="confirm-desc"
                  className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400"
                >
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label={cancelLabel}
              title={cancelLabel}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-colors disabled:opacity-40"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-slate-100 dark:bg-slate-700" />

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-4">
            <button
              ref={cancelRef}
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700/60 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40"
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm',
                isDanger
                  ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200 dark:shadow-rose-950'
                  : 'bg-accent-600 hover:bg-accent-700 shadow-accent-200 dark:shadow-accent-950',
              )}
            >
              {loading && (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              )}
              {loading ? t('dialog.please_wait') : confirmLabel}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
