"use client";

import {
  useGetAiInsightsApi, useGetLibraryReportsApi, useGetReportActivityApi, useGetReportCatalogApi, useGetReportDatasetApi,
  useGetReportDatasetsApi, useGetReportKpisApi, useGetReportSchedulesApi, useGetReportTemplatesApi,
} from "lib";

export { reportKeys } from "lib";

export const useReportKpisQuery = useGetReportKpisApi;
export const useReportCatalogQuery = useGetReportCatalogApi;
export const useLibraryReportsQuery = useGetLibraryReportsApi;
export const useReportSchedulesQuery = useGetReportSchedulesApi;
export const useReportTemplatesQuery = useGetReportTemplatesApi;
export const useAiInsightsQuery = useGetAiInsightsApi;
export const useReportActivityQuery = useGetReportActivityApi;
export const useReportDatasetQuery = useGetReportDatasetApi;
export const useReportDatasetsQuery = useGetReportDatasetsApi;