import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlayCircle,
  XCircle,
} from "lucide-react";

import { canAccessModule } from "./dashboard-nav-filter";
import { isoTodayAt } from "./dashboard-helpers";

export type VisitStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "late"
  | "missed"
  | "cancelled";

export interface VisitDTO {
  id: string;
  patientName: string;
  patientAvatar?: string | null;
  carerName: string;
  careTypes: string[];
  startTime: string;
  endTime: string;
  status: VisitStatus;
}

export interface TodaysVisitsResponse {
  visits: VisitDTO[];
  total: number;
  statusCounts: Partial<Record<VisitStatus, number>>;
}

export interface VisitRow {
  id: string;
  patient: {
    name: string;
    avatar?: string;
    initials: string;
    careType: string;
  };
  carer: string;
  time: string;
  status: VisitStatus;
  duration: number;
}

export type StatusTone = "success" | "info" | "warning" | "error" | "muted";

interface StatusMeta {
  label: string;
  badgeVariant: string;
  Icon: LucideIcon;
  tone: StatusTone;
}

export const VISIT_STATUS_META: Record<VisitStatus, StatusMeta> = {
  scheduled: { label: "Scheduled", badgeVariant: "pastel-info", Icon: Clock, tone: "muted" },
  "in-progress": { label: "In Progress", badgeVariant: "pastel-warning", Icon: PlayCircle, tone: "info" },
  completed: { label: "Completed", badgeVariant: "pastel-success", Icon: CheckCircle2, tone: "success" },
  late: { label: "Late", badgeVariant: "pastel-warning", Icon: AlertTriangle, tone: "warning" },
  missed: { label: "Missed", badgeVariant: "pastel-danger", Icon: XCircle, tone: "error" },
  cancelled: { label: "Cancelled", badgeVariant: "pastel-neutral", Icon: XCircle, tone: "muted" },
};

export const VISIT_STATUSES = Object.keys(VISIT_STATUS_META) as VisitStatus[];

export const SUMMARY_STATUSES: VisitStatus[] = [
  "scheduled",
  "completed",
  "in-progress",
  "late",
  "missed",
];

const pick = <T>(fn: (m: StatusMeta) => T) =>
  Object.fromEntries(
    Object.entries(VISIT_STATUS_META).map(([k, m]) => [k, fn(m)])
  ) as Record<VisitStatus, T>;

export const statusPastelMap = pick((m) => m.badgeVariant);
export const statusLabelMap = pick((m) => m.label);

export function getStatusBadgeVariant(status: VisitStatus): string {
  return statusPastelMap[status] || "pastel-neutral";
}

export function formatNameWithInitial(fullName: string): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0).toUpperCase()}.`;
}

export function getInitials(fullName: string): string {
  const parts = (fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function mapVisitToRow(v: VisitDTO): VisitRow {
  const start = new Date(v.startTime);
  const end = new Date(v.endTime);

  return {
    id: v.id,
    patient: {
      name: v.patientName,
      avatar: v.patientAvatar ?? undefined,
      initials: getInitials(v.patientName),
      careType: v.careTypes.join(" + "),
    },
    carer: v.carerName,
    time: `${timeFormat.format(start)} - ${timeFormat.format(end)}`,
    status: v.status,
    duration: Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000)),
  };
}

export function canSeeVisits(role: string): boolean {
  const normalizedRole = (role || "").toLowerCase().trim().replace(/[\s-]+/g, "_");
  return canAccessModule(normalizedRole, "visits");
}


export const MOCK_VISITS: VisitDTO[] = [
  { id: "1", patientName: "Margaret Johnson", carerName: "Sarah Williams", careTypes: ["Personal Care", "Medication"], startTime: isoTodayAt(8, 0), endTime: isoTodayAt(9, 0), status: "completed" },
  { id: "2", patientName: "Robert Chen", carerName: "James O'Brien", careTypes: ["Meal Preparation"], startTime: isoTodayAt(9, 30), endTime: isoTodayAt(10, 30), status: "in-progress" },
  { id: "3", patientName: "Patricia Smith", carerName: "Emma Davis", careTypes: ["Medication", "Personal Care"], startTime: isoTodayAt(11, 0), endTime: isoTodayAt(12, 0), status: "scheduled" },
  { id: "4", patientName: "David Wilson", carerName: "Michael Brown", careTypes: ["Personal Care"], startTime: isoTodayAt(13, 0), endTime: isoTodayAt(14, 0), status: "scheduled" },
  { id: "5", patientName: "Susan Taylor", carerName: "Laura Martinez", careTypes: ["Medication", "Meal", "Personal Care"], startTime: isoTodayAt(15, 0), endTime: isoTodayAt(16, 30), status: "scheduled" },
];

export const MOCK_VISIT_STATUS_COUNTS: TodaysVisitsResponse["statusCounts"] = {
  scheduled: 18,
  completed: 20,
  "in-progress": 6,
  late: 3,
  missed: 1,
};

export interface VisitTableColumn {
  key: string;
  label: string;
  minWidth: number;
  align: "left" | "right";
}

export const VISIT_TABLE_COLUMNS: VisitTableColumn[] = [
  { key: "patient", label: "Patient", minWidth: 200, align: "left" },
  { key: "carer", label: "Carer", minWidth: 150, align: "left" },
  { key: "time", label: "Time", minWidth: 120, align: "left" },
  { key: "status", label: "Status", minWidth: 100, align: "left" },
  { key: "duration", label: "Duration", minWidth: 80, align: "right" },
];

export function filterVisitsByStatus(visits: VisitDTO[], status?: VisitStatus): VisitDTO[] {
  return status ? visits.filter((v) => v.status === status) : visits;
}

export function getTodaysVisitRows(status?: VisitStatus): VisitRow[] {
  return filterVisitsByStatus(MOCK_VISITS, status).map(mapVisitToRow);
}

export function toggleVisitStatusFilter(
  current: VisitStatus | undefined,
  clicked: VisitStatus
): VisitStatus | undefined {
  return current === clicked ? undefined : clicked;
}

export function getVisitFilterButtonLabel(status?: VisitStatus): string {
  return status ? `Filter · ${statusLabelMap[status]}` : "Filter";
}

export interface VisitFilterOption {
  status: VisitStatus;
  text: string; 
  isActive: boolean;
}

export function buildVisitFilterOptions(activeStatus?: VisitStatus): VisitFilterOption[] {
  return VISIT_STATUSES.map((status) => {
    const count = MOCK_VISIT_STATUS_COUNTS[status];
    return {
      status,
      text: `${statusLabelMap[status]}${count !== undefined ? ` (${count})` : ""}`,
      isActive: activeStatus === status,
    };
  });
}


export interface VisitStatusSummary {
  status: VisitStatus;
  label: string;
  Icon: LucideIcon;
  tone: StatusTone;
  value: number;
}

export function buildVisitStatusSummary(
  counts: TodaysVisitsResponse["statusCounts"] = MOCK_VISIT_STATUS_COUNTS
): VisitStatusSummary[] {
  return SUMMARY_STATUSES.map((status) => {
    const { label, Icon, tone } = VISIT_STATUS_META[status];
    return { status, label, Icon, tone, value: counts[status] ?? 0 };
  });
}
