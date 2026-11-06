import type { ReactNode } from "react";
import type { BadgeProps } from "@/components/ui";
import type { LucideIcon } from "lucide-react";

/* ---------- domain ---------- */

export type VisitStatus =
  | "starting"
  | "in-progress"
  | "delayed"
  | "scheduled"
  | "completed"
  | "missed";

export type CarerLiveStatus = "active" | "travelling" | "break";

export type AttentionType =
  | "missed-visit"
  | "no-checkin"
  | "safeguarding"
  | "overdue"
  | "expiring"
  | "delayed"
  | "gps";

export type AttentionPriority = "high" | "medium" | "low";

export interface LiveVisit {
  id: string;
  patientName: string;
  patientInitials: string;
  careType: string;
  carerName: string;
  carerInitials: string;
  status: VisitStatus;
  scheduledWindow: string;
  referenceOffsetMinutes: number;
  durationMinutes: number;
}

export interface LiveAttentionItem {
  id: string;
  type: AttentionType;
  title: string;
  description: string;
  detail: string;
  time: string;
}

export interface LiveCarer {
  id: string;
  name: string;
  initials: string;
  status: CarerLiveStatus;
  detail: string;
}

/* ---------- api ---------- */

export interface LiveMonitoringResponse {
  visits: LiveVisit[];
  attentionItems: LiveAttentionItem[];
  carers: LiveCarer[];
}

/* ---------- view models ---------- */

export type LiveBadgeVariant = NonNullable<BadgeProps["variant"]>;
export type CarerStatusTone = "brand" | "blue" | "amber";

export interface AttentionTypeConfig {
  label: string;
  icon: string;
  priority: AttentionPriority;
  badgeVariant: LiveBadgeVariant;
}

export type LiveActivityFilterKey = "all" | VisitStatus;

export interface LiveActivityFilter {
  key: LiveActivityFilterKey;
  label: string;
}

export interface LiveActivityRowData {
  visit: LiveVisit;
  timingLabel: string;
  statusLabel: string;
  badgeVariant: LiveBadgeVariant;
}

export interface LiveMonitoringCounts {
  activePatients: number;
  activeVisits: number;
  carersOnDuty: number;
  alerts: number;
  highPriorityAlerts: number;
}

/* ---------- ui props ---------- */

export interface LiveMonitoringHeaderProps {
  updatedLabel: string;
  onRefresh: () => void;
}

export interface LiveActivityFilterTabsProps {
  filters: LiveActivityFilter[];
  value: LiveActivityFilterKey;
  onChange: (key: LiveActivityFilterKey) => void;
}

export interface LiveActivityRowProps {
  row: LiveActivityRowData;
}

export interface LiveActivityTableProps {
  rows: LiveActivityRowData[];
  filters: LiveActivityFilter[];
  activeFilter: LiveActivityFilterKey;
  onFilterChange: (key: LiveActivityFilterKey) => void;
}

export interface LiveAttentionPanelProps {
  urgentCount: number;
  children: ReactNode;
}

export interface LiveAttentionRowProps {
  item: LiveAttentionItem;
  config: AttentionTypeConfig;
}

export interface LiveCarersPanelProps {
  onDutyCount: number;
  children: ReactNode;
}

export interface LiveCarerRowProps {
  carer: LiveCarer;
  statusLabel: string;
  tone: CarerStatusTone;
}

/* ---------- section props ---------- */

export interface LiveMonitoringStatsProps {
  counts: LiveMonitoringCounts;
  isLoading: boolean;
}

export interface LiveActivitySectionProps {
  visits: LiveVisit[];
  now: number;
  mountedAt: number;
}

export interface LiveAttentionSectionProps {
  items: LiveAttentionItem[];
}

export interface LiveCarersSectionProps {
  carers: LiveCarer[];
}

export type StatCardTrend = "up" | "down" | "neutral";
 
export interface StatCardProps {
  label: string;
  value: string;
  description: string;
  Icon: LucideIcon;
  badgeVariant?: BadgeProps["variant"];
  score?: number;
  showScore?: boolean;
  trend?: StatCardTrend;
  showTrend?: boolean;
  cqcScore?: number;
  hasCqcScore?: boolean;
  hasValueBadge?: boolean;
  valueBadgeValue?: string;
  children?: ReactNode;
}