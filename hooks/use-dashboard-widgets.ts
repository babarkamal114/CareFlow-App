"use client";

import { useDashboardData } from "./use-dashboard-data";
import type { AttentionResponse } from "utils";
import type { OnShiftResponse, StaffSnapshotResponse } from "utils";
import type { NotificationsResponse } from "utils";
import { COMPLIANCE_WINDOW_DAYS, type ComplianceDueResponse } from "utils";
import type { CqcOverviewResponse } from "utils";
import type { RevenueSnapshotResponse } from "utils";
import type { WeeklyActivityResponse } from "utils";

const ON_SHIFT_LIMIT = 5;
const minutesAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

const dateInDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export function useAttentionItems() {
  return useDashboardData<AttentionResponse>("/dashboard/attention", {
    params: { limit: 10 },
    mock: () => ({
      items: [
        { id: "1", type: "missed-visit", priority: "high", subject: "Dorothy Chen", detail: "Scheduled 8:30 AM · No check-in recorded", occurredAt: minutesAgo(12) },
        { id: "2", type: "no-checkin", priority: "high", subject: "James Okafor", detail: "Visit at 8:30 AM · Carer didn't check in", occurredAt: minutesAgo(12) },
        { id: "3", type: "safeguarding", priority: "high", subject: "Edna Morris", detail: "Financial abuse reported · Family member involved", occurredAt: minutesAgo(60) },
        { id: "4", type: "overdue", priority: "medium", subject: "3 patients", detail: "R. Ahmed, B. Williams, H. Smith · Due yesterday", occurredAt: minutesAgo(60 * 9) },
        { id: "5", type: "expiring", priority: "medium", subject: "Lucy Chen", detail: "Expires 16 April · 14 days remaining", occurredAt: minutesAgo(60 * 10) },
      ],
    }),
  });
}

export function useOnShiftCarers() {
  return useDashboardData<OnShiftResponse>("/dashboard/staff/on-shift", {
    params: { limit: ON_SHIFT_LIMIT },
    mock: () => ({
      total: 12,
      carers: [
        { id: "1", name: "Sarah Johnson", status: "active" },
        { id: "2", name: "Michael Chen", status: "en-route" },
        { id: "3", name: "Emma Williams", status: "active" },
        { id: "4", name: "David Smith", status: "break" },
        { id: "5", name: "Lisa Garcia", status: "active" },
      ],
    }),
  });
}

/* ------------------------------ Staff Snapshot ----------------------------- */

export function useStaffSnapshot() {
  return useDashboardData<StaffSnapshotResponse>("/dashboard/staff/snapshot", {
    mock: () => ({ onShift: 12, available: 15, onLeave: 4 }),
  });
}

/* ------------------------------- Notifications ----------------------------- */

export function useNotifications() {
  return useDashboardData<NotificationsResponse>("/notifications", {
    params: { limit: 5 },
    mock: () => ({
      unreadCount: 2,
      items: [
        { id: "n1", title: "Care plan review due", body: "Dorothy Chen · due tomorrow", createdAt: minutesAgo(25), read: false },
        { id: "n2", title: "Visit completed", body: "Margaret Johnson · 60 min", createdAt: minutesAgo(90), read: false },
        { id: "n3", title: "New patient added", body: "Sophie Martinez", createdAt: minutesAgo(60 * 20), read: true },
      ],
    }),
  });
}

/* ------------------------------ Compliance Due ----------------------------- */

export function useComplianceDue() {
  return useDashboardData<ComplianceDueResponse>("/dashboard/compliance-due", {
    params: { days: COMPLIANCE_WINDOW_DAYS },
    mock: () => ({
      items: [
        { id: "1", title: "DBS Checks", dueDate: dateInDays(3), count: 5 },
        { id: "2", title: "Fire Safety Training", dueDate: dateInDays(5), count: 8 },
        { id: "3", title: "Manual Handling Certification", dueDate: dateInDays(11), count: 3 },
        { id: "4", title: "CQC Documentation Review", dueDate: dateInDays(14), count: 1 },
      ],
    }),
  });
}

/* ------------------------- CQC (Gauge + Breakdown) ------------------------- */

// Both CQC widgets call this. Same URL, so they share one network request.
export function useCqcOverview() {
  return useDashboardData<CqcOverviewResponse>("/dashboard/cqc", {
    mock: () => ({
      overallScore: 87,
      previousScore: 83,
      updatedAt: minutesAgo(60 * 24 * 9),
      attributes: [
        { key: "safe", score: 92 },
        { key: "effective", score: 85 },
        { key: "caring", score: 88 },
        { key: "responsive", score: 79 },
        { key: "well-led", score: 91 },
      ],
    }),
  });
}

/* ---------------------------- Revenue Snapshot ----------------------------- */

export function useRevenueSnapshot() {
  return useDashboardData<RevenueSnapshotResponse>("/dashboard/revenue", {
    mock: () => ({ thisMonth: 42500, lastMonth: 38900, outstanding: 8000, currency: "GBP" }),
  });
}

/* ------------------------------ Weekly Activity ---------------------------- */

export function useWeeklyActivity() {
  return useDashboardData<WeeklyActivityResponse>("/dashboard/weekly-activity", {
    params: { days: 7 },
    mock: () => {
      const done = [45, 52, 48, 61, 55, 42, 38];
      const active = [23, 18, 25, 20, 22, 28, 30];
      const missed = [5, 3, 6, 4, 7, 8, 9];
      return {
        days: done.map((_, i) => ({
          date: dateInDays(i - 6), // last 7 days, ending today
          done: done[i],
          active: active[i],
          missed: missed[i],
        })),
      };
    },
  });
}