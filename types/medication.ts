export type MedFormErrors = Partial<Record<string, string>>;

export type MedicationType = "regular" | "prn" | "controlled" | "short-course" | "variable-dose";
export type MedicationRoute = "oral" | "topical" | "inhaled" | "injection" | "eye-drops" | "sublingual";
export type MedicationFrequency = "once-daily" | "twice-daily" | "three-daily" | "four-daily" | "with-meals" | "as-required";
export type ControlledSchedule = "2" | "3";

export type AdministrationStatus = "administered" | "refused" | "omitted" | "not-available" | "self-administered";
/** Status shown in the round: a recorded outcome, or derived from the clock if nothing is recorded yet. */
export type DoseState = AdministrationStatus | "upcoming" | "due" | "missed";
export type ReasonCode = "patient-asleep" | "nausea" | "no-stock" | "gp-instruction" | "clinical-judgement" | "patient-unwell" | "other";
export type MedTab = "round" | "profiles" | "prn" | "alerts" | "audit" | "controlled";
export type RoundFilter = "all" | "attention" | "upcoming" | "done";

export interface MedicationPatient {
  id: string;
  name: string;
  initials: string;
  allergies: string[];
}

export interface Medication {
  id: string;
  patientId: string;
  drugName: string;
  strength: string;
  route: MedicationRoute;
  type: MedicationType;
  frequency: MedicationFrequency;
  times: string[]; // "HH:mm"; empty for PRN
  prescriber: string;
  startDate: Date;
  endDate?: Date; // short courses
  indication: string;
  instructions?: string;
  barcode: string;
  schedule?: ControlledSchedule;
  prnMinIntervalHours?: number;
  prnMaxPer24h?: number;
  changedAt?: Date; 
  changeNote?: string;
  active: boolean;
}

export interface AdministrationRecord {
  status: AdministrationStatus;
  reasonCode?: ReasonCode;
  note?: string;
  doseGiven?: string;
  recordedBy: string;
  recordedAt: Date;
  witness?: string;
  barcodeVerified: boolean;
}

export interface ScheduledDose {
  id: string;
  medicationId: string;
  patientId: string;
  scheduledAt: Date;
  record: AdministrationRecord | null;
}

export interface RoundRow {
  dose: ScheduledDose;
  medication: Medication;
  patient: MedicationPatient;
  state: DoseState;
}

export interface RoundFilters { search: string; status: RoundFilter; patientId: string | "all" }

export interface HistoryDose {
  medicationId: string;
  patientId: string;
  scheduledAt: Date;
  status: AdministrationStatus | "gap"; // "gap" = nothing recorded
  reasonCode?: ReasonCode;
}

// ---- PRN ----
export type PrnEffectiveness = "effective" | "partial" | "not-effective";
export type PrnFollowUpState = "waiting" | "due" | "overdue" | "done";

export interface PrnRecord {
  id: string;
  medicationId: string;
  patientId: string;
  administeredAt: Date;
  reason: string;
  doseGiven: string;
  recordedBy: string;
  followUp?: { checkedAt: Date; effectiveness: PrnEffectiveness; note?: string; recordedBy: string };
}

// ---- Controlled drugs (Phase 2) ----
export type ControlledEntryKind = "administration" | "receipt" | "disposal" | "stock-check";

export interface ControlledStock {
  medicationId: string;
  balance: number; // recorded balance
  unit: string;
  lastCheckedAt: Date;
  lastCheckedBy: string;
  lastPhysicalCount: number; // from the last stock check
}

export interface ControlledEntry {
  id: string;
  medicationId: string;
  patientId: string;
  kind: ControlledEntryKind;
  quantity: number;
  balanceAfter: number;
  recordedBy: string;
  witness: string;
  at: Date;
  note?: string;
}

// ---- Alerts / interactions / audit ----
export type MedAlertKind = "missed-dose" | "omission-escalation" | "interaction" | "medication-change" | "prn-followup" | "stock-discrepancy";
export type MedAlertSeverity = "urgent" | "warning" | "info";

export interface MedAlert {
  id: string;
  kind: MedAlertKind;
  severity: MedAlertSeverity;
  title: string;
  description: string;
  patientId: string;
  targetTab: MedTab;
}

export interface InteractionRule { a: string; b: string; severity: "major" | "moderate"; message: string }
export interface InteractionWarning { kind: "interaction" | "allergy"; severity: "major" | "moderate"; message: string; with?: string }

export interface AuditReport {
  id: string;
  period: string;
  generatedAt: Date;
  administrationRate: number;
  scheduled: number;
  generatedBy: "auto" | "manual";
}

export interface AuditSummary {
  scheduled: number; administered: number; refused: number; omitted: number; notAvailable: number; gaps: number; rate: number;
}

// ---- Forms (validated with zod in lib/validations/medication) ----
export interface RecordDoseFormData {
  status: AdministrationStatus | "";
  reasonCode: ReasonCode | "";
  note: string;
  doseGiven: string;
  witness: string;
  barcode: string;
}

export interface MedicationFormData {
  patientId: string;
  drugName: string;
  strength: string;
  route: MedicationRoute | "";
  type: MedicationType | "";
  frequency: MedicationFrequency | "";
  times: string[];
  prescriber: string;
  startDate: string;
  endDate: string;
  indication: string;
  instructions: string;
  schedule: ControlledSchedule | "";
  prnMinIntervalHours: number | "";
  prnMaxPer24h: number | "";
}

export interface PrnFormData { medicationId: string; reason: string; doseGiven: string }
export interface PrnFollowUpFormData { effectiveness: PrnEffectiveness | ""; note: string }

export interface ControlledEntryFormData {
  kind: Exclude<ControlledEntryKind, "administration"> | "";
  quantity: number | "";
  witness: string;
  note: string;
  adjustBalance: boolean;
}

// ---- View models (built in hooks / utils) ----
export interface PrnRow { record: PrnRecord; medication: Medication; patient: MedicationPatient; state: PrnFollowUpState }
export interface ProfileGroup { patient: MedicationPatient; medications: Medication[] }
export interface ControlledItem { stock: ControlledStock; medication: Medication; patient: MedicationPatient; discrepancy: number }
