'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronsUpDown, ChevronUp, ChevronDown, GripVertical,
  MoreHorizontal, ChevronLeft, ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RowTone = 'danger' | 'warning' | 'success' | null | undefined;

export interface Column<T> {
  key: string;
  header: ReactNode;
  /** CSS width for the column, e.g. "160px" or "20%". Omit to auto-size. */
  width?: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sortAccessor?: (row: T) => string | number;
  render?: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface RowAction<T> {
  label: string;
  icon?: LucideIcon;
  danger?: boolean;
  onClick?: (row: T) => void;
}

export interface PaginationConfig {
  page: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  rowsPerPageLabel?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  rowTone?: (row: T) => RowTone;
  selectable?: boolean;
  /** Show a 1-based row number column. */
  showIndex?: boolean;
  /** Per-row "⋯" actions menu. */
  rowActions?: (row: T) => RowAction<T>[];
  /** Show grip handles and allow drag-to-reorder columns. */
  reorderable?: boolean;
  pagination?: PaginationConfig;
  monospace?: boolean;
  stickyHeader?: boolean;
  onRowClick?: (row: T) => void;
  initialSort?: { key: string; dir: 'asc' | 'desc' };
  emptyMessage?: ReactNode;
  toolbar?: ReactNode;
  className?: string;
}

const toneRow: Record<NonNullable<RowTone>, string> = {
  danger:  'bg-rose-50/70 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30',
  warning: 'bg-amber-50/70 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30',
  success: 'hover:bg-slate-50 dark:hover:bg-slate-700/40',
};
const toneSquare: Record<NonNullable<RowTone>, string> = {
  danger:  'bg-rose-500',
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
};
const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' };

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      className="h-4 w-4 cursor-pointer rounded-sm border-slate-300 accent-(--color-accent-500) dark:border-slate-600"
    />
  );
}

