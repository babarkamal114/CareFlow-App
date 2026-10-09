import type { BadgeProps, ChartConfig } from "@/components/ui";
import type {
  DashboardActivityPoint,
  DashboardComplianceItem,
  DashboardCqcDomain,
  DashboardRevenueSnapshot,
} from "types";

import { pluralize } from "./dashboard-helpers";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

export type DashboardTrendDirection = "up" | "down" | "neutral";

// ---------------------------------------------------------------------------
// CQC readiness
// ---------------------------------------------------------------------------

export type DashboardScoreTone = "success" | "warning" | "danger";

export const DASHBOARD_SCORE_TONE_CLASSES: Record<
  DashboardScoreTone,
  { text: string; bar: string; stroke: string; badge: BadgeVariant }
> = {
  success: { text: "text-brand-600", bar: "bg-brand-500", stroke: "stroke-brand-500", badge: "softSuccess" },
  warning: { text: "text-cf-amber-500", bar: "bg-cf-amber-500", stroke: "stroke-cf-amber-500", badge: "softWarning" },
  danger: { text: "text-destructive", bar: "bg-destructive", stroke: "stroke-destructive", badge: "softDanger" },
};

/** 85+ is strong, 70-84 needs watching, below 70 is at risk. */
export function getDashboardScoreTone(score: number): DashboardScoreTone {
  if (score >= 85) return "success";
  if (score >= 70) return "warning";
  return "danger";
}

export function getDashboardCqcOverall(domains: DashboardCqcDomain[]): number {
  if (domains.length === 0) return 0;
  return Math.round(domains.reduce((sum, d) => sum + d.score, 0) / domains.length);
}

export interface DashboardCqcTrend {
  direction: DashboardTrendDirection;
  delta: number;
  label: string;
}

export function getDashboardCqcTrend(current: number, previous: number): DashboardCqcTrend {
  const delta = current - previous;
  if (delta > 0) return { direction: "up", delta, label: `Improving (+${delta} pts)` };
  if (delta < 0) return { direction: "down", delta, label: `Declining (${delta} pts)` };
  return { direction: "neutral", delta: 0, label: "No change" };
}

/** Circle geometry for the readiness gauge (SVG viewBox 0 0 120 120). */
export const DASHBOARD_GAUGE_RADIUS = 52;
export const DASHBOARD_GAUGE_CIRCUMFERENCE = 2 * Math.PI * DASHBOARD_GAUGE_RADIUS;

export function getDashboardGaugeOffset(score: number): number {
  const clamped = Math.min(100, Math.max(0, score));
  return DASHBOARD_GAUGE_CIRCUMFERENCE * (1 - clamped / 100);
}

// ---------------------------------------------------------------------------
// Revenue snapshot (money is GBP pounds; format with formatCurrency from dashboard-helpers)
// ---------------------------------------------------------------------------

export interface DashboardRevenueChange {
  direction: DashboardTrendDirection;
  /** Absolute change vs last month, one decimal place. */
  percent: number;
}

export function getDashboardRevenueChange(thisMonth: number, lastMonth: number): DashboardRevenueChange {
  if (lastMonth <= 0 || thisMonth === lastMonth) return { direction: "neutral", percent: 0 };
  const percent = Math.round((Math.abs(thisMonth - lastMonth) / lastMonth) * 1000) / 10;
  return { direction: thisMonth > lastMonth ? "up" : "down", percent };
}

export interface DashboardRevenueBar {
  key: "thisMonth" | "lastMonth";
  label: string;
  value: number;
  /** Bar length relative to the larger of the two months, 0-100. */
  widthPercent: number;
}

export function buildDashboardRevenueBars(s: DashboardRevenueSnapshot): DashboardRevenueBar[] {
  const max = Math.max(s.thisMonth, s.lastMonth, 1);
  return [
    { key: "thisMonth", label: "This month", value: s.thisMonth, widthPercent: (s.thisMonth / max) * 100 },
    { key: "lastMonth", label: "Last month", value: s.lastMonth, widthPercent: (s.lastMonth / max) * 100 },
  ];
}

// ---------------------------------------------------------------------------
// Weekly activity chart
// ---------------------------------------------------------------------------

export const DASHBOARD_ACTIVITY_SERIES = [
  { key: "completed", label: "Completed", color: "var(--chart-1)", primary: true },
  { key: "scheduled", label: "Scheduled", color: "var(--chart-4)", primary: false },
  { key: "missed", label: "Missed", color: "var(--chart-3)", primary: false },
] as const;

export const DASHBOARD_ACTIVITY_CHART_CONFIG: ChartConfig = Object.fromEntries(
  DASHBOARD_ACTIVITY_SERIES.map((s) => [s.key, { label: s.label, color: s.color }]),
);

export function getDashboardActivityTotals(points: DashboardActivityPoint[]) {
  const totals = points.reduce(
    (acc, p) => ({
      scheduled: acc.scheduled + p.scheduled,
      completed: acc.completed + p.completed,
      missed: acc.missed + p.missed,
    }),
    { scheduled: 0, completed: 0, missed: 0 },
  );
  const completionRate = totals.scheduled > 0 ? Math.round((totals.completed / totals.scheduled) * 100) : 0;
  return { ...totals, completionRate };
}

// ---------------------------------------------------------------------------
// Compliance due
// ---------------------------------------------------------------------------

/** Only items due within this many days are listed. */
export const DASHBOARD_COMPLIANCE_WINDOW_DAYS = 30;

export type DashboardDueUrgency = "overdue" | "urgent" | "soon" | "later";

export const DASHBOARD_DUE_URGENCY_BADGE: Record<DashboardDueUrgency, BadgeVariant> = {
  overdue: "softDanger",
  urgent: "softWarning",
  soon: "softInfo",
  later: "softMuted",
};

export function getDashboardDueUrgency(dueInDays: number): DashboardDueUrgency {
  if (dueInDays < 0) return "overdue";
  if (dueInDays <= 7) return "urgent";
  if (dueInDays <= 14) return "soon";
  return "later";
}

export function formatDashboardDueLabel(dueInDays: number): string {
  if (dueInDays < 0) {
    const days = Math.abs(dueInDays);
    return `Overdue by ${days} ${pluralize(days, "day")}`;
  }
  if (dueInDays === 0) return "Due today";
  if (dueInDays === 1) return "Due tomorrow";
  return `Due in ${dueInDays} days`;
}

/** Items inside the window, most urgent first. */
export function sortDashboardComplianceItems(items: DashboardComplianceItem[]): DashboardComplianceItem[] {
  return items
    .filter((i) => i.dueInDays <= DASHBOARD_COMPLIANCE_WINDOW_DAYS)
    .sort((a, b) => a.dueInDays - b.dueInDays);
}

/** Overdue items plus those due within a week. */
export const countUrgentComplianceItems = (items: DashboardComplianceItem[]): number =>
  items.filter((i) => {
    const urgency = getDashboardDueUrgency(i.dueInDays);
    return urgency === "overdue" || urgency === "urgent";
  }).length;