import { LiveCarerRow, LiveCarersPanel } from "@/components/ui";
import { getCarerStatusLabel, getCarerStatusTone } from "utils";
import type { LiveCarersSectionProps } from "types";

export function LiveCarersSection({ carers }: LiveCarersSectionProps) {
  return (
    <LiveCarersPanel onDutyCount={carers.length}>
      {carers.map((carer) => (
        <LiveCarerRow
          key={carer.id}
          carer={carer}
          statusLabel={getCarerStatusLabel(carer.status)}
          tone={getCarerStatusTone(carer.status)}
        />
      ))}
    </LiveCarersPanel>
  );
}
