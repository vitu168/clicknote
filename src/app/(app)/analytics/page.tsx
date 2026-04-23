import type { Metadata } from 'next';
import { TrendingUp, Eye, MousePointerClick, Users } from 'lucide-react';
import { trafficSources, monthlyAnalytics, weeklyPageViews } from '@/lib/data';
import TrafficDonut from '@/components/analytics/TrafficDonut';
import MonthlyBarChart from '@/components/analytics/MonthlyBarChart';
import WeeklyLineChart from '@/components/analytics/WeeklyLineChart';

export const metadata: Metadata = { title: 'Analytics' };

const kpiCards = [
  { label: 'Total Visitors', value: '8,400', change: '+6.3%', icon: Users, color: 'bg-indigo-50 text-indigo-600' },
  { label: 'Page Views', value: '25,100', change: '+6.4%', icon: Eye, color: 'bg-blue-50 text-blue-600' },
  { label: 'Conversions', value: '272', change: '+6.3%', icon: MousePointerClick, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Bounce Rate', value: '38.2%', change: '-2.1%', icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.color}`}>
              <card.icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 leading-none">{card.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{card.label}</p>
              <p className="text-[11px] font-medium text-emerald-600 mt-0.5">{card.change} this month</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 animate-fade-in">
          <MonthlyBarChart data={monthlyAnalytics} />
        </div>
        <div className="animate-fade-in">
          <TrafficDonut sources={trafficSources} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="animate-fade-in">
        <WeeklyLineChart data={weeklyPageViews} />
      </div>

      {/* Top pages table */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm animate-fade-in">
        <div className="px-6 py-5 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-900">Top Pages</p>
          <p className="text-xs text-slate-400 mt-0.5">Most visited pages this month</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Page</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Views</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Unique</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">Avg. Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { page: '/dashboard', views: 4820, unique: 3210, time: '3m 42s' },
                { page: '/analytics', views: 3640, unique: 2890, time: '4m 18s' },
                { page: '/users', views: 2980, unique: 2140, time: '2m 55s' },
                { page: '/settings', views: 1840, unique: 1620, time: '1m 38s' },
                { page: '/docs', views: 1340, unique: 980, time: '5m 12s' },
              ].map((row) => (
                <tr key={row.page} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-sm text-indigo-600">{row.page}</td>
                  <td className="px-4 py-3.5 text-right font-medium text-slate-900">{row.views.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right text-slate-500 hidden md:table-cell">{row.unique.toLocaleString()}</td>
                  <td className="px-6 py-3.5 text-right text-slate-500 hidden lg:table-cell">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
