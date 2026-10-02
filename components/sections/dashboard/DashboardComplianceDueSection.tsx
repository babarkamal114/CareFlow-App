// components/sections/dashboard/DashboardComplianceDue.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComplianceItem {
  id: string;
  title: string;
  dueDate: string;
  daysRemaining: number;
  priority: 'high' | 'medium' | 'low';
  count?: number;
}

const complianceDueItems: ComplianceItem[] = [
  { id: '1', title: 'DBS Checks', dueDate: 'March 20, 2024', daysRemaining: 3, priority: 'high', count: 5 },
  { id: '2', title: 'Fire Safety Training', dueDate: 'March 22, 2024', daysRemaining: 5, priority: 'high', count: 8 },
  { id: '3', title: 'Manual Handling Certification', dueDate: 'March 28, 2024', daysRemaining: 11, priority: 'medium', count: 3 },
  { id: '4', title: 'CQC Documentation Review', dueDate: 'April 1, 2024', daysRemaining: 15, priority: 'low', count: 1 },
];

// Soft, token-based tones — priority maps onto the semantic state
// tokens already defined in globals.css (muted bg + solid accent)
const priorityColors: Record<'high' | 'medium' | 'low', string> = {
  high: 'bg-[var(--cf-error-muted)] border-[var(--cf-error)]/20 hover:bg-[var(--cf-error-muted)]/70',
  medium: 'bg-[var(--cf-warning-muted)] border-[var(--cf-warning)]/20 hover:bg-[var(--cf-warning-muted)]/70',
  low: 'bg-[var(--cf-info-muted)] border-[var(--cf-info)]/20 hover:bg-[var(--cf-info-muted)]/70',
};

const priorityTextColors: Record<'high' | 'medium' | 'low', string> = {
  high: 'text-[var(--cf-error)]',
  medium: 'text-[var(--cf-warning)]',
  low: 'text-[var(--cf-info)]',
};

const priorityDotColors: Record<'high' | 'medium' | 'low', string> = {
  high: 'bg-[var(--cf-error)]',
  medium: 'bg-[var(--cf-warning)]',
  low: 'bg-[var(--cf-info)]',
};

const getPriorityLabel = (priority: 'high' | 'medium' | 'low'): string => {
  const labels = { high: 'Urgent', medium: 'Due Soon', low: 'Upcoming' };
  return labels[priority];
};

export function DashboardComplianceDue() {
  const sortedItems = [...complianceDueItems].sort(
    (a, b) => a.daysRemaining - b.daysRemaining
  );

  const urgentCount = complianceDueItems.filter(
    (item) => item.priority === 'high'
  ).length;

  return (
    <motion.div
      className="h-full flex-1 min-w-0"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="border-cf-border-light shadow-cf-sm rounded-2xl w-full h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-cf-ink">
            Compliance Due
          </CardTitle>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-cf-ink-60" />
            <span className="text-xs text-cf-ink-60">Next 14 days</span>
          </div>
        </CardHeader>

        <CardContent className="px-4 pb-4 flex-1 flex flex-col min-h-0">
          {urgentCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="mb-4 p-3 bg-[var(--cf-error-muted)] border border-[var(--cf-error)]/20 rounded-lg flex items-start gap-2 flex-shrink-0"
            >
              <AlertCircle className="h-4 w-4 text-[var(--cf-error)] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--cf-error)]">
                <span className="font-medium">{urgentCount}</span> urgent compliance items due
              </p>
            </motion.div>
          )}

          <div className="space-y-2 overflow-y-auto flex-1">
            {sortedItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                className={`p-3 rounded-lg border transition-colors ${priorityColors[item.priority]}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${priorityDotColors[item.priority]}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cf-ink">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  {item.count && (
                    <Badge
                      variant="outline"
                      className={`text-xs flex-shrink-0 ${priorityTextColors[item.priority]}`}
                    >
                      {item.count}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-cf-ink-60">{item.dueDate}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-medium ${priorityTextColors[item.priority]}`}>
                      {item.daysRemaining} days
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${priorityTextColors[item.priority]}`}
                    >
                      {getPriorityLabel(item.priority)}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {sortedItems.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-cf-ink-60">No compliance items due</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}