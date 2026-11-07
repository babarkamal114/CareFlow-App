import { computeCompliance } from "lib";
import {
  DAY_SHORT_LABELS,
  FIRST_SUPERVISION_DAYS,
  INITIAL_STAFF_FORM_DATA,
  MANDATORY_TRAINING_MODULES,
} from "types";
import type {
  AvailabilitySlot,
  ComplianceBreakdown,
  ComplianceResult,
  DayOfWeek,
  DbsStatus,
  Qualification,
  Referee,
  RefereeRelationship,
  RtwCheckType,
  StaffDocument,
  StaffDocumentType,
  StaffFormData,
  StaffMember,
  StaffRole,
  TrainingRecord,
  TrainingStatus,
  TravelMode,
} from "types";

// ---------------------------------------------------------------------------
// Mock staff profile (was staff-profile)
// ---------------------------------------------------------------------------

const ROLE_MAP: Record<string, StaffRole> = {
  manager: "registered_manager",
  coordinator: "care_coordinator",
  carer: "care_assistant",
  senior_carer: "senior_carer",
  admin: "admin",
  other: "other",
};

const FIRST_NAMES = ["Amara", "Bilal", "Chloe", "Dev", "Elena", "Farid", "Grace", "Hana", "Isaac", "Zara"];
const LAST_NAMES = ["Okafor", "Singh", "Bennett", "Mensah", "Rossi", "Khan", "Adeyemi", "Novak"];
const STREETS = ["Alder Road", "Balmoral Close", "Cavendish Way", "Dunmore Lane", "Elm Grove"];
const CITIES = ["Leeds", "Bradford", "Wakefield", "Huddersfield", "York"];
const POSTCODE_AREAS = ["LS", "BD", "WF", "HD", "YO"];
const LANGUAGES = ["English", "Urdu", "Polish", "Somali", "Punjabi", "Romanian"];
const SKILL_POOL = [
  "Medication",
  "Catheter care",
  "Dementia care",
  "End of life care",
  "PEG feeding",
  "Moving & handling",
  "Safeguarding",
  "Domestic support",
];
const MODULE_POOL = [...MANDATORY_TRAINING_MODULES];

/** Stable 32-bit hash so a staff id always yields the same mock profile. */
function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

/** Deterministic pseudo-random generator seeded by the staff record. */
function createRandom(seed: number) {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
}

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length) % items.length];
}

function pickSome<T>(items: readonly T[], count: number, random: () => number): T[] {
  const pool = [...items];
  const chosen: T[] = [];
  while (chosen.length < count && pool.length > 0) {
    chosen.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
  }
  return chosen;
}

function isoDaysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function isoDateOnly(value: Date | string | null): string {
  if (!value) return isoDaysFromNow(0);
  return new Date(value).toISOString().slice(0, 10);
}

function splitName(name: string): { firstName: string; lastName: string } {
  const [firstName = "", ...rest] = name.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
}

function buildQualifications(random: () => number): Qualification[] {
  return pickSome(
    ["Care Certificate", "NVQ Level 2", "NVQ Level 3", "First Aid at Work", "Mental Health First Aid"],
    2 + Math.floor(random() * 2),
    random
  ).map((name, index) => ({
    id: `qualification-${index}`,
    name,
    awardedDate: isoDaysFromNow(-(400 + index * 180 + Math.floor(random() * 90))),
  }));
}

function buildTraining(random: () => number): TrainingRecord[] {
  const statuses: TrainingStatus[] = ["completed", "completed", "completed", "booked", "not_started"];

  return pickSome(MODULE_POOL, 4, random).map((module, index) => {
    const status = pick(statuses, random);
    const completed = status === "completed" ? isoDaysFromNow(-(30 + index * 45)) : undefined;

    return {
      id: `training-${index}`,
      module,
      status,
      completedDate: completed,
      expiryDate: completed ? isoDaysFromNow(300 + index * 30) : undefined,
    };
  });
}

function buildReferees(staff: StaffMember, random: () => number): Referee[] {
  const relationships: RefereeRelationship[] = ["manager", "hr", "colleague"];

  return relationships.slice(0, 2).map((relationship, index) => ({
    name: `${pick(FIRST_NAMES, random)} ${pick(LAST_NAMES, random)}`,
    role: relationship === "hr" ? "HR Manager" : "Registered Manager",
    organisation: relationship === "hr" ? "Agency Head Office" : "Willow Care Group",
    phone: `0770090${String(1000 + Math.floor(random() * 8999)).slice(0, 4)}`,
    email: `referee${index + 1}@willowcare.example`,
    relationship,
    referenceReceived: random() > 0.15,
  }));
}

function buildDocuments(staff: StaffMember): StaffDocument[] {
  const types: StaffDocumentType[] = ["contract", "passport", "dbs_certificate", "training_cert"];
  const names: Record<StaffDocumentType, string> = {
    contract: `employment-contract-${staff.id}.pdf`,
    passport: "passport-scan.pdf",
    dbs_certificate: "dbs-certificate.pdf",
    training_cert: "training-certificates.pdf",
    other: "other-document.pdf",
  };

  return types.map((type, index) => ({
    type,
    url: `/documents/${staff.id}/${type}`,
    uploadedAt: new Date(
      Date.now() - (index * 6 + 2) * 24 * 60 * 60 * 1000
    ).toISOString(),
    fileName: names[type],
  }));
}

