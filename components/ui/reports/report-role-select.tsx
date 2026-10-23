"use client";

import type { ReportRole } from "types";
import { REPORT_ROLE_OPTIONS } from "utils";
import { ReportSelect } from "./report-select";

export function ReportRoleSelect({ role, onChange }: { role: ReportRole; onChange: (role: ReportRole) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-cf-ink-60">Viewing as</span>
      <ReportSelect value={role} options={REPORT_ROLE_OPTIONS} onChange={onChange} className="w-48" />
    </div>
  );
}
