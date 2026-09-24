"use client";

import { useCallback, useEffect, useState } from "react";
import type { DashboardStatsResponse } from "utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DASHBOARD === "true";


const MOCK_STATS: DashboardStatsResponse = {
  totalPatients: { value: 142, changePercent: 12 },
  activeStaff: { value: 31, changePercent: 8 },
  todaysVisits: { value: 48, completionRate: 92 },
  revenue: { value: 42500, targetAttainment: 78, currency: "GBP" },
};

export function useDashboardStats() {
  const [data, setData] = useState<DashboardStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (USE_MOCK) {
      const timer = setTimeout(() => {
        setData(MOCK_STATS);
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }

    const controller = new AbortController();

    fetch(`${API_URL}/dashboard/stats`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json() as Promise<DashboardStatsResponse>;
      })
      .then(setData)
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        console.error("[dashboard stats]", err.message); 
        setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { data, isLoading, error, refetch };
}