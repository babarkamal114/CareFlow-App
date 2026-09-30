import type { PatientFormData } from './patient-create';


export interface SelectOption {
  value: string;
  label: string;
}

export type CommunicationSelectKey = 'hearingImpairment' | 'visionImpairment' | 'mentalCapacity';

export type ConsentKey = 'consentDataSharing' | 'consentFamilySharing' | 'consentPhotoEvidence';

export type PoaKey = 'poaName' | 'poaRelationship' | 'poaPhone';

export const COMMUNICATION_SELECTS: {
  name: CommunicationSelectKey;
  label: string;
  placeholder: string;
  defaultValue: string;
  options: SelectOption[];
}[] = [
  {
    name: 'hearingImpairment',
    label: 'Hearing Impairment',
    placeholder: 'Select hearing status',
    defaultValue: 'none',
    options: [
      { value: 'none', label: 'None' },
      { value: 'mild', label: 'Mild' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' },
      { value: 'deaf', label: 'Deaf' },
    ],
  },
  {
    name: 'visionImpairment',
    label: 'Vision Impairment',
    placeholder: 'Select vision status',
    defaultValue: 'none',
    options: [
      { value: 'none', label: 'None' },
      { value: 'mild', label: 'Mild' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' },
      { value: 'blind', label: 'Blind' },
    ],
  },
  {
    name: 'mentalCapacity',
    label: 'Mental Capacity',
    placeholder: 'Select capacity status',
    defaultValue: 'full',
    options: [
      { value: 'full', label: 'Full Capacity' },
      { value: 'partial', label: 'Partial Capacity' },
      { value: 'lacks', label: 'Lacks Capacity' },
    ],
  },
];

export const POA_FIELDS: { name: PoaKey; label: string; placeholder: string }[] = [
  { name: 'poaName', label: 'Name', placeholder: 'Margaret Chen' },
  { name: 'poaRelationship', label: 'Relationship', placeholder: 'Daughter' },
  { name: 'poaPhone', label: 'Phone Number', placeholder: '07700 900123' },
];

export const CONSENT_OPTIONS: { name: ConsentKey; label: string }[] = [
  {
    name: 'consentDataSharing',
    label: 'Consents to data being shared with GP, district nurse, and other care professionals',
  },
  {
    name: 'consentFamilySharing',
    label: 'Consents to care information being shared with family via the Family Portal',
  },
  {
    name: 'consentPhotoEvidence',
    label: 'Consents to photo evidence being taken (e.g. wound progression, home hazards)',
  },
];

export function getSelectValue(
  formData: PatientFormData,
  field: (typeof COMMUNICATION_SELECTS)[number]
): string {
  return formData[field.name] || field.defaultValue;
}