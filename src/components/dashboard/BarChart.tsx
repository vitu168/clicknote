'use client';

import { useRef, useState } from 'react';

export interface BarDataPoint {
  label: string;   // x-axis month name e.g. "Jan"
  primary: number;
  secondary: number;
}

interface BarChartProps {
  data: BarDataPoint[];
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const PAD = { top: 12, right: 12, bottom: 24, left: 34 };
const VIEW_W = 520;
const VIEW_H = 150;
const PLOT_W = VIEW_W - PAD.left - PAD.right;
const PLOT_H = VIEW_H - PAD.top - PAD.bottom;
const BAR_W = 13;
const BAR_GAP = 5;
const INTERVALS = 4; // → 5 gridlines

/** Clean, evenly-spaced integer axis: returns yMax divisible into `INTERVALS` nice steps. */
function niceScale(max: number): { yMax: number; step: number } {
  if (max <= 0) return { yMax: INTERVALS, step: 1 };
  const rawStep = max / INTERVALS;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  return { yMax: step * INTERVALS, step };
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

export default function BarChart({
  data,
  title,
  subtitle,
  primaryLabel = 'Notes',
  secondaryLabel = 'Favorites',
  primaryColor = 'var(--color-accent-500)',
  secondaryColor = 'var(--color-accent-300)',
}: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  const maxVal = Math.max(...data.flatMap((d) => [d.primary, d.secondary]), 0);
  const { yMax } = niceScale(maxVal);

  const slotW = data.length > 0 ? PLOT_W / data.length : PLOT_W;
  const pairW = BAR_W * 2 + BAR_GAP;

  const barY = (v: number) => PAD.top + PLOT_H - (v / yMax) * PLOT_H;
  const barH = (v: number) => Math.max(0, (v / yMax) * PLOT_H);

  const hovered = hoverIndex !== null ? data[hoverIndex] : null;

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }
  function handleLeave() {
    setHoverIndex(null);
    setTip(null);
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-700 px-6 py-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: primaryColor }} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{primaryLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: secondaryColor }} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{secondaryLabel}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div ref={containerRef} className="relative flex-1 px-4 py-3">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          style={{ height: VIEW_H, width: '100%' }}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          {/* Gridlines */}
          {Array.from({ length: INTERVALS + 1 }).map((_, i) => {
            const y = PAD.top + (PLOT_H / INTERVALS) * i;
            const isBaseline = i === INTERVALS;
            const gridValue = Math.round(yMax * (1 - i / INTERVALS));
            return (
              <g key={i}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={PAD.left + PLOT_W}
                  y2={y}
                  className={isBaseline ? 'stroke-slate-300 dark:stroke-slate-600' : 'stroke-slate-200/70 dark:stroke-slate-700/50'}
                  strokeWidth={1}
                  strokeDasharray={isBaseline ? undefined : '3 4'}
                />
                <text x={PAD.left - 8} y={y + 3.5} textAnchor="end" fontSize={10} className="fill-slate-400 dark:fill-slate-500">
                  {fmt(gridValue)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((point, i) => {
            const slotCX = PAD.left + i * slotW + slotW / 2;
            const primaryX = slotCX - pairW / 2;
            const secondaryX = primaryX + BAR_W + BAR_GAP;
            const isHovered = hoverIndex === i;
            const dim = hoverIndex !== null && !isHovered;

            return (
              <g key={point.label} onMouseEnter={() => setHoverIndex(i)} className="cursor-default">
                {/* Hover hit area */}
                <rect x={slotCX - slotW / 2} y={PAD.top} width={slotW} height={PLOT_H} fill="transparent" />
                {/* Hover column highlight */}
                {isHovered && (
                  <rect
                    x={slotCX - slotW / 2 + 2}
                    y={PAD.top}
                    width={slotW - 4}
                    height={PLOT_H}
                    rx={6}
                    className="fill-slate-100/70 dark:fill-slate-700/40"
                  />
                )}
                {/* Primary bar */}
                <rect
                  x={primaryX} y={barY(point.primary)} width={BAR_W} height={barH(point.primary)}
                  rx={3} fill={primaryColor}
                  opacity={dim ? 0.35 : 1} style={{ transition: 'opacity 150ms' }}
                />
                {/* Secondary bar */}
                <rect
                  x={secondaryX} y={barY(point.secondary)} width={BAR_W} height={barH(point.secondary)}
                  rx={3} fill={secondaryColor}
                  opacity={dim ? 0.35 : 1} style={{ transition: 'opacity 150ms' }}
                />
                {/* X-axis label */}
                <text
                  x={slotCX} y={PAD.top + PLOT_H + 16} textAnchor="middle" fontSize={10}
                  className={isHovered ? 'fill-slate-600 dark:fill-slate-300' : 'fill-slate-400 dark:fill-slate-500'}
                  fontWeight={isHovered ? 600 : 400}
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating HTML tooltip — theme-aware */}
        {hovered && tip && (
          <div
            className="pointer-events-none absolute z-50 min-w-36 rounded-xl border border-slate-100 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 shadow-xl"
            style={{
              left: tip.x + 14,
              top: Math.max(0, tip.y - 50),
              transform: tip.x > 260 ? 'translateX(-110%)' : undefined,
            }}
          >
            <p className="mb-1.5 text-[11px] font-semibold text-slate-800 dark:text-slate-100">{hovered.label}</p>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ background: primaryColor }} />
                {primaryLabel}
              </span>
              <span className="text-[11px] font-bold tabular-nums text-slate-700 dark:text-slate-200">{hovered.primary}</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ background: secondaryColor }} />
                {secondaryLabel}
              </span>
              <span className="text-[11px] font-bold tabular-nums text-slate-700 dark:text-slate-200">{hovered.secondary}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
