"use client";

import { useGetLiveMonitoringApi } from "lib";
import { useLiveClock } from "./use-live-clock";

export function useLiveMonitoring() {
  const { data, isLoading, error, refetch } = useGetLiveMonitoringApi();
  const { now, mountedAt, secondsSinceRefresh, refresh: resetClock } = useLiveClock();

  const visits = data?.visits ?? [];
  const attentionItems = data?.attentionItems ?? [];
  const carers = data?.carers ?? [];

  const refresh = () => {
    resetClock();
    refetch();
  };

  return {
    visits,
    attentionItems,
    carers,
    now,
    mountedAt,
    secondsSinceRefresh,
    isLoading,
    error,
    refresh,
  };
}