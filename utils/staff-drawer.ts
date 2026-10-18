import { DAY_SHORT_LABELS, FIRST_SUPERVISION_DAYS } from "types";
import type {
  AvailabilitySlot,
  ComplianceBreakdown,
  ComplianceResult,
  DayOfWeek,
  StaffDocument,
  StaffDocumentType,
  StaffFormData,
  TrainingRecord,
} from "types";

export type StaffDrawerTabId =
  | "profile"
  | "employment"
  | "vetting"
  | "training"
  | "availability"
  | "documents"
  | "permissions"
  | "activity";

export interface StaffDrawerTab {
  id: StaffDrawerTabId;
  label: string;
  /** Matching step in the add-staff flow, when the tab mirrors one. */
  step?: number;
  description: string;
}

export const STAFF_DRAWER_TABS: StaffDrawerTab[] = [
  {
    id: "profile",
    label: "Profile",
    step: 1,
    description: "Identity, contact, address and account record",
  },
  {
    id: "employment",
    label: "Employment",
    step: 2,
    description: "Role, contract, hours, pay and supervision",
  },
  {
    id: "vetting",
    label: "Vetting",
    step: 3,
    description: "Right to work, DBS, driving and references",
  },
  {
    id: "training",
    label: "Training",
    step: 4,
    description: "Qualifications and mandatory course records",
  },
  {
    id: "availability",
    label: "Availability",
    step: 5,
    description: "Languages, skills, work area and working hours",
  },
  {
    id: "documents",
    label: "Documents",
    step: 6,
    description: "Uploaded contracts and supporting evidence",
  },
  {
    id: "permissions",
    label: "Permissions",
    description: "What this staff member can access",
  },
  {
    id: "activity",
    label: "Activity",
    description: "Account timeline and record changes",
  },
];

export function getStaffTabById(id: StaffDrawerTabId): StaffDrawerTab {
  return STAFF_DRAWER_TABS.find((tab) => tab.id === id) ?? STAFF_DRAWER_TABS[0];
}

const DAY_ORDER: Record<DayOfWeek, number> = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

export interface StaffTrainingProgress {
  completed: number;
  total: number;
  percent: number;
  expired: number;
  outstanding: number;
}

export function getStaffTrainingProgress(
  records: TrainingRecord[]
): StaffTrainingProgress {
  const total = records.length;
  const completed = records.filter(
    (record) => record.status === "completed"
  ).length;
  const expired = records.filter(
    (record) => record.status === "expired"
  ).length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    expired,
    outstanding: total - completed,
  };
}

export type StaffStatusTone = "success" | "warning" | "danger" | "neutral";

export function getStaffTrainingTone(record: TrainingRecord): StaffStatusTone {
  if (record.status === "expired") return "danger";
  if (record.status === "completed") return "success";
  if (record.status === "booked") return "warning";
  return "neutral";
}

export function getStaffDbsTone(status: string): StaffStatusTone {
  if (status === "clear") return "success";
  if (status === "flagged_for_review") return "danger";
  if (status === "temporarily_verified") return "warning";
  return "neutral";
}

export function getStaffComplianceTone(
  status: ComplianceResult["complianceStatus"]
): "success" | "warning" | "danger" {
  if (status === "green") return "success";
  if (status === "amber") return "warning";
  return "danger";
}

const OUTSTANDING_LABELS: Record<keyof ComplianceBreakdown, string> = {
  rightToWork: "Right to work not verified",
  dbs: "No valid DBS record",
  dbsClear: "DBS not cleared yet",
  driving: "Driving or travel details missing",
  training: "Mandatory training incomplete",
  references: "Two references not received",
  documents: "Signed contract not uploaded",
};

export function getStaffOutstandingItems(
  compliance: ComplianceResult
): string[] {
  return (Object.keys(OUTSTANDING_LABELS) as (keyof ComplianceBreakdown)[])
    .filter((key) => !compliance.breakdown[key])
    .map((key) => OUTSTANDING_LABELS[key]);
}

