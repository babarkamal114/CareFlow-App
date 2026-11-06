"use client";

import { LiveMonitoringHeader } from "@/components/ui";
import { useLiveMonitoring } from "hooks";
import { getLiveMonitoringCounts, getLiveUpdatedLabel } from "utils";
import { LiveMonitoringStats } from "./LiveMonitoringStats";
import { LiveActivitySection } from "./LiveActivitySection";
import { LiveAttentionSection } from "./LiveAttentionSection";
import { LiveCarersSection } from "./LiveCarersSection";

export function LiveMonitoringWorkspaceSection() {
 const {
  visits,
  attentionItems,
  carers,
  now,
  mountedAt,
  secondsSinceRefresh,
  isLoading, 
  refresh,
} = useLiveMonitoring();

  return (
    <div className="space-y-4">
      <LiveMonitoringHeader
        updatedLabel={getLiveUpdatedLabel(secondsSinceRefresh)}
        onRefresh={refresh}
      />

      <LiveMonitoringStats
        counts={getLiveMonitoringCounts(visits, carers, attentionItems)}
        isLoading={isLoading}
      />

      <div className="flex justify-between gap-x-4">
        <div className="w-full">
          <LiveActivitySection visits={visits} now={now} mountedAt={mountedAt} />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-y-4">
          <LiveAttentionSection items={attentionItems} />
          <LiveCarersSection carers={carers} />
        </div>
      </div>
    </div>
  );
}
