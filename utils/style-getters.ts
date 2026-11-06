import type { ScheduleCalendarEvent } from "types";

/**
 * Calendar styling is class-based so colours come from the design tokens in
 * calendar.css, never from inline hex values. Classes emitted:
 *   event-{visit type}, status-{visit status}, event-unassigned
 */
export const eventStyleGetter = (event: ScheduleCalendarEvent) => {
  const { type, status, carerId } = event.resource;
  const classes = [`event-${type}`, `status-${status}`];
  if (carerId === null) classes.push("event-unassigned");
  return { className: classes.join(" ") };
};

/** Highlights the given ISO date. Takes it as a parameter so mock data can use a fixed "today". */
export const createDayStyleGetter = (todayIso: string) => (date: Date) => {
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
  return iso === todayIso ? { className: "rbc-today" } : {};
};