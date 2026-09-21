'use client';

import { motion } from 'framer-motion';
import { StatCard } from 'shared';
import { FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Incident } from '@/types';

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
    return (
      incidentDate.getMonth() === now.getMonth() &&
      incidentDate.getFullYear() === now.getFullYear()
    );
  }).length;

  const thisMonthPct = totalIncidents > 0 ? Math.round((thisMonth / totalIncidents) * 100) : 0;

  const resolutionRate =
    totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 0;

  const cards = [
    {
      label: 'Total Incidents',
      value: totalIncidents.toLocaleString(),
      Icon: FileText,
      description: `${thisMonth} this month`,
      showScore: false,
      showTrend: true,
      trend: 'up' as const,
      hasCqcScore: false,
      hasValueBadge: true,
      valueBadgeValue: `${thisMonthPct}%`,
      badgeVariant: 'softSuccess' as const,
    },
    {
      label: 'Open Incidents',
      value: openIncidents.toLocaleString(),
      Icon: AlertCircle,
      description: 'Active cases',
      showScore: false,
      showTrend: false,
      hasCqcScore: false,
      hasValueBadge: true,
      valueBadgeValue: openIncidents > 0 ? `${openIncidents} open` : 'Clear',
      badgeVariant: openIncidents > 0 ? ('softDanger' as const) : ('softSuccess' as const),
    },
    {
      label: 'Overdue',
      value: overdueIncidents.toLocaleString(),
      Icon: Clock,
      description: 'Past review date',
      showScore: false,
      showTrend: false,
      hasCqcScore: false,
      hasValueBadge: true,
      valueBadgeValue: overdueIncidents > 0 ? `${overdueIncidents} overdue` : 'On track',
      badgeVariant: overdueIncidents > 0 ? ('softWarning' as const) : ('softSuccess' as const),
    },
    {
      label: 'Resolved',
      value: resolvedIncidents.toLocaleString(),
      Icon: CheckCircle,
      description: 'Successfully closed',
      showScore: true,
      score: resolutionRate,
      showTrend: false,
      hasCqcScore: false,
      hasValueBadge: false,
      badgeVariant: 'softSuccess' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
}