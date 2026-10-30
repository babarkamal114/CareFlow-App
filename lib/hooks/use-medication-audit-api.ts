"use client";

import { type UseMutationResult } from "@tanstack/react-query";
import type { AuditReport, HistoryDose } from "types";
import { generateAuditReport, getAuditReports, getHistoryDoses } from "lib";
import { medicationKeys, useInvalidateMedication, type ApiMutationOptions, type ApiQueryOptions } from "./medication-shared";
import { useApiMutation, useApiQuery } from "./use-api";


const generateAuditReportKey = [...medicationKeys.all, "generate-audit-report"] as const;

export function useGetMedicationHistoryApi(options?: ApiQueryOptions<HistoryDose[]>) {
  return useApiQuery<HistoryDose[]>(
    medicationKeys.history,
    // MOCK: replace this line with apiClient.get(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    () => getHistoryDoses(),
    options,
  );
}

export function useGetAuditReportsApi(options?: ApiQueryOptions<AuditReport[]>) {
  return useApiQuery<AuditReport[]>(
    medicationKeys.reports,
    // MOCK: replace this line with apiClient.get(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    () => getAuditReports(),
    options,
  );
}

export function useGenerateAuditReportApi(
  options?: ApiMutationOptions<AuditReport, void>,
): UseMutationResult<AuditReport, Error, void, unknown> {
  const invalidate = useInvalidateMedication();
  return useApiMutation<AuditReport, void>({
    mutationKey: generateAuditReportKey,
    // MOCK: replace this line with apiClient.post(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, body, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    mutationFn: () => generateAuditReport(),
    showErrorToast: true,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      invalidate(medicationKeys.reports);
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
