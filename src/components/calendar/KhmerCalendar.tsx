'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/lib/i18n';
import {
  getHolidaysForMonth,
  KHMER_HOLIDAYS,
  type KhmerHoliday,
  type HolidayType,
} from '@/lib/khmer-holidays';

// ── Constants ─────────────────────────────────────────────────────────────────

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
] as const;

const KM_MONTHS = [
  'មករា','កុម្ភៈ','មីនា','មេសា','ឧសភា','មិថុនា',
  'កក្កដា','សីហា','កញ្ញា','តុលា','វិច្ឆិកា','ធ្នូ',
] as const;

type TypeConfig = {
  label: string;
  labelKh: string;
  barBg: string;
  barText: string;
  badgeBg: string;
  badgeText: string;
  dot: string;
  ring: string;
};

const TYPE_CONFIG: Record<HolidayType, TypeConfig> = {
  public: {
    label: 'Public Holiday', labelKh: 'ថ្ងៃឈប់សម្រាក',
    barBg: 'bg-red-500', barText: 'text-white',
    badgeBg: 'bg-red-50 dark:bg-red-950/40', badgeText: 'text-red-700 dark:text-red-300',
    dot: '#ef4444', ring: 'ring-red-200 dark:ring-red-800/50',
  },
  buddhist: {
    label: 'Buddhist', labelKh: 'ពុទ្ធសាសនា',
    barBg: 'bg-amber-500', barText: 'text-white',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40', badgeText: 'text-amber-700 dark:text-amber-300',
    dot: '#f59e0b', ring: 'ring-amber-200 dark:ring-amber-800/50',
  },
  royal: {
    label: 'Royal', labelKh: 'ព្រះរាជ',
    barBg: 'bg-purple-500', barText: 'text-white',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40', badgeText: 'text-purple-700 dark:text-purple-300',
    dot: '#8b5cf6', ring: 'ring-purple-200 dark:ring-purple-800/50',
  },
  cultural: {
    label: 'Cultural', labelKh: 'វប្បធម៌',
    barBg: 'bg-emerald-500', barText: 'text-white',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40', badgeText: 'text-emerald-700 dark:text-emerald-300',
    dot: '#10b981', ring: 'ring-emerald-200 dark:ring-emerald-800/50',
  },
  international: {
    label: 'International', labelKh: 'អន្តរជាតិ',
    barBg: 'bg-blue-500', barText: 'text-white',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40', badgeText: 'text-blue-700 dark:text-blue-300',
    dot: '#3b82f6', ring: 'ring-blue-200 dark:ring-blue-800/50',
  },
  jewish: {
    label: 'Shabbat', labelKh: 'ថ្ងៃសប្ប័ត',
    barBg: 'bg-indigo-400', barText: 'text-white',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40', badgeText: 'text-indigo-700 dark:text-indigo-300',
    dot: '#818cf8', ring: 'ring-indigo-200 dark:ring-indigo-800/50',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDay  = new Date(year, month, 1).getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysCount; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);
  return cells;
}

function isoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getUpcomingHolidays(count = 5): KhmerHoliday[] {
  const today = new Date();
  const todayStr = isoDate(today.getFullYear(), today.getMonth(), today.getDate());
  return KHMER_HOLIDAYS.filter((h) => h.date >= todayStr).slice(0, count);
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TypeBadge({ type, small }: { type: HolidayType; small?: boolean }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <span className={cn(
      'inline-flex shrink-0 items-center gap-1 rounded-full font-semibold ring-1',
      cfg.badgeBg, cfg.badgeText, cfg.ring,
      small ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]',
    )}>
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function EventBar({ holiday, onClick }: { holiday: KhmerHoliday; onClick?: () => void }) {
  const cfg = TYPE_CONFIG[holiday.type];
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      title={holiday.name}
      className={cn(
        'w-full truncate rounded px-1.5 py-0.5 text-left text-[10px] font-medium leading-none transition-opacity hover:opacity-80',
        cfg.barBg, cfg.barText,
      )}
    >
      {holiday.nameKh}
    </button>
  );
}

function HolidayListItem({ holiday }: { holiday: KhmerHoliday }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] font-semibold leading-snug text-slate-800 dark:text-slate-100">
          {holiday.nameKh}
        </p>
        <TypeBadge type={holiday.type} small />
      </div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{holiday.name}</p>
      {holiday.description && (
        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed mt-0.5">
          {holiday.description}
        </p>
      )}
    </div>
  );
}

