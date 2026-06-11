'use client';

import DataTable, { type Column, type RowTone } from '@/components/ui/DataTable';
import { cn } from '@/lib/utils';

interface LogRow {
  id: string;
  date: string;
  ts: number;
  status: number;
  method: 'GET' | 'POST';
  host: string;
  pathname: string;
  latency: number;
  regionCode: string;
  regionCity: string;
  phases: [number, number, number, number]; // dns · connect · ttfb · transfer
}

const REGIONS: [string, string][] = [
  ['ams', 'Amsterdam'],
  ['iad', 'Washington D.C.'],
  ['gru', 'Sao Paulo'],
  ['syd', 'Sydney'],
  ['fra', 'Frankfurt'],
  ['hkg', 'Hong Kong'],
];

/** Deterministic pseudo-random so the bars vary per row without Math.random. */
function phasesFor(i: number): [number, number, number, number] {
  const a = 8 + ((i * 7) % 14);
  const b = 14 + ((i * 11) % 26);
  const c = 18 + ((i * 13) % 30);
  const d = 30 + ((i * 5) % 40);
  return [a, b, c, d];
}

const ROWS: LogRow[] = (() => {
  const out: LogRow[] = [];
  const blocks = [
    { hour: '14:04:10', method: 'POST' as const, host: 'api.acme-shop.com', path: '/v1/customers', statuses: [200, 200, 200, 200, 200, 200] },
    { hour: '13:04:10', method: 'POST' as const, host: 'api.acme-shop.com', path: '/v1/customers', statuses: [200, 404, 200, 200, 200, 500] },
    { hour: '12:04:10', method: 'GET' as const,  host: 'acme-shop.com',     path: '/bikes/city/cargo-electric', statuses: [200, 200, 200, 200, 200, 200] },
    { hour: '11:04:10', method: 'GET' as const,  host: 'acme-shop.com',     path: '/bikes/racing/tour-pro', statuses: [200, 200, 200, 200, 200, 200] },
  ];
  const lat = [1000, 770, 1345, 1172, 885, 1230];
  let ts = blocks.length * 100;
  blocks.forEach((b, bi) => {
    b.statuses.forEach((status, ri) => {
      const [code, city] = REGIONS[ri % REGIONS.length];
      const i = bi * 6 + ri;
      out.push({
        id: `${bi}-${ri}`,
        date: `Jan 30, 2025 ${b.hour}`,
        ts: ts--,
        status,
        method: b.method,
        host: b.host,
        pathname: b.path,
        latency: lat[ri] + bi * 2 - (status >= 400 ? 2 : 0),
        regionCode: code,
        regionCity: city,
        phases: phasesFor(i),
      });
    });
  });
  return out;
})();

/* ── Cell components ── */

function StatusText({ status }: { status: number }) {
  const color =
    status >= 500 ? 'text-rose-600 dark:text-rose-400'
    : status >= 400 ? 'text-amber-600 dark:text-amber-400'
    : 'text-emerald-600 dark:text-emerald-400';
  return <span className={cn('font-semibold tabular-nums', color)}>{status}</span>;
}

function Latency({ ms }: { ms: number }) {
  return (
    <span className="tabular-nums text-slate-700 dark:text-slate-200">
      {ms.toLocaleString('en-US')}
      <span className="text-slate-400 dark:text-slate-500">ms</span>
    </span>
  );
}

function Region({ code, city }: { code: string; city: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="font-semibold text-slate-700 dark:text-slate-200">{code}</span>
      <span className="truncate font-sans text-slate-400 dark:text-slate-500">{city}</span>
    </span>
  );
}

const PHASE_COLORS = ['bg-emerald-400', 'bg-cyan-400', 'bg-blue-500', 'bg-violet-400'];
const PHASE_LABELS = ['DNS', 'Connect', 'TTFB', 'Transfer'];

function TimingPhases({ phases }: { phases: number[] }) {
  const total = phases.reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700" title={PHASE_LABELS.join(' · ')}>
      {phases.map((p, i) => (
        <div
          key={i}
          className={PHASE_COLORS[i % PHASE_COLORS.length]}
          style={{ width: `${(p / total) * 100}%` }}
        />
      ))}
    </div>
  );
}

/* ── Columns ── */

const columns: Column<LogRow>[] = [
  { key: 'date', header: 'Date', width: '186px', sortable: true, sortAccessor: (r) => r.ts, render: (r) => <span className="text-slate-700 dark:text-slate-200">{r.date}</span> },
  { key: 'status', header: 'Status', width: '92px', sortable: true, sortAccessor: (r) => r.status, render: (r) => <StatusText status={r.status} /> },
  { key: 'method', header: 'Method', width: '84px', render: (r) => <span className="text-slate-500 dark:text-slate-400">{r.method}</span> },
  { key: 'host', header: 'Host', width: '150px', render: (r) => <span className="text-slate-700 dark:text-slate-200">{r.host}</span> },
  { key: 'pathname', header: 'Pathname', width: '150px', render: (r) => <span className="text-slate-700 dark:text-slate-200">{r.pathname}</span> },
  { key: 'latency', header: 'Latency', width: '108px', sortable: true, sortAccessor: (r) => r.latency, render: (r) => <Latency ms={r.latency} /> },
  { key: 'region', header: 'Region', width: '190px', render: (r) => <Region code={r.regionCode} city={r.regionCity} /> },
  { key: 'timing', header: 'Timing Phases', render: (r) => <TimingPhases phases={r.phases} /> },
];

function rowTone(r: LogRow): RowTone {
  if (r.status >= 500) return 'danger';
  if (r.status >= 400) return 'warning';
  return null;
}

export default function LogsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Request Logs</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500">Edge requests across all regions · sortable, selectable</p>
      </div>

      <DataTable
        columns={columns}
        rows={ROWS}
        rowKey={(r) => r.id}
        rowTone={rowTone}
        selectable
        monospace
        initialSort={{ key: 'date', dir: 'asc' }}
      />
    </div>
  );
}