export function sortStaffAvailability(
  slots: AvailabilitySlot[]
): AvailabilitySlot[] {
  return [...slots].sort(
    (a, b) =>
      DAY_ORDER[a.day] - DAY_ORDER[b.day] || a.startTime.localeCompare(b.startTime)
  );
}

export function formatStaffSlotLabel(slot: AvailabilitySlot): string {
  return `${DAY_SHORT_LABELS[slot.day]} ${slot.startTime}–${slot.endTime}`;
}

export function getStaffSlotHours(slot: AvailabilitySlot): number {
  const [startHour, startMinute] = slot.startTime.split(":").map(Number);
  const [endHour, endMinute] = slot.endTime.split(":").map(Number);

  if ([startHour, startMinute, endHour, endMinute].some(Number.isNaN)) return 0;

  const minutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  return Math.round((Math.max(0, minutes) / 60) * 10) / 10;
}

export function getStaffWeeklyHours(slots: AvailabilitySlot[]): number {
  const total = slots.reduce((sum, slot) => sum + getStaffSlotHours(slot), 0);
  return Math.round(total * 10) / 10;
}

export interface StaffSupervisionDeadline {
  date: string;
  daysRemaining: number;
  overdue: boolean;
  dueSoon: boolean;
}

/** New care staff need a supervision session within 30 days of their start date. */
export function getStaffSupervisionDeadline(
  startDate: string
): StaffSupervisionDeadline | null {
  if (!startDate) return null;

  const started = new Date(startDate);
  if (Number.isNaN(started.getTime())) return null;

  const deadline = new Date(started);
  deadline.setDate(deadline.getDate() + FIRST_SUPERVISION_DAYS);

  const daysRemaining = Math.ceil(
    (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return {
    date: deadline.toISOString().slice(0, 10),
    daysRemaining,
    overdue: daysRemaining < 0,
    dueSoon: daysRemaining >= 0 && daysRemaining <= 14,
  };
}

export interface StaffDocumentGroup {
  type: StaffDocumentType;
  documents: StaffDocument[];
}

const DOCUMENT_TYPE_ORDER: StaffDocumentType[] = [
  "contract",
  "passport",
  "dbs_certificate",
  "training_cert",
  "other",
];

export function groupStaffDocuments(
  documents: StaffDocument[]
): StaffDocumentGroup[] {
  return DOCUMENT_TYPE_ORDER.map((type) => ({
    type,
    documents: documents.filter((document) => document.type === type),
  })).filter((group) => group.documents.length > 0);
}

export function countStaffDocumentsByType(
  documents: StaffDocument[],
  type: StaffDocumentType
): number {
  return documents.filter((document) => document.type === type).length;
}

export function hasStaffContract(documents: StaffDocument[]): boolean {
  return countStaffDocumentsByType(documents, "contract") > 0;
}

export function getStaffProfileCompleteness(data: StaffFormData): number {
  const checks: (string | number | boolean)[] = [
    data.firstName,
    data.lastName,
    data.dateOfBirth,
    data.nationalInsuranceNumber,
    data.phone,
    data.email,
    data.address.line1,
    data.address.city,
    data.address.postcode,
    data.emergencyContact.name,
    data.emergencyContact.phone,
    data.role,
    data.employmentType,
    data.startDate,
    data.contractedHoursPerWeek,
    data.payRatePerHour,
    data.rightToWork.checkType,
    data.dbs.status,
    data.driving.travelMode,
    data.qualifications.length,
    data.mandatoryTraining.length,
    data.languages.length,
    data.skills.length,
    data.availability.length,
    hasStaffContract(data.documents),
  ];

  const completed = checks.filter((check) =>
    typeof check === "number" ? check > 0 : Boolean(check)
  ).length;

  return Math.round((completed / checks.length) * 100);
}