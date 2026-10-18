'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge, BadgeProps } from "@/components/ui";
import { Clock, User, Shield, Heart, Bone, Apple, Pill, Home, Flame, Gavel } from 'lucide-react';
import { getRiskBadgeVariant } from 'utils';

interface RiskAssessment {
  id: string;
  type: 'falls' | 'pressure-ulcer' | 'nutrition' | 'moving-handling' | 'medication' | 'environmental' | 'fire' | 'lone-worker' | 'safeguarding';
  date: string;
  assessor: string;
  score: number;
  riskLevel: 'high' | 'medium' | 'low';
  findings: { factor: string; score: number }[];
  interventions: string[];
  nextReview: string;
  status: 'active' | 'reviewed';
}

const mockRiskAssessments: RiskAssessment[] = [
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

const assessmentIcons: Record<RiskAssessment['type'], React.ReactNode> = {
  'falls': <Heart className="h-4 w-4" />,
  'pressure-ulcer': <Bone className="h-4 w-4" />,
  'nutrition': <Apple className="h-4 w-4" />,
  'moving-handling': <User className="h-4 w-4" />,
  'medication': <Pill className="h-4 w-4" />,
  'environmental': <Home className="h-4 w-4" />,
  'fire': <Flame className="h-4 w-4" />,
  'lone-worker': <Shield className="h-4 w-4" />,
  'safeguarding': <Gavel className="h-4 w-4" />,
};

const assessmentLabels: Record<RiskAssessment['type'], string> = {
  'falls': 'Falls Risk',
  'pressure-ulcer': 'Pressure Ulcer Risk',
  'nutrition': 'Nutrition Risk',
  'moving-handling': 'Moving & Handling',
  'medication': 'Medication Risk',
  'environmental': 'Environmental Risk',
  'fire': 'Fire Risk',
  'lone-worker': 'Lone Worker Risk',
  'safeguarding': 'Safeguarding',
};

const assessmentTools: Record<RiskAssessment['type'], string> = {
  'falls': 'FRASE / Morse Scale',
  'pressure-ulcer': 'Waterlow Score',
  'nutrition': 'MUST Tool',
  'moving-handling': 'Manual Handling Assessment',
  'medication': 'Clinical Review',
  'environmental': 'Home Safety Check',
  'fire': 'Fire Safety Assessment',
  'lone-worker': 'Lone Worker Policy',
  'safeguarding': 'Safeguarding Protocol',
};

export function PatientRiskAssessmentsTab() {
  const activeAssessments = mockRiskAssessments.filter(a => a.status === 'active');
  const reviewedAssessments = mockRiskAssessments.filter(a => a.status === 'reviewed');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-cf-surface-muted rounded-lg">
          <p className="text-xs text-cf-ink-60">Active</p>
          <p className="text-lg font-semibold text-cf-ink">{activeAssessments.length}</p>
        </div>
        <div className="p-3 bg-cf-surface-muted rounded-lg">
          <p className="text-xs text-cf-ink-60">Reviewed</p>
          <p className="text-lg font-semibold text-cf-ink">{reviewedAssessments.length}</p>
        </div>
      </div>

      {activeAssessments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-cf-ink mb-2">Active Assessments</h4>
          <div className="space-y-3">
            {activeAssessments.map((assessment) => (
              <RiskAssessmentCard key={assessment.id} assessment={assessment} />
            ))}
          </div>
        </div>
      )}

      {reviewedAssessments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-cf-ink mb-2">Reviewed Assessments</h4>
          <div className="space-y-3">
            {reviewedAssessments.map((assessment) => (
              <RiskAssessmentCard key={assessment.id} assessment={assessment} />
            ))}
          </div>
        </div>
      )}

      {mockRiskAssessments.length === 0 && (
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
          <p className="text-sm text-cf-ink-60">No risk assessments found</p>
          <p className="text-xs text-cf-ink-40 mt-1">Complete a risk assessment to get started</p>
        </div>
      )}
    </div>
  );
}

function RiskAssessmentCard({ assessment }: { assessment: RiskAssessment }) {
  const isHigh = assessment.riskLevel === 'high';
  const isMedium = assessment.riskLevel === 'medium';

  return (
    <Card className={`border-l-4 ${isHigh ? 'border-l-red-500' : isMedium ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {assessmentIcons[assessment.type]}
          <CardTitle className="text-sm font-medium text-cf-ink">
            {assessmentLabels[assessment.type]}
          </CardTitle>
          <Badge variant={getRiskBadgeVariant(assessment.riskLevel) as BadgeProps['variant']} >
            {assessment.riskLevel}
          </Badge>
        </div>
        <span className="text-xs text-cf-ink-40">
          Score: {assessment.score}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-cf-ink-60">
            <Clock className="h-3 w-3" />
            <span>Next review: {new Date(assessment.nextReview).toLocaleDateString('en-GB')}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-cf-ink-60">
            <User className="h-3 w-3" />
            <span>Assessor: {assessment.assessor}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-cf-ink-60">
            <span>Tool: {assessmentTools[assessment.type]}</span>
          </div>
          {assessment.interventions.length > 0 && (
            <div className="mt-2 p-2 bg-cf-surface-muted rounded">
              <p className="text-xs font-medium text-cf-ink">Interventions:</p>
              <ul className="text-xs text-cf-ink-60 list-disc list-inside">
                {assessment.interventions.slice(0, 2).map((intervention, i) => (
                  <li key={i}>{intervention}</li>
                ))}
                {assessment.interventions.length > 2 && (
                  <li className="text-cf-ink-40">+{assessment.interventions.length - 2} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}