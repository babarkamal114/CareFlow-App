import { formatFileSize } from './file-format-size';

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

/** ISO dates sort correctly as plain strings. */
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