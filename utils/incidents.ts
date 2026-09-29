import {
  Image, File, FileText, Paperclip,
  User, Tag, Calendar, Users,
  FileUp, Download, XCircle, CheckCircle,
  Clock, AlertCircle,
  type LucideIcon,
} from "lucide-react";
import type { BadgeProps } from "@/components/ui";
import type {
  Incident,
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  StatCardProps,
} from "@/types";

export interface Evidence {
  id: string;
  name: string;
  type: EvidenceType;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  size: number;
}

export type EvidenceType = "image" | "document" | "audio" | "video";

export const MOCK_EVIDENCE: Evidence[] = [
  {
    id: "1",
    name: "incident-photo-1.jpg",
    type: "image",
    url: "/images/incident-1.jpg",
    uploadedBy: "Sarah Johnson",
    uploadedAt: new Date("2024-03-15T14:30:00"),
    size: 2450000,
  },
  {
    id: "2",
    name: "witness-statement.pdf",
    type: "document",
    url: "/documents/witness-statement.pdf",
    uploadedBy: "Michael Chen",
    uploadedAt: new Date("2024-03-16T09:15:00"),
    size: 450000,
  },
];


export const evidenceTypeConfig: Record<EvidenceType, { icon: LucideIcon }> = {
  image: { icon: Image },
  document: { icon: File },
  audio: { icon: FileText },
  video: { icon: FileText },
};


export function getEvidenceIcon(type: EvidenceType): LucideIcon {
  return evidenceTypeConfig[type]?.icon ?? Paperclip;
}

export function formatEvidenceDate(date: Date): string {
  return date.toLocaleDateString();
}


export const incidentSeverityConfig: Record<
  IncidentSeverity,
  { badgeVariant: BadgeProps["variant"]; label: string }
> = {
  critical: { badgeVariant: "pastel-danger", label: "CRITICAL" },
  high: { badgeVariant: "pastel-orange", label: "HIGH" },
  medium: { badgeVariant: "pastel-warning", label: "MEDIUM" },
  low: { badgeVariant: "pastel-info", label: "LOW" },
};

export function getSeverityBadgeVariant(
  severity: IncidentSeverity
): BadgeProps["variant"] {
  return incidentSeverityConfig[severity]?.badgeVariant ?? "pastel-neutral";
}

export function getSeverityLabel(severity: IncidentSeverity): string {
  return incidentSeverityConfig[severity]?.label ?? severity.toUpperCase();
}

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  fall: "Fall",
  "medication-error": "Medication Error",
  bruise: "Bruise",
  "abuse-allegation": "Abuse Allegation",
  safeguarding: "Safeguarding",
  "missed-visit": "Missed Visit",
  other: "Other",
};

export function getIncidentTypeLabel(type: IncidentType): string {
  return INCIDENT_TYPE_LABELS[type] ?? type;
}

export function formatIncidentDateTime(date: Date): string {
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
}

export function formatNoteTimestamp(date: Date): string {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}


