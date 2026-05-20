'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  title: string;
  subtitle?: string;
  centerLabel?: string;
}

const CX = 80;
const CY = 80;
const R = 68;
const INNER_R = 46;
const GAP_DEG = 1.5;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildArcPath(outerR: number, startDeg: number, endDeg: number): string {
  const s = startDeg + GAP_DEG;
  const e = endDeg - GAP_DEG;
  if (e <= s) return '';
  const largeArc = e - s > 180 ? 1 : 0;
  const o1 = polarToXY(CX, CY, outerR, s);
  const o2 = polarToXY(CX, CY, outerR, e);
  const i1 = polarToXY(CX, CY, INNER_R, e);
  const i2 = polarToXY(CX, CY, INNER_R, s);
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

export default function DonutChart({ data, title, subtitle, centerLabel }: DonutChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Build segments without mutation — use reduce to accumulate angle
  const segments = data.reduce<
    Array<{ label: string; value: number; color: string; startDeg: number; endDeg: number; fraction: number }>
  >((acc, seg) => {
    const prev = acc[acc.length - 1];
    const startDeg = prev ? prev.endDeg : 0;
    const fraction = total > 0 ? seg.value / total : 0;
    const endDeg = startDeg + fraction * 360;
    return [...acc, { ...seg, startDeg, endDeg, fraction }];
  }, []);

  const hoveredSeg = hoveredIndex !== null ? segments[hoveredIndex] : null;

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function handleMouseLeave() {
    setHoveredIndex(null);
    setTooltip(null);
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-700 px-6 py-4">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
        )}
      </div>

      {/* Body */}
      <div ref={containerRef} className="relative flex flex-1 items-center gap-6 px-6 py-5">
        {/* SVG Donut */}
        <div className="shrink-0">
          <svg
            viewBox="0 0 160 160"
            width={160}
            height={160}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {segments.map((seg, i) => {
              const isHovered = hoveredIndex === i;
              const outerR = isHovered ? R + 5 : R;
              const path = buildArcPath(outerR, seg.startDeg, seg.endDeg);
              return path ? (
                <path
                  key={seg.label}
                  d={path}
                  fill={seg.color}
                  opacity={hoveredIndex === null ? 1 : isHovered ? 1 : 0.3}
                  style={{ transition: 'opacity 180ms ease' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  className="cursor-pointer"
                />
              ) : null;
            })}

            {/* Center text — idle */}
            {hoveredSeg === null && (
              <>
                <text
                  x={CX} y={CY + 7}
                  textAnchor="middle" fontSize={20} fontWeight={800}
                  className="fill-slate-900 dark:fill-slate-100"
                >
                  {total}
                </text>
                {centerLabel && (
                  <text x={CX} y={CY + 21} textAnchor="middle" fontSize={9} fill="#94a3b8">
                    {centerLabel}
                  </text>
                )}
              </>
            )}

            {/* Center text — hovered */}
            {hoveredSeg !== null && (
              <>
                <text
                  x={CX} y={CY + 4}
                  textAnchor="middle" fontSize={18} fontWeight={800}
                  className="fill-slate-900 dark:fill-slate-100"
                >
                  {Math.round(hoveredSeg.fraction * 100)}%
                </text>
                <text x={CX} y={CY + 18} textAnchor="middle" fontSize={9} fill="#94a3b8">
                  {hoveredSeg.label}
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-1 flex-col gap-2.5">
          {segments.map((seg, i) => {
            const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
            const isHovered = hoveredIndex === i;
            return (
              <div
                key={seg.label}
                className={cn(
                  'flex items-center gap-2 cursor-default transition-opacity duration-150',
                  hoveredIndex !== null && !isHovered ? 'opacity-35' : 'opacity-100',
                )}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={handleMouseLeave}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: seg.color }} />
                <span className="flex-1 text-xs text-slate-600 dark:text-slate-300 leading-none">
                  {seg.label}
                </span>
                <span className="text-xs font-semibold tabular-nums" style={{ color: seg.color }}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Floating tooltip */}
        {hoveredSeg !== null && tooltip !== null && (
          <div
            className="pointer-events-none absolute z-50 rounded-xl border border-slate-100 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2.5 shadow-xl"
            style={{
              left: tooltip.x + 14,
              top: tooltip.y - 40,
              transform: tooltip.x > 120 ? 'translateX(-110%)' : undefined,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: hoveredSeg.color }} />
              <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                {hoveredSeg.label}
              </span>
            </div>
            <div className="flex items-center gap-3 pl-4">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Count: <span className="font-bold text-slate-700 dark:text-slate-200">{hoveredSeg.value}</span>
              </span>
              <span
                className="text-[11px] font-bold"
                style={{ color: hoveredSeg.color }}
              >
                {Math.round(hoveredSeg.fraction * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
