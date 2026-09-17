
import React from "react";
import { StatCard } from "shared";
import { Calendar, Clock, CheckCircle, XCircle, Users, AlertCircle } from "lucide-react";

function ScheduleStatSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      <StatCard
        label="Total Visits"
        value="48"
        Icon={Calendar}
        description="Scheduled for today"
        showScore={false}
        showTrend={true}
        trend="up"
        hasCqcScore={false}
        hasValueBadge={true}
        valueBadgeValue="12%"
      />

  
      <StatCard
        label="Completed"
        value="32"
        Icon={CheckCircle}
        description="Visits completed today"
        showScore={true}
        score={67}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={false}
      />


      <StatCard
        label="In Progress"
        value="8"
        Icon={Clock}
        description="Currently ongoing visits"
        showScore={false}
        showTrend={false}
        hasCqcScore={false}
        hasValueBadge={false}
      />


      <StatCard
        label="Missed / Cancelled"
        value="4"
        Icon={XCircle}
        description="Visits that were missed or cancelled"
        showScore={false}
        showTrend={true}
        trend="down"
        hasCqcScore={false}
        hasValueBadge={true}
        valueBadgeValue="2"
      />
    </div>
  );
}

export default ScheduleStatSection;