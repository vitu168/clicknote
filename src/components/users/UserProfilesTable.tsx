'use client';

import { useState } from 'react';
import { Search, Mail, MoreHorizontal, Trash2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';

interface UserProfilesTableProps {
  profiles: UserProfile[];
  onDelete?: (id: string) => void;
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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const AVATAR_COLORS = [
  'bg-indigo-500',
  'bg-violet-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-fuchsia-500',
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

export default function UserProfilesTable({ profiles, onDelete }: UserProfilesTableProps) {
  const [query, setQuery] = useState('');

  const filtered = profiles.filter((p) => {
    const q = query.toLowerCase();
    return (
      (p.name ?? '').toLowerCase().includes(q) ||
      (p.email ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
        <p className="ml-auto text-xs text-slate-400">
          {filtered.length} of {profiles.length} users
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                User
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 md:table-cell">
                Email
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 lg:table-cell">
                Joined
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Notes
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                  {query ? 'No users match your search.' : 'No users found.'}
                </td>
              </tr>
            ) : (
              filtered.map((profile) => (
                <tr key={profile.id} className="transition-colors hover:bg-slate-50">
                  {/* User */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {profile.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.avatarUrl}
                          alt={profile.name ?? 'avatar'}
                          className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                            avatarColor(profile.id),
                          )}
                        >
                          {getInitials(profile.name, profile.email)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold leading-none text-slate-900">
                          {profile.name ?? '—'}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400 md:hidden">
                          <Mail className="h-3 w-3" />
                          {profile.email ?? '—'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="hidden px-4 py-4 md:table-cell">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Mail className="h-3 w-3 shrink-0" />
                      {profile.email ?? '—'}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="hidden px-4 py-4 text-xs text-slate-500 lg:table-cell">
                    {formatDate(profile.createdAt)}
                  </td>

                  {/* isNote badge */}
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                        profile.isNote
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500',
                      )}
                    >
                      {profile.isNote ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(profile.id)}
                          aria-label="Delete user"
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label="More options"
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 px-6 py-3">
        <p className="text-xs text-slate-400">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{profiles.length}</span> user profiles
        </p>
      </div>
    </div>
  );
}
