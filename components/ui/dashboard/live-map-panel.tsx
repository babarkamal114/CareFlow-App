"use client";

import { cn } from "lib";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";
import type { DashboardVisitStatus } from "types";
import {
  DASHBOARD_MAP_PIN_CLASSES,
  DASHBOARD_VISIT_STATUS_LABELS,
  type DashboardMapMarker,
} from "utils";

const LEGEND_STATUSES: DashboardVisitStatus[] = ["completed", "in-progress", "scheduled", "late", "missed"];

interface LiveMapPanelProps {
  markers: DashboardMapMarker[];
}

/** Stylised map (grid + roads) with one pin per visit. Real map integration comes with the backend. */
export function LiveMapPanel({ markers }: LiveMapPanelProps) {
  return (
    <TooltipProvider>
      <div className="flex h-full flex-col gap-3">
        <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-lg border border-cf-border-light bg-cf-surface-muted">
          <svg
            className="absolute inset-0 size-full"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <pattern id="dashboard-map-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M10 0H0V10" fill="none" stroke="var(--cf-border-light)" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="60" fill="url(#dashboard-map-grid)" />
            <path d="M0 40 C 25 30, 45 55, 100 25" fill="none" stroke="var(--cf-border)" strokeWidth="1.2" />
            <path d="M30 0 C 35 25, 60 35, 55 60" fill="none" stroke="var(--cf-border)" strokeWidth="1.2" />
          </svg>

          {markers.map((marker) => (
            <Tooltip key={marker.visitId}>
              <TooltipTrigger
                aria-label={`${marker.label}, ${DASHBOARD_VISIT_STATUS_LABELS[marker.status]}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5"
                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              >
                <span
                  className={cn(
                    "block size-3 rounded-full ring-2 ring-cf-surface",
                    DASHBOARD_MAP_PIN_CLASSES[marker.status],
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <span className="font-semibold">{marker.label}</span>
                <span className="opacity-70">{DASHBOARD_VISIT_STATUS_LABELS[marker.status]}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {LEGEND_STATUSES.map((status) => (
            <li key={status} className="flex items-center gap-1.5 text-xs text-cf-ink-60">
              <span className={cn("size-2 rounded-full", DASHBOARD_MAP_PIN_CLASSES[status])} aria-hidden />
              {DASHBOARD_VISIT_STATUS_LABELS[status]}
            </li>
          ))}
        </ul>
      </div>
    </TooltipProvider>
  );
}