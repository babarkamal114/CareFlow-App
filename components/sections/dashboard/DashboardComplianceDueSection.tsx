import { CheckCircle2 } from "lucide-react";

import { Badge, Card, ComplianceDueItem, EmptyState, ScrollArea } from "@/components/ui";
import type { DashboardComplianceItem } from "types";
import { DASHBOARD_COMPLIANCE_WINDOW_DAYS } from "utils";

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
    <Card variant="elevated" className="h-full gap-0 py-0">
      <div className="flex items-start justify-between gap-2 border-b border-cf-border-light px-4 py-3">
        <div>
          <h2 className="font-heading text-base font-semibold text-cf-ink">Compliance Due</h2>
          <p className="text-xs text-cf-ink-60">Next {DASHBOARD_COMPLIANCE_WINDOW_DAYS} days</p>
        </div>
        <Badge variant={urgentCount > 0 ? "softDanger" : "softMuted"} shape="pill">
          {urgentCount} urgent
        </Badge>
      </div>

      {items.length === 0 ? (
        <div className="p-4">
          <EmptyState
            icon={<CheckCircle2 />}
            title="Nothing due"
            description="No compliance items are due in the next 30 days."
            className="py-8"
          />
        </div>
      ) : (
        <ScrollArea className="h-[320px]">
          <ul className="divide-y divide-cf-border-light px-4">
            {items.map((item) => (
              <ComplianceDueItem key={item.id} item={item} />
            ))}
          </ul>
        </ScrollArea>
      )}
    </Card>
  );
}