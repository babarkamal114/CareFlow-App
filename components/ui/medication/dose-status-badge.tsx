import { Badge } from "@/components/ui";
import type { DoseState } from "types";
import { DOSE_STATE_CONFIG } from "utils";

export function DoseStatusBadge({ state }: { state: DoseState }) {
  const cfg = DOSE_STATE_CONFIG[state];
  return <Badge variant={cfg.badge} shape="pill" badgeSize="md" dot>{cfg.label}</Badge>;
}