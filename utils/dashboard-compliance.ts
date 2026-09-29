import {
  canAccess,
  daysFromToday,
  formatLongDate,
  isoDateInDays,
  pluralize,
} from "./dashboard-helpers";

export const COMPLIANCE_WINDOW_DAYS = 14;
export interface ComplianceItemDTO {
  id: string;
  title: string;
  dueDate: string;
  count?: number | null;
}

export interface ComplianceDueResponse {
  items: ComplianceItemDTO[];
}

export type CompliancePriority = "high" | "medium" | "low";
export interface ComplianceRow {
  id: string;
  title: string;
  dueDate: string;
  days: number;
  daysLabel: string;
  priority: CompliancePriority;
  priorityLabel: string;
  count?: number;
}

const URGENT_WITHIN_DAYS = 7;
const DUE_SOON_WITHIN_DAYS = 14;

function getPriority(days: number): CompliancePriority {
  if (days <= URGENT_WITHIN_DAYS) return "high";
  if (days <= DUE_SOON_WITHIN_DAYS) return "medium";
  return "low";
}

function getPriorityLabel(days: number, priority: CompliancePriority): string {
  if (days < 0) return "Overdue";
  return { high: "Urgent", medium: "Due Soon", low: "Upcoming" }[priority];
}

function getDaysLabel(days: number): string {
  if (days < 0) {
    const overdue = Math.abs(days);
    return `${overdue} ${overdue === 1 ? "day" : "days"} overdue`;
  }
  if (days === 0) return "Today";
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export function buildComplianceRows(items: ComplianceItemDTO[]): ComplianceRow[] {
  return items
    .map((item) => {
      const days = daysFromToday(item.dueDate);
      const priority = getPriority(days);
      return {
        id: item.id,
        title: item.title,
        dueDate: formatLongDate(item.dueDate),
        days,
        daysLabel: getDaysLabel(days),
        priority,
        priorityLabel: getPriorityLabel(days, priority),
        count: item.count && item.count > 0 ? item.count : undefined,
      };
    })
    .sort((a, b) => a.days - b.days);
}

export const canSeeCompliance = (role: string) => canAccess(role, "reports");


export function getMockComplianceDue(): ComplianceDueResponse {
  return {
    items: [
      { id: "1", title: "DBS Checks", dueDate: isoDateInDays(3), count: 5 },
      { id: "2", title: "Fire Safety Training", dueDate: isoDateInDays(5), count: 8 },
      { id: "3", title: "Manual Handling Certification", dueDate: isoDateInDays(11), count: 3 },
      { id: "4", title: "CQC Documentation Review", dueDate: isoDateInDays(14), count: 1 },
    ],
  };
}

export function getComplianceRows(): ComplianceRow[] {
  return buildComplianceRows(getMockComplianceDue().items);
}

export function countUrgentCompliance(rows: ComplianceRow[]): number {
  return rows.filter((r) => r.priority === "high").length;
}

/** "item" / "items" for the urgent banner. */
export const getUrgentItemNoun = (count: number) => pluralize(count, "item");
