"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  TodaysVisitsResponse,
  VisitDTO,
  VisitStatus,
} from "utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DASHBOARD === "true";
const PAGE_SIZE = 5; 


const at = (h: number, m: number) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const MOCK_VISITS: VisitDTO[] = [
  { id: "1", patientName: "Margaret Johnson", carerName: "Sarah Williams", careTypes: ["Personal Care", "Medication"], startTime: at(8, 0), endTime: at(9, 0), status: "completed" },
  { id: "2", patientName: "Robert Chen", carerName: "James O'Brien", careTypes: ["Meal Preparation"], startTime: at(9, 30), endTime: at(10, 30), status: "in-progress" },
  { id: "3", patientName: "Patricia Smith", carerName: "Emma Davis", careTypes: ["Medication", "Personal Care"], startTime: at(11, 0), endTime: at(12, 0), status: "scheduled" },
  { id: "4", patientName: "David Wilson", carerName: "Michael Brown", careTypes: ["Personal Care"], startTime: at(13, 0), endTime: at(14, 0), status: "scheduled" },
  { id: "5", patientName: "Susan Taylor", carerName: "Laura Martinez", careTypes: ["Medication", "Meal", "Personal Care"], startTime: at(15, 0), endTime: at(16, 30), status: "scheduled" },
];

const MOCK_COUNTS = { scheduled: 18, completed: 20, "in-progress": 6, late: 3, missed: 1 };

function getMockResponse(status?: VisitStatus): TodaysVisitsResponse {
  const visits = status ? MOCK_VISITS.filter((v) => v.status === status) : MOCK_VISITS;
  return { visits, total: visits.length, statusCounts: MOCK_COUNTS };
}

export function useTodaysVisits(status?: VisitStatus) {
  const [data, setData] = useState<TodaysVisitsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (USE_MOCK) {
      const timer = setTimeout(() => {
        setData(getMockResponse(status));
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }

    const controller = new AbortController();
    const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
    if (status) params.set("status", status);

    fetch(`${API_URL}/dashboard/visits/today?${params}`, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json() as Promise<TodaysVisitsResponse>;
      })
      .then(setData)
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        console.error("[todays visits]", err.message);
        setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [status, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { data, isLoading, error, refetch };
}