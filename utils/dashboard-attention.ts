import type { LucideIcon } from "lucide-react";
import { Calendar, Clock, FileText, Shield, User } from "lucide-react";
import { canAccess, formatRelativeTime, isoMinutesAgo, pluralize } from "./dashboard-helpers";

export type AttentionType =
  | "missed-visit"
  | "no-checkin"
  | "safeguarding"
  | "overdue"
  | "expiring";

export type AttentionPriority = "high" | "medium" | "low";

export interface AttentionItemDTO {
  id: string;
  type: AttentionType;
  priority: AttentionPriority;
  subject: string;
  detail: string;
  occurredAt: string;
}

export interface AttentionResponse {
  items: AttentionItemDTO[];
}

export interface AttentionRow {
  id: string;
  Icon: LucideIcon;
  title: string;
  subject: string;
  detail: string;
  time: string;
  priority: AttentionPriority;
}

interface AttentionTypeMeta {
  title: string;
  Icon: LucideIcon;
  requiredModule: string;
}

const ATTENTION_TYPE_META: Record<AttentionType, AttentionTypeMeta> = {
  "missed-visit": { title: "Missed visit", Icon: Clock, requiredModule: "visits" },
  "no-checkin": { title: "No check-in", Icon: User, requiredModule: "visits" },
  safeguarding: { title: "Safeguarding concern", Icon: Shield, requiredModule: "staff" },
  overdue: { title: "Care plans overdue", Icon: FileText, requiredModule: "patients" },
  expiring: { title: "DBS expiring", Icon: Calendar, requiredModule: "staff" },
};

export function buildAttentionRows(
  items: AttentionItemDTO[],
  role: string
): AttentionRow[] {
  return items.flatMap((item) => {
    const meta = ATTENTION_TYPE_META[item.type];
    if (!meta || !canAccess(role, meta.requiredModule)) return [];

    return [
      {
        id: item.id,
        Icon: meta.Icon,
        title: meta.title,
        subject: item.subject,
        detail: item.detail,
        time: formatRelativeTime(item.occurredAt),
        priority: item.priority,
      },
    ];
  });
}

export function getMockAttention(): AttentionResponse {
  return {
    items: [
      { id: "1", type: "missed-visit", priority: "high", subject: "Dorothy Chen", detail: "Scheduled 8:30 AM · No check-in recorded", occurredAt: isoMinutesAgo(12) },
      { id: "2", type: "no-checkin", priority: "high", subject: "James Okafor", detail: "Visit at 8:30 AM · Carer didn't check in", occurredAt: isoMinutesAgo(12) },
      { id: "3", type: "safeguarding", priority: "high", subject: "Edna Morris", detail: "Financial abuse reported · Family member involved", occurredAt: isoMinutesAgo(60) },
      { id: "4", type: "overdue", priority: "medium", subject: "3 patients", detail: "R. Ahmed, B. Williams, H. Smith · Due yesterday", occurredAt: isoMinutesAgo(60 * 9) },
      { id: "5", type: "expiring", priority: "medium", subject: "Lucy Chen", detail: "Expires 16 April · 14 days remaining", occurredAt: isoMinutesAgo(60 * 10) },
    ],
  };
}


export function getAttentionRows(role: string): AttentionRow[] {
  return buildAttentionRows(getMockAttention().items, role);
}

export function countHighPriority(rows: AttentionRow[]): number {
  return rows.filter((r) => r.priority === "high").length;
}

export function getAttentionBadgeLabel(count: number): string {
  return `${count} ${pluralize(count, "Item")}`;
}
