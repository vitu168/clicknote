'use client';

interface WeekDataPoint {
  day: string;
  views: number;
}

interface WeeklyLineChartProps {
  data: WeekDataPoint[];
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

export default function WeeklyLineChart({ data }: WeeklyLineChartProps) {
  const W = 520;
  const H = 180;
  const pad = { top: 16, right: 16, bottom: 32, left: 48 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;

  const maxVal = Math.max(...data.map((d) => d.views));
  const yTicks = [0, 0.5, 1].map((f) => Math.round(maxVal * f));

  const toX = (i: number) => pad.left + (i / (data.length - 1)) * chartW;
  const toY = (v: number) => pad.top + chartH - (v / maxVal) * chartH;

  const linePoints: [number, number][] = data.map((d, i) => [toX(i), toY(d.views)]);
  const linePath = smoothPath(linePoints);
  const areaPath =
    linePath +
    ` L ${linePoints[linePoints.length - 1][0]} ${pad.top + chartH}` +
    ` L ${linePoints[0][0]} ${pad.top + chartH} Z`;

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-900">Weekly Page Views</p>
          <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Page Views
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-72"
          aria-label="Weekly page views line chart"
        >
          <defs>
            <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((val) => {
            const y = toY(val);
            return (
              <g key={val}>
                <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                <text x={pad.left - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#94A3B8">
                  {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                </text>
              </g>
            );
          })}

          {data.map((d, i) => (
            <text key={d.day} x={toX(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#94A3B8">
              {d.day}
            </text>
          ))}

          <path d={areaPath} fill="url(#weeklyGrad)" />
          <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {linePoints.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#10B981" strokeWidth="2" />
          ))}
        </svg>
      </div>
    </div>
  );
}
