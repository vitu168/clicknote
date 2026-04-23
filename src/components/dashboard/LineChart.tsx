'use client';

import { useState } from 'react';

export interface LineDataPoint {
  label: string;
  value: number;
}

export default function LineChart({
  data,
  title,
  subtitle,
  color = '#6366f1',
}: {
  data: LineDataPoint[];
  title: string;
  subtitle?: string;
  color?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const W = 500;
  const H = 140;
  const PAD = { top: 24, right: 20, bottom: 28, left: 28 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  const max = Math.max(...data.map((d) => d.value), 1);
  const n = data.length;
  const xStep = n > 1 ? cW / (n - 1) : cW;

  const toX = (i: number) => PAD.left + i * xStep;
  const toY = (v: number) => PAD.top + cH - (v / max) * cH;

  const pts = data.map((d, i) => ({ ...d, x: toX(i), y: toY(d.value) }));

  // Smooth cubic bezier path
  function curvePath(points: { x: number; y: number }[]): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX = (prev.x + curr.x) / 2;
      d += ` C ${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
  }

  const linePath = curvePath(pts);

  // Area path (closed under the line)
  const areaPath =
    pts.length > 0
      ? `M ${pts[0].x},${PAD.top + cH} ${linePath.slice(1)} L ${pts[pts.length - 1].x},${PAD.top + cH} Z`
      : '';

  const gradId = `lg-${color.replace('#', '')}`;

  // Y-axis tick values
  const yTicks = [0, Math.round(max / 2), max];

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex-1 px-4 pb-4 pt-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 160 }}
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {yTicks.map((v) => {
            const y = toY(v);
            return (
              <g key={v}>
                <line
                  x1={PAD.left} y1={y}
                  x2={W - PAD.right} y2={y}
                  stroke="#f1f5f9" strokeWidth={1}
                />
                <text x={PAD.left - 5} y={y + 4} textAnchor="end" fontSize={9} fill="#cbd5e1">
                  {v}
                </text>
              </g>
            );
          })}

          {/* Area */}
          <path d={areaPath} fill={`url(#${gradId})`} />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points + hover targets */}
          {pts.map((p, i) => (
            <g key={i}>
              {/* Invisible wide hit area */}
              <rect
                x={p.x - 20} y={PAD.top}
                width={40} height={cH + 4}
                fill="transparent"
                onMouseEnter={() => setHovered(i)}
              />
              {/* Dot */}
              <circle
                cx={p.x} cy={p.y}
                r={hovered === i ? 5.5 : 3.5}
                fill={hovered === i ? color : '#fff'}
                stroke={color}
                strokeWidth={2}
                style={{ transition: 'r 0.15s ease' }}
              />
            </g>
          ))}

          {/* Tooltip */}
          {hovered !== null && (() => {
            const p = pts[hovered];
            const tx = Math.min(Math.max(p.x, PAD.left + 24), W - PAD.right - 24);
            return (
              <g pointerEvents="none">
                <line
                  x1={p.x} y1={PAD.top - 4}
                  x2={p.x} y2={PAD.top + cH}
                  stroke={color} strokeWidth={1.5} strokeDasharray="4,3" opacity={0.45}
                />
                <rect x={tx - 26} y={PAD.top - 18} width={52} height={22} rx={7} fill={color} />
                <text x={tx} y={PAD.top - 3} textAnchor="middle" fontSize={11} fill="white" fontWeight="700">
                  {p.value}
                </text>
              </g>
            );
          })()}

          {/* X axis labels */}
          {pts.map((p, i) => (
            <text
              key={i} x={p.x} y={H - 4}
              textAnchor="middle" fontSize={9.5}
              fill={hovered === i ? color : '#94a3b8'}
              fontWeight={hovered === i ? '700' : '400'}
              style={{ transition: 'fill 0.15s' }}
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
