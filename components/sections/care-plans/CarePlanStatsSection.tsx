'use client';

import { StatCard } from "shared";
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface CarePlanStats {
  total: number;
  approved: number;
  inReview: number;
  draft: number;
}

const mockStats: CarePlanStats = {
  total: 24,
  approved: 14,
  inReview: 5,
  draft: 5,
};

export function CarePlanStatSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Care Plans"
        value={mockStats.total.toLocaleString()}
        Icon={FileText}
        description="All care plans"
        showScore={false}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={false}
      />

      <StatCard
        label="Approved"
        value={mockStats.approved.toLocaleString()}
        Icon={CheckCircle}
        description="Live and active"
        showScore={false}
        showTrend={true}
        trend="up"
        hasCqcScore={false}
        hasValueBadge={true}
        valueBadgeValue="12%"
      />

      <StatCard
        label="In Review"
        value={mockStats.inReview.toLocaleString()}
        Icon={Clock}
        description="Awaiting approval"
        showScore={false}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={false}
      />

      <StatCard
        label="Draft"
        value={mockStats.draft.toLocaleString()}
        Icon={AlertCircle}
        description="Not yet submitted"
        showScore={false}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={false}
      />
    </div>
  );
}