import type { AttentionType, AttentionPriority, AttentionTypeConfig } from "types";

export const attentionTypeConfig: Record<AttentionType, AttentionTypeConfig> = {
  "missed-visit": { label: "Missed Visit", icon: "Clock", priority: "high", badgeVariant: "pastel-danger" },
  "no-checkin": { label: "No Check-in", icon: "User", priority: "high", badgeVariant: "pastel-warning" },
  safeguarding: { label: "Safeguarding", icon: "Shield", priority: "high", badgeVariant: "pastel-danger" },
  overdue: { label: "Overdue", icon: "FileText", priority: "medium", badgeVariant: "pastel-warning" },
  expiring: { label: "Expiring", icon: "Calendar", priority: "medium", badgeVariant: "pastel-info" },
  delayed: { label: "Visit Running Late", icon: "Clock", priority: "medium", badgeVariant: "pastel-warning" },
  gps: { label: "GPS Signal Lost", icon: "Wifi", priority: "medium", badgeVariant: "pastel-info" },
};

export function getAttentionTypeConfig(type: AttentionType): AttentionTypeConfig {
  return attentionTypeConfig[type];
}

export function getBadgeVariant(type: AttentionType): string {
  return attentionTypeConfig[type]?.badgeVariant || "pastel-neutral";
}

export function getPriority(type: AttentionType): AttentionPriority {
  return attentionTypeConfig[type]?.priority || "low";
}

export function getAttentionLabel(type: AttentionType): string {
  return attentionTypeConfig[type]?.label || type;
}
