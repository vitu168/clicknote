'use client';

import { useState } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import ChatView from '@/components/messenger/ChatView';
import { cn } from '@/lib/utils';

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

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-violet-500', 'bg-sky-500',
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

export default function MessengerClient({ users, currentUserId, currentUserName }: MessengerClientProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<UserProfile | null>(null);

  const contacts = users.filter(
    (u) =>
      u.id !== currentUserId &&
      ((u.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email ?? '').toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="grid h-[calc(100vh-8rem)] gap-5 lg:grid-cols-[280px_1fr]">
      {/* Contacts panel */}
      <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-sm font-semibold text-slate-900">Messages</p>
          <p className="text-xs text-slate-400">{contacts.length} contacts</p>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-slate-50">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        {/* Contact list */}
        <ul className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {contacts.length === 0 ? (
            <li className="flex flex-col items-center gap-2 py-12 text-center">
              <MessageSquare className="h-7 w-7 text-slate-300" />
              <p className="text-xs text-slate-400">{search ? 'No contacts found.' : 'No users to chat with.'}</p>
            </li>
          ) : (
            contacts.map((user) => (
              <li
                key={user.id}
                onClick={() => setSelected(user)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 px-5 py-3.5 transition-colors',
                  selected?.id === user.id ? 'bg-indigo-50' : 'hover:bg-slate-50',
                )}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name ?? 'avatar'}
                    className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white',
                      avatarColor(user.id),
                    )}
                  >
                    {getInitials(user.name, user.email)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className={cn('truncate text-sm font-semibold', selected?.id === user.id ? 'text-indigo-700' : 'text-slate-800')}>
                    {user.name ?? user.email ?? 'Unknown'}
                  </p>
                  <p className="truncate text-[11px] text-slate-400">{user.email ?? ''}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Chat panel */}
      <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {selected ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              {selected.avatarUrl ? (
                <img
                  src={selected.avatarUrl}
                  alt={selected.name ?? 'avatar'}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white',
                    avatarColor(selected.id),
                  )}
                >
                  {getInitials(selected.name, selected.email)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-900">{selected.name ?? 'Unknown'}</p>
                <p className="text-[11px] text-slate-400">{selected.email}</p>
              </div>
            </div>

            <ChatView
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              otherUser={selected}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <MessageSquare className="h-8 w-8" />
            </div>
            <p className="text-sm font-medium text-slate-600">Select a contact to start chatting</p>
            <p className="text-xs text-slate-400">Real-time messages powered by Supabase</p>
          </div>
        )}
      </section>
    </div>
  );
}
