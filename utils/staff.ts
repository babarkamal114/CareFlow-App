import type { Variants } from "framer-motion";
import type { BadgeProps } from "@/components/ui";
import type { StaffMember } from "types";
import {
  UserPlus2,
  Mail,
  CheckCircle2,
  RotateCw,
  Trash2,
  User,
  Phone,
  Eye,
  Download,
  type LucideIcon,
} from "lucide-react";

export function getStaggerDelay(index: number, base = 0.05, step = 0.05): number {
  return base + index * step;
}

export interface StaffFormData {
  name: string;
  email: string;
  phone: string;
}

export interface StaffFormField {
  name: keyof StaffFormData;
  label: string;
  placeholder: string;
  icon: LucideIcon;
  type?: "text" | "email";
  /** Show the "Verified / Not verified" hint under the input. */
  showVerification?: boolean;
}

export interface StaffFormSection {
  title: string;
  fields: StaffFormField[];
}

export const EDIT_STAFF_FORM_SECTIONS: StaffFormSection[] = [
  {
    title: "Personal",
    fields: [
      { name: "name", label: "Full name", placeholder: "Full name", icon: User },
    ],
  },
  {
    title: "Contact",
    fields: [
      {
        name: "email",
        label: "Email",
        placeholder: "Email address",
        icon: Mail,
        type: "email",
        showVerification: true,
      },
      {
        name: "phone",
        label: "Phone",
        placeholder: "Phone number (optional)",
        icon: Phone,
      },
    ],
  },
];

export const EDIT_STAFF_SUCCESS_CLOSE_DELAY_MS = 1200;

export function getDefaultStaffFormData(staff: StaffMember): StaffFormData {
  return {
    name: staff.name,
    email: staff.email,
    phone: staff.phone || "",
  };
}

export function validateStaffForm(data: StaffFormData): string | null {
  if (!data.name.trim()) return "Name is required";
  if (!data.email.trim()) return "Email is required";
  return null;
}

export function buildStaffUpdatePayload(
  staff: StaffMember,
  data: StaffFormData,
): Partial<StaffMember> {
  return {
    id: staff.id,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
  };
}

export function getStaffModalInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStaffDisplayName(name: string): string {
  return name || "Unnamed";
}

export function getStaffDisplayEmail(email: string): string {
  return email || "—";
}

export function getEmailVerificationLabel(verified: boolean | undefined): string {
  return verified ? "✓ Verified" : "⚠ Not verified yet";
}

export interface StaffPerformance {
  punctualityPct: number;
  visitCompletionPct: number;
  noteQualityScore: number;
  patientFeedbackScore: number;
}

export type PerformanceColumnKind = "name" | "percent" | "stars";

export interface PerformanceColumn {
  id: string;
  label: string;
  kind: PerformanceColumnKind;
  /** Which field on StaffPerformance this column shows (not used by "name"). */
  field?: keyof StaffPerformance;
}

export const PERFORMANCE_TABLE_COLUMNS: PerformanceColumn[] = [
  { id: "name", label: "Staff member", kind: "name" },
  { id: "punctuality", label: "Punctuality", kind: "percent", field: "punctualityPct" },
  { id: "visits", label: "Visit completion", kind: "percent", field: "visitCompletionPct" },
  { id: "notes", label: "Note quality", kind: "stars", field: "noteQualityScore" },
  { id: "feedback", label: "Patient feedback", kind: "stars", field: "patientFeedbackScore" },
];

export const performanceMetricColorConfig = [
  { threshold: 90, className: "text-success" },
  { threshold: 75, className: "text-warning" },
];

export function getMetricColorClass(pct: number): string {
  for (const cfg of performanceMetricColorConfig) {
    if (pct >= cfg.threshold) return cfg.className;
  }
  return "text-error";
}

export const SCORE_STAR_INDEXES = [1, 2, 3, 4, 5] as const;

