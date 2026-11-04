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
