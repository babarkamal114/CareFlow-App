"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Avatar,
  AvatarFallback,
  Badge,
  BadgeProps,
  EmptyState,
} from "@/components/ui";
import { Radio } from "lucide-react";
import { mockLiveVisits, liveVisitStatusLabelMap, liveVisitStatusBadgeVariantMap } from "utils";
import type { LiveVisit, VisitStatus } from "types";
import { formatLiveDuration } from "./use-live-clock";

interface LiveActivityTableProps {
  now: number;
  mountedAt: number;
}

type FilterKey = "all" | VisitStatus;

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "in-progress", label: "In Progress" },
  { key: "delayed", label: "Delayed" },
  { key: "starting", label: "Starting Soon" },
  { key: "scheduled", label: "Scheduled" },
  { key: "completed", label: "Completed" },
  { key: "missed", label: "Missed" },
];

function liveTimingLabel(visit: LiveVisit, now: number, mountedAt: number): string {
  const visitStartAt = mountedAt + visit.referenceOffsetMinutes * 60_000;

  if (visit.status === "in-progress" || visit.status === "delayed") {
    return `${formatLiveDuration(now - visitStartAt)} elapsed`;
  }
  if (visit.status === "starting" || visit.status === "scheduled") {
    const remaining = visitStartAt - now;
    return remaining <= 0 ? "Starting now" : `Starts in ${formatLiveDuration(remaining)}`;
  }
  return `${visit.durationMinutes} min`;
}

function LiveActivityTable({ now, mountedAt }: LiveActivityTableProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const filteredVisits = useMemo(
    () =>
      activeFilter === "all"
        ? mockLiveVisits
        : mockLiveVisits.filter((v) => v.status === activeFilter),
    [activeFilter]
  );

  return (
    <div className="cf-glass-panel w-full rounded-xl overflow-hidden">
      {/* Header + filters */}
      <div className="flex flex-col gap-3 border-b border-cf-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-cf-ink">Current Activity</h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeFilter === f.key
                  ? "bg-cf-ink text-white"
                  : "bg-cf-surface-muted text-cf-ink-60 hover:bg-cf-surface-inset"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filteredVisits.length === 0 ? (
        <div className="p-4">
          <EmptyState
            icon={<Radio />}
            title="Nothing here right now"
            description="No visits currently match this filter."
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-cf-surface-muted hover:bg-cf-surface-muted">
                <TableHead className="text-xs font-semibold text-cf-ink-60 min-w-[200px]">
                  Patient
                </TableHead>
                <TableHead className="text-xs font-semibold text-cf-ink-60 min-w-[150px]">
                  Carer
                </TableHead>
                <TableHead className="text-xs font-semibold text-cf-ink-60 min-w-[120px]">
                  Scheduled
                </TableHead>
                <TableHead className="text-xs font-semibold text-cf-ink-60 min-w-[110px]">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-cf-ink-60 text-right min-w-[140px]">
                  Live
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.map((visit) => {
                const isLive = visit.status === "in-progress";
                return (
                  <TableRow
                    key={visit.id}
                    className={`hover:bg-cf-surface-muted/50 ${
                      visit.status === "delayed"
                        ? "border-l-2 border-l-cf-red-500"
                        : isLive
                          ? "border-l-2 border-l-cf-amber-500"
                          : ""
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-cf-brand-500/10 text-cf-brand-500 text-xs font-medium">
                            {visit.patientInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-cf-ink">{visit.patientName}</p>
                          <p className="text-xs text-cf-ink-60">{visit.careType}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-cf-ink-60">{visit.carerName}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-cf-ink-60">{visit.scheduledWindow}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        shape="pill"
                        dot={isLive}
                        variant={liveVisitStatusBadgeVariantMap[visit.status] as BadgeProps["variant"]}
                      >
                        {liveVisitStatusLabelMap[visit.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`text-sm font-medium tabular-nums ${
                          visit.status === "delayed" ? "text-cf-red-500" : "text-cf-ink-60"
                        }`}
                      >
                        {liveTimingLabel(visit, now, mountedAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default LiveActivityTable;