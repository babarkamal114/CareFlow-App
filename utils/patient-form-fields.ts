import { FileText, FileHeart, Scale, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { PatientFormData } from './patient-create';
import { formatFileSize } from './file-format-size';
import { PATIENT_DOCUMENT_TYPES, getDocumentTypeLabel } from './patient-records';

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

export type PatientFieldDef<N extends string = string> =
  | { kind: 'input'; name: N; label: string; placeholder: string; type: string }
  | { kind: 'textarea'; name: N; label: string; placeholder: string; minHeightClass: string; hint?: string }
  | { kind: 'select'; name: N; label: string; placeholder: string; options: SelectOption[] };

export interface PatientFieldSection<N extends string = string> {
  id: string;
  gridClass?: string;
  fields: PatientFieldDef<N>[];
}

export const PATIENT_RISK_OPTIONS: SelectOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const PATIENT_STATUS_OPTIONS: SelectOption[] = [
  { value: 'new', label: 'New' },
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On Hold' },
];

export type CreatePatientInfoKey =
  | 'name'
  | 'preferredName'
  | 'dateOfBirth'
  | 'nhsNumber'
  | 'address'
  | 'email'
  | 'phone'
  | 'gpName'
  | 'gpPhone'
  | 'gpAddress'
  | 'nextOfKinName'
  | 'nextOfKinPhone'
  | 'nextOfKinRelationship'
  | 'emergencyContact'
  | 'emergencyPhone'
  | 'emergencyRelationship'
  | 'risk'
  | 'status';

export const CREATE_PATIENT_INFO_SECTIONS: PatientFieldSection<CreatePatientInfoKey>[] = [
  {
    id: 'personal',
    gridClass: 'grid grid-cols-2 gap-4',
    fields: [
      { kind: 'input', name: 'name', label: 'Full Name *', placeholder: 'Dorothy Chen', type: 'text' },
      { kind: 'input', name: 'preferredName', label: 'Preferred Name', placeholder: 'Dot', type: 'text' },
      { kind: 'input', name: 'dateOfBirth', label: 'Date of Birth *', placeholder: '', type: 'date' },
      { kind: 'input', name: 'nhsNumber', label: 'NHS Number', placeholder: '123 456 7890', type: 'text' },
    ],
  },
  {
    id: 'address',
    fields: [
      { kind: 'input', name: 'address', label: 'Address *', placeholder: '123 Oak Street, Manchester, M1 2AB', type: 'text' },
    ],
  },
  {
    id: 'contact',
    gridClass: 'grid grid-cols-2 gap-4',
    fields: [
      { kind: 'input', name: 'email', label: 'Email', placeholder: 'dorothy@email.com', type: 'email' },
      { kind: 'input', name: 'phone', label: 'Phone Number *', placeholder: '0161 123 4567', type: 'text' },
    ],
  },
  {
    id: 'gp',
    gridClass: 'grid grid-cols-2 gap-4',
    fields: [
      { kind: 'input', name: 'gpName', label: 'GP Name', placeholder: 'Dr. Sarah Ahmed', type: 'text' },
      { kind: 'input', name: 'gpPhone', label: 'GP Phone', placeholder: '0161 123 4567', type: 'text' },
    ],
  },
  {
    id: 'gp-address',
    fields: [
      { kind: 'input', name: 'gpAddress', label: 'GP Surgery Address', placeholder: 'Oak Lane Surgery, Manchester', type: 'text' },
    ],
  },
  {
    id: 'next-of-kin',
    gridClass: 'grid grid-cols-3 gap-4',
    fields: [
      { kind: 'input', name: 'nextOfKinName', label: 'Next of Kin Name', placeholder: 'Margaret Chen', type: 'text' },
      { kind: 'input', name: 'nextOfKinPhone', label: 'Next of Kin Phone', placeholder: '07700 900123', type: 'text' },
      { kind: 'input', name: 'nextOfKinRelationship', label: 'Relationship', placeholder: 'Daughter', type: 'text' },
    ],
  },
  {
    id: 'emergency',
    gridClass: 'grid grid-cols-3 gap-4',
    fields: [
      { kind: 'input', name: 'emergencyContact', label: 'Emergency Contact', placeholder: 'Margaret Chen', type: 'text' },
      { kind: 'input', name: 'emergencyPhone', label: 'Emergency Phone', placeholder: '07700 900123', type: 'text' },
      { kind: 'input', name: 'emergencyRelationship', label: 'Emergency Relationship', placeholder: 'Daughter', type: 'text' },
    ],
  },
  {
    id: 'risk-status',
    gridClass: 'grid grid-cols-2 gap-4',
    fields: [
      { kind: 'select', name: 'risk', label: 'Risk Level *', placeholder: 'Select risk level', options: PATIENT_RISK_OPTIONS },
      { kind: 'select', name: 'status', label: 'Status *', placeholder: 'Select status', options: PATIENT_STATUS_OPTIONS },
    ],
  },
];

export const PATIENT_ATTACHMENT_TYPES = PATIENT_DOCUMENT_TYPES.filter((t) => t.value !== 'medication-list');

export const PATIENT_ATTACHMENT_ICONS: Record<string, LucideIcon> = {
  'capacity-assessment': ShieldAlert,
  dnar: FileHeart,
  poa: Scale,
  'discharge-summary': FileText,
  'care-plan': FileText,
  other: FileText,
};

type PatientAttachment = PatientFormData['attachments'][number];

export function buildPatientAttachments(files: File[], docType: string): PatientAttachment[] {
  return files.map((file) => ({
    id: Date.now().toString() + Math.random(),
    name: file.name,
    size: file.size,
    docType,
    file,
  }));
}

export function removePatientAttachment(attachments: PatientAttachment[], id: string): PatientAttachment[] {
  return attachments.filter((attachment) => attachment.id !== id);
}

export function getAttachmentMetaParts(attachment: PatientAttachment): string[] {
  return [
    formatFileSize(attachment.size),
    attachment.docType ? getDocumentTypeLabel(attachment.docType) : '',
  ].filter(Boolean);
}