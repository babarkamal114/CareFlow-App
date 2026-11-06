import { LiveAttentionPanel } from "ui/live-monitoring/live-attention-panel";
import { LiveAttentionRow } from "ui/live-monitoring/live-attention-row";
import { getAttentionTypeConfig } from "app-utils/attention-helpers";
import { countHighPriorityItems } from "app-utils/live-monitoring";
import type { LiveAttentionSectionProps } from "types";

export function LiveAttentionSection({ items }: LiveAttentionSectionProps) {
  return (
    <LiveAttentionPanel urgentCount={countHighPriorityItems(items)}>
      {items.map((item) => (
        <LiveAttentionRow
          key={item.id}
          item={item}
          config={getAttentionTypeConfig(item.type)}
        />
      ))}
    </LiveAttentionPanel>
  );
}
