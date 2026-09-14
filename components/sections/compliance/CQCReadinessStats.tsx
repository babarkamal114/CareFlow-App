'use client';


import { StatCard } from '@/components/shared';
import {
  Shield,
  FileText,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';

interface CQCReadinessStatsProps {
  score?: number;
  documentationGaps?: {
    unsignedPlans: number;
    missingMAR: number;
    lateNotes: number;
  };
  trainingCompliance?: {
    expired: number;
    expiringSoon: number;
  };
  incidentResponse?: {
    avgResponseTime: number;
    openInvestigations: number;
    target: string;
  };
}

export function CQCReadinessStats({
  score = 87,
  documentationGaps = {
    unsignedPlans: 3,
    missingMAR: 4,
    lateNotes: 5,
  },
  trainingCompliance = {
    expired: 3,
    expiringSoon: 5,
  },
  incidentResponse = {
    avgResponseTime: 4.2,
    openInvestigations: 2,
    target: "<6h",
  },
}: CQCReadinessStatsProps) {
  const totalIssues = documentationGaps.unsignedPlans + documentationGaps.missingMAR + documentationGaps.lateNotes;
  const trainingIssues = trainingCompliance.expired + trainingCompliance.expiringSoon;

  // Same compact shape as Dashboard/Staff/Patients stat cards — no
  // breakdown lists or progress bars inside the card itself, so the row
  // matches the height/size used everywhere else in the app.
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="CQC Readiness"
        value={score.toLocaleString()}
        Icon={Shield}
        description="Overall compliance score"
        showTrend={true}
        trend="up"
        hasCqcScore={true}
        valueBadgeValue={`+${score - 83} pts`}
        badgeVariant="softSuccess"
      />

      <StatCard
        label="Documentation Gaps"
        value={totalIssues.toLocaleString()}
        Icon={FileText}
        description="Issues requiring attention"
        showScore={false}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={true}
        valueBadgeValue={`${totalIssues} issues`}
        badgeVariant="softInfo"
      />

      <StatCard
        label="Training Compliance"
        value={trainingIssues.toLocaleString()}
        Icon={GraduationCap}
        description="Staff training status"
        showScore={false}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={true}
        valueBadgeValue={`${trainingIssues} issues`}
        badgeVariant="softWarning"
      />

      <StatCard
        label="Incident Response"
        value={`${incidentResponse.avgResponseTime}`}
        Icon={AlertCircle}
        description="Average response time"
        showScore={false}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={true}
        valueBadgeValue={`${incidentResponse.openInvestigations} open`}
        badgeVariant="softDanger"
      />
    </div>
  );
}