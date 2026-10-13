import { ThumbsUp, ThumbsDown, type LucideIcon } from 'lucide-react';
import type { Patient } from 'types';
import type { PatientInfoData } from './patient-profile';
import { formatPatientDateGB } from './patient-records';

export const PATIENT_DRAWER_MAIN_TABS = [
  { value: 'info', label: 'Info' },
  { value: 'medical', label: 'Medical' },
  { value: 'communication', label: 'Communication' },
  { value: 'preferences', label: 'Preferences' },
] as const;

export const PATIENT_DRAWER_MORE_TABS = [
  { value: 'activity', label: 'Activity' },
  { value: 'medications', label: 'Medications' },
  { value: 'documents', label: 'Documents' },
  { value: 'clinical', label: 'Clinical Notes' },
  { value: 'risk', label: 'Risk' },
] as const;

export const PATIENT_DRAWER_TABS = [...PATIENT_DRAWER_MAIN_TABS, ...PATIENT_DRAWER_MORE_TABS];


export const PATIENT_DRAWER_SKELETON_TAB_IDS: ReadonlySet<string> = new Set(
  PATIENT_DRAWER_MAIN_TABS.map((tab) => tab.value)
);


export const PATIENT_COMMUNICATION_KEYS = [
  'preferredLanguage',
  'hearingImpairment',
  'visionImpairment',
  'mentalCapacity',
  'hearingAids',
  'glasses',
  'pictureBoard',
  'interpreter',
  'communicationNotes',
  'poaName',
  'poaRelationship',
  'poaPhone',
] as const;

export const PATIENT_PREFERENCES_KEYS = [
  'wakeTime',
  'bedTime',
  'breakfastTime',
  'lunchTime',
  'dinnerTime',
  'bathPreference',
  'teaPreference',
  'dietaryPreferences',
  'culturalReligious',
  'likes',
  'dislikes',
  'hobbies',
  'dailyRoutine',
] as const;

/** Copies just the listed fields off the patient, so a tab gets exactly its own props. */
export function pickPatientFields<K extends keyof Patient>(
  patient: Patient,
  keys: readonly K[]
): Pick<Patient, K> {
  return Object.fromEntries(
    keys.filter((key) => key in patient).map((key) => [key, patient[key]])
  ) as Pick<Patient, K>;
}


export interface PatientInfoRowData {
  label: string;
  value?: string | undefined;
}

export function getPersonalInfoRows(p: PatientInfoData): PatientInfoRowData[] {
  return [
    { label: 'Full Name', value: p.name },
    { label: 'Preferred Name', value: p.preferredName },
    { label: 'Date of Birth', value: p.dateOfBirth ? formatPatientDateGB(p.dateOfBirth) : undefined },
    { label: 'NHS Number', value: p.nhsNumber },
    { label: 'Address', value: p.address },
    { label: 'Email', value: p.email },
    { label: 'Phone', value: p.phone },
  ];
}

export function getGpInfoRows(p: PatientInfoData): PatientInfoRowData[] {
  return [
    { label: 'GP Name', value: p.gpName },
    { label: 'GP Phone', value: p.gpPhone },
    { label: 'GP Address', value: p.gpAddress },
  ];
}

export function getNextOfKinRows(p: PatientInfoData): PatientInfoRowData[] {
  return [
    { label: 'Next of Kin', value: p.nextOfKinName },
    { label: 'Relationship', value: p.nextOfKinRelationship },
    { label: 'Phone', value: p.nextOfKinPhone },
  ];
}

export function getEmergencyContactRows(p: PatientInfoData): PatientInfoRowData[] {
  return [
    { label: 'Emergency Contact', value: p.emergencyContact },
    { label: 'Relationship', value: p.emergencyRelationship },
    { label: 'Phone', value: p.emergencyPhone },
  ];
}

export const PREFERENCE_OPINION_BLOCKS: {
  key: 'likes' | 'dislikes';
  Icon: LucideIcon;
  boxClass: string;
  iconClass: string;
}[] = [
  {
    key: 'likes',
    Icon: ThumbsUp,
    boxClass: 'p-2 bg-brand-50/50 rounded-lg border border-brand-200/50',
    iconClass: 'h-4 w-4 text-brand-500 mt-0.5',
  },
  {
    key: 'dislikes',
    Icon: ThumbsDown,
    boxClass: 'p-2 bg-cf-red-50/50 rounded-lg border border-destructive/20',
    iconClass: 'h-4 w-4 text-destructive mt-0.5',
  },
];