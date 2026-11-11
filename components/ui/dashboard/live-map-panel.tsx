"use client";

import dynamic from "next/dynamic";
import { cn } from "lib";
import { Skeleton } from "@/components/ui";
import type { DashboardVisitStatus } from "types";
import {
  DASHBOARD_MAP_PIN_CLASSES,
  DASHBOARD_VISIT_STATUS_LABELS,
  type DashboardMapMarker,
} from "utils";

const LEGEND_STATUSES: DashboardVisitStatus[] = ["completed", "in-progress", "scheduled", "late", "missed"];

const LiveMapCanvas = dynamic(() => import("./live-map-canvas").then((mod) => mod.LiveMapCanvas), {
  ssr: false,
  loading: () => <Skeleton className="size-full min-h-[220px] rounded-lg" />,
});

interface LiveMapPanelProps {
  markers: DashboardMapMarker[];
}

export function LiveMapPanel({ markers }: LiveMapPanelProps) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div
        role="region"
        aria-label="Map of today's visits"
        className="relative isolate min-h-[220px] flex-1 overflow-hidden rounded-lg border border-cf-border-light"
      >
        <LiveMapCanvas markers={markers} />
      </div>

      <p className="sr-only">The same visits are listed in the Today&apos;s Visits table.</p>

      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {LEGEND_STATUSES.map((status) => (
          <li key={status} className="flex items-center gap-1.5 text-xs text-cf-ink-60">
            <span className={cn("size-2 rounded-full", DASHBOARD_MAP_PIN_CLASSES[status])} aria-hidden />
            {DASHBOARD_VISIT_STATUS_LABELS[status]}
          </li>
        ))}
      </ul>
    </div>
  );
}