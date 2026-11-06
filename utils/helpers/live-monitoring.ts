import type {
  CarerLiveStatus,
  CarerStatusTone,
  LiveActivityFilterKey,
  LiveActivityRowData,
  LiveAttentionItem,
  LiveBadgeVariant,
  LiveCarer,
  LiveMonitoringCounts,
  LiveVisit,
  LiveMonitoringVisitStatus as VisitStatus,
  LiveActivityFilter,
} from "types";
import { getPriority } from "./attention-helpers";

const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  starting: "Starting Soon",
  "in-progress": "In Progress",
  delayed: "Delayed",
  scheduled: "Scheduled",
  completed: "Completed",
  missed: "Missed",
};

const VISIT_STATUS_BADGE_VARIANTS: Record<VisitStatus, LiveBadgeVariant> = {
  starting: "pastel-purple",
  "in-progress": "pastel-warning",
  delayed: "pastel-danger",
  scheduled: "pastel-info",
  completed: "pastel-success",
  missed: "pastel-neutral",
};

const CARER_STATUS_LABELS: Record<CarerLiveStatus, string> = {
  active: "In visit",
  travelling: "Travelling",
  break: "On break",
};

const CARER_STATUS_TONES: Record<CarerLiveStatus, CarerStatusTone> = {
  active: "brand",
  travelling: "blue",
  break: "amber",
};

export const getLiveVisitStatusLabel = (status: VisitStatus) =>
  VISIT_STATUS_LABELS[status];

export const getLiveVisitBadgeVariant = (status: VisitStatus) =>
  VISIT_STATUS_BADGE_VARIANTS[status];

export const getCarerStatusLabel = (status: CarerLiveStatus) =>
  CARER_STATUS_LABELS[status];

export const getCarerStatusTone = (status: CarerLiveStatus) =>
  CARER_STATUS_TONES[status];

export function formatLiveDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export function getLiveUpdatedLabel(secondsSinceRefresh: number): string {
  return secondsSinceRefresh < 5
    ? "Updated just now"
    : `Updated ${secondsSinceRefresh}s ago`;
}

export function getLiveTimingLabel(
  visit: LiveVisit,
  now: number,
  mountedAt: number,
): string {
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

export function filterLiveVisits(
  visits: LiveVisit[],
  filter: LiveActivityFilterKey,
): LiveVisit[] {
  return filter === "all" ? visits : visits.filter((v) => v.status === filter);
}

export function buildLiveActivityRows(
  visits: LiveVisit[],
  now: number,
  mountedAt: number,
): LiveActivityRowData[] {
  return visits.map((visit) => ({
    visit,
    timingLabel: getLiveTimingLabel(visit, now, mountedAt),
    statusLabel: getLiveVisitStatusLabel(visit.status),
    badgeVariant: getLiveVisitBadgeVariant(visit.status),
  }));
}

export function countHighPriorityItems(items: LiveAttentionItem[]): number {
  return items.filter((item) => getPriority(item.type) === "high").length;
}

export function getLiveMonitoringCounts(
  visits: LiveVisit[],
  carers: LiveCarer[],
  items: LiveAttentionItem[],
): LiveMonitoringCounts {
  return {
    activePatients: visits.filter(
      (v) => v.status !== "completed" && v.status !== "missed",
    ).length,
    activeVisits: visits.filter(
      (v) => v.status === "in-progress" || v.status === "delayed",
    ).length,
    carersOnDuty: carers.length,
    alerts: items.length,
    highPriorityAlerts: countHighPriorityItems(items),
  };
}

export const LIVE_ACTIVITY_FILTERS: LiveActivityFilter[] = [
  { key: "all", label: "All" },
  { key: "in-progress", label: "In Progress" },
  { key: "delayed", label: "Delayed" },
  { key: "starting", label: "Starting Soon" },
  { key: "scheduled", label: "Scheduled" },
  { key: "completed", label: "Completed" },
  { key: "missed", label: "Missed" },
];