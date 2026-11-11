import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui";
import { Card } from "ui/card";
import { StaffSnapshotRow } from "ui/dashboard/staff-snapshot-row";
import type { DashboardStaffSegment } from "utils";

interface DashboardStaffSnapshotSectionProps {
  segments: DashboardStaffSegment[];
  total: number;
}

export function DashboardStaffSnapshotSection({ segments, total }: DashboardStaffSnapshotSectionProps) {
  return (
    <Card variant="elevated" className="gap-0 py-0">
      <div className="flex items-center justify-between gap-3 border-b border-cf-border-light px-4 py-3">
        <h2 id="staff-snapshot-heading" className="font-heading text-base font-semibold text-cf-ink">
          Staff Snapshot
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-cf-ink-60">{total} staff</span>
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/staff" />}>
            <Eye />
            View staff
          </Button>
        </div>
      </div>
      <ul aria-labelledby="staff-snapshot-heading" className="space-y-4 p-4">
        {segments.map((segment) => (
          <StaffSnapshotRow key={segment.key} segment={segment} />
        ))}
      </ul>
    </Card>
  );
}