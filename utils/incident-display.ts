import type { BadgeProps } from "@/components/ui";
import type {
  Incident,
  IncidentMarkType,
  InjurySeverity,
} from "types";
import {
  INJURY_SEVERITY_OPTIONS,
  INCIDENT_MARK_TYPES,
} from "./constants";

export interface IncidentFlag {
  id: "cqc" | "riddor" | "safeguarding";
  label: string;
  description: string;
}

export function getIncidentFlags(incident: Incident): IncidentFlag[] {
  const flags: IncidentFlag[] = [];
  if (incident.isCqcNotifiable) {
    flags.push({
      id: "cqc",
      label: "CQC notifiable",
      description: "Reported to the Care Quality Commission as a notifiable incident.",
    });
  }
  if (incident.isRiddorReportable) {
    flags.push({
      id: "riddor",
      label: "RIDDOR reportable",
      description: "Reportable to the Health and Safety Executive under RIDDOR.",
    });
  }
  if (incident.isSafeguardingConcern) {
    flags.push({
      id: "safeguarding",
      label: "Safeguarding concern",
      description: "Referred or awaiting referral to the local safeguarding board.",
    });
  }
  return flags;
}

export function isIncidentFlagged(incident: Incident): boolean {
  return getIncidentFlags(incident).length > 0;
}

export function getCarePlanFollowedLabel(followed?: boolean | null): string {
  if (followed === null || followed === undefined) return "Not recorded";
  return followed ? "Care plan followed as written" : "Care plan deviated";
}

export function getCarePlanFollowedVariant(
  followed?: boolean | null
): BadgeProps["variant"] {
  if (followed === null || followed === undefined) return "softMuted";
  return followed ? "softSuccess" : "softWarning";
}

export function getInjurySeverityLabel(severity?: InjurySeverity): string {
  if (!severity) return "-";
  return (
    INJURY_SEVERITY_OPTIONS.find((option) => option.value === severity)?.label ??
    severity
  );
}

export function getInjurySeverityVariant(
  severity?: InjurySeverity
): BadgeProps["variant"] {
  switch (severity) {
    case "severe":
      return "softDanger";
    case "moderate":
      return "softWarning";
    case "minor":
      return "softInfo";
    default:
      return "softMuted";
  }
}

export function getBodyMarkTypeLabel(markType?: IncidentMarkType): string {
  if (!markType) return "-";
  return (
    INCIDENT_MARK_TYPES.find((option) => option.value === markType)?.label ??
    markType
  );
}

export function getEvidenceFileName(url: string): string {
  const cleaned = url.split("?")[0].split("#")[0];
  const segments = cleaned.split("/").filter(Boolean);
  return segments[segments.length - 1] || cleaned;
}

export function getIncidentEvidenceCount(incident: Incident): number {
  return incident.evidence?.length ?? 0;
}

export function getIncidentInjuryCount(incident: Incident): number {
  return incident.injuryDetails?.length ?? 0;
}

export function getWitnessNames(incident: Incident): string[] {
  return (incident.witnesses ?? []).filter(
    (witness) => witness.trim().toLowerCase() !== "none"
  );
}