import type { MedicationDraft, PatientMedication } from './patient-records';

export type MedicationDraftTextKey = Extract<
  keyof MedicationDraft,
  'name' | 'dosage' | 'frequency' | 'timing' | 'prescriber' | 'startDate' | 'indication' | 'instructions'
>;

export type MedicationRowTextKey = Extract<
  keyof PatientMedication,
  'name' | 'dosage' | 'frequency' | 'timing' | 'route' | 'prescriber' | 'startDate' | 'indication' | 'instructions'
>;

export interface MedicationDraftFieldDef {
  id: string;
  name: MedicationDraftTextKey;
  label: string;
  placeholder: string;
  type: string;
}

export interface MedicationRowFieldDef {
  name: MedicationRowTextKey;
  placeholder: string;
  type: string;
  className: string;
}

export const MEDICATION_DRAFT_REQUIRED_FIELDS: MedicationDraftFieldDef[] = [
  { id: 'med-name', name: 'name', label: 'Medication Name *', placeholder: 'Lisinopril', type: 'text' },
  { id: 'med-dosage', name: 'dosage', label: 'Dosage *', placeholder: '10mg', type: 'text' },
  { id: 'med-frequency', name: 'frequency', label: 'Frequency *', placeholder: 'Once daily', type: 'text' },
  { id: 'med-timing', name: 'timing', label: 'Timing *', placeholder: 'Morning', type: 'text' },
];

export const MEDICATION_DRAFT_OPTIONAL_FIELDS: MedicationDraftFieldDef[] = [
  { id: 'med-prescriber', name: 'prescriber', label: 'Prescriber', placeholder: 'Dr. Sarah Ahmed', type: 'text' },
  { id: 'med-start-date', name: 'startDate', label: 'Start Date', placeholder: '', type: 'date' },
];

export const MEDICATION_DRAFT_NOTE_FIELDS: MedicationDraftFieldDef[] = [
  { id: 'med-indication', name: 'indication', label: 'Indication (optional)', placeholder: 'Hypertension', type: 'text' },
  {
    id: 'med-instructions',
    name: 'instructions',
    label: 'Special Instructions (optional)',
    placeholder: 'Take with food, avoid grapefruit...',
    type: 'text',
  },
];

export const MEDICATION_ROW_LEAD_FIELDS: MedicationRowFieldDef[] = [
  { name: 'name', placeholder: '', type: 'text', className: 'flex-1' },
  { name: 'dosage', placeholder: 'Dosage', type: 'text', className: 'w-20' },
];

export const MEDICATION_ROW_DETAIL_LINES: MedicationRowFieldDef[][] = [
  [
    { name: 'frequency', placeholder: 'Frequency', type: 'text', className: 'flex-1' },
    { name: 'timing', placeholder: 'Timing', type: 'text', className: 'flex-1' },
    { name: 'route', placeholder: 'Route', type: 'text', className: 'flex-1' },
  ],
  [
    { name: 'prescriber', placeholder: 'Prescriber', type: 'text', className: 'flex-1' },
    { name: 'startDate', placeholder: '', type: 'date', className: 'flex-1' },
  ],
];

export const MEDICATION_ROW_NOTE_FIELDS: MedicationRowFieldDef[] = [
  { name: 'indication', placeholder: 'Indication (optional)', type: 'text', className: 'w-full' },
  { name: 'instructions', placeholder: 'Special instructions (optional)', type: 'text', className: 'w-full' },
];