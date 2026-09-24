import type { LucideIcon } from "lucide-react";
import { Calendar, Clock, FileText, Shield, User } from "lucide-react";
import { canAccess, formatRelativeTime } from "./dashboard-helpers";


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
  // Sensitive: management roles only (carers and patients have no "staff" module).
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