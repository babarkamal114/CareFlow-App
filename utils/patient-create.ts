import type { Carer, Patient, PatientFormData, PatientStepKey } from 'types';
import { getCarerName } from './carers';
import { getPatientsToday } from './patients';

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
] as const satisfies readonly { key: PatientStepKey; label: string }[];

export const TOTAL_STEPS = PATIENT_STEPS.length;
export const STEP_LABELS: string[] = PATIENT_STEPS.map((s) => s.label);

export function getStepKey(step: number): PatientStepKey | undefined {
  return PATIENT_STEPS[step - 1]?.key;
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

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Full years between `dateOfBirth` and `today` (both ISO dates). */
export function calculateAge(dateOfBirth: string, today = getPatientsToday()): number {
  const [by = 0, bm = 1, bd = 1] = dateOfBirth.slice(0, 10).split('-').map(Number);
  const [ty = 0, tm = 1, td = 1] = today.slice(0, 10).split('-').map(Number);
  const hadBirthday = tm > bm || (tm === bm && td >= bd);
  return ty - by - (hadBirthday ? 0 : 1);
}

/** ISO date `days` after `isoDate`. */
export function addDaysToIso(isoDate: string, days: number): string {
  const [y = 0, m = 1, d = 1] = isoDate.slice(0, 10).split('-').map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`;
}

/** Default care plan review cycle: every 4 weeks (blueprint §3.1.2). */
export const DEFAULT_REVIEW_INTERVAL_DAYS = 28;

export function buildNewPatient(
  formData: PatientFormData,
  carers: Carer[],
  today = getPatientsToday()
): Patient {
  const { selectedCarers, contacts, medications, attachments, ...profile } = formData;
  const primaryCarerId = selectedCarers[0];

  return {
    ...profile,
    id: Date.now().toString(),
    initials: getInitials(formData.name),
    age: calculateAge(formData.dateOfBirth, today),
    carer: (primaryCarerId && getCarerName(carers, primaryCarerId)) || '',
    nextVisit: null,
    carePlanReviewDate: addDaysToIso(today, DEFAULT_REVIEW_INTERVAL_DAYS),
    admissionDate: today,
  };
}