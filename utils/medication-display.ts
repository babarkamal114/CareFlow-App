import type { BadgeProps } from "@/components/ui";
import { AlertTriangle, CheckCircle2, Clock, Hourglass, MinusCircle, XCircle } from "lucide-react";
import type {
  ControlledEntryKind, DoseState, MedAlertKind, MedAlertSeverity, MedicationFrequency, MedicationRoute, MedicationType,
  PrnEffectiveness, PrnFollowUpState, ReasonCode, RoundFilter,
} from "types";

type BadgeVariant = BadgeProps["variant"];
export type MedTone = "success" | "warning" | "error" | "info" | "muted";

export const MED_TONE_TEXT: Record<MedTone, string> = { success: "text-success", warning: "text-warning", error: "text-error", info: "text-info", muted: "text-cf-ink-40" };
export const MED_TONE_PANEL: Record<MedTone, string> = {
  success: "bg-success-muted border-success/20", warning: "bg-warning-muted border-warning/20", error: "bg-error-muted border-error/20",
  info: "bg-info-muted border-info/20", muted: "bg-cf-surface-muted border-cf-border",
};
export const MED_TONE_BAR: Record<MedTone, string> = { success: "bg-success", warning: "bg-warning", error: "bg-error", info: "bg-info", muted: "bg-cf-ink-20" };
export const MED_TONE_PILL_ACTIVE: Record<MedTone, string> = {
  success: "bg-success text-success-foreground border-success", warning: "bg-warning text-warning-foreground border-warning",
  error: "bg-error text-error-foreground border-error", info: "bg-info text-info-foreground border-info", muted: "bg-cf-ink-40 text-cf-surface border-cf-ink-40",
};

const toOptions = <T extends string>(labels: Record<T, string>) =>
  (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));

export const DOSE_STATE_CONFIG: Record<DoseState, { label: string; badge: BadgeVariant; tone: MedTone; Icon: typeof Clock }> = {
  administered: { label: "Administered", badge: "pastel-success", tone: "success", Icon: CheckCircle2 },
  "self-administered": { label: "Self-administered", badge: "pastel-success", tone: "success", Icon: CheckCircle2 },
  refused: { label: "Refused", badge: "pastel-danger", tone: "error", Icon: XCircle },
  omitted: { label: "Omitted", badge: "pastel-warning", tone: "warning", Icon: MinusCircle },
  "not-available": { label: "Not available", badge: "pastel-warning", tone: "warning", Icon: MinusCircle },
  due: { label: "Due now", badge: "pastel-info", tone: "info", Icon: Clock },
  missed: { label: "Missed", badge: "pastel-danger", tone: "error", Icon: AlertTriangle },
  upcoming: { label: "Upcoming", badge: "pastel-neutral", tone: "muted", Icon: Hourglass },
};

export const MEDICATION_TYPE_CONFIG: Record<MedicationType, { label: string; badge: BadgeVariant }> = {
  regular: { label: "Regular", badge: "pastel-neutral" },
  prn: { label: "PRN", badge: "pastel-info" },
  controlled: { label: "Controlled", badge: "pastel-purple" },
  "short-course": { label: "Short course", badge: "pastel-warning" },
  "variable-dose": { label: "Variable dose", badge: "pastel-indigo" },
};