export function getStarClassName(starIndex: number, score: number): string {
  return starIndex <= Math.round(score) ? "fill-warning text-warning" : "text-border";
}

export function formatPercent(value: number): string {
  return `${value}%`;
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export type ActivityTone = "default" | "success" | "info" | "danger";

export const activityToneClasses: Record<ActivityTone, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-success-muted text-success",
  info: "bg-info-muted text-info",
  danger: "bg-error-muted text-error",
};

export const staffActivityContainerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const staffActivityItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export interface StaffActivity {
  action: string;
  timestamp: Date | string | null | undefined;
  icon: LucideIcon;
  tone: ActivityTone;
}

export function buildStaffActivities(staff: StaffMember): StaffActivity[] {
  const activities: StaffActivity[] = [
    {
      action: "Account Created",
      timestamp: staff.createdAt,
      icon: UserPlus2,
      tone: "default",
    },
  ];

  if (staff.invitedAt) {
    activities.push({
      action: "Invitation Sent",
      timestamp: staff.invitedAt,
      icon: Mail,
      tone: "info",
    });
  }

  if (staff.acceptedAt) {
    activities.push({
      action: "Invitation Accepted",
      timestamp: staff.acceptedAt,
      icon: CheckCircle2,
      tone: "success",
    });
  }

  activities.push({
    action: "Last Updated",
    timestamp: staff.updatedAt,
    icon: RotateCw,
    tone: "default",
  });

  if (staff.deletedAt) {
    activities.push({
      action: "Account Deleted",
      timestamp: staff.deletedAt,
      icon: Trash2,
      tone: "danger",
    });
  }

  return activities;
}

export type DocumentType =
  | "certification"
  | "license"
  | "insurance"
  | "training"
  | "other";
export type DocumentStatus = "verified" | "pending" | "expired";

export interface StaffDocument {
  id: string;
  name: string;
  type: DocumentType;
  uploadedAt: Date;
  expiresAt?: Date;
  uploadedBy: string;
  url: string;
  size: string;
  status: DocumentStatus;
}

export const MOCK_STAFF_DOCUMENTS: StaffDocument[] = [
  {
    id: "1",
    name: "DBS Check Certificate",
    type: "certification",
    uploadedAt: new Date("2024-01-15"),
    expiresAt: new Date("2027-01-15"),
    uploadedBy: "Admin User",
    url: "#",
    size: "2.4 MB",
    status: "verified",
  },
  {
    id: "2",
    name: "First Aid Training",
    type: "training",
    uploadedAt: new Date("2025-10-20"),
    expiresAt: new Date("2026-10-20"),
    uploadedBy: "Admin User",
    url: "#",
    size: "1.8 MB",
    status: "verified",
  },
  {
    id: "3",
    name: "Professional Indemnity Insurance",
    type: "insurance",
    uploadedAt: new Date("2025-03-10"),
    expiresAt: new Date("2026-08-31"),
    uploadedBy: "Finance Team",
    url: "#",
    size: "3.2 MB",
    status: "expired",
  },
  {
    id: "4",
    name: "Nursing License",
    type: "license",
    uploadedAt: new Date("2023-06-05"),
    expiresAt: new Date("2027-06-05"),
    uploadedBy: "HR Manager",
    url: "#",
    size: "1.5 MB",
    status: "verified",
  },
  {
    id: "5",
    name: "Manual Handling Training Certificate",
    type: "training",
    uploadedAt: new Date("2025-01-25"),
    expiresAt: new Date("2027-01-25"),
    uploadedBy: "Admin User",
    url: "#",
    size: "2.1 MB",
    status: "verified",
  },
];

export const DOCUMENT_UPLOAD_COPY = {
  title: "Upload Document",
  hint: "Drag and drop or click to select a file",
};

export const documentStatusConfig: Record<
  DocumentStatus,
  { containerClass: string; badgeVariant: BadgeProps["variant"] }
