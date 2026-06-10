'use client';

import { useState } from 'react';
import { Search, MessageSquarePlus, MessageSquare } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import ChatView from '@/components/messenger/ChatView';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

interface MessengerClientProps {
  users: UserProfile[];
  currentUserId: string;
  currentUserName: string;
}

function getInitials(name: string | null, email: string | null): string {
  const src = name ?? email ?? '?';
  const parts = src.trim().split(' ');
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : src.slice(0, 2).toUpperCase();
}

const AVATAR_PALETTES = [
  { bg: 'bg-accent-500',   text: 'text-white' },
  { bg: 'bg-sky-500',      text: 'text-white' },
  { bg: 'bg-emerald-500',  text: 'text-white' },
  { bg: 'bg-violet-500',   text: 'text-white' },
  { bg: 'bg-rose-500',     text: 'text-white' },
  { bg: 'bg-amber-500',    text: 'text-white' },
  { bg: 'bg-teal-500',     text: 'text-white' },
  { bg: 'bg-indigo-500',   text: 'text-white' },
];

function palette(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTES[hash % AVATAR_PALETTES.length];
}

function isOnline(id: string): boolean {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 7 + id.charCodeAt(i)) >>> 0;
  return hash % 3 !== 0;
}

function Avatar({ user, size = 'md' }: { user: UserProfile; size?: 'sm' | 'md' | 'lg' }) {
  const p = palette(user.id);
  const dim = size === 'sm' ? 'h-8 w-8 text-[10px]' : size === 'lg' ? 'h-10 w-10 text-[13px]' : 'h-9 w-9 text-[11px]';
  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={user.avatarUrl} alt={user.name ?? ''} className={cn(dim, 'shrink-0 rounded-full object-cover')} />
    );
  }
  return (
    <div className={cn(dim, 'shrink-0 flex items-center justify-center rounded-full font-bold', p.bg, p.text)}>
      {getInitials(user.name, user.email)}
    </div>
  );
}

export default function MessengerClient({ users, currentUserId, currentUserName }: MessengerClientProps) {
  const { t } = useI18n();
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState<UserProfile | null>(null);

  const contacts = users.filter(
    (u) =>
      u.id !== currentUserId &&
      ((u.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email ?? '').toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="flex h-full overflow-hidden rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">

      {/* ── Contact panel ── */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-slate-100 dark:border-slate-700/80">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-4 border-b border-slate-100 dark:border-slate-700/80">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{t('messenger.title')}</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{contacts.length} {contacts.length === 1 ? t('messenger.contact') : t('messenger.contacts')}</p>
          </div>
          <button
            type="button"
            title={t('messenger.new_message')}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-accent-200 hover:bg-accent-50 hover:text-accent-600 dark:hover:bg-accent-950/30 dark:hover:text-accent-400 transition-colors"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="shrink-0 px-3 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={t('messenger.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60 pl-8 pr-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-accent-400 dark:focus:border-accent-500 focus:ring-2 focus:ring-accent-100 dark:focus:ring-accent-950/40 transition"
            />
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 min-h-0 overflow-y-auto py-1">
          {contacts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
                <MessageSquare className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {search ? t('messenger.no_found') : t('messenger.no_users')}
              </p>
            </div>
          ) : (
            contacts.map((user) => {
              const online = isOnline(user.id);
              const isActive = selected?.id === user.id;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelected(user)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 mx-1 rounded-xl transition-colors text-left',
                    isActive
                      ? 'bg-accent-50 dark:bg-accent-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/40',
                  )}
                  style={{ width: 'calc(100% - 8px)' }}
                >
                  {/* Avatar with online indicator */}
                  <div className="relative shrink-0">
                    <Avatar user={user} size="md" />
                    <span className={cn(
                      'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-800',
                      online ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600',
                    )} />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-1">
                      <p className={cn(
                        'truncate text-[13px] font-semibold leading-snug',
                        isActive ? 'text-accent-700 dark:text-accent-300' : 'text-slate-800 dark:text-slate-100',
                      )}>
                        {user.name ?? user.email ?? 'Unknown'}
                      </p>
                    </div>
                    <p className={cn(
                      'truncate text-[11px] leading-snug mt-0.5',
                      online ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500',
                    )}>
                      {online ? t('messenger.active_now') : user.email ?? ''}
                    </p>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ── Chat panel ── */}
      <section className="flex flex-1 min-w-0 flex-col">
        {selected ? (
          <>
            {/* Chat header */}
            <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 dark:border-slate-700/80 bg-white dark:bg-slate-800 px-5 py-3.5">
              <div className="relative shrink-0">
                <Avatar user={selected} size="lg" />
                <span className={cn(
                  'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-800',
                  isOnline(selected.id) ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600',
                )} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-none">
                  {selected.name ?? 'Unknown'}
                </p>
                <p className={cn(
                  'text-[11px] mt-0.5 leading-none',
                  isOnline(selected.id) ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500',
                )}>
                  {isOnline(selected.id) ? t('messenger.active_now') : selected.email ?? ''}
                </p>
              </div>
            </div>

            <ChatView
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              otherUser={selected}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-50 dark:bg-accent-950/30">
              <MessageSquare className="h-9 w-9 text-accent-500 dark:text-accent-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t('messenger.your_messages')}</p>
              <p className="mt-1 text-[12px] text-slate-400 dark:text-slate-500 max-w-[220px] leading-relaxed">
                {t('messenger.select_prompt')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t('messenger.realtime')}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
