'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui';
import { useTodaysVisits } from 'hooks';
import {
  SUMMARY_STATUSES,
  VISIT_STATUS_META,
  canSeeVisits,
  type StatusTone,
} from 'utils';

const toneClasses: Record<StatusTone, { bg: string; text: string; icon: string }> = {
  success: { bg: 'bg-[var(--cf-success-muted)]', text: 'text-[var(--cf-success)]', icon: 'text-[var(--cf-success)]' },
  info: { bg: 'bg-[var(--cf-info-muted)]', text: 'text-[var(--cf-info)]', icon: 'text-[var(--cf-info)]' },
  warning: { bg: 'bg-[var(--cf-warning-muted)]', text: 'text-[var(--cf-warning)]', icon: 'text-[var(--cf-warning)]' },
  error: { bg: 'bg-[var(--cf-error-muted)]', text: 'text-[var(--cf-error)]', icon: 'text-[var(--cf-error)]' },
  muted: { bg: 'bg-cf-surface-muted', text: 'text-cf-ink', icon: 'text-cf-ink-60' },
};

function VisitStatusCards() {
  const { data, isLoading, error } = useTodaysVisits();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {SUMMARY_STATUSES.map((status, i) => {
        const { label, Icon, tone: toneKey } = VISIT_STATUS_META[status];
        const tone = toneClasses[toneKey];
        const value = isLoading || error ? '—' : data?.statusCounts[status] ?? 0;

        return (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2 }}
          >
            <Card className="border-cf-border-light shadow-cf-xs rounded-xl h-full">
              <CardContent className="p-3.5 flex flex-col gap-2">
                <div className={`inline-flex size-8 items-center justify-center rounded-lg ${tone.bg}`}>
                  <Icon className={`size-4 ${tone.icon}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold leading-none ${tone.text} ${isLoading ? 'animate-pulse' : ''}`}>
                    {value}
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium text-cf-ink-60">{label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

export function DashboardVisitStatus({ role }: { role: string }) {
  if (!canSeeVisits(role)) return null;
  return <VisitStatusCards />;
}