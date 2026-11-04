import { useApiQuery } from "./use-api";
import { apiClient } from "../api";
import { env } from "@/config/env";
import type { LiveMonitoringResponse } from "types";

const liveMonitoringKeys = ["live-monitoring"] as const;

export function useGetLiveMonitoringApi(accessToken?: string) {
  return useApiQuery<LiveMonitoringResponse>(
    [...liveMonitoringKeys],
    () => {
      return apiClient.get(`${env.NEXT_PUBLIC_API_URL}/live-monitoring`, {
        Authorization: `Bearer ${accessToken}`,
      });
    },
    { enabled: !!accessToken },
  );
}
