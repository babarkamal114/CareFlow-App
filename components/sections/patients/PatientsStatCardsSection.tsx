import React from "react";
import { StatCard } from "shared";
import { Users, UserPlus, FileText, Calendar } from "lucide-react";

function PatientStatSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Patients"
        value="142"
        Icon={Users}
        description="Active patients under care"
        showScore={false}
        showTrend={true}
        trend="up"
        hasCqcScore={false}
        hasValueBadge={true}
        valueBadgeValue="12%"
      />

      <StatCard
        label="New Patients"
        value="18"
        Icon={UserPlus}
        description="Added this month"
        showScore={false}
        showTrend={true}
        trend="up"
        hasCqcScore={false}
        hasValueBadge={true}
        valueBadgeValue="8"
      />

      <StatCard
        label="Active Care Plans"
        value="98"
        Icon={FileText}
        description="Care plans currently active"
        showScore={true}
        score={85}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={false}
      />

      <StatCard
        label="Visits Today"
        value="48"
        Icon={Calendar}
        description="Scheduled patient visits"
        showScore={false}
        showTrend={true}
        trend="up"
        hasCqcScore={false}
        hasValueBadge={true}
        valueBadgeValue="5%"
      />
    </div>
  );
}

export default PatientStatSection;