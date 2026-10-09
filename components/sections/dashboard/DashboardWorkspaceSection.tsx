"use client";

import { useDashboardWorkspace } from "lib";

import { DashboardAlertFeedSection } from "./DashboardAlertFeedSection";
import { DashboardComplianceDueSection } from "./DashboardComplianceDueSection";
import { DashboardCqcSection } from "./DashboardCqcSection";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardLiveMapSection } from "./DashboardLiveMapSection";
import { DashboardRevenueSection } from "./DashboardRevenueSection";
import { DashboardStaffSnapshotSection } from "./DashboardStaffSnapshotSection";
import { DashboardStatSection } from "./DashboardStatSection";
import { DashboardVisitSection } from "./DashboardVisitSection";
import { DashboardWeeklyActivitySection } from "./DashboardWeeklyActivitySection";

/** Dashboard layout. Gets all its data from useDashboardWorkspace and hands each section its slice. */
export function DashboardWorkspaceSection() {
  const { visits, alerts, staff, cqc, revenue, activity, compliance } = useDashboardWorkspace();

  return (
    <div className="space-y-4">
      <DashboardHeader />

      <DashboardStatSection
        summary={visits.summary}
        completionRate={visits.completionRate}
        upcoming={visits.upcoming}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="flex xl:col-span-2">
          <DashboardVisitSection visits={visits.rows} filter={visits.filter} onFilterChange={visits.setFilter} />
        </div>
        <div className="flex flex-col gap-4">
          <DashboardAlertFeedSection
            items={alerts.items}
            countLabel={alerts.countLabel}
            highPriorityCount={alerts.highPriorityCount}
          />
          <DashboardStaffSnapshotSection segments={staff.segments} total={staff.total} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="flex xl:col-span-2">
          <DashboardLiveMapSection markers={visits.mapMarkers} activeCount={visits.summary.inProgress} />
        </div>
        <DashboardCqcSection score={cqc.score} trend={cqc.trend} domains={cqc.domains} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardWeeklyActivitySection
          points={activity.points}
          completed={activity.totals.completed}
          scheduled={activity.totals.scheduled}
        />
        <DashboardRevenueSection snapshot={revenue.snapshot} change={revenue.change} bars={revenue.bars} />
        <DashboardComplianceDueSection items={compliance.items} urgentCount={compliance.urgentCount} />
      </div>
    </div>
  );
}