export const ROUTE_LABEL: Record<MedicationRoute, string> = {
  oral: "Oral", topical: "Topical", inhaled: "Inhaled", injection: "Injection", "eye-drops": "Eye drops", sublingual: "Sublingual",
};
export const FREQUENCY_LABEL: Record<MedicationFrequency, string> = {
  "once-daily": "Once daily", "twice-daily": "Twice daily", "three-daily": "Three times daily", "four-daily": "Four times daily",
  "with-meals": "With meals", "as-required": "As required (PRN)",
};
export const FREQUENCY_DEFAULT_TIMES: Record<MedicationFrequency, string[]> = {
  "once-daily": ["08:00"], "twice-daily": ["08:00", "20:00"], "three-daily": ["08:00", "14:00", "20:00"],
  "four-daily": ["08:00", "12:00", "16:00", "20:00"], "with-meals": ["08:00", "12:30", "18:00"], "as-required": [],
};
export const REASON_LABEL: Record<ReasonCode, string> = {
  "patient-asleep": "Patient asleep", nausea: "Nausea / vomiting", "no-stock": "No stock available", "gp-instruction": "GP instruction to hold",
  "clinical-judgement": "Clinical judgement", "patient-unwell": "Patient unwell", other: "Other (add a note)",
};
export const OUTCOME_LABEL = {
  administered: "Administered", refused: "Refused", omitted: "Omitted", "not-available": "Not available", "self-administered": "Self-administered",
} as const;
export const EFFECTIVENESS_LABEL: Record<PrnEffectiveness, string> = { effective: "Effective", partial: "Partly effective", "not-effective": "Not effective" };
export const EFFECTIVENESS_BADGE: Record<PrnEffectiveness, BadgeVariant> = { effective: "pastel-success", partial: "pastel-warning", "not-effective": "pastel-danger" };
export const PRN_FOLLOWUP_CONFIG: Record<PrnFollowUpState, { label: string; badge: BadgeVariant }> = {
  waiting: { label: "Check in 30–60 min", badge: "pastel-neutral" },
  due: { label: "Follow-up due", badge: "pastel-info" },
  overdue: { label: "Follow-up overdue", badge: "pastel-danger" },
  done: { label: "Checked", badge: "pastel-success" },
};
export const CONTROLLED_KIND_LABEL: Record<ControlledEntryKind, string> = {
  administration: "Administered", receipt: "Stock received", disposal: "Disposed / returned", "stock-check": "Stock check",
};
export const ROUND_FILTER_LABEL: Record<RoundFilter, string> = { all: "All doses", attention: "Needs attention", upcoming: "Upcoming", done: "Recorded" };
export const ALERT_SEVERITY_CONFIG: Record<MedAlertSeverity, { label: string; badge: BadgeVariant; tone: MedTone }> = {
  urgent: { label: "Urgent", badge: "pastel-danger", tone: "error" },
  warning: { label: "Warning", badge: "pastel-warning", tone: "warning" },
  info: { label: "Info", badge: "pastel-info", tone: "info" },
};
export const ALERT_KIND_LABEL: Record<MedAlertKind, string> = {
  "missed-dose": "Missed dose", "omission-escalation": "Omission escalation", interaction: "Interaction", "medication-change": "Medication change",
  "prn-followup": "PRN follow-up", "stock-discrepancy": "Stock discrepancy",
};
export const ALERT_ACTION_LABEL: Record<MedAlertKind, string> = {
  "missed-dose": "Go to round", "omission-escalation": "View audit", interaction: "View profile", "medication-change": "View profile",
  "prn-followup": "Go to PRN", "stock-discrepancy": "Go to controlled drugs",
};

export const ROUTE_OPTIONS = toOptions(ROUTE_LABEL);
export const FREQUENCY_OPTIONS = toOptions(FREQUENCY_LABEL);
export const REASON_OPTIONS = toOptions(REASON_LABEL);
export const OUTCOME_OPTIONS = toOptions(OUTCOME_LABEL);
export const ROUND_FILTER_OPTIONS = toOptions(ROUND_FILTER_LABEL);
export const EFFECTIVENESS_OPTIONS = toOptions(EFFECTIVENESS_LABEL);
export const MEDICATION_TYPE_OPTIONS = toOptions({ regular: "Regular", prn: "PRN (as needed)", controlled: "Controlled drug", "short-course": "Short course", "variable-dose": "Variable dose" } as Record<MedicationType, string>);
export const CONTROLLED_ENTRY_OPTIONS = [
  { value: "receipt", label: CONTROLLED_KIND_LABEL.receipt }, { value: "disposal", label: CONTROLLED_KIND_LABEL.disposal },
  { value: "stock-check", label: CONTROLLED_KIND_LABEL["stock-check"] },
] as const;
