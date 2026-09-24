"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DASHBOARD === "true";

type Params = Record<string, string | number | undefined>;

interface Options<T> {
  params?: Params;
  mock: () => T;
}

const inFlight = new Map<string, Promise<unknown>>();

function request<T>(url: string): Promise<T> {
  const existing = inFlight.get(url);
  if (existing) return existing as Promise<T>;

  const promise = fetch(url, {
    headers: {
      Accept: "application/json",
      // TODO: attach your auth here, same as the other dashboard hooks.
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      return res.json() as Promise<T>;
    })
    .finally(() => inFlight.delete(url));

  inFlight.set(url, promise);
  return promise;
}

export function useDashboardData<T>(path: string, { params, mock }: Options<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const mockRef = useRef(mock);
  mockRef.current = mock;

  const query = new URLSearchParams(
    Object.entries(params ?? {})
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();
  const url = `${API_URL}${path}${query ? `?${query}` : ""}`;

  useEffect(() => {
    let cancelled = false; 
    setIsLoading(true);
    setError(null);

    if (USE_MOCK) {
      const timer = setTimeout(() => {
        if (cancelled) return;
        setData(mockRef.current());
        setIsLoading(false);
      }, 400);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    request<T>(url)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        console.error(`[dashboard] ${path}`, err.message);
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url, path, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { data, isLoading, error, refetch };
}