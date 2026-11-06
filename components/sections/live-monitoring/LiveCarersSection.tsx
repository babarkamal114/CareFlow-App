import { LiveCarerRow } from "ui/live-monitoring/live-carer-row";
import { LiveCarersPanel } from "ui/live-monitoring/live-carers-panel";
import { getCarerStatusLabel, getCarerStatusTone } from "app-utils/live-monitoring";
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
