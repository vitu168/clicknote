'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, FileText, Star, Calendar, Edit3 } from 'lucide-react';
import { useSession } from '@/lib/session';
import { noteService } from '@/lib/services/noteService';
import type { NoteInfo } from '@/lib/types';
import NoteCard from '@/components/notes/NoteCard';

function initials(src: string | null | undefined): string {
  if (!src) return '?';
  const parts = src.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProfilePage() {
  const { user, profile } = useSession();
  const [notes, setNotes] = useState<NoteInfo[]>([]);
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

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  if (!user) return null;

  const displayName = profile?.name ?? user.name ?? user.email;
  const favorites = notes.filter((n) => n.isFavorites);

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
        <div className="h-24 bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500" />
        <div className="relative px-6 pb-6">
          <div className="-mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white ring-4 ring-white">
                {profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  initials(displayName)
                )}
              </div>
              <div className="pb-1">
                <p className="text-lg font-bold text-slate-900">{displayName}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="h-3 w-3" /> {user.email}
                </p>
              </div>
            </div>
            <Link
              href="/settings"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Notes" value={notes.length} tint="bg-emerald-50 text-emerald-600" />
        <StatCard icon={Star} label="Favorites" value={favorites.length} tint="bg-amber-50 text-amber-600" />
        <StatCard
          icon={Calendar}
          label="Joined"
          value={formatDate(profile?.createdAt ?? null)}
          tint="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* My Notes */}
      <section className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">My notes</p>
            <p className="text-xs text-slate-400">Everything you&apos;ve captured</p>
          </div>
          <Link
            href="/notes"
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <p className="text-center text-sm text-slate-400 py-8">
              You haven&apos;t created any notes yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notes.slice(0, 6).map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  tint: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900">{value}</p>
        <p className="text-[11px] text-slate-500">{label}</p>
      </div>
    </div>
  );
}
