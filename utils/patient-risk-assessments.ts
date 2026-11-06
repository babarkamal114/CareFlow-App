import {
  Heart,
  Bone,
  Apple,
  User,
  Pill,
  Home,
  Flame,
  Shield,
  Gavel,
  type LucideIcon,
} from 'lucide-react';
import type { PatientRiskAssessment, PatientRiskAssessmentType } from 'types';

export const RISK_ASSESSMENT_TYPE_META: Record<
  PatientRiskAssessmentType,
  { label: string; tool: string; Icon: LucideIcon }
> = {
  falls: { label: 'Falls Risk', tool: 'FRASE / Morse Scale', Icon: Heart },
  'pressure-ulcer': { label: 'Pressure Ulcer Risk', tool: 'Waterlow Score', Icon: Bone },
  nutrition: { label: 'Nutrition Risk', tool: 'MUST Tool', Icon: Apple },
  'moving-handling': { label: 'Moving & Handling', tool: 'Manual Handling Assessment', Icon: User },
  medication: { label: 'Medication Risk', tool: 'Clinical Review', Icon: Pill },
  environmental: { label: 'Environmental Risk', tool: 'Home Safety Check', Icon: Home },
  fire: { label: 'Fire Risk', tool: 'Fire Safety Assessment', Icon: Flame },
  'lone-worker': { label: 'Lone Worker Risk', tool: 'Lone Worker Policy', Icon: Shield },
  safeguarding: { label: 'Safeguarding', tool: 'Safeguarding Protocol', Icon: Gavel },
};

export const RISK_LEVEL_BORDER_CLASS: Record<PatientRiskAssessment['riskLevel'], string> = {
  high: 'border-l-destructive',
  medium: 'border-l-cf-amber-500',
  low: 'border-l-brand-500',
};

const RISK_ASSESSMENT_GROUPS = [
  { status: 'active', statLabel: 'Active', title: 'Active Assessments' },
  { status: 'reviewed', statLabel: 'Reviewed', title: 'Reviewed Assessments' },
] as const;

export function groupRiskAssessments(assessments: PatientRiskAssessment[]) {
  return RISK_ASSESSMENT_GROUPS.map((group) => ({
    ...group,
    items: assessments.filter((a) => a.status === group.status),
  }));
}

const INTERVENTIONS_PREVIEW_COUNT = 2;
export function getInterventionPreview(interventions: string[]) {
  return {
    visible: interventions.slice(0, INTERVENTIONS_PREVIEW_COUNT),
    hiddenCount: Math.max(interventions.length - INTERVENTIONS_PREVIEW_COUNT, 0),
  };
}