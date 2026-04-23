import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Transaction } from '@/lib/data';
import { formatCurrency, formatDate } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-900">Recent Orders</p>
          <p className="text-xs text-slate-400 mt-0.5">{transactions.length} orders this period</p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">
                Product
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={tx.customer} colorClass={tx.avatarColor} size="sm" />
                    <div>
                      <p className="font-medium text-slate-800 leading-none">{tx.customer}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{tx.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-600 hidden md:table-cell">{tx.product}</td>
                <td className="px-4 py-3.5 text-right font-semibold text-slate-900">
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={tx.status} showDot>{tx.status}</Badge>
                </td>
                <td className="px-6 py-3.5 text-slate-500 hidden lg:table-cell">
                  {formatDate(tx.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
