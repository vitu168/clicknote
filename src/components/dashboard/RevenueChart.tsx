'use client';

import type { RevenuePoint } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

interface RevenueChartProps {
  data: RevenuePoint[];
}

function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const cpX = ((points[i - 1][0] + points[i][0]) / 2).toFixed(2);
    d += ` C ${cpX} ${points[i - 1][1].toFixed(2)}, ${cpX} ${points[i][1].toFixed(2)}, ${points[i][0].toFixed(2)} ${points[i][1].toFixed(2)}`;
  }
  return d;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const W = 560;
  const H = 200;
  const pad = { top: 16, right: 16, bottom: 40, left: 56 };

  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const maxVal = Math.max(...data.map((d) => d.revenue));
  const yTicks = 4;

  const toX = (i: number) => pad.left + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => pad.top + chartH - (v / maxVal) * chartH;

  const linePoints: [number, number][] = data.map((d, i) => [toX(i), toY(d.revenue)]);
  const linePath = smoothPath(linePoints);

  const areaPath =
    linePath +
    ` L ${linePoints[linePoints.length - 1][0]} ${pad.top + chartH}` +
    ` L ${linePoints[0][0]} ${pad.top + chartH} Z`;

  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxVal / yTicks) * i),
  );

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-900">Sales Overview</p>
          <p className="text-xs text-slate-400 mt-0.5">Last 8 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            Revenue
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="px-4 pb-4 pt-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-80"
          aria-label="Revenue chart"
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTickValues.map((val) => {
            const y = toY(val);
            return (
              <g key={val}>
                <line
                  x1={pad.left}
                  y1={y}
                  x2={W - pad.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={pad.left - 8}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize="11"
                  fill="#94A3B8"
                >
                  {val >= 1000 ? `$${val / 1000}k` : `$${val}`}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={d.month}
              x={toX(i)}
              y={H - 10}
              textAnchor="middle"
              fontSize="11"
              fill="#94A3B8"
            >
              {d.month}
            </text>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#revenueGrad)" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points */}
          {linePoints.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="white" stroke="#6366F1" strokeWidth="2" />
              {/* Tooltip on last point */}
              {i === linePoints.length - 1 && (
                <g>
                  <rect
                    x={x - 36}
                    y={y - 30}
                    width="72"
                    height="22"
                    rx="6"
                    fill="#6366F1"
                  />
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill="white"
                  >
                    {formatCurrency(data[i].revenue)}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
