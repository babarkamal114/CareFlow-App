import type { BadgeProps } from '@/components/ui';

type BadgeVariant = BadgeProps['variant'];
type BadgeInfo = { variant: BadgeVariant; label: string };

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

export interface PatientCondition {
  name: string;
  diagnosedDate: string;
  status: 'active' | 'managed' | 'resolved' | 'discharged';
}

export interface PatientAllergy {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

export interface PatientHospitalisation {
  date: string;
  reason: string;
  duration: string;
  outcome: string;
}

const CONDITION_ORDER = ['active', 'managed', 'resolved', 'discharged'];
const ALLERGY_ORDER = ['severe', 'moderate', 'mild'];

const rank = (order: string[], value: string) => {
  const i = order.indexOf(value);
  return i === -1 ? order.length : i;
};

export const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export function sortConditions(conditions: PatientCondition[]): PatientCondition[] {
  return [...conditions].sort((a, b) => rank(CONDITION_ORDER, a.status) - rank(CONDITION_ORDER, b.status));
}

export function sortAllergies(allergies: PatientAllergy[]): PatientAllergy[] {
  return [...allergies].sort((a, b) => rank(ALLERGY_ORDER, a.severity) - rank(ALLERGY_ORDER, b.severity));
}

export function sortHospitalisations(list: PatientHospitalisation[]): PatientHospitalisation[] {
  return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || 0);
}

export function getConditionBadgeVariant(status: PatientCondition['status']): BadgeVariant {
  if (status === 'active') return 'pastel-danger';
  if (status === 'managed') return 'pastel-warning';
  return 'pastel-success';
}

export function getAllergyBadgeVariant(severity: PatientAllergy['severity']): BadgeVariant {
  if (severity === 'severe') return 'pastel-danger';
  if (severity === 'moderate') return 'pastel-warning';
  return 'pastel-info';
}

export interface PatientCommunicationInfo {
  preferredLanguage?: string;
  hearingImpairment?: string;
  visionImpairment?: string;
  mentalCapacity?: string;
  hearingAids?: boolean;
  glasses?: boolean;
  pictureBoard?: boolean;
  interpreter?: boolean;
  communicationNotes?: string;
  poaName?: string;
  poaRelationship?: string;
  poaPhone?: string;
}

const CAPACITY_BADGES: Record<string, BadgeInfo> = {
  full: { variant: 'pastel-success', label: 'Full Capacity' },
  partial: { variant: 'pastel-warning', label: 'Partial Capacity' },
};

const LACKS_CAPACITY: BadgeInfo = { variant: 'pastel-danger', label: 'Lacks Capacity' };

export function getCapacityBadge(capacity: string): BadgeInfo {
  return CAPACITY_BADGES[capacity] ?? LACKS_CAPACITY;
}

export function hasImpairment(value?: string): boolean {
  return !!value && value !== 'none';
}

export const AIDS = [
  { key: 'hearingAids', label: 'Hearing Aids' },
  { key: 'glasses', label: 'Glasses' },
  { key: 'pictureBoard', label: 'Picture Board' },
  { key: 'interpreter', label: 'Interpreter Needed' },
] as const;

export type CommunicationAidKey = (typeof AIDS)[number]['key'];

export function getCommunicationAids(info: PatientCommunicationInfo): string[] {
  return AIDS.filter(({ key }) => info[key]).map(({ label }) => label);
}

export function hasCommunicationInfo(info: PatientCommunicationInfo): boolean {
  return (
    !!info.preferredLanguage ||
    hasImpairment(info.hearingImpairment) ||
    hasImpairment(info.visionImpairment) ||
    !!info.mentalCapacity ||
    getCommunicationAids(info).length > 0 ||
    !!info.communicationNotes ||
    !!(info.poaName || info.poaRelationship || info.poaPhone)
  );
}

export interface PatientDetailRow {
  label: string;
  value: string;
  badgeVariant?: BadgeVariant;
}

export const hasPoaInfo = (info: PatientCommunicationInfo) =>
  !!(info.poaName || info.poaRelationship || info.poaPhone);

export function hasCommunicationCardInfo(info: PatientCommunicationInfo): boolean {
  return (
    !!info.preferredLanguage ||
    hasImpairment(info.hearingImpairment) ||
    hasImpairment(info.visionImpairment) ||
    getCommunicationAids(info).length > 0 ||
    !!info.communicationNotes
  );
}

export function getCommunicationDetailRows(info: PatientCommunicationInfo): PatientDetailRow[] {
  const rows: PatientDetailRow[] = [];
  if (info.preferredLanguage) rows.push({ label: 'Preferred Language', value: info.preferredLanguage });
  if (info.hearingImpairment && hasImpairment(info.hearingImpairment)) {
    rows.push({ label: 'Hearing', value: info.hearingImpairment, badgeVariant: 'pastel-warning' });
  }
  if (info.visionImpairment && hasImpairment(info.visionImpairment)) {
    rows.push({ label: 'Vision', value: info.visionImpairment, badgeVariant: 'pastel-warning' });
  }
  return rows;
}

export function getPoaDetailRows(info: PatientCommunicationInfo): PatientDetailRow[] {
  const rows: PatientDetailRow[] = [];
  if (info.poaName) rows.push({ label: 'Name', value: info.poaName });
  if (info.poaRelationship) rows.push({ label: 'Relationship', value: info.poaRelationship });
  if (info.poaPhone) rows.push({ label: 'Phone', value: info.poaPhone });
  return rows;
}

export interface PatientPreferencesInfo {
  wakeTime?: string;
  bedTime?: string;
  breakfastTime?: string;
  lunchTime?: string;
  dinnerTime?: string;
  bathPreference?: string;
  teaPreference?: string;
  dietaryPreferences?: string;
  culturalReligious?: string;
  likes?: string;
  dislikes?: string;
  hobbies?: string;
  dailyRoutine?: string;
}

export interface PreferenceRow {
  label: string;
  value: string;
}

/** Keeps only the rows that actually have a value. */
function pickFilled(entries: [string, string | undefined][]): PreferenceRow[] {
  return entries
    .filter((entry): entry is [string, string] => !!entry[1])
    .map(([label, value]) => ({ label, value }));
}

export function getRoutineRows(p: PatientPreferencesInfo): PreferenceRow[] {
  return pickFilled([
    ['Wakes', p.wakeTime],
    ['Bedtime', p.bedTime],
    ['Breakfast', p.breakfastTime],
    ['Lunch', p.lunchTime],
    ['Dinner', p.dinnerTime],
    ['Bath Preference', p.bathPreference],
  ]);
}

export function getPreferenceRows(p: PatientPreferencesInfo): PreferenceRow[] {
  return pickFilled([
    ['Tea Preference', p.teaPreference],
    ['Dietary', p.dietaryPreferences],
    ['Cultural/Religious', p.culturalReligious],
  ]);
}

export const hasLikesSection = (p: PatientPreferencesInfo) =>
  !!(p.likes || p.dislikes || p.hobbies || p.dailyRoutine);

export const hasPreferenceInfo = (p: PatientPreferencesInfo) =>
  getRoutineRows(p).length > 0 || getPreferenceRows(p).length > 0 || hasLikesSection(p);