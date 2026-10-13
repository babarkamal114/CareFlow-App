/**
 * Create-patient wizard form types (blueprint §5.3 admission wizard).
 */
import type {
  PatientAllergy,
  PatientCommunicationInfo,
  PatientCondition,
  PatientConsentInfo,
  PatientHospitalisation,
  PatientKeyPeople,
  PatientLifeStory,
  PatientPreferencesInfo,
  PatientRisk,
  PatientStatus,
  WithId,
} from "./patients";
import type { PatientMedication } from "./patient-records";

export type PatientStepKey =
  | "personal"
  | "medical-history"
  | "communication"
  | "preferences"
  | "contacts"
  | "life-story"
  | "medications"
  | "carers"
  | "documents";

export interface PatientContact {
  id: string;
  type: "gp" | "district-nurse" | "social-worker" | "pharmacist" | "family" | "other";
  name: string;
  role: string;
  phone: string;
  email: string;
  relationship: string;
  isPrimary: boolean;
  isEmergency: boolean;
}

export type PatientContactDraft = Omit<PatientContact, "id">;

export interface PatientFormAttachment {
  id: string;
  name: string;
  size: number;
  docType?: string;
  file: File;
}

export interface PatientFormData
  extends Required<PatientKeyPeople>,
    Required<PatientCommunicationInfo>,
    Required<PatientConsentInfo>,
    Required<PatientPreferencesInfo>,
    Required<PatientLifeStory> {
  name: string;
  preferredName: string;
  dateOfBirth: string;
  nhsNumber: string;
  email: string;
  phone: string;
  address: string;
  risk: PatientRisk;
  status: Exclude<PatientStatus, "discharged">;
  conditions: WithId<PatientCondition>[];
  allergies: WithId<PatientAllergy>[];
  hospitalisations: WithId<PatientHospitalisation>[];
  contacts: PatientContact[];
  selectedCarers: string[];
  medications: Required<PatientMedication>[];
  attachments: PatientFormAttachment[];
}