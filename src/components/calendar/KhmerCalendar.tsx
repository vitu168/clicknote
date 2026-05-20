'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getHolidaysForMonth,
  getHolidaysForDate,
  type KhmerHoliday,
  type HolidayType,
} from '@/lib/khmer-holidays';

// ── Constants ────────────────────────────────────────────────────────────────

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

const TYPE_COLOR: Record<HolidayType, string> = {
  public:        '#ef4444',
  buddhist:      '#f59e0b',
  royal:         '#8b5cf6',
  cultural:      '#10b981',
  international: '#3b82f6',
};

const TYPE_LABEL: Record<HolidayType, string> = {
  public:        'Public',
  buddhist:      'Buddhist',
  royal:         'Royal',
  cultural:      'Cultural',
  international: 'International',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  // month is 0-based here (JS Date convention)
  const firstDay  = new Date(year, month, 1).getDay(); // 0=Sun
  const daysCount = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];

  // Pad start
  for (let i = 0; i < firstDay; i++) cells.push(null);
  // Fill days
  for (let d = 1; d <= daysCount; d++) cells.push(d);
  // Pad end to fill 6 rows
  while (cells.length < 42) cells.push(null);

  return cells;
}

function prevMonthDay(year: number, month: number, offset: number): number {
  // offset = position from end of previous month (1-based)
  return new Date(year, month, 0).getDate() - offset + 1;
}

function nextMonthDay(index: number): number {
  return index + 1;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function HolidayDots({ holidays }: { holidays: KhmerHoliday[] }) {
  const visible = holidays.slice(0, 3);
  return (
    <div className="flex items-center justify-center gap-0.5 mt-0.5">
      {visible.map((h, i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full shrink-0"
          style={{ backgroundColor: TYPE_COLOR[h.type] }}
        />
      ))}
    </div>
  );
}

function HolidayBadge({ type }: { type: HolidayType }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold text-white shrink-0"
      style={{ backgroundColor: TYPE_COLOR[type] }}
    >
      {TYPE_LABEL[type]}
    </span>
  );
}

function HolidayPanel({
  date,
  holidays,
  onClose,
}: {
  date: Date;
  holidays: KhmerHoliday[];
  onClose: () => void;
}) {
  const label = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 ring-1 ring-slate-200 dark:ring-slate-600/50 p-4">
      {/* Panel header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
          {label}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Holiday list */}
      <ul className="space-y-2.5">
        {holidays.map((h, i) => (
          <li key={i} className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <HolidayBadge type={h.type} />
              <span className="text-[13px] font-medium text-slate-800 dark:text-slate-100">
                {h.nameKh}
              </span>
            </div>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug">
              {h.name}
            </p>
            {h.description && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-snug">
                {h.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function KhmerCalendar() {
  const today = new Date();

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-based
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Holiday map for the current view month (1-based month for the helper)
  const holidayMap = getHolidaysForMonth(viewYear, viewMonth + 1);

  // Calendar grid cells: null = padding cell, number = day of month
  const cells = buildCalendarGrid(viewYear, viewMonth);

  // Navigation
  function goToPrevMonth() {
    setSelectedDay(null);
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else { setViewMonth(m => m - 1); }
  }

  function goToNextMonth() {
    setSelectedDay(null);
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else { setViewMonth(m => m + 1); }
  }

  function goToToday() {
    setSelectedDay(null);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }

  function handleDayClick(day: number) {
    if (selectedDay === day) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  }

  // Selected day details
  const selectedDate   = selectedDay != null ? new Date(viewYear, viewMonth, selectedDay) : null;
  const selectedHolidays = selectedDate ? getHolidaysForDate(selectedDate) : [];

  // Is today in the current view?
  const isCurrentMonthView =
    today.getFullYear() === viewYear && today.getMonth() === viewMonth;

  // How many padding cells at the start
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-2 px-5 py-4 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToPrevMonth}
            aria-label="Previous month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="min-w-[140px] text-center text-[15px] font-semibold text-slate-900 dark:text-white select-none">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h2>
          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Next month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {!isCurrentMonthView && (
          <button
            type="button"
            onClick={goToToday}
            className="rounded-lg px-3 py-1 text-[12px] font-medium text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Today
          </button>
        )}
      </div>

      {/* ── Calendar body ── */}
      <div className="p-4">
        {/* Weekday header row */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="flex items-center justify-center py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 select-none"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((cell, index) => {
            if (cell === null) {
              // Padding cell — show faded day number from adjacent month
              const isPrevPad = index < firstDay;
              const padDay = isPrevPad
                ? prevMonthDay(viewYear, viewMonth, firstDay - index - 1)
                : nextMonthDay(index - firstDay - new Date(viewYear, viewMonth + 1, 0).getDate());

              return (
                <div
                  key={`pad-${index}`}
                  className="flex h-10 items-start justify-center pt-1.5"
                >
                  <span className="text-[13px] text-slate-300 dark:text-slate-600 select-none">
                    {padDay}
                  </span>
                </div>
              );
            }

            const isToday        = isCurrentMonthView && cell === today.getDate();
            const isSelected     = cell === selectedDay;
            const dayHolidays    = holidayMap.get(cell) ?? [];
            const hasHolidays    = dayHolidays.length > 0;

            return (
              <div
                key={`day-${cell}`}
                role="button"
                tabIndex={0}
                aria-label={`${MONTH_NAMES[viewMonth]} ${cell}, ${viewYear}${hasHolidays ? ` – ${dayHolidays.length} holiday${dayHolidays.length > 1 ? 's' : ''}` : ''}`}
                aria-pressed={isSelected}
                onClick={() => handleDayClick(cell)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleDayClick(cell); } }}
                className={cn(
                  'flex flex-col items-center justify-start pt-1 h-10 cursor-pointer rounded-xl transition-colors duration-100 select-none',
                  isSelected
                    ? 'ring-2 ring-accent-400 dark:ring-accent-400 bg-slate-50 dark:bg-slate-700/50'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/50',
                )}
              >
                {/* Day number */}
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-medium leading-none transition-colors',
                    isToday
                      ? 'bg-[var(--color-accent-600)] text-white font-semibold'
                      : isSelected
                        ? 'text-accent-700 dark:text-accent-300'
                        : 'text-slate-700 dark:text-slate-200',
                  )}
                >
                  {cell}
                </span>

                {/* Holiday indicator dots */}
                {hasHolidays && <HolidayDots holidays={dayHolidays} />}
              </div>
            );
          })}
        </div>

        {/* ── Legend ── */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-100 dark:border-slate-700/60 pt-4">
          {(Object.entries(TYPE_COLOR) as [HolidayType, string][]).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                {TYPE_LABEL[type]}
              </span>
            </div>
          ))}
        </div>

        {/* ── Holiday detail panel ── */}
        {selectedDate && selectedHolidays.length > 0 && (
          <HolidayPanel
            date={selectedDate}
            holidays={selectedHolidays}
            onClose={() => setSelectedDay(null)}
          />
        )}
      </div>
    </div>
  );
}
