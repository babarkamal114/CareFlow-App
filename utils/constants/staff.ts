import {
  BriefcaseBusiness,
  CalendarClock,
  CircleCheck,
  CircleSlash,
  FileText,
  GraduationCap,
  History,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StaffDrawerTabId } from "utils";
import type { ComplianceBreakdown, DocumentTypeGuideItem, InterimCertificate } from "types";

export const TRAINING_MODULES = [
  "Safeguarding",
  "Medication",
  "First Aid",
  "Moving & Handling",
  "Fire Safety",
  "Infection Control",
] as const;

export const DOCUMENT_TYPE_GUIDE: DocumentTypeGuideItem[] = [
  { type: "contract", hint: "Required — the signed employment contract." },
  { type: "passport", hint: "Photo ID used for the right to work check." },
  { type: "dbs_certificate", hint: "The enhanced DBS certificate." },
  { type: "training_cert", hint: "Any mandatory training certificates." },
  { type: "other", hint: "Anything else relevant to this appointment." },
];


export const PANEL_CLASS = "px-4 pb-6 pt-5 sm:px-6";

export const PRIMARY_TABS: StaffDrawerTabId[] = ["profile", "employment", "vetting", "training"];
export const OVERFLOW_TABS: StaffDrawerTabId[] = ["availability", "documents", "permissions", "activity"];

export const TAB_LABELS: Record<StaffDrawerTabId, string> = {
  profile: "Profile",
  employment: "Employment",
  vetting: "Vetting",
  training: "Training",
  availability: "Availability",
  documents: "Documents",
  permissions: "Permissions",
  activity: "Activity",
};

export const TAB_ICONS: Record<StaffDrawerTabId, LucideIcon> = {
  profile: UserRound,
  employment: BriefcaseBusiness,
  vetting: ShieldCheck,
  training: GraduationCap,
  availability: CalendarClock,
  documents: FileText,
  permissions: KeyRound,
  activity: History,
};

export const TRIGGER_CLASS =
  "h-10 flex-none gap-1.5 rounded-none px-3 text-[13px] font-semibold data-active:text-primary";

export const TAB_GAP = 4;

export const CONTAINER_GAP = 8;

export const ESTIMATED_OVERFLOW_WIDTH = 96;

export const DRAWER_ACTION_BUTTON =
  "text-cf-ink-60 transition-transform duration-200 hover:scale-105 active:scale-95";

export const STATUS_DOT_TONE = {
  ACTIVE: "brand",
  SUSPENDED: "red",
  TERMINATED: "red",
} as const;

export const COMPLIANCE_TONE = {
  success: "solidSuccess",
  warning: "solidWarning",
  danger: "solidDanger",
} as const;

export const COMPLIANCE_ICON = {
  success: CircleCheck,
  warning: ShieldAlert,
  danger: CircleSlash,
} as const;

export const COMPLIANCE_ALERT_VARIANT = {
  success: "success",
  warning: "warning",
  danger: "error",
} as const;

export const CHECKLIST_LABELS: Record<keyof ComplianceBreakdown, string> = {
  rightToWork: "Right to work verified",
  dbs: "DBS on record",
  dbsClear: "DBS cleared",
  driving: "Driving / travel details",
  training: "Mandatory training complete",
  references: "Two references received",
  documents: "Signed contract uploaded",
};

export const CHECKLIST_ORDER: (keyof ComplianceBreakdown)[] = [
  "rightToWork",
  "dbs",
  "dbsClear",
  "driving",
  "training",
  "references",
  "documents",
];

export const PERMISSIONS_TABLE_HEADER_COLUMNS = [
  { label: "Module" },
  { label: "Read" },
  { label: "Create" },
  { label: "Update" },
  { label: "Delete" },
  { label: "All" },
];

export const RTW_DOCUMENT_TYPE_OPTIONS = [
  { value: "passport", label: "Passport" },
  { value: "share_code", label: "Share Code" },
  { value: "biometric_residence", label: "Biometric Residence Permit" },
  { value: "birth_certificate", label: "UK Birth Certificate" },
  { value: "immigration_document", label: "Immigration Document" },
  { value: "other", label: "Other" },
];

export const EMPTY_INTERIM_CERTIFICATE: InterimCertificate = {
  certificateNumber: "",
  issueDate: "",
  updateServiceConsent: false,
  originalSeenInPerson: false,
  statusCheckResult: "current",
  statusCheckDate: "",
};

export const STAFF_STATUS_BADGE_VARIANT = {
  green: "softSuccess",
  amber: "softWarning",
  red: "softDanger",
  neutral: "softMuted",
} as const;
