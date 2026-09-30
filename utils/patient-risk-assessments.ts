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

export type PatientRiskAssessmentType =
  | 'falls'
  | 'pressure-ulcer'
  | 'nutrition'
  | 'moving-handling'
  | 'medication'
  | 'environmental'
  | 'fire'
  | 'lone-worker'
  | 'safeguarding';

export interface PatientRiskAssessment {
  id: string;
  type: PatientRiskAssessmentType;
  date: string;
  assessor: string;
  score: number;
  riskLevel: 'high' | 'medium' | 'low';
  findings: { factor: string; score: number }[];
  interventions: string[];
  nextReview: string;
  status: 'active' | 'reviewed';
}

export const MOCK_RISK_ASSESSMENTS: PatientRiskAssessment[] = [
  {
    id: '1',
    type: 'falls',
    date: '2024-03-10',
    assessor: 'Sarah Johnson',
    score: 10,
    riskLevel: 'medium',
    findings: [
      { factor: 'Previous falls', score: 3 },
      { factor: 'Walking aid required', score: 2 },
      { factor: 'Unsteady gait', score: 2 },
      { factor: 'Poor vision', score: 1 },
      { factor: 'Medication side effects', score: 2 },
    ],
    interventions: [
      'Review medications with GP',
      'Ophthalmology referral',
      'Provide walking frame',
      'Install grab rails in bathroom',
    ],
    nextReview: '2024-04-10',
    status: 'active',
  },
  {
    id: '2',
    type: 'nutrition',
    date: '2024-03-12',
    assessor: 'Emma Williams',
    score: 8,
    riskLevel: 'medium',
    findings: [
      { factor: 'BMI < 18.5', score: 2 },
      { factor: 'Weight loss > 5%', score: 2 },
      { factor: 'Poor appetite', score: 2 },
      { factor: 'Difficulty chewing', score: 2 },
    ],
    interventions: [
      'Refer to dietitian',
      'Provide fortified foods',
      'Nutritional supplements',
      'Monitor weight weekly',
    ],
    nextReview: '2024-04-12',
    status: 'active',
  },
  {
    id: '3',
    type: 'pressure-ulcer',
    date: '2024-03-05',
    assessor: 'Dr. James Wilson',
    score: 12,
    riskLevel: 'high',
    findings: [
      { factor: 'Reduced mobility', score: 3 },
      { factor: 'Incontinence', score: 2 },
      { factor: 'Poor nutrition', score: 2 },
      { factor: 'Friction/shear', score: 2 },
      { factor: 'Skin condition', score: 3 },
    ],
    interventions: [
      'Pressure-relieving mattress',
      'Turn patient every 2 hours',
      'Skin inspection daily',
      'Nutritional support',
    ],
    nextReview: '2024-04-05',
    status: 'active',
  },
  {
    id: '4',
    type: 'medication',
    date: '2024-02-28',
    assessor: 'Dr. Sarah Ahmed',
    score: 6,
    riskLevel: 'low',
    findings: [
      { factor: 'Multiple medications', score: 2 },
      { factor: 'Patient compliance', score: 2 },
      { factor: 'Side effects', score: 2 },
    ],
    interventions: [
      'Regular medication reviews',
      'Simplify medication schedule',
      'Patient education',
    ],
    nextReview: '2024-05-28',
    status: 'reviewed',
  },
  {
    id: '5',
    type: 'safeguarding',
    date: '2024-03-01',
    assessor: 'Emma Williams',
    score: 9,
    riskLevel: 'medium',
    findings: [
      { factor: 'Cognitive impairment', score: 3 },
      { factor: 'Social isolation', score: 2 },
      { factor: 'Financial vulnerability', score: 2 },
      { factor: 'Family concerns', score: 2 },
    ],
    interventions: [
      'Regular welfare checks',
      'Financial safeguarding review',
      'Social worker referral',
      'Family communication plan',
    ],
    nextReview: '2024-04-01',
    status: 'active',
  },
];

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
  high: 'border-l-red-500',
  medium: 'border-l-yellow-500',
  low: 'border-l-green-500',
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