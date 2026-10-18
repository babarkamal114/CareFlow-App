// components/sections/dashboard/DashboardStaffSnapshotSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Users } from 'lucide-react';

// Mock data - replace with real API
const staffSnapshot = [
  { label: 'On Shift', value: 12, tone: 'success' as const },
  { label: 'Available', value: 15, tone: 'info' as const },
  { label: 'On Leave', value: 4, tone: 'muted' as const },
];

const toneClasses = {
  success: 'bg-[var(--cf-success)]',
  info: 'bg-[var(--cf-info)]',
  muted: 'bg-cf-ink-40',
};

const total = staffSnapshot.reduce((sum, item) => sum + item.value, 0);

export function DashboardStaffSnapshot() {
  return (
    <motion.div
      className="h-full flex-1 min-w-0"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-cf-border-light shadow-cf-sm rounded-2xl h-full">
        <CardHeader className="flex flex-row items-center gap-2 pb-2 pt-4 px-4">
          <Users className="size-4 text-cf-ink-60" />
          <CardTitle className="text-sm font-semibold text-cf-ink">
            Staff Snapshot
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4 space-y-4">
          {/* Stacked proportion bar */}
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-cf-surface-muted">
            {staffSnapshot.map((item, i) => (
              <motion.div
                key={item.label}
                className={toneClasses[item.tone]}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / total) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {staffSnapshot.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${toneClasses[item.tone]}`} />
                  <span className="text-xs text-cf-ink-60">{item.label}</span>
                </div>
                <p className="mt-1 text-xl font-bold text-cf-ink">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}