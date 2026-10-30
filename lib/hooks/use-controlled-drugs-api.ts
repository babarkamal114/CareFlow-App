"use client";

import { type UseMutationResult } from "@tanstack/react-query";
import type { ControlledEntry, ControlledStock } from "types";
import { getControlledData, recordControlledEntry } from "lib";
import { medicationKeys, useInvalidateMedication, type ApiMutationOptions, type ApiQueryOptions } from "./medication-shared";
import { useApiMutation, useApiQuery } from "./use-api";

export interface ControlledDataResponse {
  stock: ControlledStock[];
  entries: ControlledEntry[];
}

export type RecordControlledEntryVariables = Parameters<typeof recordControlledEntry>[0];

const recordControlledEntryKey = [...medicationKeys.all, "record-controlled-entry"] as const;

export function useGetControlledDataApi(options?: ApiQueryOptions<ControlledDataResponse>) {
  return useApiQuery<ControlledDataResponse>(
    medicationKeys.controlled,
    // MOCK: replace this line with apiClient.get(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    () => getControlledData(),
    options,
  );
}

export function useRecordControlledEntryApi(
  options?: ApiMutationOptions<void, RecordControlledEntryVariables>,
): UseMutationResult<void, Error, RecordControlledEntryVariables, unknown> {
  const invalidate = useInvalidateMedication();
  return useApiMutation<void, RecordControlledEntryVariables>({
    mutationKey: recordControlledEntryKey,
    // MOCK: replace this line with apiClient.post(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, body, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    mutationFn: (variables) => recordControlledEntry(variables),
    showErrorToast: true,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      invalidate(medicationKeys.controlled);
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
