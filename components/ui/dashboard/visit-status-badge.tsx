import { Badge } from "@/components/ui";
import type { DashboardVisitStatus } from "types";
import { DASHBOARD_VISIT_STATUS_BADGE, DASHBOARD_VISIT_STATUS_LABELS } from "utils";

interface VisitStatusBadgeProps {
  status: DashboardVisitStatus;
  /** Shown only when the visit is late. */
  minutesLate?: number;
}

/** Coloured pill for a visit's status. The colour map lives in utils/dashboard-home.ts. */
export function VisitStatusBadge({ status, minutesLate }: VisitStatusBadgeProps) {
  const label =
    status === "late" && minutesLate
      ? `Late by ${minutesLate} min`
      : DASHBOARD_VISIT_STATUS_LABELS[status];

  return (
    <Badge variant={DASHBOARD_VISIT_STATUS_BADGE[status]} shape="pill" dot>
      {label}
    </Badge>
  );
}