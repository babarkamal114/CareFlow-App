import { Badge } from "@/components/ui";
import type { Medication } from "types";
import { MEDICATION_TYPE_CONFIG } from "utils";

export function MedicationTypeBadge({ medication }: { medication: Medication }) {
  const cfg = MEDICATION_TYPE_CONFIG[medication.type];
  return (
    <Badge variant={cfg.badge} shape="pill" badgeSize="sm">
      {cfg.label}{medication.type === "controlled" && medication.schedule ? ` · CD ${medication.schedule}` : ""}
    </Badge>
  );
}
