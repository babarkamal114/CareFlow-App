"use client";

import { type UseMutationResult } from "@tanstack/react-query";
import type { ScheduledDose } from "types";
import { getRoundDoses, recordDose } from "lib";
import { medicationKeys, useInvalidateMedication, type ApiMutationOptions, type ApiQueryOptions } from "./medication-shared";
import { useApiMutation, useApiQuery } from "./use-api";

export type RecordDoseVariables = Parameters<typeof recordDose>[0];

const recordDoseKey = [...medicationKeys.all, "record-dose"] as const;

export function useGetRoundDosesApi(options?: ApiQueryOptions<ScheduledDose[]>) {
  return useApiQuery<ScheduledDose[]>(
    medicationKeys.round,
    // MOCK: replace this line with apiClient.get(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    () => getRoundDoses(),
    options,
  );
}

export function useRecordDoseApi(
  options?: ApiMutationOptions<ScheduledDose, RecordDoseVariables>,
): UseMutationResult<ScheduledDose, Error, RecordDoseVariables, unknown> {
  const invalidate = useInvalidateMedication();
  return useApiMutation<ScheduledDose, RecordDoseVariables>({
    mutationKey: recordDoseKey,
    // MOCK: replace this line with apiClient.post(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, body, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    mutationFn: (variables) => recordDose(variables),
    showErrorToast: true,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      // controlled-drug stock moves when a dose is administered
      invalidate(medicationKeys.round, medicationKeys.controlled);
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
