import { Badge } from "@/components/ui";
import type { FundingSource } from "types";
import { FUNDING_SOURCE_LABEL, FUNDING_SOURCE_VARIANT } from "utils";

export function FundingSourceBadge({ source }: { source: FundingSource }) {
  return (
    <Badge variant={FUNDING_SOURCE_VARIANT[source]} shape="pill" badgeSize="md">
      {FUNDING_SOURCE_LABEL[source]}
    </Badge>
  );
}