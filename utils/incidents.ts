import {
  User, Tag, Calendar, Users, Paperclip,
  FileText, Clock, AlertCircle, CheckCircle,
  type LucideIcon,
} from "lucide-react";
import type { BadgeProps } from "@/components/ui";
import type {
  Incident,
  IncidentFormData,
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  StatCardProps,
} from "types";
import {
  evidenceTypeConfig,
  incidentSeverityConfig,
  incidentStatusConfig,
  INCIDENT_TYPE_LABELS,
  INCIDENT_TYPE_OPTIONS,
  INCIDENT_SEVERITY_OPTIONS,
} from "./constants";
import {
  mockIncidentAssignedTo,
  mockIncidentReportedBy,
} from "./data";
import {
  getBodyMarkings,
  getIncidentDescriptionFromForm,
  getIncidentTitleFromForm,
} from "./incident-form";

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

export interface IncidentAction {
  id: "add-evidence" | "download-logs" | "close-case";
  label: string;
  icon: LucideIcon;
  danger: boolean;
}

export interface IncidentDetailField {
  icon: LucideIcon;
  label: string;
  value: string;
}

export interface StatusHistoryEntry {
  label: string;
  note: string;
  dotClass: string;
  animate: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                  Evidence                                   */
/* -------------------------------------------------------------------------- */

export function getEvidenceIcon(type: EvidenceType): LucideIcon {
  return evidenceTypeConfig[type]?.icon ?? Paperclip;
}

export function formatEvidenceDate(date: Date): string {
  return date.toLocaleDateString();
}

/* -------------------------------------------------------------------------- */
/*                                   Severity                                  */
/* -------------------------------------------------------------------------- */

export function getSeverityBadgeVariant(
  severity: IncidentSeverity
): BadgeProps["variant"] {
  return incidentSeverityConfig[severity]?.badgeVariant ?? "pastel-neutral";
}

export function getSeverityLabel(severity: IncidentSeverity): string {
  return incidentSeverityConfig[severity]?.label ?? severity.toUpperCase();
}

export function getIncidentTypeOptionLabel(type: IncidentType): string {
  return INCIDENT_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

export function getSeverityOption(severity: IncidentSeverity) {
  return INCIDENT_SEVERITY_OPTIONS.find((o) => o.value === severity);
}

/* -------------------------------------------------------------------------- */
/*                                    Status                                   */
/* -------------------------------------------------------------------------- */

export function getStatusBadgeVariant(
  status: IncidentStatus
): BadgeProps["variant"] {
  return incidentStatusConfig[status]?.badgeVariant ?? "pastel-neutral";
}

/* -------------------------------------------------------------------------- */
/*                                  Formatting                                 */
/* -------------------------------------------------------------------------- */

export function getIncidentTypeLabel(type: IncidentType): string {
  return INCIDENT_TYPE_LABELS[type] ?? type;
}

export function formatIncidentDateTime(date: Date): string {
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
}

export function formatNoteTimestamp(date: Date): string {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/* -------------------------------------------------------------------------- */
/*                                Derivation                                   */
/* -------------------------------------------------------------------------- */

export function getIncidentDetailFields(incident: Incident): IncidentDetailField[] {
  return [
    { icon: User, label: "Patient", value: incident.patientName },
    { icon: Tag, label: "Type", value: getIncidentTypeLabel(incident.type) },
    { icon: Calendar, label: "Date & Time", value: formatIncidentDateTime(incident.dateTime) },
    { icon: User, label: "Reported By", value: incident.reportedBy },
    { icon: Users, label: "Assigned To", value: incident.assignedTo },
  ];
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


export function getDatetimeInputValue(date: Date = new Date()): string {
  return date.toISOString().slice(0, 16);
}

export function getDefaultIncidentFormData(): IncidentFormData {
  return {
    type: "",
    severity: "",
    patientId: "",
    patientName: "",
    dateTime: getDatetimeInputValue(),
    location: "",
    reportedBy: mockIncidentReportedBy,
    reportedByName: "Current User",
    antecedent: "",
    description: "",
    consequence: "",
    injuriesObserved: false,
    injuryDetails: [],
    bodyMapData: { markings: [] },
    immediateActions: "",
    carePlanFollowed: null,
    carePlanDeviationReason: "",
    emergencyServicesCalled: false,
    emergencyServicesDetails: "",
    evidence: [],
    contributingFactors: [],
    followUpPlan: "",
    status: "reported",
    assignedTo: mockIncidentAssignedTo,
    rootCause: "",
    preventiveActions: "",
    lessonsLearned: "",
    isCqcNotifiable: false,
    isRiddorReportable: false,
    isSafeguardingConcern: false,
  };
}

export function buildIncidentPayload(
  form: IncidentFormData
): Omit<Incident, "id" | "createdAt" | "updatedAt"> {
  return {
    patientId: form.patientId,
    patientName: form.patientName,
    type: form.type || "other",
    severity: form.severity || "minor",
    title: getIncidentTitleFromForm(form),
    description: getIncidentDescriptionFromForm(form),
    dateTime: new Date(form.dateTime),
    reportedBy: form.reportedByName.trim() || form.reportedBy,
    assignedTo: form.assignedTo ?? "",
    status: form.status,
    location: form.location,
    antecedent: form.antecedent,
    consequence: form.consequence,
    immediateActions: form.immediateActions,
    carePlanFollowed: form.carePlanFollowed,
    carePlanDeviationReason: form.carePlanDeviationReason,
    emergencyServicesCalled: form.emergencyServicesCalled,
    emergencyServicesDetails: form.emergencyServicesDetails,
    injuriesObserved: form.injuriesObserved,
    injuryDetails: form.injuryDetails,
    bodyMapMarkings: getBodyMarkings(form),
    contributingFactors: form.contributingFactors,
    followUpPlan: form.followUpPlan,
    rootCause: form.rootCause,
    preventiveActions: form.preventiveActions,
    lessonsLearned: form.lessonsLearned,
    isCqcNotifiable: form.isCqcNotifiable,
    isRiddorReportable: form.isRiddorReportable,
    isSafeguardingConcern: form.isSafeguardingConcern,
    investigationNotes: [
      {
        note: `Incident reported by ${form.reportedBy}`,
        author: form.reportedBy,
        timestamp: new Date(),
      },
    ],
    witnesses: [],
    evidence: form.evidence.map((item) => item.url),
  };
}
