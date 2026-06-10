'use client';

import { FileText, Star } from 'lucide-react';
import type { NoteInfo } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

export default function RecentNotes({ notes, renderTime }: { notes: NoteInfo[]; renderTime: number }) {
  const { t, lang } = useI18n();

  function timeAgo(dateStr: string | null | undefined): string {
    if (!dateStr) return '';
    const diff = renderTime - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t('time.just_now');
    if (mins < 60) return lang === 'km' ? `${mins} ${t('time.m_ago')}` : `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return lang === 'km' ? `${hours} ${t('time.h_ago')}` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return lang === 'km' ? `${days} ${t('time.d_ago')}` : `${days}d ago`;
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('widget.recent_notes')}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('widget.recent_notes_sub')}</p>
      </div>
      {notes.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <FileText className="h-8 w-8 text-slate-200 dark:text-slate-700 mb-2" />
          <p className="text-sm text-slate-400 dark:text-slate-500">{t('widget.no_notes')}</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-50 dark:divide-slate-700/50">
          {notes.map((note) => (
            <li key={note.id} className="flex items-start gap-3 px-6 py-3.5 hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{note.name || t('widget.untitled')}</p>
                  {note.isFavorites && <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{note.description || t('widget.no_description')}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{timeAgo(note.createdAt)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
