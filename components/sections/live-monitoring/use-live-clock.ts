"use client";

import { useEffect, useRef, useState } from "react";

export function useLiveClock() {
  const mountedAt = useRef(Date.now()).current;
  const [now, setNow] = useState(mountedAt);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(mountedAt);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const secondsSinceRefresh = Math.max(0, Math.floor((now - lastRefreshedAt) / 1000));

  return {
    now,
    mountedAt,
    secondsSinceRefresh,
    refresh: () => setLastRefreshedAt(Date.now()),
  };
}

export function formatLiveDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}