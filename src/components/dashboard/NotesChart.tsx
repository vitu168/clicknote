'use client';

interface Bar {
  label: string;
  value: number;
  color: string;
  bg: string;
}

export default function NotesChart({ total, favorites, users, activeUsers }: {
  total: number;
  favorites: number;
  users: number;
  activeUsers: number;
}) {
  const regular = Math.max(0, total - favorites);

  const bars: Bar[] = [
    { label: 'All Notes', value: total, color: 'bg-indigo-500', bg: 'bg-indigo-100' },
    { label: 'Regular', value: regular, color: 'bg-sky-500', bg: 'bg-sky-100' },
    { label: 'Favorites', value: favorites, color: 'bg-amber-400', bg: 'bg-amber-100' },
    { label: 'Total Users', value: users, color: 'bg-emerald-500', bg: 'bg-emerald-100' },
    { label: 'Active Users', value: activeUsers, color: 'bg-violet-500', bg: 'bg-violet-100' },
  ];

  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-900">Notes Overview</p>
        <p className="text-xs text-slate-400 mt-0.5">Breakdown of notes and users in your workspace</p>
      </div>
      <div className="px-6 py-5">
        {/* Bar chart */}
        <div className="flex items-end gap-4 h-40">
          {bars.map((bar) => {
            const pct = Math.round((bar.value / max) * 100);
            return (
              <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-700">{bar.value}</span>
                <div className={`w-full rounded-t-lg ${bar.bg} relative overflow-hidden`} style={{ height: '100px' }}>
                  <div
                    className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${bar.color} transition-all duration-700`}
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 text-center leading-tight">{bar.label}</span>
              </div>
            );
          })}
        </div>

        {/* Legend / ratio row */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Favorite Rate</p>
            <p className="mt-0.5 text-lg font-bold text-slate-900">
              {total > 0 ? `${Math.round((favorites / total) * 100)}%` : '—'}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Notes / User</p>
            <p className="mt-0.5 text-lg font-bold text-slate-900">
              {users > 0 ? (total / users).toFixed(1) : '—'}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">Active Rate</p>
            <p className="mt-0.5 text-lg font-bold text-slate-900">
              {users > 0 ? `${Math.round((activeUsers / users) * 100)}%` : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
