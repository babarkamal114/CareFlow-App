'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  canSeeCqc,
  getCqcBreakdown,
  type ScoreTone,
} from 'utils';

const progressColors: Record<ScoreTone, string> = {
  success: 'bg-[var(--cf-success)]',
  warning: 'bg-[var(--cf-warning)]',
  error: 'bg-[var(--cf-error)]',
};

function CqcBreakdownCard() {
  const { attributes, lastUpdated } = getCqcBreakdown();

  return (
    <motion.div
      className="h-full flex-1 min-w-0"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-4 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-cf-ink">
            CQC Breakdown
          </CardTitle>
          <div className="flex items-center gap-1.5 cursor-help" title="Care Quality Commission rating">
            <Info className="h-4 w-4 text-cf-ink-40" />
            <span className="text-xs text-cf-ink-60">Details</span>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {attributes.map((attr, i) => (
              <motion.div
                key={attr.key}
                className="space-y-1.5"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-cf-ink">{attr.label}</span>
                  <span className="text-sm font-semibold text-cf-ink">{attr.score}</span>
                </div>

                <div className="w-full bg-cf-surface-muted rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${progressColors[attr.tone]}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${attr.score}%` }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {lastUpdated && (
            <div className="pt-2 border-t border-cf-border-light">
              <p className="text-[10px] text-cf-ink-40">
                Last updated: {lastUpdated}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardCQCBreakdown({ role }: { role: string }) {
  if (!canSeeCqc(role)) return null;
  return <CqcBreakdownCard />;
}
