'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function Pagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  if (totalCount === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3 px-1 pt-1', className)}>
      {/* Left: rows per page + count */}
      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 select-none">
              Rows per page
            </span>
            <select
              value={pageSize}
              onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
              className="h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 text-[12px] text-slate-700 dark:text-slate-300 focus:outline-none focus:border-accent-400 cursor-pointer"
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
        <span className="text-[11px] text-slate-400 dark:text-slate-500 select-none">
          Showing <span className="font-medium text-slate-600 dark:text-slate-300">{from}–{to}</span> of{' '}
          <span className="font-medium text-slate-600 dark:text-slate-300">{totalCount}</span> records
        </span>
      </div>

      {/* Right: page controls */}
      <div className="flex items-center gap-1">
        <span className="mr-1.5 text-[11px] text-slate-400 dark:text-slate-500 select-none">
          Page <span className="font-medium text-slate-600 dark:text-slate-300">{page}</span> of{' '}
          <span className="font-medium text-slate-600 dark:text-slate-300">{totalPages}</span>
        </span>

        <NavBtn onClick={() => onPageChange(1)} disabled={page <= 1} label="First page">
          <ChevronsLeft className="h-3.5 w-3.5" />
        </NavBtn>
        <NavBtn onClick={() => onPageChange(page - 1)} disabled={page <= 1} label="Previous page">
          <ChevronLeft className="h-3.5 w-3.5" />
        </NavBtn>
        <NavBtn onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} label="Next page">
          <ChevronRight className="h-3.5 w-3.5" />
        </NavBtn>
        <NavBtn onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} label="Last page">
          <ChevronsRight className="h-3.5 w-3.5" />
        </NavBtn>
      </div>
    </div>
  );
}

function NavBtn({ onClick, disabled, label, children }: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-lg border transition-colors',
        disabled
          ? 'border-slate-100 dark:border-slate-700/50 text-slate-300 dark:text-slate-600 cursor-not-allowed'
          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-accent-300 hover:text-accent-600 dark:hover:border-accent-600 dark:hover:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-950/20',
      )}
    >
      {children}
    </button>
  );
}
