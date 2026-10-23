"use client";

import { Button, ReportRoleSelect } from "@/components/ui";
import { CalendarClock } from "lucide-react";
import type { ReportRole } from "types";

interface ReportsHeaderSectionProps { role: ReportRole; onRoleChange: (role: ReportRole) => void; onSchedule: () => void }

export function ReportsHeaderSection({ role, onRoleChange, onSchedule }: ReportsHeaderSectionProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-cf-border-light pb-4">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-cf-ink md:text-4xl">Reports &amp; Analytics</h1>
        <p className="mt-1 text-sm text-cf-ink-60">Dashboards, a report library, a custom builder and scheduled reports</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ReportRoleSelect role={role} onChange={onRoleChange} />
        <Button onClick={onSchedule}><CalendarClock />Schedule report</Button>
      </div>
    </div>
  );
}