function ActionsMenu<T>({ row, actions }: { row: T; actions: RowAction<T>[] }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 6, left: Math.min(r.left, window.innerWidth - 196) });
    setOpen((v) => !v);
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label="Row actions"
        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && pos && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left }}
          className="z-100 min-w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-700 dark:bg-slate-800"
        >
          {actions.map((a, i) => {
            const ActionIcon = a.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setOpen(false); a.onClick?.(row); }}
                className={cn(
                  'flex w-full items-center gap-2.5 px-3.5 py-2 text-left font-sans text-[13px] transition-colors',
                  a.danger
                    ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/60',
                )}
              >
                {ActionIcon && <ActionIcon className="h-4 w-4 shrink-0" />}
                {a.label}
              </button>
            );
          })}
        </div>,
        document.body,
      )}
    </>
  );
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  rowTone,
  selectable = false,
  showIndex = false,
  rowActions,
  reorderable = false,
  pagination,
  monospace = true,
  stickyHeader = true,
  onRowClick,
  initialSort,
  emptyMessage = 'No results.',
  toolbar,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(initialSort ?? null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [order, setOrder] = useState<string[]>(() => columns.map((c) => c.key));
  const [dragKey, setDragKey] = useState<string | null>(null);

  // Column order (gracefully handles added/removed columns).
  const orderedColumns = useMemo(() => {
    if (!reorderable) return columns;
    const byKey = new Map(columns.map((c) => [c.key, c]));
    const used = new Set<string>();
    const result: Column<T>[] = [];
    for (const k of order) { const c = byKey.get(k); if (c) { result.push(c); used.add(k); } }
    for (const c of columns) if (!used.has(c.key)) result.push(c);
    return result;
  }, [columns, order, reorderable]);

  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortAccessor) return rows;
    const acc = col.sortAccessor;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = acc(a); const bv = acc(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [rows, sort, columns]);

  function toggleSort(col: Column<T>) {
    if (!col.sortable) return;
    setSort((prev) =>
      prev?.key === col.key
        ? { key: col.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key: col.key, dir: 'asc' });
  }

  function dropOn(targetKey: string) {
    if (!dragKey || dragKey === targetKey) { setDragKey(null); return; }
    const keys = orderedColumns.map((c) => c.key);
    const from = keys.indexOf(dragKey);
    const to = keys.indexOf(targetKey);
    if (from === -1 || to === -1) { setDragKey(null); return; }
    keys.splice(to, 0, keys.splice(from, 1)[0]);
    setOrder(keys);
    setDragKey(null);
  }

  const allKeys = sortedRows.map(rowKey);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selected.has(k));
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(allKeys));
  const toggleOne = (key: string) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });

  const hasCheck = selectable || !!rowTone;
  const indexOffset = pagination ? (pagination.page - 1) * pagination.pageSize : 0;
  const leadingCount = (hasCheck ? 1 : 0) + (rowActions ? 1 : 0) + (showIndex ? 1 : 0);

  return (
    <div className={cn('overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm', className)}>
      {toolbar && (
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5 dark:border-slate-700">{toolbar}</div>
      )}

      <div className="overflow-x-auto">
        <table className={cn('w-full table-fixed border-collapse text-[13px]', monospace && 'font-mono')}>
          <colgroup>
            {hasCheck && <col style={{ width: '44px' }} />}
            {rowActions && <col style={{ width: '44px' }} />}
            {showIndex && <col style={{ width: '52px' }} />}
            {orderedColumns.map((c) => (
              <col key={c.key} style={c.width ? { width: c.width } : undefined} />
            ))}
          </colgroup>

          <thead className={cn(stickyHeader && 'sticky top-0 z-10')}>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/95 backdrop-blur">
              {hasCheck && (
                <th className="px-3 py-3">
                  {selectable
                    ? <Checkbox checked={allSelected} onChange={toggleAll} label="Select all rows" />
                    : <span className="sr-only">Status</span>}
                </th>
              )}
              {rowActions && <th className="px-3 py-3"><span className="sr-only">Actions</span></th>}
              {showIndex && <th className="px-3 py-3 text-center font-sans text-xs font-semibold text-slate-400 dark:text-slate-500">#</th>}
              {orderedColumns.map((col) => {
                const active = sort?.key === col.key;
                const dir = active ? sort!.dir : null;
                const label = (
                  <span className={cn('inline-flex items-center gap-1.5', col.align === 'right' && 'flex-row-reverse')}>
                    {reorderable && <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-slate-300 dark:text-slate-600" />}
                    {col.header}
                    {col.sortable && (
                      dir
                        ? (dir === 'asc'
                            ? <ChevronUp className="h-3.5 w-3.5 text-accent-500" />
                            : <ChevronDown className="h-3.5 w-3.5 text-accent-500" />)
                        : <ChevronsUpDown className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                    )}
                  </span>
                );
                return (
                  <th
                    key={col.key}
                    draggable={reorderable}
                    onDragStart={reorderable ? () => setDragKey(col.key) : undefined}
                    onDragOver={reorderable ? (e) => e.preventDefault() : undefined}
                    onDrop={reorderable ? () => dropOn(col.key) : undefined}
                    className={cn(
                      'px-4 py-3 font-sans text-xs font-semibold text-slate-600 dark:text-slate-300',
                      alignClass[col.align ?? 'left'],
                      reorderable && 'cursor-grab',
                      dragKey === col.key && 'opacity-40',
                      col.headerClassName,
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col)}
                        aria-label={`Sort by ${col.key}${dir ? `, currently ${dir === 'asc' ? 'ascending' : 'descending'}` : ''}`}
                        className={cn('inline-flex items-center gap-1.5 select-none rounded transition-colors hover:text-slate-900 dark:hover:text-slate-100', col.align === 'right' && 'flex-row-reverse')}
                      >
                        {label}
                      </button>
                    ) : label}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={orderedColumns.length + leadingCount} className="px-4 py-16 text-center font-sans text-sm text-slate-400 dark:text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedRows.map((row, i) => {
                const key = rowKey(row);
                const tone = rowTone?.(row) ?? null;
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'border-b border-slate-100 dark:border-slate-700/50 transition-colors last:border-0',
                      tone ? toneRow[tone] : 'hover:bg-slate-50 dark:hover:bg-slate-700/40',
                      onRowClick && 'cursor-pointer',
                    )}
                  >
                    {hasCheck && (
                      <td className="px-3 py-2.5">
                        <span className="flex items-center">
                          {tone
                            ? <span className={cn('h-3 w-3 rounded-sm', toneSquare[tone])} />
                            : selectable
                              ? <Checkbox checked={selected.has(key)} onChange={() => toggleOne(key)} label="Select row" />
                              : null}
                        </span>
                      </td>
                    )}
                    {rowActions && (
                      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <ActionsMenu row={row} actions={rowActions(row)} />
                      </td>
                    )}
                    {showIndex && (
                      <td className="px-3 py-2.5 text-center text-xs text-slate-400 tabular-nums dark:text-slate-500">
                        {indexOffset + i + 1}
                      </td>
                    )}
                    {orderedColumns.map((col) => (
                      <td
                        key={col.key}
                        className={cn('px-4 py-2.5 text-slate-700 dark:text-slate-200', alignClass[col.align ?? 'left'], col.className)}
                      >
                        <div className="truncate">
                          {col.render ? col.render(row) : col.sortAccessor?.(row)}
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && <PaginationFooter {...pagination} />}
    </div>
  );
}

function PaginationFooter({
  page, totalPages, pageSize, pageSizeOptions = [10, 25, 50, 100],
  onPageChange, onPageSizeChange, rowsPerPageLabel = 'Rows per page',
}: PaginationConfig) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 font-sans dark:border-slate-700">
      <div className="flex items-center gap-1.5">
        <NavBtn onClick={() => onPageChange(page - 1)} disabled={page <= 1} label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </NavBtn>
        <span className="px-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          <span className="font-semibold text-slate-700 dark:text-slate-200">{page}</span> / {totalPages}
        </span>
        <NavBtn onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} label="Next page">
          <ChevronRight className="h-4 w-4" />
        </NavBtn>
      </div>
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500">{rowsPerPageLabel}</span>
          <select
            value={pageSize}
            onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
            aria-label={rowsPerPageLabel}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:border-accent-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {pageSizeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

function NavBtn({ onClick, disabled, label, children }: { onClick: () => void; disabled: boolean; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
        disabled
          ? 'cursor-not-allowed border-slate-100 text-slate-300 dark:border-slate-700/50 dark:text-slate-600'
          : 'border-slate-200 text-slate-500 hover:border-accent-300 hover:text-accent-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-accent-600 dark:hover:text-accent-400',
      )}
    >
      {children}
    </button>
  );
}
