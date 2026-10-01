import type { PatientFormData } from './patient-create';
import type { SelectOption } from './patient-form-fields';
import { capitalise } from './patient-profile';
import { formatPatientDateGB } from './patient-records';

export type PatientHistoryKey = 'conditions' | 'allergies' | 'hospitalisations';

export type PatientHistoryDraft = Record<string, string>;

export interface PatientHistoryField {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type: string;
}

export interface PatientHistorySection {
  key: PatientHistoryKey;
  heading: string;
  addLabel: string;
  gridFields: PatientHistoryField[];
  selectField?: { id: string; name: string; label: string; options: SelectOption[] };
  extraFields: PatientHistoryField[];
  requiredFields: string[];
  emptyDraft: PatientHistoryDraft;
  listCardClass: string;
}

const CONDITION_STATUS_OPTIONS: SelectOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'managed', label: 'Managed' },
  { value: 'resolved', label: 'Resolved' },
];

const ALLERGY_SEVERITY_OPTIONS: SelectOption[] = [
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
];

export const PATIENT_HISTORY_SECTIONS: PatientHistorySection[] = [
  {
    key: 'conditions',
    heading: 'Current Conditions',
    addLabel: 'Add Condition',
    gridFields: [
      { id: 'condition-name', name: 'name', label: 'Condition Name', placeholder: 'Type 2 Diabetes', type: 'text' },
      { id: 'condition-date', name: 'diagnosedDate', label: 'Diagnosed Date', placeholder: '', type: 'date' },
    ],
    selectField: { id: 'condition-status', name: 'status', label: 'Status', options: CONDITION_STATUS_OPTIONS },
    extraFields: [],
    requiredFields: ['name', 'diagnosedDate'],
    emptyDraft: { name: '', diagnosedDate: '', status: 'active' },
    listCardClass: 'border-cf-border p-3',
  },
  {
    key: 'allergies',
    heading: 'Allergies',
    addLabel: 'Add Allergy',
    gridFields: [
      { id: 'allergy-name', name: 'name', label: 'Allergen', placeholder: 'Penicillin', type: 'text' },
      { id: 'allergy-reaction', name: 'reaction', label: 'Reaction', placeholder: 'Rash, difficulty breathing', type: 'text' },
    ],
    selectField: { id: 'allergy-severity', name: 'severity', label: 'Severity', options: ALLERGY_SEVERITY_OPTIONS },
    extraFields: [],
    requiredFields: ['name', 'reaction'],
    emptyDraft: { name: '', severity: 'mild', reaction: '' },
    listCardClass: 'border-l-4 border-l-red-500 p-3',
  },
  {
    key: 'hospitalisations',
    heading: 'Hospitalisations',
    addLabel: 'Add Hospitalisation',
    gridFields: [
      { id: 'hospital-date', name: 'date', label: 'Admission Date', placeholder: '', type: 'date' },
      { id: 'hospital-duration', name: 'duration', label: 'Duration', placeholder: '3 days', type: 'text' },
    ],
    extraFields: [
      { id: 'hospital-reason', name: 'reason', label: 'Reason', placeholder: 'Chest infection, fractured hip', type: 'text' },
      { id: 'hospital-outcome', name: 'outcome', label: 'Outcome', placeholder: 'Fully recovered, ongoing physio', type: 'text' },
    ],
    requiredFields: ['date', 'reason'],
    emptyDraft: { date: '', reason: '', duration: '', outcome: '' },
    listCardClass: 'border-cf-border p-3',
  },
];

export function getEmptyPatientHistoryDrafts(): Record<PatientHistoryKey, PatientHistoryDraft> {
  return {
    conditions: { ...PATIENT_HISTORY_SECTIONS[0]!.emptyDraft },
    allergies: { ...PATIENT_HISTORY_SECTIONS[1]!.emptyDraft },
    hospitalisations: { ...PATIENT_HISTORY_SECTIONS[2]!.emptyDraft },
  };
}

export const canAddPatientHistoryItem = (section: PatientHistorySection, draft: PatientHistoryDraft) =>
  section.requiredFields.every((field) => !!draft[field]);

export function addPatientHistoryItem(
  formData: PatientFormData,
  key: PatientHistoryKey,
  draft: PatientHistoryDraft
): PatientFormData {
  const list = (formData[key] || []) as unknown[];
  return { ...formData, [key]: [...list, { ...draft, id: Date.now().toString() }] } as PatientFormData;
}

export function removePatientHistoryItem(formData: PatientFormData, key: PatientHistoryKey, id: string): PatientFormData {
  const list = (formData[key] || []) as unknown as { id: string }[];
  return { ...formData, [key]: list.filter((item) => item.id !== id) } as PatientFormData;
}

const HISTORY_ITEM_VIEWS: Record<PatientHistoryKey, (item: Record<string, string>) => { title: string; metaParts: string[] }> = {
  conditions: (c) => ({
    title: c.name ?? '',
    metaParts: [`Diagnosed: ${formatPatientDateGB(c.diagnosedDate ?? '')}`, capitalise(c.status ?? '')],
  }),
  allergies: (a) => ({
    title: a.name ?? '',
    metaParts: [capitalise(a.severity ?? ''), `Reaction: ${a.reaction}`],
  }),
  hospitalisations: (h) => ({
    title: h.reason ?? '',
    metaParts: [formatPatientDateGB(h.date ?? ''), h.duration ?? '', h.outcome ?? ''],
  }),
};

export function getPatientHistoryItems(formData: PatientFormData, key: PatientHistoryKey) {
  const list = (formData[key] || []) as unknown as ({ id: string } & Record<string, string>)[];
  return list.map((item) => ({ id: item.id, ...HISTORY_ITEM_VIEWS[key](item) }));
}