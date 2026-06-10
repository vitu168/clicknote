'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, FileText, Star, Calendar, Settings, ArrowRight } from 'lucide-react';
import { useSession } from '@/lib/session';
import { noteService } from '@/lib/services/noteService';
import type { NoteInfo } from '@/lib/types';
import NoteCard from '@/components/notes/NoteCard';
import { useI18n } from '@/lib/i18n';

function initials(src: string | null | undefined): string {
  if (!src) return '?';
  const parts = src.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function ProfilePage() {
  const { t } = useI18n();
  const { user, profile } = useSession();
  const [notes,   setNotes]   = useState<NoteInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await noteService.getNotes({ userId: user.userId, pageSize: 50 });
      setNotes(res.items);
    } catch {
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  if (!user) return null;

  const displayName = profile?.name ?? user.name ?? user.email ?? '';
  const favorites   = notes.filter((n) => n.isFavorites);

  return (
    <div className="space-y-5">

      {/* ── Hero card ── */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">

        {/* Banner */}
        <div className="relative h-28 bg-linear-to-135deg from-accent-500 via-accent-600 to-accent-800">
          <div className="absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.25) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(255,255,255,0.12) 0%, transparent 50%)' }}
          />
          {/* Edit button — top right of banner */}
          <Link
            href="/settings"
            className="absolute top-3 right-4 flex items-center gap-1.5 rounded-lg bg-white/15 backdrop-blur-sm border border-white/25 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-white/25 transition-colors"
          >
            <Settings className="h-3 w-3" />
            {t('profile.edit')}
          </Link>
        </div>

        {/* Avatar overlapping banner */}
        <div className="px-6 pt-0 pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4 -mt-10">
              {/* Circular avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-accent-500 to-accent-600 text-xl font-extrabold text-white ring-4 ring-white dark:ring-slate-800 shadow-lg">
                {profile?.avatarUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                  : initials(displayName)}
              </div>

              {/* Name + meta */}
              <div className="pb-1">
                <h1 className="text-base font-bold leading-snug text-slate-900 dark:text-slate-100">
                  {displayName || '—'}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <Mail className="h-3 w-3 shrink-0" />
                    {user.email}
                  </span>
                  {profile?.createdAt && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                      <Calendar className="h-3 w-3 shrink-0" />
                      {t('profile.joined')} {formatDate(profile.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Status badge */}
            {profile?.isNote && (
              <span className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800/40">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {t('profile.active_member')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: FileText, label: t('profile.stat_notes'),     value: loading ? '…' : String(notes.length),     color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-50 dark:bg-accent-950/30' },
          { icon: Star,     label: t('profile.stat_favorites'), value: loading ? '…' : String(favorites.length), color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-950/30'   },
          { icon: Calendar, label: t('profile.member_since'),   value: formatDate(profile?.createdAt ?? null),    color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="flex items-center gap-3.5 rounded-2xl bg-white dark:bg-slate-800 px-4 py-4 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold leading-tight text-slate-900 dark:text-slate-100 truncate">{value}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Notes ── */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('profile.my_notes')}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('profile.recent_desc')}</p>
          </div>
          <Link href="/notes" className="flex items-center gap-1 text-xs font-semibold text-accent-600 dark:text-accent-400 hover:text-accent-700 transition-colors">
            {t('profile.view_all')} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/60" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t('profile.no_notes')}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t('profile.start_capturing')}</p>
              </div>
              <Link href="/notes" className="inline-flex items-center gap-1.5 rounded-xl bg-accent-600 px-4 py-2 text-xs font-semibold text-white hover:bg-accent-700 transition-colors">
                {t('profile.create_first')} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.slice(0, 6).map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
