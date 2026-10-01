import { MEDICATION_ROUTES, MEDICATION_TYPES, type MedicationDraft, type PatientMedication } from './patient-records';
import type { PatientFormData } from './patient-create';
import type { SelectOption } from './patient-form-fields';

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

export const MEDICATION_ROUTE_OPTIONS: SelectOption[] = MEDICATION_ROUTES.map((route) => ({
  value: route,
  label: route,
}));

export const MEDICATION_TYPE_OPTIONS: SelectOption[] = MEDICATION_TYPES.map((type) => ({
  value: type.value,
  label: type.label,
}));

export const MEDICATION_WIZARD_REQUIRED_FIELDS: MedicationDraftFieldDef[] = MEDICATION_DRAFT_REQUIRED_FIELDS.map(
  (field) => ({ ...field, label: field.label.replace(/ \*$/, '') })
);

export const canAddMedicationDraft = (draft: MedicationDraft) =>
  !!(draft.name && draft.dosage && draft.frequency && draft.timing);

export function buildMedicationFromDraft(draft: MedicationDraft): PatientFormData['medications'][number] {
  return { id: Date.now().toString(), ...draft };
}

export function removeMedicationById<T extends { id: string }>(medications: T[], id: string): T[] {
  return medications.filter((med) => med.id !== id);
}

export function getMedicationSummaryParts(med: PatientMedication): string[] {
  return [med.dosage, med.frequency, med.timing, med.route].filter((part): part is string => !!part);
}