import type { BadgeProps } from '@/components/ui';

export type AddStaffRole = "carer" | "manager" | "admin" | "supervisor";
export type AddStaffEmploymentType = "full_time" | "part_time" | "casual";
export type AddStaffRefRelationship = "previous_employer" | "colleague" | "other";

export interface AddStaffPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  niNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface AddStaffEmploymentInfo {
  role: AddStaffRole | "";
  startDate: string;
  employmentType: AddStaffEmploymentType | "";
  hoursPerWeek: string;
  rightToWorkVerified: boolean;
  rightToWorkFileName: string;
  isOverseasWorker: boolean | null;
  goodConductFileName: string;
  ref1Name: string;
  ref1Contact: string;
  ref1Relationship: AddStaffRefRelationship | "";
  ref2Name: string;
  ref2Contact: string;
  ref2Relationship: AddStaffRefRelationship | "";
}

export interface AddStaffFormData {
  personal: AddStaffPersonalInfo;
  employment: AddStaffEmploymentInfo;
  confirmed: boolean;
}


export const ADD_STAFF_INITIAL_DATA: AddStaffFormData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    niNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  },
  employment: {
    role: "",
    startDate: "",
    employmentType: "",
    hoursPerWeek: "",
    rightToWorkVerified: false,
    rightToWorkFileName: "",
    isOverseasWorker: null,
    goodConductFileName: "",
    ref1Name: "",
    ref1Contact: "",
    ref1Relationship: "",
    ref2Name: "",
    ref2Contact: "",
    ref2Relationship: "",
  },
  confirmed: false,
};

export const ADD_STAFF_ROLE_LABELS: Record<AddStaffRole, string> = {
  carer: "Carer",
  manager: "Manager",
  admin: "Admin",
  supervisor: "Supervisor",
};

export const ADD_STAFF_EMPLOYMENT_LABELS: Record<AddStaffEmploymentType, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  casual: "Casual",
};

export const ADD_STAFF_REF_LABELS: Record<AddStaffRefRelationship, string> = {
  previous_employer: "Previous Employer",
  colleague: "Colleague",
  other: "Other",
};

export interface AddStaffSelectOption {
  value: string;
  label: string;
}

export function toAddStaffSelectOptions(
  labels: Record<string, string>,
): AddStaffSelectOption[] {
  return Object.entries(labels).map(([value, label]) => ({ value, label }));
}

export const ADD_STAFF_ROLE_OPTIONS = toAddStaffSelectOptions(ADD_STAFF_ROLE_LABELS);
export const ADD_STAFF_EMPLOYMENT_OPTIONS = toAddStaffSelectOptions(ADD_STAFF_EMPLOYMENT_LABELS);
export const ADD_STAFF_REF_OPTIONS = toAddStaffSelectOptions(ADD_STAFF_REF_LABELS);

export const ADD_STAFF_OVERSEAS_OPTIONS: { label: string; value: boolean }[] = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

export const ADD_STAFF_STEP_TITLES = [
  "Personal Information",
  "Employment & Pre-Employment Checks",
  "Review & Confirm",
];

export const ADD_STAFF_TOTAL_STEPS = ADD_STAFF_STEP_TITLES.length;
export const ADD_STAFF_STEP_NUMBERS = ADD_STAFF_STEP_TITLES.map((_, i) => i + 1);
export const ADD_STAFF_RESET_DELAY_MS = 200;

export const ADD_STAFF_MODAL_COPY = {
  trigger: "Add Staff Member",
  title: "Add New Staff Member",
  cancel: "Cancel",
  back: "Back",
  next: "Next",
  submit: "Create Staff Member",
};

export function getAddStaffStepTitle(step: number): string {
  return ADD_STAFF_STEP_TITLES[step - 1];
}

export function isFirstAddStaffStep(step: number): boolean {
  return step === 1;
}

export function isLastAddStaffStep(step: number): boolean {
  return step === ADD_STAFF_TOTAL_STEPS;
}

export function getNextAddStaffStep(step: number): number {
  return Math.min(step + 1, ADD_STAFF_TOTAL_STEPS);
}

export function getPreviousAddStaffStep(step: number): number {
  return Math.max(step - 1, 1);
}

export function getStepDotClass(dot: number, current: number): string {
  if (dot === current) return "w-5 bg-primary";
  if (dot < current) return "w-3 bg-primary/35";
  return "w-3 bg-border";
}

