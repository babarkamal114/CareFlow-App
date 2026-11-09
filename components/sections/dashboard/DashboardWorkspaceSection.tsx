"use client";

import { useDashboardWorkspace } from "hooks";

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

export function DashboardWorkspaceSection() {
  const { visits, alerts, staff, cqc, revenue, activity, compliance } = useDashboardWorkspace();

  return (
    <div className="space-y-3 sm:space-y-4">
      <DashboardHeader />

      <DashboardStatSection
        summary={visits.summary}
        completionRate={visits.completionRate}
        upcoming={visits.upcoming}
      />
      <div className="grid gap-3 sm:gap-4 xl:grid-cols-3">
        <div className="flex min-w-0 xl:col-span-2 [&>*]:w-full [&>*]:min-w-0">
          <DashboardVisitSection visits={visits.rows} filter={visits.filter} onFilterChange={visits.setFilter} />
        </div>
        <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
          <DashboardAlertFeedSection
            items={alerts.items}
            countLabel={alerts.countLabel}
            highPriorityCount={alerts.highPriorityCount}
          />
          <DashboardStaffSnapshotSection segments={staff.segments} total={staff.total} />
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 xl:grid-cols-3">
        <div className="flex min-w-0 xl:col-span-2 [&>*]:w-full [&>*]:min-w-0">
          <DashboardLiveMapSection markers={visits.mapMarkers} activeCount={visits.summary.inProgress} />
        </div>
        {cqc && (
          <DashboardCqcSection score={cqc.score} trend={cqc.trend} domains={cqc.domains} />
        )}
      </div>
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardWeeklyActivitySection
          points={activity.points}
          completed={activity.totals.completed}
          scheduled={activity.totals.scheduled}
        />
        {revenue && (
        <DashboardRevenueSection
          snapshot={revenue.snapshot}
          change={revenue.change}
          bars={revenue.bars}
        />
      )}
        <div className="min-w-0 lg:col-span-2 xl:col-span-1 [&>*]:h-full">
          <DashboardComplianceDueSection items={compliance.items} urgentCount={compliance.urgentCount} />
        </div>
      </div>
    </div>
  );
}