function buildAvailability(random: () => number): AvailabilitySlot[] {
  const days: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri"];
  const startHours = ["08", "09", "09", "10"];
  const endHours = ["16", "17", "17", "18"];

  return days.slice(0, 3 + Math.floor(random() * 3)).map((day, index) => ({
    id: `availability-${index}`,
    day,
    startTime: `${pick(startHours, random)}:00`,
    endTime: `${pick(endHours, random)}:00`,
  }));
}

function buildProfile(staff: StaffMember): StaffFormData {
  const random = createRandom(hash(`${staff.id}:${staff.name}`));
  const { firstName, lastName } = splitName(staff.name);
  const role = ROLE_MAP[staff.role] ?? "other";
  const dbsStatus: DbsStatus = pick(
    ["clear", "clear", "clear", "temporarily_verified", "pending"],
    random
  );
  const travelMode: TravelMode = pick(["drive", "public_transport", "cycle"], random);

  return {
    ...INITIAL_STAFF_FORM_DATA,
    firstName,
    lastName,
    preferredName: random() > 0.6 ? firstName : undefined,
    dateOfBirth: isoDaysFromNow(-(7000 + Math.floor(random() * 9000))),
    nationalInsuranceNumber: `${pick(["AB", "CD", "EF", "GH"], random)}${String(
      100000 + Math.floor(random() * 899999)
    )}${pick(["A", "B", "C", "D"], random)}`,
    phone: staff.phone ?? `0770090${String(1000 + Math.floor(random() * 8999)).slice(0, 4)}`,
    email: staff.email,
    address: {
      line1: `${1 + Math.floor(random() * 90)} ${pick(STREETS, random)}`,
      line2: random() > 0.7 ? "Flat 2" : undefined,
      city: pick(CITIES, random),
      postcode: `${pick(POSTCODE_AREAS, random)}1 1${pick(["AA", "AB", "BB", "CD"], random)}`,
    },
    emergencyContact: {
      name: `${pick(FIRST_NAMES, random)} ${lastName}`,
      relationship: pick(["Partner", "Parent", "Sibling", "Friend"], random),
      phone: `0770090${String(1000 + Math.floor(random() * 8999)).slice(0, 4)}`,
    },
    photoConsentForFamilyPortal: random() > 0.4,

    role,
    employmentType: pick(["employed", "employed", "bank", "agency"], random),
    startDate: isoDateOnly(staff.joinDate),
    contractedHoursPerWeek: pick([16, 24, 30, 37, 40], random),
    payRatePerHour: Number((11 + random() * 5).toFixed(2)),
    payRateType: pick(["standard", "standard", "weekend", "sleep_in"], random),
    managerId: role === "registered_manager" ? "mgr-001" : undefined,

    rightToWork: {
      checkType: pick(["online", "digital_dvsp", "manual"], random) as RtwCheckType,
      checkDate: isoDaysFromNow(-(30 + Math.floor(random() * 120))),
      documentType: "passport",
      documentExpiryDate: isoDaysFromNow(400 + Math.floor(random() * 2000)),
      followUpCheckDate: isoDaysFromNow(180 + Math.floor(random() * 200)),
    },
    dbs: {
      path: "existing_certificate",
      status: dbsStatus,
      expiryDate: isoDaysFromNow(120 + Math.floor(random() * 900)),
      certificateUrl: `/documents/${staff.id}/dbs`,
      interimCertificate:
        dbsStatus === "temporarily_verified"
          ? {
              certificateNumber: `INT-${1000 + Math.floor(random() * 8999)}`,
              issueDate: isoDaysFromNow(-60),
              updateServiceConsent: true,
              originalSeenInPerson: true,
              statusCheckResult: "current",
              statusCheckDate: isoDaysFromNow(-30),
            }
          : undefined,
    },
    driving: {
      hasLicence: travelMode === "drive",
      licenceNumber: travelMode === "drive" ? `${pick(["AB", "CD"], random)}-${100000 + Math.floor(random() * 899999)}` : undefined,
      drivesForWork: travelMode === "drive" && random() > 0.3,
      travelMode,
    },
    referees: buildReferees(staff, random),

    qualifications: buildQualifications(random),
    mandatoryTraining: buildTraining(random),

    languages: pickSome(LANGUAGES, 1 + Math.floor(random() * 2), random),
    skills: pickSome(SKILL_POOL, 3 + Math.floor(random() * 3), random),
    workAreaPostcode: `${pick(POSTCODE_AREAS, random)}2 4${pick(["AA", "AJ", "BH"], random)}`,
    availability: buildAvailability(random),

    documents: buildDocuments(staff),
    confirmed: true,
  };
}

export interface MockStaffProfile {
  data: StaffFormData;
  compliance: ComplianceResult;
}

/** Deterministic mocked profile for a staff record, with live compliance maths. */
export function getMockStaffProfile(staff: StaffMember): MockStaffProfile {
  const data = buildProfile(staff);
  return { data, compliance: computeCompliance(data) };
}

// ---------------------------------------------------------------------------
// Staff drawer: tabs, tones, training, availability, documents (was staff-drawer)
// ---------------------------------------------------------------------------

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