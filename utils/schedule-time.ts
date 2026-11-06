import type { ScheduleDayOfWeek } from "types";

const MINUTES_IN_DAY = 24 * 60;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAY_BY_INDEX: ScheduleDayOfWeek[] = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function isoToUtcMs(iso: string): number {
  const [year, month, day] = iso.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/* ── Date <-> ISO string (local time, never toISOString) ────── */

/** Local yyyy-mm-dd. Avoids the off-by-one-day bug of toISOString(). */
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Local HH:mm. */
export function toHHmm(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** yyyy-mm-dd to a local-midnight Date (for calendars and date pickers). */
export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDaysIso(iso: string, days: number): string {
  return new Date(isoToUtcMs(iso) + days * MS_PER_DAY).toISOString().slice(0, 10);
}

/** Whole days from `fromIso` to `toIso` (negative if `toIso` is earlier). */
export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((isoToUtcMs(toIso) - isoToUtcMs(fromIso)) / MS_PER_DAY);
}

export function getDayOfWeek(iso: string): ScheduleDayOfWeek {
  return DAY_BY_INDEX[new Date(isoToUtcMs(iso)).getUTCDay()];
}

/** Monday of the week containing `iso`. */
export function startOfWeekIso(iso: string): string {
  const index = new Date(isoToUtcMs(iso)).getUTCDay();
  return addDaysIso(iso, index === 0 ? -6 : 1 - index);
}

/* ── Times (HH:mm) ──────────────────────────────────────────── */

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Minutes since midnight to HH:mm, clamped to 00:00 to 23:59. */
export function minutesToTime(total: number): string {
  const clamped = Math.min(Math.max(total, 0), MINUTES_IN_DAY - 1);
  return `${pad(Math.floor(clamped / 60))}:${pad(clamped % 60)}`;
}

export function calculateEndTime(
  startTime: string,
  durationMinutes: number
): string {
  return minutesToTime(timeToMinutes(startTime) + durationMinutes);
}

export function getDurationMinutes(startTime: string, endTime: string): number {
  return Math.max(timeToMinutes(endTime) - timeToMinutes(startTime), 0);
}

export function getDurationHours(startTime: string, endTime: string): number {
  return Math.round((getDurationMinutes(startTime, endTime) / 60) * 100) / 100;
}

/** True when the two ranges share time. Back-to-back ranges do not overlap. */
export function timeRangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return (
    timeToMinutes(aStart) < timeToMinutes(bEnd) &&
    timeToMinutes(aEnd) > timeToMinutes(bStart)
  );
}

export function formatDurationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = minutes / 60;
  return hours === 1 ? "1 hour" : `${hours} hours`;
}

/* ── Display (en-GB) ────────────────────────────────────────── */

const shortDateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const longDateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

/** "Mon 18 Mar" */
export function formatShortDate(iso: string): string {
  return shortDateFormat.format(new Date(isoToUtcMs(iso)));
}

/** "Monday 18 March" */
export function formatLongDate(iso: string): string {
  return longDateFormat.format(new Date(isoToUtcMs(iso)));
}

/** Relative label between two local ISO datetimes, e.g. "2 hours ago". */
export function formatTimeAgo(thenIso: string, nowIso: string): string {
  const minutes = Math.floor(
    (new Date(nowIso).getTime() - new Date(thenIso).getTime()) / 60000
  );
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}