import { Card, WeeklyActivityChart, WeeklyActivityLegend } from "@/components/ui";
import type { DashboardActivityPoint } from "types";

interface DashboardWeeklyActivitySectionProps {
  points: DashboardActivityPoint[];
  completed: number;
  scheduled: number;
}

/** Scheduled, completed and missed visits over the last 7 days. */
export function DashboardWeeklyActivitySection({ points, completed, scheduled }: DashboardWeeklyActivitySectionProps) {
  return (
    <Card variant="elevated" className="h-full gap-0 py-0">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-cf-border-light px-4 py-3">
        <div>
          <h2 className="font-heading text-base font-semibold text-cf-ink">Weekly Activity</h2>
          <p className="text-xs text-cf-ink-60">
            {completed} of {scheduled} scheduled visits completed in the last 7 days
          </p>
        </div>
        <WeeklyActivityLegend />
      </div>

      <div className="flex min-h-[240px] flex-1 flex-col p-4">
        {points.length === 0 ? (
          <p className="flex flex-1 items-center justify-center text-sm text-cf-ink-60">No visit activity yet.</p>
        ) : (
          <WeeklyActivityChart points={points} />
        )}
      </div>
    </Card>
  );
}