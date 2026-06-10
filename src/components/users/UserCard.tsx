'use client';

import { Mail, Calendar, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserProfile } from '@/lib/types';
import type { ViewMode } from '@/components/ui/ViewToggle';
import { useI18n } from '@/lib/i18n';

interface UserCardProps {
  profile: UserProfile;
  view?: ViewMode;
  onDelete?: (id: string) => void;
}

const LIST_COLS = 'grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_120px_96px_auto]';

const AVATAR_COLORS = [
  'bg-accent-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-fuchsia-500',
  'bg-violet-500',
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

function getInitials(name: string | null, email: string | null): string {
  if (name) {
    const parts = name.trim().split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return (email ?? '??').slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function Avatar({ profile, size = 'md' }: { profile: UserProfile; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-12 w-12 text-sm' : size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs';
  if (profile.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.avatarUrl}
        alt={profile.name ?? 'avatar'}
        className={cn(sizeClass, 'shrink-0 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700')}
      />
    );
  }
  return (
    <div className={cn('flex shrink-0 items-center justify-center rounded-full font-bold text-white', sizeClass, avatarColor(profile.id))}>
      {getInitials(profile.name, profile.email)}
    </div>
  );
}

export function UserListHeader() {
  const { t } = useI18n();
  const headers = [t('table.user'), t('table.email'), t('table.joined'), t('table.status'), ''];
  return (
    <div className={cn('sticky top-0 z-10 grid gap-4 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 select-none', LIST_COLS)}>
      {headers.map((h, i) => (
        <span key={i} className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {h}
        </span>
      ))}
    </div>
  );
}

export default function UserCard({ profile, view = 'grid', onDelete }: UserCardProps) {
  if (view === 'list') {
    return (
      <div className={cn('group grid gap-4 px-4 py-3 items-center', LIST_COLS, 'bg-white dark:bg-slate-800', 'border-b border-slate-100 dark:border-slate-700/60 last:border-0', 'hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors')}>
        {/* User */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar profile={profile} size="sm" />
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {profile.name ?? '—'}
          </p>
        </div>

        {/* Email */}
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
          <Mail className="h-3 w-3 shrink-0" />
          {profile.email ?? '—'}
        </span>

        {/* Joined */}
        <span className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <Calendar className="h-3 w-3 shrink-0" />
          {formatDate(profile.createdAt)}
        </span>

        {/* Status */}
        <span className={cn('inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-medium', profile.isNote ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400')}>
          {profile.isNote ? 'Active' : 'Inactive'}
        </span>

        {/* Actions */}
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(profile.id)}
              aria-label="Delete user"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  /* Grid card */
  return (
    <div className="group flex flex-col items-center gap-3 rounded-2xl bg-white dark:bg-slate-800 p-5 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center relative">
      {onDelete && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onDelete(profile.id)}
            aria-label="Delete user"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <Avatar profile={profile} size="lg" />

      <div className="w-full min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
          {profile.name ?? '—'}
        </p>
        <p className="mt-0.5 truncate flex items-center justify-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
          <Mail className="h-3 w-3 shrink-0" />
          {profile.email ?? '—'}
        </p>
      </div>

      <div className="flex items-center justify-between w-full mt-1">
        <span className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
          <Calendar className="h-3 w-3 shrink-0" />
          {formatDate(profile.createdAt)}
        </span>
        <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium', profile.isNote ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400')}>
          {profile.isNote ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  );
}
