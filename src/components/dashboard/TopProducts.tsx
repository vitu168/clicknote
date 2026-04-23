import { TrendingUp } from 'lucide-react';
import type { Product } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TopProductsProps {
  products: Product[];
}

const maxRevenue = 260000;

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-900">Top Products</p>
        <p className="text-xs text-slate-400 mt-0.5">Best-selling devices &amp; services</p>
      </div>

      {/* List */}
      <ul className="divide-y divide-slate-50 px-4 py-2">
        {products.map((product, index) => (
          <li key={product.id} className="flex items-center gap-3 py-3 hover:bg-slate-50 -mx-4 px-4 rounded-xl transition-colors cursor-default">
            {/* Rank & emoji */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg">
              {product.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                <p className="text-sm font-semibold text-slate-900 ml-2 shrink-0">
                  {formatCurrency(product.revenue)}
                </p>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                {/* Progress bar */}
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      index === 0 ? 'bg-indigo-500' :
                      index === 1 ? 'bg-violet-500' :
                      index === 2 ? 'bg-blue-500' :
                      index === 3 ? 'bg-emerald-500' : 'bg-amber-500',
                    )}
                    style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                {/* Growth */}
                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 shrink-0">
                  <TrendingUp className="h-3 w-3" />
                  {product.growth}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{product.sales} sales · {product.category}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
