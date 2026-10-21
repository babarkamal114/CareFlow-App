import {
  Image, File, FileText, FileUp, Download, XCircle,
  type LucideIcon,
} from "lucide-react";
import type { BadgeProps } from "@/components/ui";
import type {
  IncidentEvidence,
  IncidentMarkType,
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
  InjurySeverity,
} from "types";
import type { EvidenceType, IncidentAction } from "./incidents";


export const EVIDENCE_ACCEPT_TYPES = "image/*,.pdf,.doc,.docx,.mp3,.mp4";

export const evidenceTypeConfig: Record<EvidenceType, { icon: LucideIcon }> = {
  image: { icon: Image },
  document: { icon: File },
  audio: { icon: FileText },
  video: { icon: FileText },
};



export const incidentSeverityConfig: Record<
  IncidentSeverity,
  { badgeVariant: BadgeProps["variant"]; label: string }
> = {
  catastrophic: { badgeVariant: "pastel-danger", label: "CRITICAL" },
  severe: { badgeVariant: "pastel-orange", label: "HIGH" },
  moderate: { badgeVariant: "pastel-warning", label: "MEDIUM" },
  minor: { badgeVariant: "pastel-info", label: "LOW" },
};

export const INCIDENT_SEVERITY_OPTIONS: {
  value: IncidentSeverity;
  label: string;
  color: BadgeProps["variant"];
}[] = [
  { value: "minor", label: "Low", color: "pastel-info" },
  { value: "moderate", label: "Medium", color: "pastel-warning" },
  { value: "severe", label: "High", color: "pastel-danger" },
  { value: "catastrophic", label: "Critical", color: "pastel-danger" },
];



export const incidentStatusConfig: Record<
  IncidentStatus,
  { badgeVariant: BadgeProps["variant"] }
> = {
  reported: { badgeVariant: "pastel-info" },
  investigating: { badgeVariant: "pastel-warning" },
  resolved: { badgeVariant: "pastel-success" },
  closed: { badgeVariant: "pastel-zinc" },
};



export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  fall: "Fall",
  "medication-error": "Medication Error",
  bruise: "Bruise",
  "abuse-allegation": "Abuse Allegation",
  safeguarding: "Safeguarding",
  "missed-visit": "Missed Visit",
  other: "Other",
};

export const INCIDENT_TYPE_OPTIONS: { value: IncidentType; label: string }[] = [
  { value: "fall", label: "Fall / Slip" },
  { value: "medication-error", label: "Medication Error" },
  { value: "bruise", label: "Bruise / Injury" },
  { value: "abuse-allegation", label: "Abuse Allegation" },
  { value: "safeguarding", label: "Safeguarding Concern" },
  { value: "missed-visit", label: "Missed Visit" },
  { value: "other", label: "Other" },
];



export const INCIDENTS_PAGE_TITLE = "Incidents & Safeguarding";

export const INCIDENTS_PAGE_SUBTITLE =
  "Manage incident reporting, investigations, and safeguarding concerns";

export const INCIDENT_TABS = [
  { value: "overview", label: "Overview" },
  { value: "injuries", label: "Injuries" },
  { value: "response", label: "Response" },
  { value: "investigation", label: "Investigation" },
  { value: "evidence", label: "Evidence" },
] as const;

export const INCIDENT_ACTIONS: IncidentAction[] = [
  { id: "add-evidence", label: "Add Evidence", icon: FileUp, danger: false },
  { id: "download-logs", label: "Download Logs", icon: Download, danger: false },
  { id: "close-case", label: "Close Case", icon: XCircle, danger: true },
];

/* -------------------------------------------------------------------------- */
/*                            Incident report form                            */
/* -------------------------------------------------------------------------- */

export const INCIDENT_REPORT_STEPS = [
  { title: "Incident", description: "Type, severity and where it happened" },
  { title: "What Happened", description: "Antecedent, description and consequence" },
  { title: "Injuries", description: "Injuries observed and body map markings" },
  { title: "Response", description: "Actions taken and care plan followed" },
  { title: "Evidence", description: "Evidence, contributing factors and follow up" },
  { title: "Review", description: "Notifiable flags, investigation and submit" },
] as const;

export const INCIDENT_STATUS_OPTIONS: {
  value: IncidentStatus;
  label: string;
}[] = [
  { value: "reported", label: "Reported" },
  { value: "investigating", label: "Investigating" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export const INCIDENT_BODY_PARTS: string[] = [
  "Head",
  "Face",
  "Neck",
  "Shoulder",
  "Upper arm",
  "Elbow",
  "Forearm",
  "Wrist",
  "Hand",
  "Finger",
  "Chest",
  "Abdomen",
  "Back",
  "Hip",
  "Thigh",
  "Knee",
  "Lower leg",
  "Ankle",
  "Foot",
  "Toe",
  "Other",
];

export const INCIDENT_MARK_TYPES: { value: IncidentMarkType; label: string }[] = [
  { value: "bruise", label: "Bruise" },
  { value: "cut", label: "Cut / Laceration" },
  { value: "abrasion", label: "Abrasion / Grazed skin" },
  { value: "burn", label: "Burn / Scald" },
  { value: "other", label: "Other" },
];

export const INJURY_SEVERITY_OPTIONS: {
  value: InjurySeverity;
  label: string;
}[] = [
  { value: "none", label: "No visible injury" },
  { value: "minor", label: "Minor - bruising / skin mark" },
  { value: "moderate", label: "Moderate - swelling, limited movement" },
  { value: "severe", label: "Severe - fracture, hospital treatment" },
];

export const INCIDENT_EVIDENCE_TYPES: {
  value: IncidentEvidence["type"];
  label: string;
}[] = [
  { value: "photo", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "document", label: "Document" },
  { value: "audio", label: "Audio" },
];

export const CONTRIBUTING_FACTOR_OPTIONS: string[] = [
  "Environment (wet floor, clutter, lighting)",
  "Equipment failure or missing equipment",
  "Medication error",
  "Staffing level or skill mix",
  "Communication failure between staff",
  "Inadequate care plan or assessment",
  "Person's health or behaviour",
  "Not following procedure",
  "Training or competency gap",
  "External / weather",
];

export const INCIDENT_MARK_TYPE_HELP: Record<IncidentMarkType, string> = {
  bruise: "Discoloured skin from broken capillaries, e.g. a handprint or fingertip grip.",
  cut: "A break in the skin caused by a sharp object - record length and depth.",
  abrasion: "A graze, e.g. from a fall on a rough surface or dragging.",
  burn: "Heat, hot water, hot drink or radiator contact - note the source.",
  other: "Describe the mark in the notes, e.g. scratch, graze or pressure mark.",
};
