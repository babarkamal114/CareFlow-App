// lib/mock/staff-compliance-mock.ts
// TEMP mock data matching blueprint sections 3.2.4 (Staff Management) and 5.4 (Staff Management dashboard).
// Keyed by staff.id so it can be joined against mockStaffMembers without touching the core StaffMember type.

export type ComplianceStatus = "clear" | "expiring" | "expired";

export const TRAINING_MODULES = [
  "Safeguarding",
  "Medication",
  "First Aid",
  "Moving & Handling",
  "Fire Safety",
  "Infection Control",
] as const;

export type TrainingModule = (typeof TRAINING_MODULES)[number];
export type TrainingResult = "pass" | "fail" | "expired" | "not_started";

export type EmploymentType = "employed" | "bank" | "agency";

export interface StaffComplianceRecord {
  staffId: string;
  employmentType: EmploymentType;
  dbsStatus: ComplianceStatus;
  dbsExpiry: Date;
  rightToWorkStatus: ComplianceStatus;
  rightToWorkExpiry: Date;
  supervisionDueDate: Date;
  lastSupervisionDate: Date | null;
  training: Record<TrainingModule, TrainingResult>;
}

export interface AvailabilityDay {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  availableHours: number; // hours the carer marked themselves available
  bookedHours: number; // hours actually scheduled
}

export interface StaffAvailabilityRecord {
  staffId: string;
  week: AvailabilityDay[];
}

export interface StaffPerformanceRecord {
  staffId: string;
  punctualityPct: number; // % of visits started on time
  visitCompletionPct: number; // % of scheduled visits completed
  noteQualityScore: number; // 1-5
  patientFeedbackScore: number; // 1-5
}

function daysFromNow(days: number): Date {
  const d = new Date(2026, 7, 20); // "today" for this mock set, matches conversation's current date
  d.setDate(d.getDate() + days);
  return d;
}

function statusFromExpiry(expiry: Date): ComplianceStatus {
  const today = new Date(2026, 7, 20);
  const diffDays = Math.floor((expiry.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return "expired";
  if (diffDays <= 30) return "expiring";
  return "clear";
}

// Overall record status = worst of DBS / right-to-work / any expired training
export function overallComplianceStatus(record: StaffComplianceRecord): ComplianceStatus {
  const statuses: ComplianceStatus[] = [record.dbsStatus, record.rightToWorkStatus];
  const hasExpiredTraining = Object.values(record.training).includes("expired");
  const hasFailedTraining = Object.values(record.training).includes("fail");
  if (statuses.includes("expired") || hasExpiredTraining) return "expired";
  if (statuses.includes("expiring") || hasFailedTraining) return "expiring";
  return "clear";
}

const EMPLOYMENT_TYPES: EmploymentType[] = ["employed", "employed", "employed", "bank", "agency"];

function makeTrainingSet(seed: number): Record<TrainingModule, TrainingResult> {
  const results: TrainingResult[] = ["pass", "pass", "pass", "pass", "fail", "expired", "not_started"];
  const record = {} as Record<TrainingModule, TrainingResult>;
  TRAINING_MODULES.forEach((mod, i) => {
    record[mod] = results[(seed + i) % results.length];
  });
  return record;
}

export function buildComplianceForStaff(staffId: string, index: number): StaffComplianceRecord {
  const dbsExpiryDays = [90, 25, -5, 180, 10, 300, 45, 3, 120, 60, -10, 200][index % 12];
  const rtwExpiryDays = [200, 15, 400, 60, -3, 250, 90, 30, 150, 45, 5, 365][index % 12];
  const dbsExpiry = daysFromNow(dbsExpiryDays);
  const rightToWorkExpiry = daysFromNow(rtwExpiryDays);

  return {
    staffId,
    employmentType: EMPLOYMENT_TYPES[index % EMPLOYMENT_TYPES.length],
    dbsStatus: statusFromExpiry(dbsExpiry),
    dbsExpiry,
    rightToWorkStatus: statusFromExpiry(rightToWorkExpiry),
    rightToWorkExpiry,
    supervisionDueDate: daysFromNow([14, -3, 40, 7, 21][index % 5]),
    lastSupervisionDate: index % 4 === 0 ? null : daysFromNow(-([20, 35, 50, 42][index % 4])),
    training: makeTrainingSet(index),
  };
}

export function buildAvailabilityForStaff(staffId: string, index: number): StaffAvailabilityRecord {
  const days: AvailabilityDay["day"][] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const week = days.map((day, i) => {
    const isWeekend = day === "Sat" || day === "Sun";
    const availableHours = isWeekend ? (index + i) % 3 === 0 ? 8 : 0 : 8;
    const bookedHours = availableHours === 0 ? 0 : Math.max(0, availableHours - ((index + i) % 3));
    return { day, availableHours, bookedHours };
  });
  return { staffId, week };
}

export function buildPerformanceForStaff(staffId: string, index: number): StaffPerformanceRecord {
  return {
    staffId,
    punctualityPct: 78 + ((index * 7) % 22),
    visitCompletionPct: 85 + ((index * 3) % 15),
    noteQualityScore: Math.round((3 + ((index * 1.7) % 2)) * 10) / 10,
    patientFeedbackScore: Math.round((3.2 + ((index * 1.3) % 1.8)) * 10) / 10,
  };
}