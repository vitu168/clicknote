'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { FileText, Star, Users, UserCheck } from 'lucide-react';
import StatsCard, { type DashStat } from '@/components/dashboard/StatsCard';
import RecentNotes from '@/components/dashboard/RecentNotes';
import ActiveUsers from '@/components/dashboard/ActiveUsers';
import BarChart, { type BarDataPoint } from '@/components/dashboard/BarChart';
import DonutChart, { type DonutSegment } from '@/components/dashboard/DonutChart';
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


/** Group notes by month for the last 8 months */
function buildMonthlyTrend(notes: NoteInfo[]): BarDataPoint[] {
  const now = new Date();
  return Array.from({ length: 8 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (7 - i), 1);
    const label = d.toLocaleDateString('en-US', { month: 'short' });
    const yr = d.getFullYear();
    const mo = d.getMonth();
    const inMonth = (n: NoteInfo) => {
      if (!n.createdAt) return false;
      const nd = new Date(n.createdAt);
      return nd.getFullYear() === yr && nd.getMonth() === mo;
    };
    return {
      label,
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
  };
}

export default function DashboardPage() {
  const { user } = useSession();
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

  /* ── Stats ── */
  const stats: DashStat[] = [
    { id: 'notes',     label: 'My Notes',     value: data?.totalNotes     ?? '—', icon: FileText,  color: 'violet',  change: 6.3,  positive: true,  description: 'this month' },
    { id: 'favorites', label: 'Favorites',    value: data?.totalFavorites ?? '—', icon: Star,       color: 'amber',   change: 4.1,  positive: true,  description: 'this month' },
    { id: 'users',     label: 'Total Members',value: data?.totalUsers     ?? '—', icon: Users,      color: 'emerald', change: 6.3,  positive: true,  description: 'this month' },
    { id: 'active',    label: 'Active Members',value: data?.totalActive   ?? '—', icon: UserCheck,  color: 'rose',    change: -2.1, positive: false, description: 'this month' },
  ];

  /* ── Monthly bar chart data ── */
  const barData: BarDataPoint[] = data ? buildMonthlyTrend(data.allNotes) : [];

  /* ── Donut chart data ── */
  const donutData: DonutSegment[] = data
    ? [
        { label: 'Regular Notes',  value: Math.max(0, data.totalNotes - data.totalFavorites), color: '#6366f1' },
        { label: 'Favorite Notes', value: data.totalFavorites,                                 color: '#f59e0b' },
        { label: 'Active Members', value: data.totalActive,                                    color: '#10b981' },
        { label: 'Other Members',  value: Math.max(0, data.totalUsers - data.totalActive),     color: '#f43f5e' },
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
          ? Array.from({ length: 4 }).map((_, i) => <div key={i}>{skeleton('h-28')}</div>)
          : stats.map((stat, i) => (
              <div key={stat.id} style={{ animationDelay: `${i * 60}ms` }} className="animate-fade-in">
                <StatsCard stat={stat} />
              </div>
            ))}
      </div>

      {/* ── Row 2: Monthly bar + Donut ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3 min-h-65">
          {loading ? skeleton('h-full min-h-65') : (
            <BarChart
              data={barData}
              title="Monthly Notes Activity"
              subtitle="Notes created vs starred per month"
              primaryLabel="Notes"
              secondaryLabel="Favorites"
            />
          )}
        </div>
        <div className="lg:col-span-2 min-h-65">
          {loading ? skeleton('h-full min-h-65') : (
            <DonutChart
              data={donutData}
              title="Workspace Overview"
              subtitle="Note & member breakdown"
              centerLabel="Items"
            />
          )}
        </div>
      </div>

      {/* ── Row 3: Recent notes + Active users ── */}
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
