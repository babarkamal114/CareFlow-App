import {
  PATIENT_RISK_OPTIONS,
  PATIENT_STATUS_OPTIONS,
  type PatientFieldDef,
  type PatientFieldSection,
} from './patient-form-fields';

export interface PatientEditData {
  id: string;
  name: string;
  preferredName?: string;
  dateOfBirth?: string;
  nhsNumber?: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'on-hold' | 'new' | 'discharged';
  carer: string;
  nextVisit: string;
  gpName?: string;
  gpPhone?: string;
  gpAddress?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
}

export type EditPatientInputKey =
  | 'name'
  | 'preferredName'
  | 'dateOfBirth'
  | 'nhsNumber'
  | 'email'
  | 'phone'
  | 'address'
  | 'gpName'
  | 'gpPhone'
  | 'gpAddress'
  | 'nextOfKinName'
  | 'nextOfKinPhone'
  | 'nextOfKinRelationship'
  | 'emergencyContact'
  | 'emergencyPhone'
  | 'emergencyRelationship'
  | 'carer'
  | 'nextVisit';

export type EditPatientSelectKey = 'risk' | 'status';

export type EditPatientFieldDef = PatientFieldDef<EditPatientInputKey | EditPatientSelectKey>;

/** Form layout, top to bottom. A section with no gridClass renders its field on its own row. */
export const EDIT_PATIENT_SECTIONS: PatientFieldSection<EditPatientInputKey | EditPatientSelectKey>[] = [
  {
    id: 'personal',
    gridClass: 'grid grid-cols-2 gap-4',
    fields: [
      { kind: 'input', name: 'name', label: 'Patient Name *', placeholder: 'John Doe', type: 'text' },
      { kind: 'input', name: 'preferredName', label: 'Preferred Name', placeholder: 'Dot', type: 'text' },
      { kind: 'input', name: 'dateOfBirth', label: 'Date of Birth *', placeholder: '', type: 'date' },
      { kind: 'input', name: 'nhsNumber', label: 'NHS Number', placeholder: '123 456 7890', type: 'text' },
      { kind: 'input', name: 'email', label: 'Email *', placeholder: 'john@example.com', type: 'email' },
      { kind: 'input', name: 'phone', label: 'Phone Number *', placeholder: '0161 123 4567', type: 'text' },
    ],
  },
  {
    id: 'address',
    fields: [
      { kind: 'input', name: 'address', label: 'Address *', placeholder: '123 Main Street, Manchester', type: 'text' },
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
      { kind: 'input', name: 'gpAddress', label: 'GP Address', placeholder: 'Oak Lane Surgery, Manchester', type: 'text' },
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
    id: 'care',
    gridClass: 'grid grid-cols-2 gap-4',
    fields: [
      { kind: 'input', name: 'carer', label: 'Primary Carer', placeholder: 'Sarah Johnson', type: 'text' },
      { kind: 'input', name: 'nextVisit', label: 'Next Visit', placeholder: 'Today, 2:00 PM', type: 'text' },
      { kind: 'select', name: 'risk', label: 'Risk Level', placeholder: 'Select risk level', options: PATIENT_RISK_OPTIONS },
      { kind: 'select', name: 'status', label: 'Status', placeholder: 'Select status', options: PATIENT_STATUS_OPTIONS },
    ],
  },
];

/** Starting form values for a patient (missing optional fields become empty strings). */
export function buildEditPatientForm(patient: PatientEditData): Partial<PatientEditData> {
  return {
    name: patient.name,
    preferredName: patient.preferredName || '',
    dateOfBirth: patient.dateOfBirth || '',
    nhsNumber: patient.nhsNumber || '',
    age: patient.age,
    email: patient.email,
    phone: patient.phone,
    address: patient.address,
    risk: patient.risk,
    status: patient.status,
    carer: patient.carer,
    nextVisit: patient.nextVisit,
    gpName: patient.gpName || '',
    gpPhone: patient.gpPhone || '',
    gpAddress: patient.gpAddress || '',
    nextOfKinName: patient.nextOfKinName || '',
    nextOfKinPhone: patient.nextOfKinPhone || '',
    nextOfKinRelationship: patient.nextOfKinRelationship || '',
    emergencyContact: patient.emergencyContact || '',
    emergencyPhone: patient.emergencyPhone || '',
    emergencyRelationship: patient.emergencyRelationship || '',
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEditPatientForm(formData: Partial<PatientEditData>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!formData.name?.trim()) errors.name = 'Name is required';
  if (!formData.age) errors.age = 'Age is required';
  if (formData.age && (formData.age < 0 || formData.age > 120)) {
    errors.age = 'Age must be between 0 and 120';
  }
  if (!formData.email?.trim()) errors.email = 'Email is required';
  if (formData.email && !EMAIL_PATTERN.test(formData.email)) {
    errors.email = 'Invalid email format';
  }
  if (!formData.phone?.trim()) errors.phone = 'Phone number is required';
  if (!formData.address?.trim()) errors.address = 'Address is required';
  if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  return errors;
}