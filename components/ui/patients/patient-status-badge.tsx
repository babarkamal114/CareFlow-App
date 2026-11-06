import { Badge } from "@/components/ui";
import type { PatientStatus } from "types";
import { getPatientStatusBadge } from "utils";

interface PatientStatusBadgeProps {
  status: PatientStatus;
  className?: string;
}

export function PatientStatusBadge({ status, className }: PatientStatusBadgeProps) {
  const { variant, label } = getPatientStatusBadge(status);

  return (
    <Badge variant={variant} shape="pill" badgeSize="md" className={className}>
      {label}
    </Badge>
  );
}