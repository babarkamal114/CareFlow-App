export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export type StaffRole =
  | "care_assistant"
  | "senior_carer"
  | "care_coordinator"
  | "registered_manager"
  | "admin"
  | "other";
export type EmploymentType = "employed" | "bank" | "agency";
export type PayRateType = "standard" | "weekend" | "sleep_in" | "waking_night";
export type RtwCheckType = "online" | "digital_dvsp" | "manual";
export type DbsStatus =
  | "pending"
  | "temporarily_verified"
  | "clear"
  | "flagged_for_review";
export type DbsPath = "new_application" | "existing_certificate";
export type TrainingStatus = "completed" | "booked" | "not_started" | "expired";
export type TravelMode = "drive" | "public_transport" | "cycle" | "walk";
export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type StaffDocumentType =
  | "contract"
  | "passport"
  | "dbs_certificate"
  | "training_cert"
  | "other";

export type ComplianceStatus = "green" | "amber" | "red";

/** New care staff must receive a supervision session within this many days of starting. */
export const FIRST_SUPERVISION_DAYS = 30;

let staffRecordCounter = 0;

export function createStaffRecordId(prefix: string): string {
  staffRecordCounter += 1;
  return `${prefix}-${staffRecordCounter}`;
}

export interface RtwSection {
  checkType: RtwCheckType | "";
  checkDate: string;
  documentType: string;
  documentExpiryDate?: string;
  followUpCheckDate?: string;
  evidenceUrl?: string;
}

export interface InterimCertificate {
  certificateNumber: string;
  issueDate: string;
  updateServiceConsent: boolean;
  originalSeenInPerson: boolean;
  statusCheckResult: "current";
  statusCheckDate: string;
}

export interface DbsSection {
  path: DbsPath | "";
  applicationReference?: string;
  submittedDate?: string;
  interimCertificate?: InterimCertificate;
  status: DbsStatus | "";
  expiryDate: string;
  certificateUrl?: string;
}

export interface DrivingSection {
  hasLicence: boolean;
  licenceNumber?: string;
  drivesForWork: boolean;
  travelMode: TravelMode | "";
}

export type RefereeRelationship = "manager" | "hr" | "colleague" | "other";

export interface Referee {
  name: string;
  role: string;
  organisation: string;
  phone: string;
  email: string;
  relationship: RefereeRelationship;
  referenceReceived: boolean;
}

export interface Qualification {
  id: string;
  name: string;
  awardedDate: string;
  certificateUrl?: string;
}

export interface TrainingRecord {
  id: string;
  module: string;
  status: TrainingStatus;
  completedDate?: string;
  expiryDate?: string;
  certificateUrl?: string;
}

export interface AvailabilitySlot {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface StaffDocument {
  type: StaffDocumentType;
  url: string;
  uploadedAt: string;
  fileName?: string;
}

export interface StaffFormData {
  // Step 1: Personal
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  nationalInsuranceNumber: string;
  phone: string;
  email: string;
  address: Address;
  emergencyContact: EmergencyContact;
  photoUrl?: string;
  photoConsentForFamilyPortal: boolean;

  // Step 2: Employment
  role: StaffRole | "";
  employmentType: EmploymentType | "";
  startDate: string;
  contractedHoursPerWeek: number | "";
  payRatePerHour: number | "";
  payRateType: PayRateType | "";
  managerId?: string;

  // Step 3: Compliance & Vetting
  rightToWork: RtwSection;
  dbs: DbsSection;
  driving: DrivingSection;
  referees: Referee[];

  // Step 4: Training
  qualifications: Qualification[];
  mandatoryTraining: TrainingRecord[];

  // Step 5: Skills & Availability
  languages: string[];
  skills: string[];
  workAreaPostcode: string;
  availability: AvailabilitySlot[];

  // Step 6: Documents
  documents: StaffDocument[];

  // System-computed (never user-edited)
  complianceStatus: ComplianceStatus;
  canBeScheduled: boolean;
  firstSupervisionDate?: string;

  // Local-only confirmation gate for the review step
  confirmed: boolean;
}

export type StaffFormStepId =
  | "personal"
  | "employment"
  | "compliance"
  | "training"
  | "skills"
  | "documents"
  | "review";

export interface StaffFormStep {
  id: StaffFormStepId;
  title: string;
  description: string;
}

export type StaffFormErrors = Partial<Record<string, string>>;

export interface ComplianceBreakdown {
  rightToWork: boolean;
  dbs: boolean;
  dbsClear: boolean;
  driving: boolean;
  training: boolean;
  references: boolean;
  documents: boolean;
}

export interface ComplianceResult {
  complianceStatus: ComplianceStatus;
  canBeScheduled: boolean;
  firstSupervisionDate?: string;
  breakdown: ComplianceBreakdown;
}

export const STAFF_FORM_STEPS: StaffFormStep[] = [
  {
    id: "personal",
    title: "Personal",
    description: "Identity, contact & address",
  },
  {
    id: "employment",
    title: "Employment",
    description: "Role, hours & pay rate",
  },
  {
    id: "compliance",
    title: "Compliance & Vetting",
    description: "Right to work, DBS, driving & references",
  },
  {
    id: "training",
    title: "Training",
    description: "Qualifications & mandatory courses",
  },
  {
    id: "skills",
    title: "Skills & Availability",
    description: "Languages, skills & working hours",
  },
  {
    id: "documents",
    title: "Documents",
    description: "Contracts & supporting evidence",
  },
  {
    id: "review",
    title: "Review & Confirm",
    description: "Check everything before creating",
  },
];

export const STAFF_ROLE_OPTIONS: StaffRole[] = [
  "care_assistant",
  "senior_carer",
  "care_coordinator",
  "registered_manager",
  "admin",
  "other",
];

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  care_assistant: "Care Assistant",
  senior_carer: "Senior Carer",
  care_coordinator: "Care Coordinator",
  registered_manager: "Registered Manager",
  admin: "Admin",
  other: "Other",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  employed: "Employed",
  bank: "Bank",
  agency: "Agency",
};

