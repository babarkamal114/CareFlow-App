import type { BadgeProps } from '@/components/ui';
import type { ActivityType, MedicationDraft, MedicationType, PatientActivity, PatientDocument, PatientMedication } from 'types';
import {
  MOCK_PATIENT_ACTIVITY,
  MOCK_PATIENT_DOCUMENTS,
  MOCK_PATIENT_MEDICATIONS,
} from 'lib';
import { formatFileSize } from './file-format-size';
import { getPatientsToday } from './patients';

export const MEDICATION_TYPES = [
  { value: 'regular', label: 'Regular' },
  { value: 'prn', label: 'PRN (As Needed)' },
  { value: 'controlled', label: 'Controlled Drug' },
  { value: 'short-course', label: 'Short Course' },
  { value: 'variable-dose', label: 'Variable Dose' },
] as const satisfies readonly { value: MedicationType; label: string }[];

export const MEDICATION_ROUTES = ['Oral', 'Topical', 'Inhaled', 'Subcutaneous', 'Intramuscular', 'Patch', 'PEG'];

const SHORT_LABELS: Record<string, string> = {
  regular: 'Regular',
  prn: 'PRN',
  controlled: 'Controlled',
  'short-course': 'Short Course',
  'variable-dose': 'Variable Dose',
};

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

export function fetchPatientMedications(patientId: string): Promise<PatientMedication[]> {
  const items = MOCK_PATIENT_MEDICATIONS.filter((m) => m.patientId === patientId).map(
    ({ patientId: _patientId, ...medication }) => medication
  );
  return new Promise((resolve) => setTimeout(() => resolve(items), 500));
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

export function getIncompleteMedicationIds(meds: PatientMedication[]): string[] {
  return meds
    .filter((m) => !m.name.trim() || !m.dosage.trim() || !m.frequency.trim() || !m.timing.trim())
    .map((m) => m.id);
}

export function haveMedicationsChanged(a: PatientMedication[], b: PatientMedication[]): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}


export function fetchPatientActivity(patientId: string): Promise<PatientActivity[]> {
  const items = MOCK_PATIENT_ACTIVITY.filter((a) => a.patientId === patientId);
  return new Promise((resolve) => setTimeout(() => resolve(items), 500));
}

const ACTIVITY_STYLES: Record<ActivityType, { badge: string; dot: string }> = {
  medication: { badge: 'bg-cf-blue-50 text-cf-blue-500', dot: 'bg-cf-blue-500' },
  meal: { badge: 'bg-brand-50 text-brand-500', dot: 'bg-brand-500' },
  vital: { badge: 'bg-cf-red-50 text-cf-red-500', dot: 'bg-cf-red-500' },
  therapy: { badge: 'bg-cf-amber-50 text-cf-amber-500', dot: 'bg-cf-amber-500' },
  other: { badge: 'bg-cf-surface-muted text-cf-ink-60', dot: 'bg-cf-ink-40' },
};

export function getActivityColor(type: ActivityType): string {
  return (ACTIVITY_STYLES[type] ?? ACTIVITY_STYLES.other).badge;
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

export function fetchPatientDocuments(patientId: string): Promise<PatientDocument[]> {
  const items = MOCK_PATIENT_DOCUMENTS.filter((d) => d.patientId === patientId);
  return new Promise((resolve) => setTimeout(() => resolve(items), 500));
}

export function getDocumentTypeLabel(value: string): string {
  return PATIENT_DOCUMENT_TYPES.find((t) => t.value === value)?.label ?? 'Other';
}

export function sortDocumentsNewestFirst(docs: PatientDocument[]): PatientDocument[] {
  return [...docs].sort((a, b) => (a.uploadedDate < b.uploadedDate ? 1 : -1));
}

export function buildDocumentsFromFiles(files: File[], docType: string, patientId: string): PatientDocument[] {
  const uploadedDate = getPatientsToday();
  return files.map((file, i) => ({
    id: `${Date.now()}-${i}-${file.name}`,
    patientId,
    name: file.name,
    docType,
    uploadedDate,
    size: formatFileSize(file.size),
  }));
}

export function getActivityDotClass(type: ActivityType): string {
  return (ACTIVITY_STYLES[type] ?? ACTIVITY_STYLES.other).dot;
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

/** "12 Oct, 08:30" for activity feed timestamps (ISO datetime in). */
export function formatPatientDateTimeGB(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${day}, ${time}`;
}