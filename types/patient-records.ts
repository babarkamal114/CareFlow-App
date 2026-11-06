/**
 * Patient record types shown in the drawer tabs:
 * medications (eMAR), activity, documents, daily notes, risk assessments.
 */
import type { PatientRisk } from "./patients";

export type MedicationType =
  | "regular"
  | "prn"
  | "controlled"
  | "short-course"
  | "variable-dose";

export interface PatientMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  indication: string;
  route?: string;
  prescriber?: string;
  startDate?: string;
  medicationType?: MedicationType;
  instructions?: string;
}

export type MedicationDraft = Omit<Required<PatientMedication>, "id">;

export type ActivityType = "medication" | "meal" | "vital" | "therapy" | "other";

export interface PatientActivity {
  id: string;
  patientId: string;
  carer: string;
  activity: string;
  /** ISO datetime. */
  time: string;
  type: ActivityType;
}

export interface PatientDocument {
  id: string;
  patientId: string;
  name: string;
  docType: string;
  /** ISO date. */
  uploadedDate: string;
  size: string;
}

export type PatientNoteDomain =
  | "mood"
  | "nutrition"
  | "personal-care"
  | "mobility"
  | "skin"
  | "continence"
  | "social"
  | "concern";

export interface PatientDailyNote {
  id: string;
  patientId: string;
  date: string;
  time: string;
  author: string;
  domain: PatientNoteDomain;
  content: string;
  flagged?: boolean;
}

export type PatientRiskAssessmentType =
  | "falls"
  | "pressure-ulcer"
  | "nutrition"
  | "moving-handling"
  | "medication"
  | "environmental"
  | "fire"
  | "lone-worker"
  | "safeguarding";

export interface PatientRiskAssessment {
  id: string;
  patientId: string;
  type: PatientRiskAssessmentType;
  date: string;
  assessor: string;
  score: number;
  riskLevel: PatientRisk;
  findings: { factor: string; score: number }[];
  interventions: string[];
  nextReview: string;
  status: "active" | "reviewed";
}