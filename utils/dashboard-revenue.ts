import { canAccess } from "./dashboard-helpers";

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