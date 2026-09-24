import { canAccessModule } from "./dashboard-nav-filter";

export function canAccess(role: string, moduleId: string): boolean {
  const normalizedRole = (role || "").toLowerCase().trim().replace(/[\s-]+/g, "_");
  return canAccessModule(normalizedRole, moduleId);
}

export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const minutes = Math.max(0, Math.floor((now.getTime() - then) / 60000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  return `${Math.floor(hours / 24)}d`;
}

export function formatCurrency(value: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseLocalDay(iso: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(iso);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatDate(iso: string): string {
  const day = parseLocalDay(iso);
  if (Number.isNaN(day.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(day);
}

export function daysFromToday(iso: string, now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((parseLocalDay(iso).getTime() - today.getTime()) / 86400000);
}