export type PatientStatus = "active" | "on-hold" | "new" | "discharged";
export type PatientRisk = "low" | "medium" | "high";
export type PatientTab =
  | "all"
  | "active"
  | "on-hold"
  | "high-risk"
  | "review-date"
  | "new";

/** Form errors. Matches what runSchema() returns. */
export type PatientFormErrors = Partial<Record<string, string>>;

export type WithId<T> = T & { id: string };

/* --------------------------- Profile fragments --------------------------- */

export interface PatientKeyPeople {
  gpName?: string;
  gpPhone?: string;
  gpAddress?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
}

export interface PatientCommunicationInfo {
  preferredLanguage?: string;
  hearingImpairment?: string;
  visionImpairment?: string;
  mentalCapacity?: string;
  hearingAids?: boolean;
  glasses?: boolean;
  pictureBoard?: boolean;
  interpreter?: boolean;
  communicationNotes?: string;
  poaName?: string;
  poaRelationship?: string;
  poaPhone?: string;
}

export interface PatientConsentInfo {
  consentDataSharing?: boolean;
  consentFamilySharing?: boolean;
  consentPhotoEvidence?: boolean;
  consentNotes?: string;
}

export interface PatientPreferencesInfo {
  wakeTime?: string;
  bedTime?: string;
  breakfastTime?: string;
  lunchTime?: string;
  dinnerTime?: string;
  bathPreference?: string;
  teaPreference?: string;
  dietaryPreferences?: string;
  culturalReligious?: string;
  likes?: string;
  dislikes?: string;
  hobbies?: string;
  dailyRoutine?: string;
}

/** "About Me" life story (blueprint §3.1.1). */
export interface PatientLifeStory {
  personalHistory?: string;
  familyBackground?: string;
  whatMakesMeSmile?: string;
  whatUpsetsMe?: string;
  whatMattersToMe?: string;
  lifeHistory?: string;
  importantPeople?: string;
}

export interface PatientCondition {
  id?: string;
  name: string;
  diagnosedDate: string;
  status: "active" | "managed" | "resolved" | "discharged";
}

export interface PatientAllergy {
  id?: string;
  name: string;
  severity: "mild" | "moderate" | "severe";
  reaction: string;
}

export interface PatientHospitalisation {
  id?: string;
  date: string;
  reason: string;
  duration: string;
  outcome: string;
}

/* ------------------------------- Discharge ------------------------------- */

export type DischargeReason =
  | "recovered"
  | "deceased"
  | "moved-out-of-area"
  | "moved-to-care-home"
  | "hospital-admission-permanent"
  | "self-funding-withdrawn"
  | "family-request"
  | "other";

export interface DischargePayload {
  reason: DischargeReason;
  notes: string;
  dischargeDate: string;
  scheduleFinalVisit: boolean;
  finalVisitDate?: string | undefined;
  finalVisitTime?: string | undefined;
  notifyGp: boolean;
  notifyNextOfKin: boolean;
  notifyEmergencyContact: boolean;
  otherNotifications: string;
}

export interface DischargeFormState extends Omit<
  DischargePayload,
  "finalVisitDate" | "finalVisitTime"
> {
  finalVisitDate: string;
  finalVisitTime: string;
}

export interface DischargeContacts {
  gpName?: string | undefined;
  nextOfKinName?: string | undefined;
  emergencyContact?: string | undefined;
}

/* --------------------------------- Patient -------------------------------- */

export interface Patient
  extends PatientKeyPeople,
    PatientCommunicationInfo,
    PatientConsentInfo,
    PatientPreferencesInfo,
    PatientLifeStory {
  id: string;
  name: string;
  preferredName?: string;
  dateOfBirth?: string;
  nhsNumber?: string;
  address: string;
  email: string;
  phone: string;
  avatar?: string;
  initials: string;
  age: number;
  risk: PatientRisk;
  status: PatientStatus;
  /** Primary carer's display name. */
  carer: string;
  /** ISO datetime of the next scheduled visit, null when none. */
  nextVisit: string | null;
  /** ISO date the care plan is next due for review (blueprint §3.1.2). */
  carePlanReviewDate: string | null;
  /** ISO date the patient was admitted. */
  admissionDate: string;
  conditions?: PatientCondition[];
  allergies?: PatientAllergy[];
  hospitalisations?: PatientHospitalisation[];
  dischargeDetails?: DischargePayload;
}

/** Fields the edit modal can change. */
export type PatientEditData = Pick<
  Patient,
  | "id"
  | "name"
  | "preferredName"
  | "dateOfBirth"
  | "nhsNumber"
  | "email"
  | "phone"
  | "address"
  | "risk"
  | "status"
  | "carer"
  | keyof PatientKeyPeople
>;

/** Summary numbers shown in the stat cards (derived from the list). */
export interface PatientStats {
  totalPatients: number;
  activePatients: number;
  newThisMonth: number;
  highRiskPatients: number;
  reviewsDue: number;
}

/* ------------------------------ Drawer tabs ------------------------------ */

export type PatientDrawerTabId =
  | "info"
  | "medical"
  | "communication"
  | "preferences"
  | "activity"
  | "medications"
  | "documents"
  | "clinical"
  | "risk";

export interface Carer {
  id: string;
  name: string;
}