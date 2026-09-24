import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlayCircle,
  XCircle,
} from "lucide-react";

import { canAccessModule } from "./dashboard-nav-filter";

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