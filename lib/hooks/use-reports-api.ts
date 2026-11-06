import { useQueries, useQueryClient, type UseQueryResult } from "@tanstack/react-query";
import type {
  LogReportActivityVariables,
  ReportDataset,
  ReportMutationResponse,
  ReviewAiInsightVariables,
  SaveReportScheduleVariables,
  SaveReportTemplateVariables,
  SetReportScheduleStatusVariables,
} from "types";
import {
  mockAiInsights, mockLibraryReports, mockReportActivity, mockReportCatalog, mockReportDatasets, mockReportKpis, mockReportSchedules,
  mockReportTemplates,
} from "lib";
import { useApiMutation, useApiQuery } from "./use-api";
import { mockRequest } from "lib";

// ---- Query keys ----
export const reportKeys = {
  all: ["reports"] as const,
  kpis: ["reports", "kpis"] as const,
  dataset: (id: string) => ["reports", "dataset", id] as const,
  catalog: ["reports", "catalog"] as const,
  library: ["reports", "library"] as const,
  schedules: ["reports", "schedules"] as const,
  templates: ["reports", "templates"] as const,
  insights: ["reports", "insights"] as const,
  activity: ["reports", "activity"] as const,
};

// After any successful write, refetch every reports query.
function useInvalidateReports() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: reportKeys.all });
  };
}

type ReportMutationOptions<TVariables> = Omit<
  Parameters<typeof useApiMutation<ReportMutationResponse, TVariables>>[0],
  "mutationKey" | "mutationFn"
>;

// ---- Reads ----
export const useGetReportKpisApi = () => useApiQuery(reportKeys.kpis, () => mockRequest(mockReportKpis));

export const useGetReportCatalogApi = () =>
  useApiQuery(reportKeys.catalog, () => mockRequest(mockReportCatalog), { staleTime: Infinity });

export const useGetLibraryReportsApi = () =>
  useApiQuery(reportKeys.library, () => mockRequest(mockLibraryReports), { staleTime: Infinity });

export const useGetReportSchedulesApi = () => useApiQuery(reportKeys.schedules, () => mockRequest(mockReportSchedules));

export const useGetReportTemplatesApi = () => useApiQuery(reportKeys.templates, () => mockRequest(mockReportTemplates));

export const useGetAiInsightsApi = () => useApiQuery(reportKeys.insights, () => mockRequest(mockAiInsights));

export const useGetReportActivityApi = () => useApiQuery(reportKeys.activity, () => mockRequest(mockReportActivity));

export function getReportDataset(id: string): Promise<ReportDataset> {
  const dataset = mockReportDatasets.find((d) => d.id === id);
  if (!dataset) return Promise.reject(new Error(`Dataset ${id} not found`));
  return mockRequest(dataset);
}

export const useGetReportDatasetApi = (id: string | null) =>
  useApiQuery(reportKeys.dataset(id ?? ""), () => getReportDataset(id as string), { enabled: Boolean(id), staleTime: Infinity });

const combineDatasets = (results: UseQueryResult<ReportDataset>[]) => ({
  datasets: results.map((r) => r.data).filter((d): d is ReportDataset => Boolean(d)),
  isLoading: results.some((r) => r.isLoading),
});

export function useGetReportDatasetsApi(ids: string[]) {
  return useQueries({
    queries: ids.map((id) => ({ queryKey: reportKeys.dataset(id), queryFn: () => getReportDataset(id), staleTime: Infinity })),
    combine: combineDatasets,
  });
}

export function useLogReportActivityApi(options?: ReportMutationOptions<LogReportActivityVariables>) {
  const invalidate = useInvalidateReports();
  return useApiMutation<ReportMutationResponse, LogReportActivityVariables>({
    showErrorToast: false,
    ...options,
    mutationKey: [...reportKeys.all, "log-activity"],
    mutationFn: () => mockRequest({ success: true, message: "Activity logged" }),
    onSuccess: (...args) => {
      invalidate();
      options?.onSuccess?.(...args);
    },
  });
}

export function useSaveReportScheduleApi(options?: ReportMutationOptions<SaveReportScheduleVariables>) {
  const invalidate = useInvalidateReports();
  return useApiMutation<ReportMutationResponse, SaveReportScheduleVariables>({
    showErrorToast: false,
    ...options,
    mutationKey: [...reportKeys.all, "save-schedule"],
    mutationFn: () => mockRequest({ success: true, message: "Schedule saved" }),
    onSuccess: (...args) => {
      invalidate();
      options?.onSuccess?.(...args);
    },
  });
}

export function useSetReportScheduleStatusApi(options?: ReportMutationOptions<SetReportScheduleStatusVariables>) {
  const invalidate = useInvalidateReports();
  return useApiMutation<ReportMutationResponse, SetReportScheduleStatusVariables>({
    showErrorToast: false,
    ...options,
    mutationKey: [...reportKeys.all, "set-schedule-status"],
    mutationFn: () => mockRequest({ success: true, message: "Schedule status updated" }),
    onSuccess: (...args) => {
      invalidate();
      options?.onSuccess?.(...args);
    },
  });
}

export function useDeleteReportScheduleApi(options?: ReportMutationOptions<string>) {
  const invalidate = useInvalidateReports();
  return useApiMutation<ReportMutationResponse, string>({
    showErrorToast: false,
    ...options,
    mutationKey: [...reportKeys.all, "delete-schedule"],
    mutationFn: () => mockRequest({ success: true, message: "Schedule deleted" }),
    onSuccess: (...args) => {
      invalidate();
      options?.onSuccess?.(...args);
    },
  });
}

export function useSaveReportTemplateApi(options?: ReportMutationOptions<SaveReportTemplateVariables>) {
  const invalidate = useInvalidateReports();
  return useApiMutation<ReportMutationResponse, SaveReportTemplateVariables>({
    showErrorToast: false,
    ...options,
    mutationKey: [...reportKeys.all, "save-template"],
    mutationFn: () => mockRequest({ success: true, message: "Template saved" }),
    onSuccess: (...args) => {
      invalidate();
      options?.onSuccess?.(...args);
    },
  });
}

export function useDeleteReportTemplateApi(options?: ReportMutationOptions<string>) {
  const invalidate = useInvalidateReports();
  return useApiMutation<ReportMutationResponse, string>({
    showErrorToast: false,
    ...options,
    mutationKey: [...reportKeys.all, "delete-template"],
    mutationFn: () => mockRequest({ success: true, message: "Template deleted" }),
    onSuccess: (...args) => {
      invalidate();
      options?.onSuccess?.(...args);
    },
  });
}

export function useReviewAiInsightApi(options?: ReportMutationOptions<ReviewAiInsightVariables>) {
  const invalidate = useInvalidateReports();
  return useApiMutation<ReportMutationResponse, ReviewAiInsightVariables>({
    showErrorToast: false,
    ...options,
    mutationKey: [...reportKeys.all, "review-insight"],
    mutationFn: () => mockRequest({ success: true, message: "Insight reviewed" }),
    onSuccess: (...args) => {
      invalidate();
      options?.onSuccess?.(...args);
    },
  });
}
