import { AlertCircle, CheckCircle2 } from "lucide-react";

import { AlertFeedItem, Badge, Card, EmptyState } from "@/components/ui";
import type { DashboardAlert } from "types";

interface DashboardAlertFeedSectionProps {
  items: DashboardAlert[];
  countLabel: string;
  highPriorityCount: number;
}

/** "Needs attention" feed: missed visits, late carers, overdue care plans, unsigned documents, expiring DBS checks. */
export function DashboardAlertFeedSection({ items, countLabel, highPriorityCount }: DashboardAlertFeedSectionProps) {
  return (
    <Card variant="elevated" className="flex-1 gap-0 py-0">
      <div className="flex items-center justify-between border-b border-cf-border-light px-4 py-3">
        <h2 className="flex items-center gap-2 font-heading text-base font-semibold text-cf-ink">
          <AlertCircle className="size-4 text-cf-ink-60" aria-hidden />
          Needs Attention
        </h2>
        <Badge variant={highPriorityCount > 0 ? "softDanger" : "softMuted"} shape="pill">
          {countLabel}
        </Badge>
      </div>

      {items.length === 0 ? (
        <div className="p-4">
          <EmptyState
            icon={<CheckCircle2 />}
            title="All clear"
            description="Nothing needs your attention right now."
            className="py-8"
          />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ul className="divide-y divide-cf-border-light px-4">
            {items.map((alert) => (
              <AlertFeedItem key={alert.id} alert={alert} />
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}