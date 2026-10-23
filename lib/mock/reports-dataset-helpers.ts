import type { ReportColumn, ReportColumnKind, ReportRole } from "types";

export const col = (key: string, label: string, kind: ReportColumnKind = "text", extra: Partial<ReportColumn> = {}): ReportColumn => ({ key, label, kind, ...extra });

export const ROLES_MANAGERS: ReportRole[] = ["owner", "registered-manager"];
export const ROLES_OPERATIONS: ReportRole[] = ["owner", "registered-manager", "coordinator"];
export const ROLES_FINANCE: ReportRole[] = ["owner", "finance-admin"];

export const STAFF_NAMES = [
  "Sarah Williams", "James O'Connor", "Priya Patel", "Dorothy Chen", "Robert Ahmed", "Barbara Williams",
  "Fatima Khan", "Henry Smith", "Lucy Clarke", "Edna Morris", "Michael Turner", "Aisha Begum",
];
