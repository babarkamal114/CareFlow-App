'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import { ArrowUp, ArrowDown, ShieldCheck } from 'lucide-react';

import { useCqcOverview } from 'hooks';
import {
  canSeeCqc,
  clampScore,
  getCqcTrend,
  getScoreTone,
  type ScoreTone,
} from 'utils';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ringColors: Record<ScoreTone, string> = {
  success: 'var(--cf-success)',
  warning: 'var(--cf-warning)',
  error: 'var(--cf-error)',
};

function CqcGaugeCard() {
  const { data, isLoading, error, refetch } = useCqcOverview();

  const score = data ? clampScore(data.overallScore) : 0;
  const trend = data ? getCqcTrend(score, data.previousScore) : null;
  const offset = CIRCUMFERENCE * (1 - score / 100);

  return (
    <motion.div
      className="h-full flex-1 min-w-0"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-cf-border-light shadow-cf-sm rounded-2xl h-full">
        <CardHeader className="flex flex-row items-center gap-2 pb-2 pt-4 px-4">
          <ShieldCheck className="size-4 text-[var(--cf-success)]" />
          <CardTitle className="text-sm font-semibold text-cf-ink">
            CQC Readiness
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4 flex items-center gap-5">
          {isLoading && (
            <div className="flex items-center gap-5 animate-pulse">
              <div className="size-32 shrink-0 rounded-full bg-cf-ink-40/20" />
              <div className="space-y-2">
                <div className="h-3 w-40 rounded bg-cf-ink-40/20" />
                <div className="h-3 w-28 rounded bg-cf-ink-40/20" />
              </div>
            </div>
          )}

          {!isLoading && error && (
            <p className="text-sm text-cf-ink-60">
              Couldn&apos;t load CQC score.{' '}
              <Button onClick={refetch} className="font-semibold text-cf-ink underline">
                Retry
              </Button>
            </p>
          )}

          {!isLoading && !error && data && (
            <>
              <div className="relative size-32 shrink-0">
                <svg viewBox="0 0 120 120" className="size-32 -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    fill="none"
                    stroke="var(--cf-surface-muted)"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    fill="none"
                    stroke={ringColors[getScoreTone(score)]}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    initial={{ strokeDashoffset: CIRCUMFERENCE }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-cf-ink">{Math.round(score)}</span>
                  <span className="text-[10px] text-cf-ink-40">/ 100</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs text-cf-ink-60">
                  Overall compliance score based on Safe, Effective, Caring,
                  Responsive, and Well-led ratings.
                </p>
                {trend && (
                  <div
                    className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      trend.isImproving
                        ? 'bg-[var(--cf-success-muted)] text-[var(--cf-success)]'
                        : 'bg-[var(--cf-error-muted)] text-[var(--cf-error)]'
                    }`}
                  >
                    {trend.isImproving ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                    {trend.points} pts vs last month
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DashboardCQCGauge({ role }: { role: string }) {
  if (!canSeeCqc(role)) return null;
  return <CqcGaugeCard />;
}