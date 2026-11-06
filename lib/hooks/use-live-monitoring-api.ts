import { useApiQuery } from "./use-api";
import { mockRequest, mockLiveVisits, mockLiveAttentionItems, mockLiveCarersOnShift } from "lib";
import type { LiveMonitoringResponse } from "types";

const KEY = ["live-monitoring"] as const;
const keys = {
  all: [...KEY, "all"],
} as const;

export const useGetLiveMonitoringApi = () =>
  useApiQuery<LiveMonitoringResponse>(keys.all, () =>
    mockRequest({
      visits: mockLiveVisits,
      attentionItems: mockLiveAttentionItems,
      carers: mockLiveCarersOnShift,
    }),
  );