> = {
  verified: {
    containerClass: "bg-success-muted border-success/30",
    badgeVariant: "pastel-success",
  },
  pending: {
    containerClass: "bg-warning-muted border-warning/30",
    badgeVariant: "pastel-warning",
  },
  expired: {
    containerClass: "bg-error-muted border-error/30",
    badgeVariant: "pastel-danger",
  },
};

export function getDocumentStatusClasses(status: DocumentStatus): string {
  return documentStatusConfig[status]?.containerClass ?? "bg-muted border-border";
}

export function getDocumentStatusBadgeVariant(
  status: DocumentStatus,
): BadgeProps["variant"] {
  return documentStatusConfig[status]?.badgeVariant ?? "pastel-neutral";
}

export function formatDocumentDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function isDocumentExpiringSoon(expiryDate?: Date): boolean {
  if (!expiryDate) return false;
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiry = new Date(expiryDate);
  return expiry <= thirtyDaysFromNow && expiry > today;
}

export function capitalizeDocumentStatus(status: DocumentStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getDocumentTypeLabel(type: DocumentType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export interface DocumentStat {
  id: string;
  label: string;
  value: number;
  valueClassName: string;
}

export function buildDocumentStats(documents: StaffDocument[]): DocumentStat[] {
  return [
    {
      id: "total",
      label: "Total Documents",
      value: documents.length,
      valueClassName: "text-foreground",
    },
    {
      id: "verified",
      label: "Verified",
      value: documents.filter((d) => d.status === "verified").length,
      valueClassName: "text-success",
    },
    {
      id: "expiring",
      label: "Expiring Soon",
      value: documents.filter((d) => isDocumentExpiringSoon(d.expiresAt)).length,
      valueClassName: "text-warning",
    },
  ];
}

export type DocumentActionId = "preview" | "download" | "delete";

export interface DocumentAction {
  id: DocumentActionId;
  label: string;
  icon: LucideIcon;
  className: string;
}

export const DOCUMENT_ACTIONS: DocumentAction[] = [
  { id: "preview", label: "Preview", icon: Eye, className: "text-muted-foreground hover:bg-muted" },
  { id: "download", label: "Download", icon: Download, className: "text-muted-foreground hover:bg-muted" },
  { id: "delete", label: "Delete", icon: Trash2, className: "text-error hover:bg-error-muted" },
];

export function getDocumentPreviewRows(
  doc: StaffDocument | null,
): { label: string; value: string }[] {
  if (!doc) return [];
  return [
    { label: "File", value: doc.name },
    { label: "Size", value: doc.size },
    { label: "Uploaded", value: formatDocumentDate(doc.uploadedAt) },
    { label: "Status", value: capitalizeDocumentStatus(doc.status) },
  ];
}

export interface AvailabilityDay {
  day: string;
  availableHours: number;
  bookedHours: number;
}

export const AVAILABILITY_WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type AvailabilityState = "unavailable" | "full" | "partial" | "open";

export function getAvailabilityState(day: AvailabilityDay): AvailabilityState {
  if (day.availableHours === 0) return "unavailable";
  if (day.bookedHours >= day.availableHours) return "full";
  if (day.bookedHours > 0) return "partial";
  return "open";
}

export const availabilityCellClasses: Record<Exclude<AvailabilityState, "unavailable">, string> = {
  full: "bg-primary/10 text-primary",
  partial: "bg-warning-muted text-warning",
  open: "bg-muted text-muted-foreground",
};

export function formatBookedHours(day: AvailabilityDay): string {
  return `${day.bookedHours}/${day.availableHours}h`;
}

export const AVAILABILITY_LEGEND: { id: string; label: string; swatchClass: string }[] = [
  { id: "full", label: "Fully booked", swatchClass: "bg-primary/20" },
  { id: "partial", label: "Partially booked", swatchClass: "bg-warning/20" },
  { id: "open", label: "Available, unbooked", swatchClass: "bg-muted" },
];