import { canAccess, formatCurrency } from "./dashboard-helpers";

export interface RevenueSnapshotResponse {
  thisMonth: number;
  lastMonth: number;
  outstanding: number;
  currency: string;
}

export function getRevenueChange(
  thisMonth: number,
  lastMonth: number
): { percent: number; isUp: boolean } | null {
  if (lastMonth <= 0) return null;

  const percent = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
  if (percent === 0) return null;

  return { percent: Math.abs(percent), isUp: percent > 0 };
}

export const canSeeRevenue = (role: string) => canAccess(role, "finance");


export const MOCK_REVENUE_SNAPSHOT: RevenueSnapshotResponse = {
  thisMonth: 42500,
  lastMonth: 38900,
  outstanding: 8000,
  currency: "GBP",
};


export interface RevenueSnapshotView {
  thisMonth: string;
  lastMonth: string;
  outstanding: string;
  change: { percent: number; isUp: boolean } | null;
}

export function getRevenueSnapshot(): RevenueSnapshotView {
  const { thisMonth, lastMonth, outstanding, currency } = MOCK_REVENUE_SNAPSHOT;
  return {
    thisMonth: formatCurrency(thisMonth, currency),
    lastMonth: formatCurrency(lastMonth, currency),
    outstanding: formatCurrency(outstanding, currency),
    change: getRevenueChange(thisMonth, lastMonth),
  };
}
