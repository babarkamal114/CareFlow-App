import type { BadgeProps } from "@/components/ui";
import type {
  DashboardAlert,
  DashboardAlertPriority,
  DashboardMapPin,
  DashboardStaffSnapshot,
  DashboardVisit,
  DashboardVisitFilter,
  DashboardVisitStatus,
  DashboardVisitSummary,
} from "types";

import { pluralize } from "./dashboard-helpers";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

// ---------------------------------------------------------------------------
// Visits
// ---------------------------------------------------------------------------

export const DASHBOARD_VISIT_STATUS_LABELS: Record<DashboardVisitStatus, string> = {
  scheduled: "Scheduled",
  "in-progress": "In Progress",
  completed: "Completed",
  late: "Late",
  missed: "Missed",
};

export const DASHBOARD_VISIT_STATUS_BADGE: Record<DashboardVisitStatus, BadgeVariant> = {
  scheduled: "softMuted",
  "in-progress": "softInfo",
  completed: "softSuccess",
  late: "softWarning",
  missed: "softDanger",
};

export const DASHBOARD_VISIT_FILTER_OPTIONS: { value: DashboardVisitFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-progress", label: DASHBOARD_VISIT_STATUS_LABELS["in-progress"] },
  { value: "scheduled", label: DASHBOARD_VISIT_STATUS_LABELS.scheduled },
  { value: "completed", label: DASHBOARD_VISIT_STATUS_LABELS.completed },
  { value: "late", label: DASHBOARD_VISIT_STATUS_LABELS.late },
  { value: "missed", label: DASHBOARD_VISIT_STATUS_LABELS.missed },
];

export const DASHBOARD_VISIT_COLUMNS: { key: string; label: string; align: "left" | "right" }[] = [
  { key: "patient", label: "Patient", align: "left" },
  { key: "carer", label: "Carer", align: "left" },
  { key: "time", label: "Time", align: "left" },
  { key: "status", label: "Status", align: "left" },
  { key: "duration", label: "Duration", align: "right" },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** "08:30" + 45 mins -> "09:15" */
export function getDashboardVisitEndTime(startTime: string, durationMins: number): string {
  const [hours, minutes] = startTime.split(":").map(Number);
  const total = hours * 60 + minutes + durationMins;
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
}

export function formatDashboardVisitRange(
  visit: Pick<DashboardVisit, "startTime" | "durationMins">,
): string {
  return `${visit.startTime} - ${getDashboardVisitEndTime(visit.startTime, visit.durationMins)}`;
}

/** "Margaret Johnson" -> "MJ" */
export function getDashboardInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

/** "Sarah Williams" -> "Sarah W." */
export function getCarerShortName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return name;
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

export function filterDashboardVisits(
  visits: DashboardVisit[],
  filter: DashboardVisitFilter,
): DashboardVisit[] {
  return filter === "all" ? visits : visits.filter((v) => v.status === filter);
}

/** Completed share of the day's visits, 0-100. */
export function getVisitCompletionRate(summary: DashboardVisitSummary): number {
  return summary.total > 0 ? Math.round((summary.completed / summary.total) * 100) : 0;
}

/** Visits that have not started yet (total minus every other status). */
export function getUpcomingVisitCount(summary: DashboardVisitSummary): number {
  const started = summary.completed + summary.inProgress + summary.late + summary.missed;
  return Math.max(0, summary.total - started);
}

// ---------------------------------------------------------------------------
// Live map
// ---------------------------------------------------------------------------

export interface DashboardMapMarker {
  visitId: string;
  x: number;
  y: number;
  label: string;
  status: DashboardVisitStatus;
}

export const DASHBOARD_MAP_PIN_CLASSES: Record<DashboardVisitStatus, string> = {
  completed: "bg-brand-500",
  "in-progress": "bg-cf-blue-500",
  scheduled: "bg-cf-ink-40",
  late: "bg-cf-amber-500",
  missed: "bg-destructive",
};

/** Joins pins with their visit so each marker knows its label and status. */
export function buildDashboardMapMarkers(
  visits: DashboardVisit[],
  pins: DashboardMapPin[],
): DashboardMapMarker[] {
  const byId = new Map(visits.map((v) => [v.id, v]));
  return pins.flatMap((pin) => {
    const visit = byId.get(pin.visitId);
    if (!visit) return [];
    return [{ visitId: pin.visitId, x: pin.x, y: pin.y, label: visit.patientName, status: visit.status }];
  });
}

// ---------------------------------------------------------------------------
// Alert feed
// ---------------------------------------------------------------------------

export const DASHBOARD_ALERT_PRIORITY_LABELS: Record<DashboardAlertPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const DASHBOARD_ALERT_PRIORITY_BADGE: Record<DashboardAlertPriority, BadgeVariant> = {
  high: "softDanger",
  medium: "softWarning",
  low: "softMuted",
};

const PRIORITY_ORDER: Record<DashboardAlertPriority, number> = { high: 0, medium: 1, low: 2 };

/** Highest priority first, newest first within a priority. */
export function sortDashboardAlerts(alerts: DashboardAlert[]): DashboardAlert[] {
  return [...alerts].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.minutesAgo - b.minutesAgo,
  );
}

export const countHighPriorityAlerts = (alerts: DashboardAlert[]): number =>
  alerts.filter((a) => a.priority === "high").length;

export const getDashboardAlertCountLabel = (count: number): string =>
  `${count} ${pluralize(count, "Item")}`;

/** 12 -> "12m", 540 -> "9h", 2000 -> "1d" */
export function formatDashboardTimeAgo(minutes: number): string {
  if (minutes < 1) return "now";
  if (minutes < 60) return `${Math.floor(minutes)}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;
  return `${Math.floor(minutes / 1440)}d`;
}

// ---------------------------------------------------------------------------
// Staff snapshot
// ---------------------------------------------------------------------------

export interface DashboardStaffSegment {
  key: keyof DashboardStaffSnapshot;
  label: string;
  count: number;
  /** Share of all staff, 0-100, not rounded (round when displaying). */
  percent: number;
  barClass: string;
}

const STAFF_SEGMENT_CONFIG: { key: keyof DashboardStaffSnapshot; label: string; barClass: string }[] = [
  { key: "onShift", label: "On shift", barClass: "bg-brand-500" },
  { key: "available", label: "Available", barClass: "bg-cf-blue-500" },
  { key: "onLeave", label: "On leave", barClass: "bg-cf-amber-500" },
];

export const getDashboardStaffTotal = (s: DashboardStaffSnapshot): number =>
  s.onShift + s.available + s.onLeave;

export function buildDashboardStaffSegments(s: DashboardStaffSnapshot): DashboardStaffSegment[] {
  const total = getDashboardStaffTotal(s);
  return STAFF_SEGMENT_CONFIG.map((c) => ({
    ...c,
    count: s[c.key],
    percent: total > 0 ? (s[c.key] / total) * 100 : 0,
  }));
}