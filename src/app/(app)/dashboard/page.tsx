'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { FileText, Star, Users, UserCheck } from 'lucide-react';
import StatsCard, { type DashStat } from '@/components/dashboard/StatsCard';
import Insights, { type InsightInput } from '@/components/dashboard/Insights';
import RecentNotes from '@/components/dashboard/RecentNotes';
import ActiveUsers from '@/components/dashboard/ActiveUsers';
import BarChart, { type BarDataPoint } from '@/components/dashboard/BarChart';
import DonutChart, { type DonutSegment } from '@/components/dashboard/DonutChart';
import { noteService } from '@/lib/services/noteService';
import { userProfileService } from '@/lib/services/userProfileService';
import { useSession } from '@/lib/session';
import { useI18n } from '@/lib/i18n';
import type { NoteInfo, UserProfile } from '@/lib/types';

interface DashData {
  totalNotes: number;
  totalFavorites: number;
  totalUsers: number;
  totalActive: number;
  recentNotes: NoteInfo[];
  displayUsers: UserProfile[];
  allNotes: NoteInfo[];
  allUsers: UserProfile[];
  fetchedAt: number;
}

interface Dated { createdAt: string | null }

/** Year/month tuples for the last n months, oldest → newest. */
function lastNMonths(n: number): { year: number; month: number }[] {
  const now = new Date();
  return Array.from({ length: n }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
}

/** Cumulative count of items created on/before the end of each month → smooth growth sparkline. */
function cumulativeSeries(items: Dated[], n = 8): number[] {
  return lastNMonths(n).map(({ year, month }) => {
    const end = new Date(year, month + 1, 0, 23, 59, 59).getTime();
    return items.filter((it) => it.createdAt && new Date(it.createdAt).getTime() <= end).length;
  });
}

function newInMonth(items: Dated[], year: number, month: number): number {
  return items.filter((it) => {
    if (!it.createdAt) return false;
    const d = new Date(it.createdAt);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;
}

/** Month-over-month % change. Returns null when there's no prior-month baseline. */
function monthTrend(items: Dated[]): { change: number; positive: boolean } | null {
  const now = new Date();
  const cur = newInMonth(items, now.getFullYear(), now.getMonth());
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prev = newInMonth(items, prevDate.getFullYear(), prevDate.getMonth());
  if (prev === 0) return cur === 0 ? null : { change: 100, positive: true };
  const pct = Math.round(((cur - prev) / prev) * 1000) / 10;
  return { change: pct, positive: pct >= 0 };
}

/** Group notes by month for the last 8 months (bar chart). */
function buildMonthlyTrend(notes: NoteInfo[]): BarDataPoint[] {
  return lastNMonths(8).map(({ year, month }) => {
    const d = new Date(year, month, 1);
    const inMonth = (n: NoteInfo) => {
      if (!n.createdAt) return false;
      const nd = new Date(n.createdAt);
      return nd.getFullYear() === year && nd.getMonth() === month;
    };
    return {
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      primary: notes.filter(inMonth).length,
      secondary: notes.filter((n) => inMonth(n) && n.isFavorites).length,
    };
  });
}

async function fetchDashboard(userId: string): Promise<DashData> {
  const [notesRes, usersRes] = await Promise.allSettled([
    noteService.getNotes({ pageSize: 500, userId }),
    userProfileService.getProfiles({ pageSize: 0 }),
  ]);

  const notes = notesRes.status === 'fulfilled' ? notesRes.value.items : [];
  const users = usersRes.status === 'fulfilled' ? usersRes.value.items : [];

  const totalNotes = notesRes.status === 'fulfilled'
    ? Math.max(notesRes.value.totalCount, notes.length) : notes.length;
  const totalFavorites = notes.filter((n) => n.isFavorites).length;
  const totalUsers = usersRes.status === 'fulfilled'
    ? Math.max(usersRes.value.totalCount, users.length) : users.length;
  const totalActive = users.filter((u) => u.isNote).length;

  const sorted = [...notes].sort((a, b) =>
    new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

  return {
    totalNotes, totalFavorites, totalUsers, totalActive,
    recentNotes: sorted.slice(0, 8),
    displayUsers: users.slice(0, 6),
    allNotes: notes,
    allUsers: users,
    fetchedAt: Date.now(),
  };
}

export default function DashboardPage() {
  const { user } = useSession();
  const { t } = useI18n();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  const load = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const d = await fetchDashboard(user.userId);
      setData(d);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    if (user?.userId && !initialized.current) {
      initialized.current = true;
      load();
    }
  }, [user?.userId, load]);

  useEffect(() => {
    if (!user?.userId) return;
    const interval = setInterval(() => load(), 30_000);
    return () => clearInterval(interval);
  }, [user?.userId, load]);

  /* ── Derived series & trends (real data) ── */
  const favNotes   = data ? data.allNotes.filter((n) => n.isFavorites) : [];
  const activeUsers = data ? data.allUsers.filter((u) => u.isNote) : [];

  const trend = (items: Dated[]) => {
    const tr = monthTrend(items);
    return tr
      ? { change: tr.change, positive: tr.positive, description: t('stat.vs_last_month') }
      : { change: undefined, positive: undefined, description: undefined };
  };

  const stats: DashStat[] = [
    { id: 'notes',     label: t('stat.my_notes'),       value: data?.totalNotes     ?? '—', icon: FileText,  color: 'sky',     spark: data ? cumulativeSeries(data.allNotes) : undefined, ...(data ? trend(data.allNotes) : {}) },
    { id: 'favorites', label: t('stat.favorites'),      value: data?.totalFavorites ?? '—', icon: Star,      color: 'amber',   spark: data ? cumulativeSeries(favNotes)     : undefined, ...(data ? trend(favNotes) : {}) },
    { id: 'users',     label: t('stat.total_members'),  value: data?.totalUsers     ?? '—', icon: Users,     color: 'violet',  spark: data ? cumulativeSeries(data.allUsers) : undefined, ...(data ? trend(data.allUsers) : {}) },
    { id: 'active',    label: t('stat.active_members'), value: data?.totalActive    ?? '—', icon: UserCheck, color: 'rose',    spark: data ? cumulativeSeries(activeUsers)  : undefined, ...(data ? trend(activeUsers) : {}) },
  ];

  /* ── Insights (derived ratios) ── */
  const weekAgo = data ? data.fetchedAt - 7 * 86_400_000 : 0;
  const insights: InsightInput | null = data ? {
    favRate:     data.totalNotes > 0 ? (data.totalFavorites / data.totalNotes) * 100 : 0,
    activeRate:  data.totalUsers > 0 ? (data.totalActive / data.totalUsers) * 100 : 0,
    avgNotes:    data.totalUsers > 0 ? data.totalNotes / data.totalUsers : 0,
    newThisWeek: data.allNotes.filter((n) => n.createdAt && new Date(n.createdAt).getTime() >= weekAgo).length,
  } : null;

  /* ── Monthly bar chart data ── */
  const barData: BarDataPoint[] = data ? buildMonthlyTrend(data.allNotes) : [];

  /* ── Donut chart data ── */
  const donutData: DonutSegment[] = data
    ? [
        { label: t('chart.regular_notes'),  value: Math.max(0, data.totalNotes - data.totalFavorites), color: '#6366f1' },
        { label: t('chart.favorite_notes'), value: data.totalFavorites,                                 color: '#f59e0b' },
        { label: t('stat.active_members'),  value: data.totalActive,                                    color: '#10b981' },
        { label: t('chart.other_members'),  value: Math.max(0, data.totalUsers - data.totalActive),     color: '#f43f5e' },
      ].filter((s) => s.value > 0)
    : [];

  const skeleton = (h: string) => (
    <div className={`animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-700/50 ${h}`} />
  );

  return (
    <div className="space-y-5">

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i}>{skeleton('h-40')}</div>)
          : stats.map((stat, i) => (
              <div key={stat.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-in">
                <StatsCard stat={stat} />
              </div>
            ))}
      </div>

      {/* ── Insights strip ── */}
      {loading
        ? <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i}>{skeleton('h-28')}</div>)}</div>
        : insights && <Insights data={insights} />}

      {/* ── Row: Donut (left, narrow) + Monthly bar (right, wide) ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2 min-h-65">
          {loading ? skeleton('h-full min-h-65') : (
            <DonutChart
              data={donutData}
              title={t('chart.workspace_title')}
              subtitle={t('chart.workspace_sub')}
              centerLabel={t('chart.center')}
            />
          )}
        </div>
        <div className="lg:col-span-3 min-h-65">
          {loading ? skeleton('h-full min-h-65') : (
            <BarChart
              data={barData}
              title={t('chart.monthly_title')}
              subtitle={t('chart.monthly_subtitle')}
              primaryLabel={t('chart.notes')}
              secondaryLabel={t('stat.favorites')}
            />
          )}
        </div>
      </div>

      {/* ── Row: Recent notes + Active users ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {loading ? skeleton('h-72') : <RecentNotes notes={data?.recentNotes ?? []} renderTime={data?.fetchedAt ?? 0} />}
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
