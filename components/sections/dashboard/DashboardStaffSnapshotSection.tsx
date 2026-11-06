import { Card, StaffSnapshotRow } from "@/components/ui";
import type { DashboardStaffSegment } from "utils";

interface DashboardStaffSnapshotSectionProps {
  segments: DashboardStaffSegment[];
  total: number;
}

/** Carers on shift, available and on leave. */
export function DashboardStaffSnapshotSection({ segments, total }: DashboardStaffSnapshotSectionProps) {
  return (
    <Card variant="elevated" className="gap-0 py-0">
      <div className="flex items-center justify-between border-b border-cf-border-light px-4 py-3">
        <h2 className="font-heading text-base font-semibold text-cf-ink">Staff Snapshot</h2>
        <span className="text-sm text-cf-ink-60">{total} staff</span>
      </div>
      <ul className="space-y-4 p-4">
        {segments.map((segment) => (
          <StaffSnapshotRow key={segment.key} segment={segment} />
        ))}
      </ul>
    </Card>
  );
}