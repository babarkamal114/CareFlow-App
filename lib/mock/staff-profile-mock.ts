// lib/mock/staff-profile-mock.ts
// TEMP mock data: generates the full staff profile captured by the add-staff
// flow, keyed deterministically off the staff record so the drawer always
// renders the same data for the same person. No API calls.
// Remove once the staff profile endpoint is wired up.

import { computeCompliance } from "../validations/staff/compliance-status";
import { INITIAL_STAFF_FORM_DATA, MANDATORY_TRAINING_MODULES } from "../../types";
import type {
  AvailabilitySlot,
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
} from "../../types";

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

function buildDocuments(staff: StaffMember, random: () => number): StaffDocument[] {
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

    documents: buildDocuments(staff, random),
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