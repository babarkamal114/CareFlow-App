import { Badge } from "@/components/ui";
import type { VisitStatus, VisitType } from "types";
import {
  VISIT_STATUS_BADGE_VARIANT,
  VISIT_STATUS_LABELS,
  VISIT_TYPE_BADGE_VARIANT,
  VISIT_TYPE_LABELS,
} from "utils";

interface VisitStatusBadgeProps {
  status: VisitStatus;
  /** True when the visit has no carer. Shown in red unless the visit is cancelled. */
  unassigned?: boolean;
  className?: string;
}

export function VisitStatusBadge({
  status,
  unassigned = false,
  className,
}: VisitStatusBadgeProps) {
  if (unassigned && status !== "cancelled") {
    return (
      <Badge variant="softDanger" dot className={className}>
        Unassigned
      </Badge>
    );
  }

  return (
    <Badge variant={VISIT_STATUS_BADGE_VARIANT[status]} dot className={className}>
      {VISIT_STATUS_LABELS[status]}
    </Badge>
  );
}

interface VisitTypeBadgeProps {
  type: VisitType;
  className?: string;
}

export function VisitTypeBadge({ type, className }: VisitTypeBadgeProps) {
  return (
    <Badge variant={VISIT_TYPE_BADGE_VARIANT[type]} className={className}>
      {VISIT_TYPE_LABELS[type]}
    </Badge>
  );
}