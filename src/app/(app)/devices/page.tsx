'use client';

import { useMemo, useState } from 'react';
import { Gauge, Router, Zap, EyeOff, Eye, Pencil, Trash2 } from 'lucide-react';
import DataTable, { type Column, type RowAction } from '@/components/ui/DataTable';
import Pill from '@/components/ui/Pill';

interface Device {
  id: string;
  serial: string;
  group: string;
  company: string;
  model: string;
  type: 'SmartMeter' | 'Gateway';
  status: 'none' | 'active';
  connection: 'E-POWER' | 'none';
}

/* ── Sample data (first rows mirror the reference, rest generated) ── */
const SEED: Omit<Device, 'id'>[] = [
  { serial: 'តេស្ត១',         group: 'បន្ថែមក្រុម', company: '002 100Devices_In_Oone_Compy', model: '',     type: 'SmartMeter', status: 'none', connection: 'E-POWER' },
  { serial: 'តេស្ត Audit Trail', group: 'GS-01',   company: 'KN01 KN01', model: '',     type: 'SmartMeter', status: 'none', connection: 'E-POWER' },
  { serial: 'b324235',        group: '',           company: 'NA NA2',    model: '',     type: 'SmartMeter', status: 'none', connection: 'none' },
  { serial: 'SNA20',          group: '',           company: 'NA NA2',    model: '',     type: 'SmartMeter', status: 'none', connection: 'none' },
  { serial: 'SN023403',       group: '',           company: 'PP-WP PP-WP', model: '',   type: 'SmartMeter', status: 'none', connection: 'none' },
  { serial: 'SN0234',         group: 'CD01',       company: 'KN01 KN01', model: '',     type: 'SmartMeter', status: 'none', connection: 'none' },
  { serial: 'SN0102C1',       group: '',           company: 'NA NA2',    model: '',     type: 'SmartMeter', status: 'none', connection: 'none' },
  { serial: 'NKA0-1',         group: 'GS-01',      company: 'N/A N/A',   model: '',     type: 'SmartMeter', status: 'none', connection: 'none' },
  { serial: 'Ksdn230',        group: 'CD01',       company: 'KN01 KN01', model: '',     type: 'SmartMeter', status: 'none', connection: 'none' },
  { serial: 'KS09233',        group: 'GS-01',      company: 'N/A N/A',   model: '',     type: 'SmartMeter', status: 'none', connection: 'none' },
];

function buildDevices(): Device[] {
  const out: Device[] = SEED.map((d, i) => ({ ...d, id: `s-${i}` }));
  // Generated gateway rows to fill out pagination
  for (let i = 0; i < 65; i++) {
    const n = 96032 - i;
    out.push({
      id: `g-${i}`,
      serial: `GW2501${n}`,
      group: '',
      company: 'NA NA2',
      model: 'GW44',
      type: 'Gateway',
      status: 'none',
      connection: i % 7 === 0 ? 'E-POWER' : 'none',
    });
  }
  return out;
}

const ALL = buildDevices();

/* ── Cells ── */
function TypePill({ type }: { type: Device['type'] }) {
  return type === 'SmartMeter'
    ? <Pill tone="emerald" variant="solid" icon={Gauge}>SmartMeter</Pill>
    : <Pill tone="sky" variant="solid" icon={Router}>Gateway</Pill>;
}
function StatusPill({ status }: { status: Device['status'] }) {
  return status === 'active'
    ? <Pill tone="emerald" variant="soft">សកម្ម</Pill>
    : <Pill tone="slate" variant="soft" icon={EyeOff}>គ្មាន</Pill>;
}
function ConnPill({ connection }: { connection: Device['connection'] }) {
  return connection === 'E-POWER'
    ? <Pill tone="amber" variant="solid" icon={Zap}>E-POWER</Pill>
    : <Pill tone="slate" variant="soft" icon={EyeOff}>គ្មាន</Pill>;
}

const columns: Column<Device>[] = [
  { key: 'serial',     header: 'លេខសេរ៉',        width: '220px', sortable: true, sortAccessor: (r) => r.serial, render: (r) => <span className="font-semibold text-slate-800 dark:text-slate-100">{r.serial}</span> },
  { key: 'group',      header: 'ក្រុមឧបករណ៍',     width: '150px', render: (r) => <span className="text-slate-600 dark:text-slate-300">{r.group || '—'}</span> },
  { key: 'company',    header: 'ក្រុមហ៊ុន',        width: '210px', render: (r) => <span className="text-slate-600 dark:text-slate-300">{r.company}</span> },
  { key: 'model',      header: 'ម៉ូដែល',           width: '120px', render: (r) => <span className="text-slate-500 dark:text-slate-400">{r.model || '—'}</span> },
  { key: 'type',       header: 'ប្រភេទឧបករណ៍',    width: '170px', render: (r) => <TypePill type={r.type} /> },
  { key: 'status',     header: 'ស្ថានភាព',         width: '130px', render: (r) => <StatusPill status={r.status} /> },
  { key: 'connection', header: 'ស្ថានភាពតភ្ជាប់',  width: '160px', render: (r) => <ConnPill connection={r.connection} /> },
];

export default function DevicesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const totalPages = Math.max(1, Math.ceil(ALL.length / pageSize));
  const pageRows = useMemo(
    () => ALL.slice((page - 1) * pageSize, page * pageSize),
    [page, pageSize],
  );

  const rowActions = (): RowAction<Device>[] => [
    { label: 'View', icon: Eye },
    { label: 'Edit', icon: Pencil },
    { label: 'Delete', icon: Trash2, danger: true },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Devices</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500">Smart meters &amp; gateways · drag column headers to reorder</p>
      </div>

      <DataTable
        columns={columns}
        rows={pageRows}
        rowKey={(r) => r.id}
        rowActions={rowActions}
        selectable
        showIndex
        reorderable
        monospace
        initialSort={{ key: 'serial', dir: 'asc' }}
        pagination={{
          page,
          totalPages,
          pageSize,
          pageSizeOptions: [10, 25, 50, 100],
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          rowsPerPageLabel: 'ទិន្នន័យបង្ហាញ',
        }}
      />
    </div>
  );
}
