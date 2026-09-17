type AttentionType =
  | "missed-visit"
  | "no-checkin"
  | "safeguarding"
  | "overdue"
  | "expiring";

type Priority = "high" | "medium" | "low";

export const attentionTypeConfig: Record<
  AttentionType,
  {
    label: string;
    icon: string;
    priority: Priority;
    badgeVariant: string;
  }
> = {
  "missed-visit": {
    label: "Missed Visit",
    icon: "Clock",
    priority: "high",
    badgeVariant: "pastel-danger",
  },
  "no-checkin": {
    label: "No Check-in",
    icon: "User",
    priority: "high",
    badgeVariant: "pastel-warning",
  },
  safeguarding: {
    label: "Safeguarding",
    icon: "Shield",
    priority: "high",
    badgeVariant: "pastel-danger",
  },
  overdue: {
    label: "Overdue",
    icon: "FileText",
    priority: "medium",
    badgeVariant: "pastel-warning",
  },
  expiring: {
    label: "Expiring",
    icon: "Calendar",
    priority: "medium",
    badgeVariant: "pastel-info",
  },
};

export function getBadgeVariant(type: AttentionType): string {
  return attentionTypeConfig[type]?.badgeVariant || "pastel-neutral";
}

export function getPriority(type: AttentionType): Priority {
  return attentionTypeConfig[type]?.priority || "low";
}

export function getAttentionLabel(type: AttentionType): string {
  return attentionTypeConfig[type]?.label || type;
}