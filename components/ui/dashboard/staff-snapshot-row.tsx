import { cn } from "lib";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui";
import type { DashboardStaffSegment } from "utils";

interface StaffSnapshotRowProps {
  segment: DashboardStaffSegment;
}

export function StaffSnapshotRow({ segment }: StaffSnapshotRowProps) {
  const percent = Math.round(segment.percent);

  return (
    <li>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-cf-ink-80">
          <span className={cn("size-2 rounded-full", segment.barClass)} aria-hidden />
          {segment.label}
        </span>
        <span className="font-semibold tabular-nums text-cf-ink">
          {segment.count}
          <span className="sr-only"> staff, {percent}% of total</span>
        </span>
      </div>
      <div aria-hidden="true">
        <Progress value={segment.percent} className="gap-0">
          <ProgressTrack>
            <ProgressIndicator className={segment.barClass} />
          </ProgressTrack>
        </Progress>
      </div>
    </li>
  );
}