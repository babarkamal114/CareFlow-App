import type { BadgeProps } from '@/components/ui';
import { formatFileSize } from './file-format-size';

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

export type ActivityType = 'medication' | 'meal' | 'vital' | 'therapy' | 'other';

export interface PatientActivity {
  id: string;
  carer: string;
  activity: string;
  time: string;
  type: ActivityType;
}

const MOCK_ACTIVITY: PatientActivity[] = [
  { id: '1', carer: 'Sarah Johnson', activity: 'Morning medication administered', time: '08:30 AM', type: 'medication' },
  { id: '2', carer: 'Sarah Johnson', activity: 'Breakfast prepared and served', time: '09:00 AM', type: 'meal' },
  { id: '3', carer: 'Michael Chen', activity: 'Vitals checked - BP: 120/80', time: '11:30 AM', type: 'vital' },
  { id: '4', carer: 'Sarah Johnson', activity: 'Lunch prepared and served', time: '01:00 PM', type: 'meal' },
  { id: '5', carer: 'Emma Williams', activity: 'Physical therapy session completed', time: '03:30 PM', type: 'therapy' },
];

export function fetchPatientActivity(patientId: string): Promise<PatientActivity[]> {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_ACTIVITY), 500));
}

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  medication: 'bg-blue-500/20 text-blue-600',
  meal: 'bg-green-500/20 text-green-600',
  vital: 'bg-red-500/20 text-red-600',
  therapy: 'bg-purple-500/20 text-purple-600',
  other: 'bg-gray-500/20 text-gray-600',
};

export function getActivityColor(type: ActivityType): string {
  return ACTIVITY_COLORS[type] ?? ACTIVITY_COLORS.other;
}

export const PATIENT_DOCUMENT_TYPES = [
  { value: 'capacity-assessment', label: 'Capacity Assessment' },
  { value: 'dnar', label: 'DNAR Order' },
  { value: 'poa', label: 'Power of Attorney' },
  { value: 'discharge-summary', label: 'Hospital Discharge Summary' },
  { value: 'care-plan', label: 'Care Plan' },
  { value: 'medication-list', label: 'Medication List' },
  { value: 'other', label: 'Other' },
] as const;

export interface PatientDocument {
  id: string;
  name: string;
  docType: string;
  uploadedDate: string;
  size: string;
}

const MOCK_DOCUMENTS: PatientDocument[] = [
  { id: '1', name: 'Care Plan - March 2024', docType: 'care-plan', uploadedDate: '2024-03-01', size: '2.4 MB' },
  { id: '2', name: 'Hospital Discharge Summary - Jan 2024', docType: 'discharge-summary', uploadedDate: '2024-01-15', size: '1.8 MB' },
  { id: '3', name: 'Medication List - Current', docType: 'medication-list', uploadedDate: '2024-03-10', size: '456 KB' },
  { id: '4', name: 'Power of Attorney - Registered', docType: 'poa', uploadedDate: '2024-02-15', size: '892 KB' },
];

export function fetchPatientDocuments(patientId: string): Promise<PatientDocument[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...MOCK_DOCUMENTS]), 500));
}

export function getDocumentTypeLabel(value: string): string {
  return PATIENT_DOCUMENT_TYPES.find((t) => t.value === value)?.label ?? 'Other';
}

export function sortDocumentsNewestFirst(docs: PatientDocument[]): PatientDocument[] {
  return [...docs].sort((a, b) => (a.uploadedDate < b.uploadedDate ? 1 : -1));
}

export function buildDocumentsFromFiles(files: File[], docType: string): PatientDocument[] {
  const uploadedDate = new Date().toLocaleDateString('en-CA');
  return files.map((file, i) => ({
    id: `${Date.now()}-${i}-${file.name}`,
    name: file.name,
    docType,
    uploadedDate,
    size: formatFileSize(file.size),
  }));
}

export function getActivityDotClass(type: ActivityType): string {
  return getActivityColor(type).split(' ')[0] ?? '';
}

export const DEFAULT_PATIENT_DOCUMENT_TYPE = 'other';
export const PATIENT_DOCUMENT_ACCEPT = '.pdf,.doc,.docx,.jpg,.png';

export function formatPatientDateGB(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-GB');
}

export function getDocumentMetaParts(doc: PatientDocument): string[] {
  return [getDocumentTypeLabel(doc.docType), formatPatientDateGB(doc.uploadedDate), doc.size];
}

export function getMedicationDetailParts(med: PatientMedication): string[] {
  return [med.frequency, med.timing, med.route].filter((part): part is string => !!part);
}

export function getMedicationPrescribedParts(med: PatientMedication): string[] {
  return [
    med.prescriber ? `Prescribed by ${med.prescriber}` : '',
    med.startDate ? `Since ${formatPatientDateGB(med.startDate)}` : '',
  ].filter(Boolean);
}