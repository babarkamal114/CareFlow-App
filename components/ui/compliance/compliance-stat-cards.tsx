import { AlertCircle, FileText, GraduationCap, Shield } from "lucide-react";
import type { DocumentationGaps, IncidentResponseStats, StatCardProps, TrainingIssues } from "types";

interface ComplianceStatInput {
  overall: number;
  change: number;
  documentationGaps: DocumentationGaps;
  trainingIssues: TrainingIssues;
  incidentResponse: IncidentResponseStats;
}

export function getComplianceStatCards(d: ComplianceStatInput): StatCardProps[] {
  const docIssues = d.documentationGaps.unsignedPlans + d.documentationGaps.missingMAR + d.documentationGaps.lateNotes;
  const trainingIssues = d.trainingIssues.expired + d.trainingIssues.expiringSoon;

  return [
    {
      label: "CQC Readiness",
      value: String(d.overall),
      Icon: Shield,
      description: "Overall compliance score",
      showTrend: true,
      trend: d.change >= 0 ? "up" : "down",
      hasCqcScore: true,
      valueBadgeValue: `${d.change >= 0 ? "+" : ""}${d.change} pts`,
      badgeVariant: "softSuccess",
    },
    {
      label: "Documentation Gaps",
      value: String(docIssues),
      Icon: FileText,
      description: "Issues requiring attention",
      hasValueBadge: true,
      valueBadgeValue: `${docIssues} issues`,
      badgeVariant: "softInfo",
    },
    {
      label: "Training Compliance",
      value: String(trainingIssues),
      Icon: GraduationCap,
      description: "Staff training status",
      hasValueBadge: true,
      valueBadgeValue: `${trainingIssues} issues`,
      badgeVariant: "softWarning",
    },
    {
      label: "Incident Response",
      value: String(d.incidentResponse.avgResponseHours),
      Icon: AlertCircle,
      description: "Average response time (hours)",
      hasValueBadge: true,
      valueBadgeValue: `${d.incidentResponse.openInvestigations} open`,
      badgeVariant: "softDanger",
    },
  ];
}
