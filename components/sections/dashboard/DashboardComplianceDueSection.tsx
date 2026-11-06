import { CheckCircle2 } from "lucide-react";

import { Badge, Card, ComplianceDueItem, EmptyState, ScrollArea } from "@/components/ui";
import type { DashboardComplianceItem } from "types";
import { DASHBOARD_COMPLIANCE_WINDOW_DAYS } from "utils";

interface DashboardComplianceDueSectionProps {
  items: DashboardComplianceItem[];
  urgentCount: number;
}

/** DBS checks, training, supervisions and reviews due soon. */
export function DashboardComplianceDueSection({ items, urgentCount }: DashboardComplianceDueSectionProps) {
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