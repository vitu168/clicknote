'use client';

import { useState } from 'react';

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

const PAD = { top: 28, right: 16, bottom: 30, left: 44 };
const VIEW_W = 520;
const VIEW_H = 200;
const PLOT_W = VIEW_W - PAD.left - PAD.right;
const PLOT_H = VIEW_H - PAD.top - PAD.bottom;
const BAR_W = 14;
const BAR_GAP = 4;
const GRID_LINES = 5;

function niceMax(value: number): number {
  if (value <= 0) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const candidates = [1, 2, 5, 10].map((m) => m * magnitude);
  for (const c of candidates) {
    if (c >= value) return c;
  }
  return candidates[candidates.length - 1];
}

function fmt(n: number): string {
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

export default function BarChart({
  data,
  title,
  subtitle,
  primaryLabel = 'Notes',
  secondaryLabel = 'Favorites',
  primaryColor = '#6366f1',
  secondaryColor = '#a5b4fc',
}: BarChartProps) {
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const allValues = data.flatMap((d) => [d.primary, d.secondary]);
  const maxVal = Math.max(...allValues, 1);
  const yMax = niceMax(maxVal);

  // X spacing: evenly divide PLOT_W among data points
  const slotW = data.length > 0 ? PLOT_W / data.length : PLOT_W;
  // pair width
  const pairW = BAR_W * 2 + BAR_GAP;

  function barY(value: number): number {
    return PAD.top + PLOT_H - (value / yMax) * PLOT_H;
  }

  function barH(value: number): number {
    return (value / yMax) * PLOT_H;
  }

  // Tooltip position
  const tooltipDatum = tooltipIndex !== null ? data[tooltipIndex] : null;
  let tooltipX = 0;
  let tooltipY = 0;
  if (tooltipIndex !== null) {
    const slotCX = PAD.left + tooltipIndex * slotW + slotW / 2;
    tooltipX = slotCX - 44;
    tooltipY = PAD.top - 4;
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
          )}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: primaryColor }}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">{primaryLabel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: secondaryColor }}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">{secondaryLabel}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 px-4 py-3">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          style={{ height: 200, width: '100%' }}
          onMouseLeave={() => setTooltipIndex(null)}
        >
          {/* Gridlines */}
          {Array.from({ length: GRID_LINES }).map((_, i) => {
            const y = PAD.top + (PLOT_H / (GRID_LINES - 1)) * i;
            const isBaseline = i === GRID_LINES - 1;
            const gridValue = Math.round(yMax * (1 - i / (GRID_LINES - 1)));
            return (
              <g key={i}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={PAD.left + PLOT_W}
                  y2={y}
                  stroke={isBaseline ? '#94a3b8' : '#e2e8f0'}
                  strokeWidth={isBaseline ? 1.5 : 1}
                  strokeDasharray={isBaseline ? undefined : '4 4'}
                />
                <text
                  x={PAD.left - 6}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={10}
                  fill="#94a3b8"
                >
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
            const isHovered = tooltipIndex === i;

            return (
              <g
                key={point.label}
                onMouseEnter={() => setTooltipIndex(i)}
                className="cursor-default"
              >
                {/* Hover hit area */}
                <rect
                  x={slotCX - slotW / 2}
                  y={PAD.top}
                  width={slotW}
                  height={PLOT_H}
                  fill="transparent"
                />
                {/* Primary bar */}
                <rect
                  x={primaryX}
                  y={barY(point.primary)}
                  width={BAR_W}
                  height={barH(point.primary)}
                  rx={3}
                  fill={primaryColor}
                  opacity={tooltipIndex !== null && !isHovered ? 0.4 : 1}
                  style={{ transition: 'opacity 150ms' }}
                />
                {/* Secondary bar */}
                <rect
                  x={secondaryX}
                  y={barY(point.secondary)}
                  width={BAR_W}
                  height={barH(point.secondary)}
                  rx={3}
                  fill={secondaryColor}
                  opacity={tooltipIndex !== null && !isHovered ? 0.4 : 1}
                  style={{ transition: 'opacity 150ms' }}
                />
                {/* X-axis label */}
                <text
                  x={slotCX}
                  y={PAD.top + PLOT_H + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill={isHovered ? '#475569' : '#94a3b8'}
                  fontWeight={isHovered ? 600 : 400}
                >
                  {point.label}
                </text>
              </g>
            );
          })}

          {/* Tooltip */}
          {tooltipDatum !== null && (
            <g style={{ pointerEvents: 'none' }}>
              {/* Drop shadow filter */}
              <defs>
                <filter id="tooltip-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000020" />
                </filter>
              </defs>
              <rect
                x={tooltipX}
                y={tooltipY}
                width={88}
                height={52}
                rx={6}
                fill="white"
                filter="url(#tooltip-shadow)"
              />
              {/* Primary row */}
              <circle cx={tooltipX + 10} cy={tooltipY + 16} r={4} fill={primaryColor} />
              <text
                x={tooltipX + 18}
                y={tooltipY + 20}
                fontSize={10}
                fill="#64748b"
              >
                {primaryLabel}
              </text>
              <text
                x={tooltipX + 82}
                y={tooltipY + 20}
                fontSize={10}
                fontWeight={700}
                fill="#1e293b"
                textAnchor="end"
              >
                {tooltipDatum.primary}
              </text>
              {/* Secondary row */}
              <circle cx={tooltipX + 10} cy={tooltipY + 36} r={4} fill={secondaryColor} />
              <text
                x={tooltipX + 18}
                y={tooltipY + 40}
                fontSize={10}
                fill="#64748b"
              >
                {secondaryLabel}
              </text>
              <text
                x={tooltipX + 82}
                y={tooltipY + 40}
                fontSize={10}
                fontWeight={700}
                fill="#1e293b"
                textAnchor="end"
              >
                {tooltipDatum.secondary}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
