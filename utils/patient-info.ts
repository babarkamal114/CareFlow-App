import type { BadgeProps } from "@/components/ui";

export interface PatientInfoData {
  id: string;
  name: string;
  preferredName?: string;
  dateOfBirth?: string;
  nhsNumber?: string;
  address: string;
  email: string;
  phone: string;
  carer: string;
  status: 'active' | 'on-hold' | 'new' | 'discharged';
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
  risk: 'low' | 'medium' | 'high';
  consentDataSharing?: boolean;
  consentFamilySharing?: boolean;
  consentPhotoEvidence?: boolean;
  consentNotes?: string;
}

type BadgeInfo = { variant: BadgeProps['variant']; label: string };

const RISK_BADGES: Record<PatientInfoData['risk'], BadgeInfo> = {
  high: { variant: 'pastel-danger', label: 'High' },
  medium: { variant: 'pastel-warning', label: 'Medium' },
  low: { variant: 'pastel-success', label: 'Low' },
};

const STATUS_BADGES: Record<PatientInfoData['status'], BadgeInfo> = {
  active: { variant: 'pastel-success', label: 'Active' },
  'on-hold': { variant: 'pastel-warning', label: 'On Hold' },
  new: { variant: 'pastel-info', label: 'New' },
  discharged: { variant: 'softMuted', label: 'Discharged' },
};

export const getRiskLevelBadge = (risk: PatientInfoData['risk']) => RISK_BADGES[risk];
export const getPatientStatusBadge = (status: PatientInfoData['status']) => STATUS_BADGES[status];

export const CONSENT_ITEMS = [
  { key: 'consentDataSharing', label: 'Share data with care professionals' },
  { key: 'consentFamilySharing', label: 'Share updates with family' },
  { key: 'consentPhotoEvidence', label: 'Photo evidence' },
] as const;

export const RISK_DOMAIN_LABELS = ['Falls', 'Skin Integrity', 'Nutrition', 'Medication', 'Safeguarding'];

export const hasGpDetails = (p: PatientInfoData) => !!(p.gpName || p.gpPhone || p.gpAddress);