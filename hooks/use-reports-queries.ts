"use client";

import { type UseQueryResult, useQueries, useQuery } from "@tanstack/react-query";
import {
  getAiInsights, getLibraryReports, getReportActivity, getReportCatalog, getReportDataset, getReportKpis, getReportSchedules, getReportTemplates,
} from "lib";
import type { ReportDataset } from "types";

export const reportKeys = {
  kpis: ["reports", "kpis"] as const,
  dataset: (id: string) => ["reports", "dataset", id] as const,
  catalog: ["reports", "catalog"] as const,
  library: ["reports", "library"] as const,
  schedules: ["reports", "schedules"] as const,
  templates: ["reports", "templates"] as const,
  insights: ["reports", "insights"] as const,
  activity: ["reports", "activity"] as const,
};

export const useReportKpisQuery = () => useQuery({ queryKey: reportKeys.kpis, queryFn: getReportKpis });
export const useReportCatalogQuery = () => useQuery({ queryKey: reportKeys.catalog, queryFn: getReportCatalog, staleTime: Infinity });
export const useLibraryReportsQuery = () => useQuery({ queryKey: reportKeys.library, queryFn: getLibraryReports, staleTime: Infinity });
export const useReportSchedulesQuery = () => useQuery({ queryKey: reportKeys.schedules, queryFn: getReportSchedules });
export const useReportTemplatesQuery = () => useQuery({ queryKey: reportKeys.templates, queryFn: getReportTemplates });
export const useAiInsightsQuery = () => useQuery({ queryKey: reportKeys.insights, queryFn: getAiInsights });
export const useReportActivityQuery = () => useQuery({ queryKey: reportKeys.activity, queryFn: getReportActivity });

export const useReportDatasetQuery = (id: string | null) =>
  useQuery({ queryKey: reportKeys.dataset(id ?? ""), queryFn: () => getReportDataset(id as string), enabled: Boolean(id), staleTime: Infinity });

const combineDatasets = (results: UseQueryResult<ReportDataset>[]) => ({
  datasets: results.map((r) => r.data).filter((d): d is ReportDataset => Boolean(d)),
  isLoading: results.some((r) => r.isLoading),
});

/** Several datasets at once (the run dialog of a library report). */
export function useReportDatasetsQuery(ids: string[]) {
  return useQueries({
    queries: ids.map((id) => ({ queryKey: reportKeys.dataset(id), queryFn: () => getReportDataset(id), staleTime: Infinity })),
    combine: combineDatasets,
  });
}
