'use client';

import { FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Incident } from '@/types';
import { StatCard } from '@/components/shared';


interface IncidentStatsSectionProps {
  incidents: Incident[];
}

export function IncidentStatsSection({ incidents }: IncidentStatsSectionProps) {
  const totalIncidents = incidents.length;

  const openIncidents = incidents.filter(
    (i) => i.status === 'reported' || i.status === 'investigating'
  ).length;

  const resolvedIncidents = incidents.filter(
    (i) => i.status === 'resolved' || i.status === 'closed'
  ).length;

  const overdueIncidents = incidents.filter((i) => {
    if (i.status === 'resolved' || i.status === 'closed') return false;
    const reviewDate = i.nextReviewDate || i.createdAt;
    return new Date(reviewDate) < new Date();
  }).length;

  const thisMonth = incidents.filter((i) => {
    const now = new Date();
    const incidentDate = new Date(i.dateTime);
    return incidentDate.getMonth() === now.getMonth() &&
      incidentDate.getFullYear() === now.getFullYear();
  }).length;

  const resolutionRate = totalIncidents > 0
    ? Math.round((resolvedIncidents / totalIncidents) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Incidents"
        value={totalIncidents.toLocaleString()}
        Icon={FileText}
        description={`${thisMonth} this month`}
        showScore={false}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={false}
      >
        <p className="text-xs text-cf-ink-60 mt-1">
          {totalIncidents > 0 ? `${Math.round((thisMonth / totalIncidents) * 100)}% this month` : 'No incidents'}
        </p>
      </StatCard>

      <StatCard
        label="Open Incidents"
        value={openIncidents.toLocaleString()}
        Icon={AlertCircle}
        description="Active cases"
        showScore={false}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={false}
      >
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-medium ${openIncidents > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {openIncidents > 0 ? `${openIncidents} need attention` : 'All clear'}
          </span>
        </div>
      </StatCard>

      <StatCard
        label="Overdue"
        value={overdueIncidents.toLocaleString()}
        Icon={Clock}
        description="Past review date"
        showScore={false}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={false}
      >
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-medium ${overdueIncidents > 0 ? 'text-amber-600' : 'text-green-600'}`}>
            {overdueIncidents > 0 ? `${overdueIncidents} overdue` : 'On track'}
          </span>
        </div>
      </StatCard>

      <StatCard
        label="Resolved"
        value={resolvedIncidents.toLocaleString()}
        Icon={CheckCircle}
        description="Successfully closed"
        showScore={true}
        score={resolutionRate}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={false}
      >
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-cf-ink-60">
            {resolutionRate}% resolution rate
          </span>
        </div>
      </StatCard>
    </div>
  );
}