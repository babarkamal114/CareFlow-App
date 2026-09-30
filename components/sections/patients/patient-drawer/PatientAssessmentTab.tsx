'use client';

import { Card, CardContent, CardHeader, CardTitle, Badge, BadgeProps } from "@/components/ui";
import { Clock, User, Shield } from 'lucide-react';
import {
  getRiskBadgeVariant,
  formatPatientDateGB,
  getInterventionPreview,
  groupRiskAssessments,
  MOCK_RISK_ASSESSMENTS,
  RISK_ASSESSMENT_TYPE_META,
  RISK_LEVEL_BORDER_CLASS,
  type PatientRiskAssessment,
} from 'utils';

export function PatientRiskAssessmentsTab() {
  const groups = groupRiskAssessments(MOCK_RISK_ASSESSMENTS);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {groups.map((group) => (
          <div key={group.status} className="p-3 bg-cf-surface-muted rounded-lg">
            <p className="text-xs text-cf-ink-60">{group.statLabel}</p>
            <p className="text-lg font-semibold text-cf-ink">{group.items.length}</p>
          </div>
        ))}
      </div>

      {groups
        .filter((group) => group.items.length > 0)
        .map((group) => (
          <div key={group.status}>
            <h4 className="text-sm font-medium text-cf-ink mb-2">{group.title}</h4>
            <div className="space-y-3">
              {group.items.map((assessment) => (
                <RiskAssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>
          </div>
        ))}

      {MOCK_RISK_ASSESSMENTS.length === 0 && (
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-cf-ink-40 mx-auto mb-3" />
          <p className="text-sm text-cf-ink-60">No risk assessments found</p>
          <p className="text-xs text-cf-ink-40 mt-1">Complete a risk assessment to get started</p>
        </div>
      )}
    </div>
  );
}

function RiskAssessmentCard({ assessment }: { assessment: PatientRiskAssessment }) {
  const { label, tool, Icon } = RISK_ASSESSMENT_TYPE_META[assessment.type];
  const { visible, hiddenCount } = getInterventionPreview(assessment.interventions);

  return (
    <Card className={`border-l-4 ${RISK_LEVEL_BORDER_CLASS[assessment.riskLevel]}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <CardTitle className="text-sm font-medium text-cf-ink">{label}</CardTitle>
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
            <span>Next review: {formatPatientDateGB(assessment.nextReview)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-cf-ink-60">
            <User className="h-3 w-3" />
            <span>Assessor: {assessment.assessor}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-cf-ink-60">
            <span>Tool: {tool}</span>
          </div>
          {assessment.interventions.length > 0 && (
            <div className="mt-2 p-2 bg-cf-surface-muted rounded">
              <p className="text-xs font-medium text-cf-ink">Interventions:</p>
              <ul className="text-xs text-cf-ink-60 list-disc list-inside">
                {visible.map((intervention, i) => (
                  <li key={i}>{intervention}</li>
                ))}
                {hiddenCount > 0 && <li className="text-cf-ink-40">+{hiddenCount} more</li>}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}