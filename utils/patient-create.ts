import type { MedicationType } from 'utils';
import type { Carer } from 'utils';
import { getCarerName } from 'utils';


export const PATIENT_STEPS = [
  { key: 'personal', label: 'Personal Details' },
  { key: 'medical-history', label: 'Medical History' },
  { key: 'communication', label: 'Communication' },
  { key: 'preferences', label: 'Preferences' },
  { key: 'contacts', label: 'Key Contacts' },
  { key: 'life-story', label: 'Life Story' },
  { key: 'medications', label: 'Medications' },
  { key: 'carers', label: 'Assign Carers' },
  { key: 'documents', label: 'Documents' },
] as const;

export type PatientStepKey = (typeof PATIENT_STEPS)[number]['key'];

export const TOTAL_STEPS = PATIENT_STEPS.length;
export const STEP_LABELS: string[] = PATIENT_STEPS.map((s) => s.label);

export function getStepKey(step: number): PatientStepKey | undefined {
  return PATIENT_STEPS[step - 1]?.key;
}

export interface PatientContact {
  id: string;
  type: 'gp' | 'district-nurse' | 'social-worker' | 'pharmacist' | 'family' | 'other';
  name: string;
  role: string;
  phone: string;
  email: string;
  relationship: string;
  isPrimary: boolean;
  isEmergency: boolean;
}

export interface PatientFormData {
  name: string;
  preferredName: string;
  dateOfBirth: string;
  nhsNumber: string;
  email: string;
  phone: string;
  address: string;
  gpName: string;
  gpPhone: string;
  gpAddress: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  nextOfKinRelationship: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelationship: string;

  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'on-hold' | 'new';

  conditions: Array<{ id: string; name: string; diagnosedDate: string; status: 'active' | 'managed' | 'resolved' }>;
  allergies: Array<{ id: string; name: string; severity: 'mild' | 'moderate' | 'severe'; reaction: string }>;
  hospitalisations: Array<{ id: string; date: string; reason: string; duration: string; outcome: string }>;

  preferredLanguage: string;
  hearingImpairment: string;
  visionImpairment: string;
  mentalCapacity: string;
  hearingAids: boolean;
  glasses: boolean;
  pictureBoard: boolean;
  interpreter: boolean;
  communicationNotes: string;
  poaName: string;
  poaRelationship: string;
  poaPhone: string;

  consentDataSharing: boolean;
  consentFamilySharing: boolean;
  consentPhotoEvidence: boolean;
  consentNotes: string;

  wakeTime: string;
  bedTime: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  bathPreference: string;
  teaPreference: string;
  dietaryPreferences: string;
  culturalReligious: string;
  likes: string;
  dislikes: string;
  hobbies: string;
  dailyRoutine: string;

  personalHistory: string;
  familyBackground: string;
  whatMakesMeSmile: string;
  whatUpsetsMe: string;
  whatMattersToMe: string;
  lifeHistory: string;
  importantPeople: string;

  contacts: PatientContact[];

  selectedCarers: string[];
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    timing: string;
    indication: string;
    route: string;
    prescriber: string;
    startDate: string;
    medicationType: MedicationType;
    instructions: string;
  }>;
  attachments: Array<{
    id: string;
    name: string;
    size: number;
    docType?: string;
    file: File;
  }>;
}

export function createEmptyPatientForm(): PatientFormData {
  return {
    name: '',
    preferredName: '',
    dateOfBirth: '',
    nhsNumber: '',
    email: '',
    phone: '',
    address: '',
    gpName: '',
    gpPhone: '',
    gpAddress: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    nextOfKinRelationship: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    risk: 'low',
    status: 'new',
    conditions: [],
    allergies: [],
    hospitalisations: [],
    preferredLanguage: '',
    hearingImpairment: 'none',
    visionImpairment: 'none',
    mentalCapacity: 'full',
    hearingAids: false,
    glasses: false,
    pictureBoard: false,
    interpreter: false,
    communicationNotes: '',
    poaName: '',
    poaRelationship: '',
    poaPhone: '',
    consentDataSharing: false,
    consentFamilySharing: false,
    consentPhotoEvidence: false,
    consentNotes: '',
    wakeTime: '',
    bedTime: '',
    breakfastTime: '',
    lunchTime: '',
    dinnerTime: '',
    bathPreference: '',
    teaPreference: '',
    dietaryPreferences: '',
    culturalReligious: '',
    likes: '',
    dislikes: '',
    hobbies: '',
    dailyRoutine: '',
    personalHistory: '',
    familyBackground: '',
    whatMakesMeSmile: '',
    whatUpsetsMe: '',
    whatMattersToMe: '',
    lifeHistory: '',
    importantPeople: '',
    contacts: [],
    selectedCarers: [],
    medications: [],
    attachments: [],
  };
}

export function validatePatientStep(
  step: PatientStepKey | undefined,
  formData: PatientFormData
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 'personal') {
    if (!formData.name.trim()) errors.name = 'Patient name is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
  }

  if (step === 'contacts' && formData.contacts.length === 0) {
    errors.contacts = 'Add at least one key contact before continuing';
  }

  if (step === 'carers' && formData.selectedCarers.length === 0) {
    errors.carers = 'Select at least one carer before continuing';
  }

  return errors;
}


export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function calculateAge(dateOfBirth: string, today = new Date()): number {
  const dob = new Date(dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  const hadBirthday =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hadBirthday) age -= 1;
  return age;
}

export function buildNewPatient(formData: PatientFormData, carers: Carer[]) {
  const { selectedCarers, ...rest } = formData;
  const primaryCarerId = selectedCarers[0];

  return {
    ...rest,
    id: Date.now().toString(),
    initials: getInitials(formData.name),
    age: calculateAge(formData.dateOfBirth),
    carer: (primaryCarerId && getCarerName(carers, primaryCarerId)) || '',
    nextVisit: 'TBD',
  };
}