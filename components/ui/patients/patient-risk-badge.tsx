import { Badge } from "@/components/ui";
import type { PatientRisk } from "types";
import { getRiskLevelBadge } from "app-utils/patient-profile";

interface PatientRiskBadgeProps {
  risk: PatientRisk;
  suffix?: string;
  className?: string;
}

export function PatientRiskBadge({ risk, suffix, className }: PatientRiskBadgeProps) {
  const { variant, label } = getRiskLevelBadge(risk);

  return (
    <Badge variant={variant} shape="pill" badgeSize="md" dot className={className}>
      {suffix ? `${label} ${suffix}` : label}
    </Badge>
  );
}