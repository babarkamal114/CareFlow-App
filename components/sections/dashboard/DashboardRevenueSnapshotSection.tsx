// components/sections/dashboard/DashboardRevenueSnapshotSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ArrowUp, ArrowDown, Wallet } from 'lucide-react';

// Mock data - replace with real API
const thisMonth = 42500;
const lastMonth = 38900;
const outstanding = 8000;
const changePercent = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
const isUp = changePercent >= 0;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);

export function DashboardRevenueSnapshot() {
  return (
    <motion.div
      className="h-full flex-1 min-w-0"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-cf-border-light shadow-cf-sm rounded-2xl h-full">
        <CardHeader className="flex flex-row items-center gap-2 pb-2 pt-4 px-4">
          <Wallet className="size-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">
            Revenue Snapshot
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4 space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-cf-ink-60">This month</p>
              <p className="text-3xl font-bold text-cf-ink leading-none mt-1">
                {formatCurrency(thisMonth)}
              </p>
            </div>
            <div
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                isUp
                  ? 'bg-[var(--cf-success-muted)] text-[var(--cf-success)]'
                  : 'bg-[var(--cf-error-muted)] text-[var(--cf-error)]'
              }`}
            >
              {isUp ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
              {Math.abs(changePercent)}%
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-cf-border-light pt-3">
            <div>
              <p className="text-[11px] text-cf-ink-40">Last month</p>
              <p className="text-sm font-medium text-cf-ink-60">{formatCurrency(lastMonth)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-cf-ink-40">Outstanding</p>
              <p className="text-sm font-medium text-[var(--cf-warning)]">
                {formatCurrency(outstanding)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}