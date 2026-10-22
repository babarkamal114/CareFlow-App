import { ClipboardList, GraduationCap, ScrollText, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui";
import type { DashboardComplianceItem, DashboardComplianceKind } from "types";
import {
  DASHBOARD_DUE_URGENCY_BADGE,
  formatDashboardDueLabel,
  getDashboardDueUrgency,
} from "utils";

const KIND_ICONS: Record<DashboardComplianceKind, LucideIcon> = {
  dbs: ShieldCheck,
  training: GraduationCap,
  "care-plan-review": ClipboardList,
  supervision: Users,
  policy: ScrollText,
};

interface ComplianceDueItemProps {
  item: DashboardComplianceItem;
}

/** One row in the "Compliance due" list. Render inside a <ul>. */
export function ComplianceDueItem({ item }: ComplianceDueItemProps) {
  const Icon = KIND_ICONS[item.kind];
  const urgency = getDashboardDueUrgency(item.dueInDays);

  return (
    <li className="flex items-center gap-3 py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cf-surface-muted text-cf-ink-60">
        <Icon className="size-4" aria-hidden />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-cf-ink">{item.title}</p>
        <p className="truncate text-xs text-cf-ink-60">{item.subject}</p>
      </div>

      <Badge variant={DASHBOARD_DUE_URGENCY_BADGE[urgency]} shape="pill">
        {formatDashboardDueLabel(item.dueInDays)}
      </Badge>
    </li>
  );
}