export interface AddStaffField<K extends string> {
  key: K;
  label: string;
  kind: "input" | "select";
  type?: "text" | "email" | "tel" | "date" | "number";
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  min?: number;
  max?: number;
  options?: AddStaffSelectOption[];
}

export interface AddStaffFieldGroup<K extends string> {
  id: string;
  columns: 1 | 2;
  fields: AddStaffField<K>[];
}

export const ADD_STAFF_GROUP_LAYOUT_CLASS: Record<1 | 2, string> = {
  1: "space-y-4",
  2: "grid grid-cols-2 gap-4",
};

export function setAddStaffTextField<T extends object>(
  data: T,
  key: keyof T,
  value: string,
): T {
  return { ...data, [key]: value };
}

export const PERSONAL_INFO_FIELD_GROUPS: AddStaffFieldGroup<keyof AddStaffPersonalInfo>[] = [
  {
    id: "basic",
    columns: 1,
    fields: [
      { key: "fullName", label: "Full Name", kind: "input", placeholder: "e.g. Sarah Johnson", required: true },
      { key: "email", label: "Email", kind: "input", type: "email", placeholder: "sarah@example.com", required: true },
      { key: "phone", label: "Phone Number", kind: "input", type: "tel", placeholder: "07123 456789", required: true },
      { key: "dateOfBirth", label: "Date of Birth", kind: "input", type: "date", required: true },
      { key: "address", label: "Address", kind: "input", placeholder: "123 Main St, London", required: true },
      { key: "niNumber", label: "National Insurance Number", kind: "input", placeholder: "AB 12 34 56 C", optional: true },
    ],
  },
  {
    id: "emergency",
    columns: 2,
    fields: [
      { key: "emergencyContactName", label: "Emergency Contact Name", kind: "input", placeholder: "John Johnson", required: true },
      { key: "emergencyContactPhone", label: "Emergency Contact Phone", kind: "input", type: "tel", placeholder: "07987 654321", required: true },
    ],
  },
];

export type AddStaffEmploymentTextKey = {
  [K in keyof AddStaffEmploymentInfo]: AddStaffEmploymentInfo[K] extends string ? K : never;
}[keyof AddStaffEmploymentInfo];

export const EMPLOYMENT_SECTION_TITLES = {
  details: "Employment Details",
  checks: "Pre-Employment Checks",
  references: "References (Will be obtained during onboarding)",
};

export const EMPLOYMENT_DETAIL_FIELDS: AddStaffField<AddStaffEmploymentTextKey>[] = [
  { key: "role", label: "Role", kind: "select", placeholder: "Select a role", required: true, options: ADD_STAFF_ROLE_OPTIONS },
  { key: "startDate", label: "Start Date", kind: "input", type: "date", required: true },
  { key: "employmentType", label: "Employment Type", kind: "select", placeholder: "Select employment type", required: true, options: ADD_STAFF_EMPLOYMENT_OPTIONS },
  { key: "hoursPerWeek", label: "Hours per Week", kind: "input", type: "number", min: 0, max: 168, placeholder: "e.g. 40", optional: true },
];

export const EMPLOYMENT_CHECKS_COPY = {
  rightToWork: {
    label: "Right to Work Documents",
    hint: "Passport / Visa / Settled Status",
    uploadLabel: "Upload Document",
    verifiedLabel: "Verified?",
  },
  overseas: {
    label: "Overseas Worker?",
    uploadLabel: "Upload Good Conduct Certificate",
  },
};

export const ADD_STAFF_UPLOAD_ACCEPT = ".pdf,.jpg,.jpeg,.png";

export type ReferenceSlot = 1 | 2;
export const REFERENCE_SLOTS: ReferenceSlot[] = [1, 2];

const REFERENCE_NAME_PLACEHOLDERS: Record<ReferenceSlot, string> = {
  1: "John Smith",
  2: "Jane Doe",
};

export function getReferenceFields(
  slot: ReferenceSlot,
): AddStaffField<AddStaffEmploymentTextKey>[] {
  return [
    { key: `ref${slot}Name` as const, label: "Name", kind: "input", placeholder: REFERENCE_NAME_PLACEHOLDERS[slot], required: true },
    { key: `ref${slot}Contact` as const, label: "Contact", kind: "input", placeholder: "Email or phone", required: true },
    { key: `ref${slot}Relationship` as const, label: "Relationship", kind: "select", placeholder: "Select relationship", required: true, options: ADD_STAFF_REF_OPTIONS },
  ];
}