export const PAY_RATE_TYPE_LABELS: Record<PayRateType, string> = {
  standard: "Standard",
  weekend: "Weekend",
  sleep_in: "Sleep In",
  waking_night: "Waking Night",
};

export const RTW_CHECK_TYPE_LABELS: Record<RtwCheckType, string> = {
  online: "Online Home Office Check",
  digital_dvsp: "Digital DVS / Share Code",
  manual: "Manual Document Check",
};

export const DBS_PATH_LABELS: Record<DbsPath, string> = {
  new_application: "New Application",
  existing_certificate: "Existing Certificate",
};

export const DBS_STATUS_LABELS: Record<DbsStatus, string> = {
  pending: "Pending",
  temporarily_verified: "Temporarily Verified",
  clear: "Clear",
  flagged_for_review: "Flagged For Review",
};

export const TRAVEL_MODE_LABELS: Record<TravelMode, string> = {
  drive: "Drive",
  public_transport: "Public Transport",
  cycle: "Cycle",
  walk: "Walk",
};

export const TRAINING_STATUS_LABELS: Record<TrainingStatus, string> = {
  completed: "Completed",
  booked: "Booked",
  not_started: "Not Started",
  expired: "Expired",
};

export const REFEREE_RELATIONSHIP_LABELS: Record<RefereeRelationship, string> = {
  manager: "Manager",
  hr: "HR",
  colleague: "Colleague",
  other: "Other",
};

export const STAFF_DOCUMENT_TYPE_LABELS: Record<StaffDocumentType, string> = {
  contract: "Contract",
  passport: "Passport / ID",
  dbs_certificate: "DBS Certificate",
  training_cert: "Training Certificate",
  other: "Other",
};

export const DAY_OF_WEEK_OPTIONS: DayOfWeek[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export const DAY_SHORT_LABELS: Record<DayOfWeek, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export const COMPLIANCE_STATUS_LABELS: Record<ComplianceStatus, string> = {
  green: "Compliant",
  amber: "Action Required",
  red: "Not Compliant",
};

export const MANDATORY_TRAINING_MODULES = [
  "Safeguarding Adults",
  "Person Centred Care",
  "Moving & Handling",
  "Medication Awareness",
  "Infection Prevention & Control",
  "Mental Capacity Act",
  "Fire Safety",
  "First Aid at Work",
  "End of Life Care",
  "Dementia Awareness",
] as const;

export const SKILL_SUGGESTIONS = [
  "Personal Care",
  "Medication Support",
  "Catheter Care",
  "Peg Feeding",
  "Hoist Operation",
  "Scar Tissue Care",
  "Dementia Support",
  "End of Life Care",
  "Domestic Support",
  "Meal Preparation",
  "Double Up Transfers",
  "Continence Care",
] as const;

export const LANGUAGE_SUGGESTIONS = [
  "English",
  "Polish",
  "Romanian",
  "Hindi",
  "Urdu",
  "Bengali",
  "Punjabi",
  "Somali",
  "Portuguese",
  "Spanish",
] as const;

export const STEP_TOTAL = STAFF_FORM_STEPS.length;

export const EMPTY_RTW: RtwSection = {
  checkType: "",
  checkDate: "",
  documentType: "",
  documentExpiryDate: "",
  followUpCheckDate: "",
  evidenceUrl: "",
};

export const EMPTY_DBS: DbsSection = {
  path: "",
  applicationReference: "",
  submittedDate: "",
  status: "",
  expiryDate: "",
  certificateUrl: "",
};

export const EMPTY_DRIVING: DrivingSection = {
  hasLicence: false,
  licenceNumber: "",
  drivesForWork: false,
  travelMode: "",
};

export const EMPTY_REFeree: Referee = {
  name: "",
  role: "",
  organisation: "",
  phone: "",
  email: "",
  relationship: "other",
  referenceReceived: false,
};

export const INITIAL_STAFF_FORM_DATA: StaffFormData = {
  firstName: "",
  lastName: "",
  preferredName: "",
  dateOfBirth: "",
  nationalInsuranceNumber: "",
  phone: "",
  email: "",
  address: {
    line1: "",
    line2: "",
    city: "",
    postcode: "",
  },
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
  },
  photoUrl: "",
  photoConsentForFamilyPortal: false,

  role: "",
  employmentType: "",
  startDate: "",
  contractedHoursPerWeek: "",
  payRatePerHour: "",
  payRateType: "standard",
  managerId: "",

  rightToWork: { ...EMPTY_RTW },
  dbs: { ...EMPTY_DBS },
  driving: { ...EMPTY_DRIVING },
  referees: [],

  qualifications: [],
  mandatoryTraining: [],

  languages: [],
  skills: [],
  workAreaPostcode: "",
  availability: [],

  documents: [],

  complianceStatus: "red",
  canBeScheduled: false,
  firstSupervisionDate: "",

  confirmed: false,
};
