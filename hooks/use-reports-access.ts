"use client";

import { useMemo, useState } from "react";
import type { ReportRole } from "types";
import { REPORT_TABS, REPORT_ROLE_TABS } from "utils";

export function useReportsAccess() {
  const [role, setRole] = useState<ReportRole>("owner");
  const tabs = useMemo(() => REPORT_TABS.filter((t) => REPORT_ROLE_TABS[role].includes(t.id)), [role]);
  return { role, setRole, tabs, can: (roles: ReportRole[]) => roles.includes(role) };
}