export const REVIEW_COPY = {
  editLabel: "Edit",
  confirmLabel: "I confirm all information is correct",
  nextSteps: {
    title: "Next Steps",
    beforeStatus: "After confirming, this staff member will be created with status ",
    status: "Onboarding Required",
    afterStatus:
      ". The manager must complete the onboarding checklist within 5 days before staff can be scheduled.",
  },
};

export interface AddStaffReviewBadge {
  variant: BadgeProps["variant"];
  text: string;
  withCheckIcon?: boolean;
}

export interface AddStaffReviewRow {
  label: string;
  value?: string;
  badge?: AddStaffReviewBadge;
  details?: string[];
}

export interface AddStaffReviewSection {
  id: string;
  title: string;
  editStep?: number;
  rows: AddStaffReviewRow[];
}

export function formatAddStaffReviewDate(iso: string): string {
  return iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";
}

function withFileName(text: string, fileName: string): string {
  return fileName ? `${text} · ${fileName}` : text;
}

function getRefLabel(relationship: AddStaffRefRelationship | ""): string {
  return relationship ? ADD_STAFF_REF_LABELS[relationship] : "";
}

export function areReferencesComplete(e: AddStaffEmploymentInfo): boolean {
  return Boolean(
    e.ref1Name && e.ref1Contact && e.ref1Relationship &&
      e.ref2Name && e.ref2Contact && e.ref2Relationship,
  );
}

function buildPersonalRows(p: AddStaffPersonalInfo): AddStaffReviewRow[] {
  return [
    { label: "Name", value: p.fullName },
    { label: "Email", value: p.email },
    { label: "Phone", value: p.phone },
    { label: "Date of Birth", value: formatAddStaffReviewDate(p.dateOfBirth) },
    { label: "Address", value: p.address },
    { label: "NI Number", value: p.niNumber || "—" },
    {
      label: "Emergency Contact",
      value: p.emergencyContactName
        ? `${p.emergencyContactName} (${p.emergencyContactPhone})`
        : "—",
    },
  ];
}

function buildEmploymentRows(e: AddStaffEmploymentInfo): AddStaffReviewRow[] {
  return [
    { label: "Role", value: e.role ? ADD_STAFF_ROLE_LABELS[e.role] : "—" },
    { label: "Start Date", value: formatAddStaffReviewDate(e.startDate) },
    {
      label: "Employment Type",
      value: e.employmentType ? ADD_STAFF_EMPLOYMENT_LABELS[e.employmentType] : "—",
    },
    { label: "Hours / Week", value: e.hoursPerWeek || "—" },
  ];
}

function buildRightToWorkRow(e: AddStaffEmploymentInfo): AddStaffReviewRow {
  return {
    label: "Right to Work",
    badge: e.rightToWorkVerified
      ? {
          variant: "softSuccess",
          text: withFileName("Verified", e.rightToWorkFileName),
          withCheckIcon: true,
        }
      : { variant: "softWarning", text: "Pending verification" },
  };
}

function buildOverseasRow(e: AddStaffEmploymentInfo): AddStaffReviewRow {
  if (e.isOverseasWorker === null) return { label: "Overseas Worker", value: "—" };
  return {
    label: "Overseas Worker",
    badge: e.isOverseasWorker
      ? { variant: "softInfo", text: withFileName("Yes", e.goodConductFileName) }
      : { variant: "softMuted", text: "No" },
  };
}

function buildReferencesRow(e: AddStaffEmploymentInfo): AddStaffReviewRow {
  if (!areReferencesComplete(e)) {
    return {
      label: "References",
      badge: { variant: "softWarning", text: "Incomplete" },
    };
  }
  return {
    label: "References",
    badge: { variant: "softSuccess", text: "2 obtained", withCheckIcon: true },
    details: [
      `${e.ref1Name} (${getRefLabel(e.ref1Relationship)})`,
      `${e.ref2Name} (${getRefLabel(e.ref2Relationship)})`,
    ],
  };
}

export function buildAddStaffReviewSections(
  data: AddStaffFormData,
): AddStaffReviewSection[] {
  const { personal, employment } = data;
  return [
    {
      id: "personal",
      title: "Personal Information",
      editStep: 1,
      rows: buildPersonalRows(personal),
    },
    {
      id: "employment",
      title: "Employment Details",
      editStep: 2,
      rows: buildEmploymentRows(employment),
    },
    {
      id: "checks",
      title: "Pre-Employment Checks",
      rows: [
        buildRightToWorkRow(employment),
        buildOverseasRow(employment),
        buildReferencesRow(employment),
      ],
    },
  ];
}