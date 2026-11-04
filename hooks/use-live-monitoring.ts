"use client";

import { useSession } from "next-auth/react";
import {
  useGetLiveMonitoringApi,
  mockLiveVisits,
  mockLiveAttentionItems,
  mockLiveCarersOnShift,
} from "lib";
import { useLiveClock } from "./use-live-clock";

export function useLiveMonitoring() {
  const session = useSession();
  const accessToken = session.data?.accessToken;

  const { data, isLoading, error, refetch } = useGetLiveMonitoringApi(accessToken);
  const { now, mountedAt, secondsSinceRefresh, refresh: resetClock } = useLiveClock();

  const visits = data?.visits ?? mockLiveVisits;
  const attentionItems = data?.attentionItems ?? mockLiveAttentionItems;
  const carers = data?.carers ?? mockLiveCarersOnShift;

  const refresh = () => {
    resetClock();
    if (accessToken) refetch();
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