function UpcomingItem({ holiday, t }: { holiday: KhmerHoliday; t: (key: TranslationKey) => string }) {
  const cfg = TYPE_CONFIG[holiday.type];
  const days = daysUntil(holiday.date);
  const label = days === 0 ? t('calendar.today') : days === 1 ? t('calendar.tomorrow') : `${days}${t('calendar.days_short')}`;
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-xl text-white"
        style={{ backgroundColor: cfg.dot }}
      >
        <span className="text-[9px] font-semibold uppercase leading-none opacity-80">
          {new Date(holiday.date).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-sm font-bold leading-none">
          {new Date(holiday.date).getDate()}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] font-semibold text-slate-800 dark:text-slate-100">
          {holiday.nameKh}
        </p>
        <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{holiday.name}</p>
      </div>
      <span className={cn(
        'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
        days === 0
          ? 'bg-accent-100 dark:bg-accent-950/50 text-accent-700 dark:text-accent-400'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
      )}>
        {label}
      </span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function KhmerCalendar() {
  const { t } = useI18n();
  const today = new Date();

  const [viewYear,    setViewYear]    = useState(today.getFullYear());
  const [viewMonth,   setViewMonth]   = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const holidayMap    = getHolidaysForMonth(viewYear, viewMonth + 1);
  const cells         = buildCalendarGrid(viewYear, viewMonth);
  const firstDay      = new Date(viewYear, viewMonth, 1).getDay();
  const isCurrentView = today.getFullYear() === viewYear && today.getMonth() === viewMonth;

  const monthHolidays = useMemo(() => {
    const list: (KhmerHoliday & { day: number })[] = [];
    holidayMap.forEach((hs, d) => hs.forEach((h) => list.push({ ...h, day: d })));
    list.sort((a, b) => a.day - b.day);
    return list;
  }, [holidayMap]);

  const selectedHolidays = selectedDay != null ? (holidayMap.get(selectedDay) ?? []) : [];
  const upcomingHolidays = useMemo(() => getUpcomingHolidays(6), []);

  function goToPrevMonth() {
    setSelectedDay(null);
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else { setViewMonth((m) => m - 1); }
  }

  function goToNextMonth() {
    setSelectedDay(null);
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else { setViewMonth((m) => m + 1); }
  }

  function goToToday() {
    setSelectedDay(null);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }

  return (
    <div className="flex h-full gap-4 min-h-0">

      {/* ── Left: Calendar grid ── */}
      <div className="flex flex-1 min-w-0 flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/60 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrevMonth}
              aria-label="Previous month"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="text-center select-none min-w-40">
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-none">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-none">
                {KM_MONTHS[viewMonth]} {viewYear}
              </p>
            </div>

            <button
              type="button"
              onClick={goToNextMonth}
              aria-label="Next month"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Legend */}
            <div className="hidden xl:flex items-center gap-3">
              {(Object.entries(TYPE_CONFIG) as [HolidayType, TypeConfig][]).map(([type, cfg]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{cfg.label}</span>
                </div>
              ))}
            </div>

            {!isCurrentView && (
              <button
                type="button"
                onClick={goToToday}
                className="rounded-lg border border-slate-200 dark:border-slate-600 px-3 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('calendar.today')}
              </button>
            )}

            {monthHolidays.length > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-accent-50 dark:bg-accent-950/30 px-2.5 py-1 text-[10px] font-semibold text-accent-600 dark:text-accent-400 ring-1 ring-accent-100 dark:ring-accent-800/30">
                <CalendarDays className="h-3 w-3" />
                {monthHolidays.length} {monthHolidays.length !== 1 ? t('calendar.events') : t('calendar.month_events')}
              </span>
            )}
          </div>
        </div>

        {/* Weekday row */}
        <div className="grid shrink-0 grid-cols-7 border-b border-slate-100 dark:border-slate-700/60">
          {WEEKDAYS.map((day, i) => (
            <div
              key={day}
              className={cn(
                'flex items-center justify-center py-2.5 text-[11px] font-semibold uppercase tracking-wide select-none',
                i === 0 ? 'text-rose-400 dark:text-rose-500' : 'text-slate-400 dark:text-slate-500',
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid flex-1 min-h-0 grid-cols-7 grid-rows-6 divide-x divide-y divide-slate-100 dark:divide-slate-700/60 overflow-hidden">
          {cells.map((cell, index) => {
            if (cell === null) {
              const isPrevPad = index < firstDay;
              const padDay = isPrevPad
                ? new Date(viewYear, viewMonth, 0).getDate() - (firstDay - index - 1)
                : index - firstDay - new Date(viewYear, viewMonth + 1, 0).getDate() + 1;
              return (
                <div key={`pad-${index}`} className="min-h-0 p-1.5 bg-slate-50/50 dark:bg-slate-900/30">
                  <span className="block text-[12px] text-slate-300 dark:text-slate-600 select-none leading-none">
                    {padDay}
                  </span>
                </div>
              );
            }

            const isToday    = isCurrentView && cell === today.getDate();
            const isSelected = cell === selectedDay;
            const dayH       = holidayMap.get(cell) ?? [];
            const visible    = dayH.slice(0, 2);
            const extra      = dayH.length - visible.length;
            const isSunday   = new Date(viewYear, viewMonth, cell).getDay() === 0;

            return (
              <div
                key={`day-${cell}`}
                role="button"
                tabIndex={0}
                aria-label={`${MONTH_NAMES[viewMonth]} ${cell}`}
                aria-pressed={isSelected ? 'true' : 'false'}
                onClick={() => setSelectedDay(isSelected ? null : cell)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedDay(isSelected ? null : cell); } }}
                className={cn(
                  'group flex min-h-0 cursor-pointer flex-col gap-0.5 p-1.5 transition-colors duration-100 outline-none',
                  isSelected
                    ? 'bg-accent-50/80 dark:bg-accent-950/30 ring-inset ring-2 ring-accent-400/50 dark:ring-accent-500/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700/40',
                )}
              >
                {/* Day number */}
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold leading-none select-none transition-colors',
                      isToday
                        ? 'bg-(--color-accent-600) text-white shadow-sm'
                        : isSelected
                          ? 'text-accent-700 dark:text-accent-300'
                          : isSunday
                            ? 'text-rose-500 dark:text-rose-400'
                            : 'text-slate-700 dark:text-slate-200',
                    )}
                  >
                    {cell}
                  </span>
                  {dayH.length > 0 && (
                    <span className="flex gap-0.5">
                      {dayH.slice(0, 3).map((h, i) => (
                        <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TYPE_CONFIG[h.type].dot }} />
                      ))}
                    </span>
                  )}
                </div>

                {/* Event bars */}
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  {visible.map((h, i) => (
                    <EventBar
                      key={i}
                      holiday={h}
                      onClick={() => setSelectedDay(cell)}
                    />
                  ))}
                  {extra > 0 && (
                    <span className="px-1 text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                      +{extra} {t('calendar.more')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right: Events panel ── */}
      <div className="flex w-72 shrink-0 flex-col gap-3 overflow-hidden">

        {/* Selected day detail */}
        {selectedDay != null && (
          <div className="shrink-0 rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 dark:border-slate-700 px-4 py-3">
              <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                {MONTH_NAMES[viewMonth]} {selectedDay}, {viewYear}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            </div>
            <div className="p-3 space-y-2">
              {selectedHolidays.length > 0 ? (
                selectedHolidays.map((h, i) => <HolidayListItem key={i} holiday={h} />)
              ) : (
                <p className="py-3 text-center text-[12px] text-slate-400 dark:text-slate-500">
                  {t('calendar.no_events_day')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Month events */}
        <div className="flex flex-1 min-h-0 flex-col rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm overflow-hidden">
          <div className="shrink-0 border-b border-slate-100 dark:border-slate-700 px-4 py-3">
            <p className="text-[12px] font-bold text-slate-900 dark:text-slate-100">
              {MONTH_NAMES[viewMonth]} {t('calendar.month_events')}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              {monthHolidays.length} {monthHolidays.length !== 1 ? t('calendar.holidays') : t('calendar.holiday')} this month
            </p>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-1.5">
            {monthHolidays.length > 0 ? (
              monthHolidays.map((h, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDay(h.day)}
                  className={cn(
                    'w-full rounded-xl text-left px-3 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50',
                    selectedDay === h.day && 'bg-accent-50 dark:bg-accent-950/30',
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: TYPE_CONFIG[h.type].dot }}
                    >
                      <span className="text-[8px] font-bold uppercase leading-none opacity-80">
                        {MONTH_NAMES[viewMonth].slice(0, 3)}
                      </span>
                      <span className="text-[13px] font-bold leading-none">{h.day}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                        {h.nameKh}
                      </p>
                      <p className="truncate text-[10px] text-slate-400 dark:text-slate-500 leading-snug mt-0.5">
                        {h.name}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <CalendarDays className="h-8 w-8 text-slate-200 dark:text-slate-600" />
                <p className="text-[12px] text-slate-400 dark:text-slate-500">{t('calendar.no_holidays')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming holidays */}
        <div className="shrink-0 rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 dark:border-slate-700 px-4 py-3">
            <p className="text-[12px] font-bold text-slate-900 dark:text-slate-100">{t('calendar.upcoming')}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{t('calendar.next')} {upcomingHolidays.length} {t('calendar.events')}</p>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700/60 px-3">
            {upcomingHolidays.map((h, i) => (
              <UpcomingItem key={i} holiday={h} t={t} />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="shrink-0 rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">{t('calendar.legend')}</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {(Object.entries(TYPE_CONFIG) as [HolidayType, TypeConfig][]).map(([type, cfg]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate">{cfg.label}</p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">{cfg.labelKh}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
