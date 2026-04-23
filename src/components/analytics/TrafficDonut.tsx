'use client';

import type { TrafficSource } from '@/lib/data';

interface TrafficDonutProps {
  sources: TrafficSource[];
}

export default function TrafficDonut({ sources }: TrafficDonutProps) {
  const cx = 80;
  const cy = 80;
  const r = 56;
  const circumference = 2 * Math.PI * r;
  const strokeWidth = 18;

  let cumulativeOffset = 0;

  const segments = sources.map((source) => {
    const dashLength = (source.percentage / 100) * circumference;
    const segment = {
      ...source,
      dasharray: `${dashLength.toFixed(2)} ${circumference.toFixed(2)}`,
      dashoffset: (-cumulativeOffset).toFixed(2),
    };
    cumulativeOffset += dashLength;
    return segment;
  });

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      <div className="px-6 py-5 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-900">Traffic Sources</p>
        <p className="text-xs text-slate-400 mt-0.5">This month breakdown</p>
      </div>

      <div className="flex items-center gap-6 px-6 py-6">
        {/* Donut */}
        <div className="relative shrink-0">
          <svg width="160" height="160" viewBox="0 0 160 160" aria-label="Traffic sources donut chart">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
            {segments.map((seg) => (
              <circle
                key={seg.name}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.dasharray}
                strokeDashoffset={seg.dashoffset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-slate-900">100%</p>
            <p className="text-xs text-slate-400">Traffic</p>
          </div>
        </div>

        {/* Legend */}
        <ul className="flex-1 space-y-3">
          {sources.map((source) => (
            <li key={source.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full shrink-0 ${source.dotClass}`}
                />
                <span className="text-sm text-slate-600">{source.name}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">{source.percentage}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
