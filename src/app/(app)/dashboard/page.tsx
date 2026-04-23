'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileText, Star, Users, UserCheck, RefreshCw, TrendingUp } from 'lucide-react';
import StatsCard, { type DashStat } from '@/components/dashboard/StatsCard';
import RecentNotes from '@/components/dashboard/RecentNotes';
import ActiveUsers from '@/components/dashboard/ActiveUsers';
import BarChart, { type BarItem } from '@/components/dashboard/BarChart';
import LineChart, { type LineDataPoint } from '@/components/dashboard/LineChart';
import { noteService } from '@/lib/services/noteService';
import { userProfileService } from '@/lib/services/userProfileService';
import { useSession } from '@/lib/session';
import type { NoteInfo, UserProfile } from '@/lib/types';

interface DashData {
  totalNotes: number;
  totalFavorites: number;
  totalUsers: number;
  totalActive: number;
  recentNotes: NoteInfo[];
  displayUsers: UserProfile[];
  allNotes: NoteInfo[];
}

/** Group notes by day-of-week for the last 7 days */
function buildWeeklyTrend(notes: NoteInfo[]): LineDataPoint[] {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    const ymd = day.toDateString();
    const count = notes.filter((n) => n.createdAt && new Date(n.createdAt).toDateString() === ymd).length;
    return { label: dayNames[day.getDay()], value: count };
  });
}

async function fetchDashboard(userId: string): Promise<DashData> {
  // pageSize: 0 → backend fetches ALL rows without pagination
  // userId filter → only the current user's notes
  const [notesRes, usersRes] = await Promise.allSettled([
    noteService.getNotes({ pageSize: 0, userId }),
    userProfileService.getProfiles({ pageSize: 0 }),
  ]);

  const notes = notesRes.status === 'fulfilled' ? notesRes.value.items : [];
  const users = usersRes.status === 'fulfilled' ? usersRes.value.items : [];

  // Derive everything locally — accurate counts, no extra API calls
  const totalNotes = notesRes.status === 'fulfilled'
    ? Math.max(notesRes.value.totalCount, notes.length)
    : notes.length;
  const totalFavorites = notes.filter((n) => n.isFavorites).length;
  const totalUsers = usersRes.status === 'fulfilled'
    ? Math.max(usersRes.value.totalCount, users.length)
    : users.length;
  const totalActive = users.filter((u) => u.isNote).length;

  // Sort notes by newest first
  const sorted = [...notes].sort((a, b) =>
    new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

  return {
    totalNotes,
    totalFavorites,
    totalUsers,
    totalActive,
    recentNotes: sorted.slice(0, 8),
    displayUsers: users.slice(0, 6),
    allNotes: notes,
  };
}

function greeting(name: string | null | undefined): string {
  const h = new Date().getHours();
  const base = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  return name ? `${base}, ${name.split(' ')[0]}! 👋` : `${base}! 👋`;
}

export default function DashboardPage() {
  const { user } = useSession();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const load = useCallback(async (isManual = false) => {
    if (!user?.userId) return;
    if (isManual) setRefreshing(true);
    try {
      const d = await fetchDashboard(user.userId);
      setData(d);
      setLastRefreshed(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    const interval = setInterval(() => load(), 30_000);
    return () => clearInterval(interval);
  }, [load]);

  /* ── Stats ─────────────────────────────────────────────────── */
  const stats: DashStat[] = [
    { id: 'notes', label: 'My Notes', value: data?.totalNotes ?? '—', icon: FileText, color: 'indigo', description: 'Your notes' },
    { id: 'favorites', label: 'My Favorites', value: data?.totalFavorites ?? '—', icon: Star, color: 'amber', description: 'Your starred notes' },
    { id: 'users', label: 'Total Users', value: data?.totalUsers ?? '—', icon: Users, color: 'emerald', description: 'Registered accounts' },
    { id: 'active', label: 'Active Users', value: data?.totalActive ?? '—', icon: UserCheck, color: 'violet', description: 'Users with note access' },
  ];

  /* ── Bar chart data ─────────────────────────────────────────── */
  const barData: BarItem[] = data
    ? [
        { label: 'All Notes', value: data.totalNotes, color: '#6366f1', colorLight: '#eef2ff' },
        { label: 'Regular', value: Math.max(0, data.totalNotes - data.totalFavorites), color: '#0ea5e9', colorLight: '#e0f2fe' },
        { label: 'Favorites', value: data.totalFavorites, color: '#f59e0b', colorLight: '#fffbeb' },
        { label: 'Users', value: data.totalUsers, color: '#10b981', colorLight: '#ecfdf5' },
        { label: 'Active', value: data.totalActive, color: '#8b5cf6', colorLight: '#f5f3ff' },
      ]
    : [];
  const lineData: LineDataPoint[] = data ? buildWeeklyTrend(data.allNotes) : [];

  const skeleton = (h: string) => (
    <div className={`animate-pulse rounded-2xl bg-slate-100 ${h}`} />
  );

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="space-y-5">

      {/* ── Welcome banner ───────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 px-6 py-5 text-white shadow-lg shadow-indigo-200">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-6 right-20 h-24 w-24 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight">{greeting(user?.name)}</h1>
            <p className="mt-0.5 text-sm text-indigo-200">{today}</p>
            {data && (
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-indigo-300" />
                <span className="text-sm text-indigo-100">
                  You have <span className="font-bold text-white">{data.totalNotes}</span> notes,{' '}
                  <span className="font-bold text-white">{data.totalFavorites}</span> starred
                </span>
              </div>
            )}
          </div>

          {/* Refresh */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/25 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            {lastRefreshed && (
              <p className="text-[10px] text-indigo-300">
                Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i}>{skeleton('h-28')}</div>)
          : stats.map((stat, i) => (
              <div key={stat.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-in">
                <StatsCard stat={stat} />
              </div>
            ))}
      </div>

      {/* ── Charts row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="min-h-65">
          {loading ? skeleton('h-full min-h-[260px]') : (
            <BarChart
              data={barData}
              title="Notes Breakdown"
              subtitle="All notes, regular, favorites, and user stats"
            />
          )}
        </div>
        <div className="min-h-65">
          {loading ? skeleton('h-full min-h-[260px]') : (
            <LineChart
              data={lineData}
              title="Activity This Week"
              subtitle="Notes created per day over the last 7 days"
              color="#6366f1"
            />
          )}
        </div>
      </div>

      {/* ── Bottom row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {loading ? skeleton('h-72') : <RecentNotes notes={data?.recentNotes ?? []} />}
        </div>
        <div className="lg:col-span-2">
          {loading
            ? skeleton('h-72')
            : <ActiveUsers users={(data?.displayUsers ?? []).filter((u) => u.id !== user?.userId)} />}
        </div>
      </div>
    </div>
  );
}
