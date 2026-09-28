import type { BadgeProps } from "@/components/ui";

export const MEDICATION_TYPES = [
  { value: 'regular', label: 'Regular' },
  { value: 'prn', label: 'PRN (As Needed)' },
  { value: 'controlled', label: 'Controlled Drug' },
  { value: 'short-course', label: 'Short Course' },
  { value: 'variable-dose', label: 'Variable Dose' },
] as const;

export type MedicationType = (typeof MEDICATION_TYPES)[number]['value'];

export const MEDICATION_ROUTES = ['Oral', 'Topical', 'Inhaled', 'Subcutaneous', 'Intramuscular', 'Patch', 'PEG'];

const SHORT_LABELS: Record<string, string> = {
  regular: 'Regular',
  prn: 'PRN',
  controlled: 'Controlled',
  'short-course': 'Short Course',
  'variable-dose': 'Variable Dose',
};

export interface PatientMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  indication: string;
  route?: string;
  prescriber?: string;
  startDate?: string;
  medicationType?: MedicationType;
  instructions?: string;
}

export interface MedicationDraft {
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
}

export const EMPTY_MEDICATION_DRAFT: MedicationDraft = {
  name: '',
  dosage: '',
  frequency: '',
  timing: '',
  indication: '',
  route: 'Oral',
  prescriber: '',
  startDate: '',
  medicationType: 'regular',
  instructions: '',
};

const MOCK_MEDICATIONS: PatientMedication[] = [
  { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', timing: 'Morning', route: 'Oral', indication: 'Hypertension', prescriber: 'Dr. Sarah Ahmed', startDate: '2024-01-15', medicationType: 'regular', instructions: 'Take with water, avoid grapefruit' },
  { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', timing: 'With meals', route: 'Oral', indication: 'Type 2 Diabetes', prescriber: 'Dr. Sarah Ahmed', startDate: '2023-11-20', medicationType: 'regular', instructions: '' },
  { id: '3', name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', timing: 'Evening', route: 'Oral', indication: 'Hypertension', prescriber: 'Dr. James Wilson', startDate: '2024-02-01', medicationType: 'regular', instructions: '' },
  { id: '4', name: 'Paracetamol', dosage: '500mg', frequency: 'Up to 4x daily', timing: 'As needed', route: 'Oral', indication: 'Pain relief', prescriber: 'Dr. James Wilson', startDate: '2024-01-05', medicationType: 'prn', instructions: 'Do not exceed 8 tablets in 24 hours' },
  { id: '5', name: 'Morphine Sulfate', dosage: '10mg', frequency: 'Every 4 hours', timing: 'As directed', route: 'Oral', indication: 'Severe pain management', prescriber: 'Dr. Sarah Ahmed', startDate: '2024-03-01', medicationType: 'controlled', instructions: 'Dual-witness administration required. Log stock balance after each dose.' },
];

export function fetchPatientMedications(patientId: string): Promise<PatientMedication[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_MEDICATIONS]), 500));
}

export function getMedicationTypeLabel(value?: string, style: 'full' | 'short' = 'full'): string {
  if (style === 'short') return (value && SHORT_LABELS[value]) || 'Regular';
  return MEDICATION_TYPES.find((t) => t.value === value)?.label ?? 'Regular';
}

export function getMedicationTypeBadgeVariant(value?: string): BadgeProps['variant'] {
  if (value === 'controlled') return 'pastel-danger';
  if (value === 'prn') return 'pastel-warning';
  if (value === 'variable-dose') return 'pastel-info';
  return 'pastel-success';
}

export function sortControlledFirst(meds: PatientMedication[]): PatientMedication[] {
  return [...meds].sort(
    (a, b) => Number(b.medicationType === 'controlled') - Number(a.medicationType === 'controlled')
  );
}

export function validateMedicationDraft(
  draft: MedicationDraft,
  existing: PatientMedication[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.name.trim()) errors.name = 'Name is required';
  if (!draft.dosage.trim()) errors.dosage = 'Dosage is required';
  if (!draft.frequency.trim()) errors.frequency = 'Frequency is required';
  if (!draft.timing.trim()) errors.timing = 'Timing is required';

  if (!errors.name && !errors.dosage) {
    const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
    if (existing.some((m) => same(m.name, draft.name) && same(m.dosage, draft.dosage))) {
      errors.name = 'Already on the list with this dosage';
    }
  }

  return errors;
}

export function getIncompleteMedicationIds(meds: PatientMedication[]): string[] {
  return meds
    .filter((m) => !m.name.trim() || !m.dosage.trim() || !m.frequency.trim() || !m.timing.trim())
    .map((m) => m.id);
}

export function haveMedicationsChanged(a: PatientMedication[], b: PatientMedication[]): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}