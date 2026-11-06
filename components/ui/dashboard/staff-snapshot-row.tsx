import { cn } from "lib";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui";
import type { DashboardStaffSegment } from "utils";

interface StaffSnapshotRowProps {
  segment: DashboardStaffSegment;
}

/** Label, headcount and a bar showing that group's share of all staff. */
export function StaffSnapshotRow({ segment }: StaffSnapshotRowProps) {
  return (
    <li>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-cf-ink-80">
          <span className={cn("size-2 rounded-full", segment.barClass)} aria-hidden />
          {segment.label}
        </span>
        <span className="font-semibold tabular-nums text-cf-ink">{segment.count}</span>
      </div>
      <Progress
        value={segment.percent}
        aria-label={`${segment.label}: ${Math.round(segment.percent)}% of staff`}
        className="gap-0"
      >
        <ProgressTrack>
          <ProgressIndicator className={segment.barClass} />
        </ProgressTrack>
      </Progress>
    </li>
  );
}