export interface IncidentDetailField {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function getIncidentDetailFields(incident: Incident): IncidentDetailField[] {
  return [
    { icon: User, label: "Patient", value: incident.patientName },
    { icon: Tag, label: "Type", value: getIncidentTypeLabel(incident.type) },
    { icon: Calendar, label: "Date & Time", value: formatIncidentDateTime(incident.dateTime) },
    { icon: User, label: "Reported By", value: incident.reportedBy },
    { icon: Users, label: "Assigned To", value: incident.assignedTo },
  ];
}

export interface StatusHistoryEntry {
  label: string;
  note: string;
  dotClass: string;
  animate: boolean;
}

export function getIncidentStatusHistory(incident: Incident): StatusHistoryEntry[] {
  const entries: StatusHistoryEntry[] = [
    {
      label: "Reported",
      note: formatIncidentDateTime(incident.dateTime),
      dotClass: "bg-green-500",
      animate: true,
    },
  ];

  if (incident.status !== "reported") {
    entries.push({
      label: "Investigating",
      note: "Investigation in progress",
      dotClass: "bg-yellow-500",
      animate: true,
    });
  }

  if (incident.status === "resolved" || incident.status === "closed") {
    entries.push({
      label: "Resolved",
      note: "Incident resolved",
      dotClass: "bg-blue-500",
      animate: false,
    });
  }

  if (incident.status === "closed") {
    entries.push({
      label: "Closed",
      note: "Case closed",
      dotClass: "bg-gray-500",
      animate: false,
    });
  }

  return entries;
}


export function canSubmitNote(note: string): boolean {
  return note.trim().length > 0;
}

export const INCIDENT_TABS = [
  { value: "info", label: "Info" },
  { value: "logs", label: "Logs" },
  { value: "evidence", label: "Evidence" },
] as const;


export const incidentStatusConfig: Record<
  IncidentStatus,
  { badgeVariant: BadgeProps["variant"] }
> = {
  reported: { badgeVariant: "pastel-info" },
  investigating: { badgeVariant: "pastel-warning" },
  resolved: { badgeVariant: "pastel-success" },
  closed: { badgeVariant: "pastel-zinc" },
};

export function getStatusBadgeVariant(
  status: IncidentStatus
): BadgeProps["variant"] {
  return incidentStatusConfig[status]?.badgeVariant ?? "pastel-neutral";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export interface IncidentAction {
  id: "add-evidence" | "download-logs" | "close-case";
  label: string;
  icon: LucideIcon;
  danger: boolean;
}

export const INCIDENT_ACTIONS: IncidentAction[] = [
  { id: "add-evidence", label: "Add Evidence", icon: FileUp, danger: false },
  { id: "download-logs", label: "Download Logs", icon: Download, danger: false },
  { id: "close-case", label: "Close Case", icon: XCircle, danger: true },
];

export const INCIDENTS_PAGE_TITLE = "Incidents & Safeguarding";

export const INCIDENTS_PAGE_SUBTITLE =
  "Manage incident reporting, investigations, and safeguarding concerns";

export function getOpenIncidentCount(incidents: Incident[]): number {
  return incidents.filter(
    (i) => i.status === "reported" || i.status === "investigating"
  ).length;
}

export function getResolvedIncidentCount(incidents: Incident[]): number {
  return incidents.filter(
    (i) => i.status === "resolved" || i.status === "closed"
  ).length;
}

export function getOverdueIncidentCount(incidents: Incident[]): number {
  return incidents.filter((i) => {
    if (i.status === "resolved" || i.status === "closed") return false;
    const reviewDate = i.nextReviewDate || i.createdAt;
    return new Date(reviewDate) < new Date();
  }).length;
}

export function getThisMonthIncidentCount(incidents: Incident[]): number {
  const now = new Date();
  return incidents.filter((i) => {
    const d = new Date(i.dateTime);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
}

export function getResolutionRate(incidents: Incident[]): number {
  if (incidents.length === 0) return 0;
  return Math.round((getResolvedIncidentCount(incidents) / incidents.length) * 100);
}

export function getIncidentStatCards(incidents: Incident[]): StatCardProps[] {
  const total = incidents.length;
  const open = getOpenIncidentCount(incidents);
  const resolved = getResolvedIncidentCount(incidents);
  const overdue = getOverdueIncidentCount(incidents);
  const thisMonth = getThisMonthIncidentCount(incidents);
  const thisMonthPct = total > 0 ? Math.round((thisMonth / total) * 100) : 0;
  const resolutionRate = getResolutionRate(incidents);

  return [
    {
      label: "Total Incidents",
      value: total.toLocaleString(),
      Icon: FileText,
      description: `${thisMonth} this month`,
      showScore: false,
      showTrend: true,
      trend: "up",
      hasCqcScore: false,
      hasValueBadge: true,
      valueBadgeValue: `${thisMonthPct}%`,
      badgeVariant: "softSuccess",
    },
    {
      label: "Open Incidents",
      value: open.toLocaleString(),
      Icon: AlertCircle,
      description: "Active cases",
      showScore: false,
      showTrend: false,
      hasCqcScore: false,
      hasValueBadge: true,
      valueBadgeValue: open > 0 ? `${open} open` : "Clear",
      badgeVariant: open > 0 ? "softDanger" : "softSuccess",
    },
    {
      label: "Overdue",
      value: overdue.toLocaleString(),
      Icon: Clock,
      description: "Past review date",
      showScore: false,
      showTrend: false,
      hasCqcScore: false,
      hasValueBadge: true,
      valueBadgeValue: overdue > 0 ? `${overdue} overdue` : "On track",
      badgeVariant: overdue > 0 ? "softWarning" : "softSuccess",
    },
    {
      label: "Resolved",
      value: resolved.toLocaleString(),
      Icon: CheckCircle,
      description: "Successfully closed",
      showScore: true,
      score: resolutionRate,
      showTrend: false,
      hasCqcScore: false,
      hasValueBadge: false,
      badgeVariant: "softSuccess",
    },
  ];
}

export const INCIDENT_TYPE_OPTIONS: { value: IncidentType; label: string }[] = [
  { value: "fall", label: "Fall / Slip" },
  { value: "medication-error", label: "Medication Error" },
  { value: "bruise", label: "Bruise / Injury" },
  { value: "abuse-allegation", label: "Abuse Allegation" },
  { value: "safeguarding", label: "Safeguarding Concern" },
  { value: "missed-visit", label: "Missed Visit" },
  { value: "other", label: "Other" },
];

export const INCIDENT_SEVERITY_OPTIONS: {
  value: IncidentSeverity;
  label: string;
  color: BadgeProps["variant"];
}[] = [
  { value: "low", label: "Low", color: "pastel-info" },
  { value: "medium", label: "Medium", color: "pastel-warning" },
  { value: "high", label: "High", color: "pastel-danger" },
  { value: "critical", label: "Critical", color: "pastel-danger" },
];

export function getIncidentTypeOptionLabel(type: IncidentType): string {
  return INCIDENT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

export function getSeverityOption(severity: IncidentSeverity) {
  return INCIDENT_SEVERITY_OPTIONS.find((o) => o.value === severity);
}

export interface IncidentFormData {
  type: IncidentType | "";
  severity: IncidentSeverity | "";
  title: string;
  description: string;
  patientName: string;
  patientId: string;
  dateTime: string;
  location: string;
  reportedBy: string;
  assignedTo: string;
}

export function getDatetimeInputValue(date: Date = new Date()): string {
  return date.toISOString().slice(0, 16);
}

export const INCIDENT_REPORTED_BY_PLACEHOLDER = "Current User (placeholder)";
export const INCIDENT_ASSIGNED_TO_PLACEHOLDER = "John Manager (placeholder)";

export function getDefaultIncidentFormData(): IncidentFormData {
  return {
    type: "",
    severity: "",
    title: "",
    description: "",
    patientName: "",
    patientId: "",
    dateTime: getDatetimeInputValue(),
    location: "",
    reportedBy: INCIDENT_REPORTED_BY_PLACEHOLDER,
    assignedTo: INCIDENT_ASSIGNED_TO_PLACEHOLDER,
  };
}

export function isIncidentStepOneValid(form: IncidentFormData): boolean {
  return Boolean(form.type && form.severity);
}

export function isIncidentStepTwoValid(form: IncidentFormData): boolean {
  return Boolean(form.patientName && form.title && form.description);
}

export function buildIncidentPayload(
  form: IncidentFormData
): Omit<Incident, "id" | "createdAt" | "updatedAt"> {
  return {
    ...form,
    type: form.type || "other",
    severity: form.severity || "low",
    dateTime: new Date(form.dateTime),
    status: "reported",
    investigationNotes: [
      {
        note: `Incident reported by ${form.reportedBy}`,
        author: form.reportedBy,
        timestamp: new Date(),
      },
    ],
    witnesses: [],
    evidence: [],
  };
}

export const EVIDENCE_ACCEPT_TYPES = "image/*,.pdf,.doc,.docx,.mp3,.mp4";