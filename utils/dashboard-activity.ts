import { canAccess, parseLocalDay } from "./dashboard-helpers";

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