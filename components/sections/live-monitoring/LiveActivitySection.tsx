"use client";

import { LiveActivityTable } from "@/components/ui";
import { useLiveActivityFilter } from "hooks";
import { buildLiveActivityRows, filterLiveVisits } from "utils";
import type { LiveActivityFilter, LiveActivitySectionProps } from "types";

const LIVE_ACTIVITY_FILTERS: LiveActivityFilter[] = [
  { key: "all", label: "All" },
  { key: "in-progress", label: "In Progress" },
  { key: "delayed", label: "Delayed" },
  { key: "starting", label: "Starting Soon" },
  { key: "scheduled", label: "Scheduled" },
  { key: "completed", label: "Completed" },
  { key: "missed", label: "Missed" },
];

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
