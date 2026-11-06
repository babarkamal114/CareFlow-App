"use client";

import { LiveActivityTable } from "ui/live-monitoring/live-activity-table";
import { useLiveActivityFilter } from "hooks";
import { buildLiveActivityRows, filterLiveVisits, LIVE_ACTIVITY_FILTERS } from "app-utils/live-monitoring";
import type { LiveActivitySectionProps } from "types";



export function LiveActivitySection({ visits, now, mountedAt }: LiveActivitySectionProps) {
  const { activeFilter, setActiveFilter } = useLiveActivityFilter();

  const rows = buildLiveActivityRows(
    filterLiveVisits(visits, activeFilter),
    now,
    mountedAt,
  );

  return (
    <LiveActivityTable
      rows={rows}
      filters={LIVE_ACTIVITY_FILTERS}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    />
  );
}
