import type { BadgeProps } from "@/components/ui";
import {
  AlertTriangle, Award, Bell, CheckCircle2, Clock, FileText, GraduationCap, Heart, Shield, User, Users, XCircle,
} from "lucide-react";
import type {
  AlertSeverity, AlertType, AuditEntity, CqcQuestionId, RegCategory, RegStatus, ScoreBand, SignatureDocType,
  SignatureStatus,
} from "types";

type BadgeVariant = BadgeProps["variant"];
export type Tone = "success" | "warning" | "error" | "info" | "muted";

export const TONE_BAR: Record<Tone, string> = {
  success: "bg-success", warning: "bg-warning", error: "bg-error", info: "bg-info", muted: "bg-cf-ink-20",
};
export const TONE_TEXT: Record<Tone, string> = {
  success: "text-success", warning: "text-warning", error: "text-error", info: "text-info", muted: "text-cf-ink-40",
};
export const TONE_PANEL: Record<Tone, string> = {
  success: "bg-success-muted border-success/20", warning: "bg-warning-muted border-warning/20",
  error: "bg-error-muted border-error/20", info: "bg-info-muted border-info/20", muted: "bg-cf-surface-muted border-cf-border",
};
export const TONE_PILL_ACTIVE: Record<Tone, string> = {
  success: "bg-success text-success-foreground border-success", warning: "bg-warning text-warning-foreground border-warning",
  error: "bg-error text-error-foreground border-error", info: "bg-info text-info-foreground border-info",
  muted: "bg-cf-ink-40 text-cf-surface border-cf-ink-40",
};

// ---- CQC score bands ----
export const BAND_CONFIG: Record<ScoreBand, { label: string; badge: BadgeVariant; tone: Tone }> = {
  good: { label: "Good", badge: "pastel-success", tone: "success" },
  "needs-improvement": { label: "Needs Improvement", badge: "pastel-warning", tone: "warning" },
  "requires-action": { label: "Requires Action", badge: "pastel-danger", tone: "error" },
};

export const QUESTION_META: Record<CqcQuestionId, { label: string; Icon: typeof Shield }> = {
  safe: { label: "Safe", Icon: Shield },
  effective: { label: "Effective", Icon: Heart },
  caring: { label: "Caring", Icon: Users },
  responsive: { label: "Responsive", Icon: Clock },
  "well-led": { label: "Well-Led", Icon: Award },
};

export const QUESTION_LABELS = Object.fromEntries(
  Object.entries(QUESTION_META).map(([id, m]) => [id, m.label]),
) as Record<CqcQuestionId, string>;

// ---- Regulations ----
export const REG_STATUS_CONFIG: Record<RegStatus, { badge: BadgeVariant; tone: Tone; border: string }> = {
  Compliant: { badge: "pastel-success", tone: "success", border: "border-l-[3px] border-l-success" },
  Attention: { badge: "pastel-warning", tone: "warning", border: "border-l-[3px] border-l-warning" },
  Risk: { badge: "pastel-danger", tone: "error", border: "border-l-[3px] border-l-error" },
  "N/A": { badge: "secondary", tone: "muted", border: "border-l-[3px] border-l-cf-ink-20" },
};

export const CATEGORY_STYLE: Record<RegCategory, string> = {
  Safe: "bg-info-muted text-info", Effective: "bg-success-muted text-success", Caring: "bg-warning-muted text-warning",
  Responsive: "bg-info-muted text-info", "Well-Led": "bg-success-muted text-success",
};

export const REG_CATEGORIES: (RegCategory | "All")[] = ["All", "Safe", "Effective", "Caring", "Responsive", "Well-Led"];
export const REG_STATUSES: (RegStatus | "All")[] = ["All", "Compliant", "Attention", "Risk", "N/A"];
export const REG_STATUS_PILL_TONE: Record<RegStatus | "All", Tone> = {
  All: "success", Compliant: "success", Attention: "warning", Risk: "error", "N/A": "muted",
};

// ---- Alerts ----
export const ALERT_TYPE_ICON: Record<AlertType, typeof Shield> = {
  training: GraduationCap, document: FileText, dbs: Shield, mar: FileText, note: FileText, supervision: User,
};
export const ALERT_TYPE_LABEL: Record<AlertType, string> = {
  training: "Training", document: "Documentation", dbs: "DBS", mar: "Medication (MAR)", note: "Daily notes", supervision: "Supervision",
};
export const ALERT_SEVERITY_CONFIG: Record<AlertSeverity, { icon: typeof Shield; label: string; badge: BadgeVariant; tone: Tone }> = {
  urgent: { icon: XCircle, label: "Urgent", badge: "pastel-danger", tone: "error" },
  warning: { icon: AlertTriangle, label: "Warning", badge: "pastel-warning", tone: "warning" },
  info: { icon: Bell, label: "Info", badge: "pastel-info", tone: "info" },
};

// ---- Audit trail ----
export const AUDIT_ENTITIES: (AuditEntity | "All")[] = ["All", "Plan", "Visit", "MAR", "Incident", "Risk", "Signature"];
export const AUDIT_ENTITY_BADGE: Record<AuditEntity, BadgeVariant> = {
  Plan: "pastel-success", Visit: "pastel-info", MAR: "pastel-info", Incident: "pastel-danger", Risk: "pastel-warning", Signature: "pastel-success",
};
export const AUDIT_ENTITY_HREF: Record<AuditEntity, string> = {
  Plan: "/care-plans", Visit: "/scheduling", MAR: "/medications", Incident: "/incidents", Risk: "/patients", Signature: "/care-plans",
};

// ---- Signatures ----
export const SIGNATURE_STATUS_CONFIG: Record<SignatureStatus, { icon: typeof Shield; label: string; badge: BadgeVariant; tone: Tone }> = {
  signed: { icon: CheckCircle2, label: "Signed", badge: "pastel-success", tone: "success" },
  pending: { icon: Clock, label: "Pending", badge: "pastel-warning", tone: "warning" },
  overdue: { icon: AlertTriangle, label: "Overdue", badge: "pastel-danger", tone: "error" },
};
export const SIGNATURE_TYPE_STYLE: Record<SignatureDocType, string> = {
  "Care Plan": "bg-info-muted text-info", "Consent Form": "bg-cf-surface-muted text-cf-ink-60", "Medication Auth": "bg-warning-muted text-warning",
};
