import type { ChartConfig } from "@/components/ui";
import { canAccess, isoDateInDays, parseLocalDay } from "./dashboard-helpers";

export interface WeeklyActivityDayDTO {
  date: string; // "2026-09-24"
  done: number;
  active: number;
  missed: number;
}

export interface WeeklyActivityResponse {
  days: WeeklyActivityDayDTO[]; // the last 7 days
}

export const ACTIVITY_SERIES = [
  { key: "done", label: "Done", color: "var(--chart-1)", primary: true },
  { key: "active", label: "Active", color: "var(--chart-2)", primary: false },
  { key: "missed", label: "Missed", color: "var(--chart-3)", primary: false },
] as const;

export const ACTIVITY_CHART_CONFIG = Object.fromEntries(
  ACTIVITY_SERIES.map((s) => [s.key, { label: s.label, color: s.color }])
) as ChartConfig;

export interface ActivityPoint {
  day: string;
  done: number;
  active: number;
  missed: number;
}

const weekdayFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short" });

export function buildActivityPoints(days: WeeklyActivityDayDTO[]): ActivityPoint[] {
  return [...days]
    .sort((a, b) => a.date.localeCompare(b.date)) // ISO dates sort correctly as text
    .map((d) => ({
      day: weekdayFormat.format(parseLocalDay(d.date)),
      done: d.done,
      active: d.active,
      missed: d.missed,
    }));
}

export const canSeeActivity = (role: string) => canAccess(role, "visits");


const MOCK_DONE = [45, 52, 48, 61, 55, 42, 38];
const MOCK_ACTIVE = [23, 18, 25, 20, 22, 28, 30];
const MOCK_MISSED = [5, 3, 6, 4, 7, 8, 9];

export function getMockWeeklyActivity(): WeeklyActivityResponse {
  return {
    days: MOCK_DONE.map((done, i) => ({
      date: isoDateInDays(i - 6),
      done,
      active: MOCK_ACTIVE[i],
      missed: MOCK_MISSED[i],
    })),
  };
}

export function getActivityPoints(): ActivityPoint[] {
  return buildActivityPoints(getMockWeeklyActivity().days);
}
