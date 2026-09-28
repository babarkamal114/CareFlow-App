import type { BadgeProps } from "@/components/ui";

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

type BadgeVariant = BadgeProps['variant'];

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