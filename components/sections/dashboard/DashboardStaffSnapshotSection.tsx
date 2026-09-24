'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { Users } from 'lucide-react';

import { useStaffSnapshot } from 'hooks';
import {
  buildSnapshotSegments,
  canSeeStaff,
  type SnapshotTone,
} from 'utils';

const toneClasses: Record<SnapshotTone, string> = {
  success: 'bg-[var(--cf-success)]',
  info: 'bg-[var(--cf-info)]',
  muted: 'bg-cf-ink-40',
};

function StaffSnapshotCard() {
  const { data, isLoading, error, refetch } = useStaffSnapshot();
  const segments = useMemo(() => (data ? buildSnapshotSegments(data) : []), [data]);

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
          {isLoading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-2 w-full rounded-full bg-cf-ink-40/20" />
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 rounded bg-cf-ink-40/20" />
                ))}
              </div>
            </div>
          )}

          {!isLoading && error && (
            <p className="text-xs text-cf-ink-60">
              Couldn&apos;t load staff snapshot.{' '}
              <Button onClick={refetch} className="font-semibold text-cf-ink underline">
                Retry
              </Button>
            </p>
          )}

          {!isLoading && !error && data && (
            <>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-cf-surface-muted">
                {segments.map((segment, i) => (
                  <motion.div
                    key={segment.key}
                    className={toneClasses[segment.tone]}
                    initial={{ width: 0 }}
                    animate={{ width: `${segment.percent}%` }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {segments.map((segment, i) => (
                  <motion.div
                    key={segment.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`size-2 rounded-full ${toneClasses[segment.tone]}`} />
                      <span className="text-xs text-cf-ink-60">{segment.label}</span>
                    </div>
                    <p className="mt-1 text-xl font-bold text-cf-ink">{segment.value}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardStaffSnapshot({ role }: { role: string }) {
  if (!canSeeStaff(role)) return null;
  return <StaffSnapshotCard />;
}