import { AlertCircle, CheckCircle2 } from "lucide-react";

import { AlertFeedItem } from "ui/dashboard/alert-feed-item";
import { Badge } from "ui/badge";
import { Card } from "ui/card";
import { EmptyState } from "ui/empty-state";
import type { DashboardAlert } from "types";

interface DashboardAlertFeedSectionProps {
  items: DashboardAlert[];
  countLabel: string;
  highPriorityCount: number;
}

export function DashboardAlertFeedSection({ items, countLabel, highPriorityCount }: DashboardAlertFeedSectionProps) {
  return (
    <Card
      variant="elevated"
      className="flex-1 gap-0 py-0"
      id="needs-attention" 
      role="region"
      aria-labelledby="needs-attention-heading" 
    >
      <div className="flex items-center justify-between border-b border-cf-border-light px-4 py-3">
        <h2
          id="needs-attention-heading" // NEW
          className="flex items-center gap-2 font-heading text-base font-semibold text-cf-ink"
        >
          <AlertCircle className="size-4 text-cf-ink-60" aria-hidden />
          Needs Attention
        </h2>
        <span role="status">
          <Badge variant={highPriorityCount > 0 ? "softDanger" : "softMuted"} shape="pill">
            {countLabel}
          </Badge>
          <span className="sr-only">, {highPriorityCount} high priority</span>
        </span>
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
          <ul aria-labelledby="needs-attention-heading" className="divide-y divide-cf-border-light px-4">
            {items.map((alert) => (
              <AlertFeedItem key={alert.id} alert={alert} />
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}