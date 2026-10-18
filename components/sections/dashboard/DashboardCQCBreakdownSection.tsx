// components/sections/dashboard/DashboardCQCBreakdown.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface CQCAttribute {
  name: string;
  score: number;
}

// Mock data - replace with real API
const cqcAttributes: CQCAttribute[] = [
  { name: 'Safe', score: 92 },
  { name: 'Effective', score: 85 },
  { name: 'Caring', score: 88 },
  { name: 'Responsive', score: 79 },
  { name: 'Well-led', score: 91 },
];

// Soft, token-based color per score band — pulls from the semantic
// state tokens already defined in globals.css (--cf-success / --cf-warning / --cf-error)
const getProgressColor = (score: number): string => {
  if (score >= 80) return 'bg-[var(--cf-success)]'; // Good & Outstanding
  if (score >= 70) return 'bg-[var(--cf-warning)]'; // Acceptable
  return 'bg-[var(--cf-error)]'; // Needs improvement / Poor
};

export function DashboardCQCBreakdown() {
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
            {cqcAttributes.map((attr, i) => (
              <motion.div
                key={attr.name}
                className="space-y-1.5"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-cf-ink">
                    {attr.name}
                  </span>
                  <span className="text-sm font-semibold text-cf-ink">
                    {attr.score}
                  </span>
                </div>

                <div className="w-full bg-cf-surface-muted rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${getProgressColor(attr.score)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${attr.score}%` }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Last Updated Info */}
          <div className="pt-2 border-t border-cf-border-light">
            <p className="text-[10px] text-cf-ink-40">
              Last updated: March 15, 2024
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}