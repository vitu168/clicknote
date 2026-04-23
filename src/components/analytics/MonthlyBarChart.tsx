'use client';

interface DataPoint {
  month: string;
  visitors: number;
  pageViews: number;
}

interface MonthlyBarChartProps {
  data: DataPoint[];
}

export default function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const W = 520;
  const H = 200;
  const pad = { top: 20, right: 16, bottom: 36, left: 48 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const maxVal = Math.max(...data.map((d) => d.pageViews));
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxVal * f));

  const barGroupWidth = chartW / data.length;
  const barWidth = (barGroupWidth - 8) / 2;

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-900">Monthly Traffic</p>
          <p className="text-xs text-slate-400 mt-0.5">Visitors vs Page Views</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />Visitors
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-200" />Page Views
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-80"
          aria-label="Monthly traffic bar chart"
        >
          {/* Grid lines */}
          {yTicks.map((val) => {
            const y = pad.top + chartH - (val / maxVal) * chartH;
            return (
              <g key={val}>
                <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                <text x={pad.left - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#94A3B8">
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const groupX = pad.left + i * barGroupWidth + 4;
            const visitorsH = (d.visitors / maxVal) * chartH;
            const pageViewsH = (d.pageViews / maxVal) * chartH;

            return (
              <g key={d.month}>
                {/* Visitors bar */}
                <rect
                  x={groupX}
                  y={pad.top + chartH - visitorsH}
                  width={barWidth}
                  height={visitorsH}
                  rx="4"
                  fill="#6366F1"
                  className="hover:opacity-80 transition-opacity"
                />
                {/* PageViews bar */}
                <rect
                  x={groupX + barWidth + 3}
                  y={pad.top + chartH - pageViewsH}
                  width={barWidth}
                  height={pageViewsH}
                  rx="4"
                  fill="#C7D2FE"
                  className="hover:opacity-80 transition-opacity"
                />
                {/* Label */}
                <text
                  x={groupX + barWidth + 1}
                  y={H - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#94A3B8"
                >
                  {d.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
