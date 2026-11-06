import { Badge } from "@/components/ui";
import type { PatientRisk } from "types";
import { getRiskLevelBadge } from "utils";

interface PatientRiskBadgeProps {
  risk: PatientRisk;
  /** Optional word after the level, e.g. "Risk" -> "High Risk". */
  suffix?: string;
  className?: string;
}

/** Risk level as a pill with a status dot. The text is always shown, never colour alone. */
export function PatientRiskBadge({ risk, suffix, className }: PatientRiskBadgeProps) {
  const { variant, label } = getRiskLevelBadge(risk);

  return (
    <Badge variant={variant} shape="pill" badgeSize="md" dot className={className}>
      {suffix ? `${label} ${suffix}` : label}
    </Badge>
  );
}