import { LiveAttentionPanel, LiveAttentionRow } from "@/components/ui";
import { countHighPriorityItems, getAttentionTypeConfig } from "utils";
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
