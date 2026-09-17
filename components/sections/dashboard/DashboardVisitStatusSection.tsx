// components/sections/dashboard/DashboardVisitStatusSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui';
import { CheckCircle2, Clock, PlayCircle, AlertTriangle, XCircle } from 'lucide-react';

interface VisitStatusItem {
  label: string;
  value: number;
  Icon: typeof CheckCircle2;
  tone: 'success' | 'info' | 'warning' | 'error' | 'muted';
}

// Mock data - replace with real API
const visitStatusItems: VisitStatusItem[] = [
  { label: 'Scheduled', value: 48, Icon: Clock, tone: 'muted' },
  { label: 'Completed', value: 31, Icon: CheckCircle2, tone: 'success' },
  { label: 'In Progress', value: 9, Icon: PlayCircle, tone: 'info' },
  { label: 'Late', value: 4, Icon: AlertTriangle, tone: 'warning' },
  { label: 'Missed', value: 2, Icon: XCircle, tone: 'error' },
];

const toneClasses: Record<VisitStatusItem['tone'], { bg: string; text: string; icon: string }> = {
  success: { bg: 'bg-[var(--cf-success-muted)]', text: 'text-[var(--cf-success)]', icon: 'text-[var(--cf-success)]' },
  info: { bg: 'bg-[var(--cf-info-muted)]', text: 'text-[var(--cf-info)]', icon: 'text-[var(--cf-info)]' },
  warning: { bg: 'bg-[var(--cf-warning-muted)]', text: 'text-[var(--cf-warning)]', icon: 'text-[var(--cf-warning)]' },
  error: { bg: 'bg-[var(--cf-error-muted)]', text: 'text-[var(--cf-error)]', icon: 'text-[var(--cf-error)]' },
  muted: { bg: 'bg-cf-surface-muted', text: 'text-cf-ink', icon: 'text-cf-ink-60' },
};

export function DashboardVisitStatus() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {visitStatusItems.map((item, i) => {
        const tone = toneClasses[item.tone];
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2 }}
          >
            <Card className="border-cf-border-light shadow-cf-xs rounded-xl h-full">
              <CardContent className="p-3.5 flex flex-col gap-2">
                <div className={`inline-flex size-8 items-center justify-center rounded-lg ${tone.bg}`}>
                  <item.Icon className={`size-4 ${tone.icon}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold leading-none ${tone.text}`}>{item.value}</p>
                  <p className="mt-1.5 text-[11px] font-medium text-cf-ink-60">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}