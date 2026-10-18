// components/sections/dashboard/DashboardCQCGaugeSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ArrowUp, ArrowDown, ShieldCheck } from 'lucide-react';

// Mock data - replace with real API
const overallScore = 87;
const previousScore = 83;
const trend = overallScore - previousScore;
const isImproving = trend >= 0;

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DashboardCQCGauge() {
  const offset = CIRCUMFERENCE * (1 - overallScore / 100);

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
                stroke="var(--cf-success)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-cf-ink">{overallScore}</span>
              <span className="text-[10px] text-cf-ink-40">/ 100</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs text-cf-ink-60">
              Overall compliance score based on Safe, Effective, Caring,
              Responsive, and Well-led ratings.
            </p>
            <div
              className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                isImproving
                  ? 'bg-[var(--cf-success-muted)] text-[var(--cf-success)]'
                  : 'bg-[var(--cf-error-muted)] text-[var(--cf-error)]'
              }`}
            >
              {isImproving ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
              {Math.abs(trend)} pts vs last month
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}