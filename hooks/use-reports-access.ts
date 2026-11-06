'use client'

import { useState } from "react";
import type { ReportRole, UseReportsAccessReturn } from "types";
import { REPORT_TABS, REPORT_ROLE_TABS } from "@/config/reports/reports-config";

export function useReportsAccess(): UseReportsAccessReturn {
    const [role, setRole] = useState<ReportRole>("owner")
    const allowedTabIds = REPORT_ROLE_TABS[role]
    const tabs = REPORT_TABS.filter((tab) => allowedTabIds.includes(tab.id))

    const can = (roles: ReportRole[]) => {
        return roles.includes(role)
    }

    return {
        role,
        setRole,
        tabs,
        can
    }
}
