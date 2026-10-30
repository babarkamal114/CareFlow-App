"use client";

import { type UseMutationResult } from "@tanstack/react-query";
import type { PrnRecord } from "types";
import { getPrnRecords, recordPrn, recordPrnFollowUp } from "lib";
import { medicationKeys, useInvalidateMedication, type ApiMutationOptions, type ApiQueryOptions } from "./medication-shared";
import { useApiMutation, useApiQuery } from "./use-api";

export type RecordPrnVariables = Parameters<typeof recordPrn>[0];
export type RecordPrnFollowUpVariables = Parameters<typeof recordPrnFollowUp>[0];

const recordPrnKey = [...medicationKeys.all, "record-prn"] as const;
const recordPrnFollowUpKey = [...medicationKeys.all, "record-prn-follow-up"] as const;

export function useGetPrnRecordsApi(options?: ApiQueryOptions<PrnRecord[]>) {
  return useApiQuery<PrnRecord[]>(
    medicationKeys.prn,
    // MOCK: replace this line with apiClient.get(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    () => getPrnRecords(),
    options,
  );
}

export function useRecordPrnApi(
  options?: ApiMutationOptions<PrnRecord, RecordPrnVariables>,
): UseMutationResult<PrnRecord, Error, RecordPrnVariables, unknown> {
  const invalidate = useInvalidateMedication();
  return useApiMutation<PrnRecord, RecordPrnVariables>({
    mutationKey: recordPrnKey,
    // MOCK: replace this line with apiClient.post(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, body, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    mutationFn: (variables) => recordPrn(variables),
    showErrorToast: true,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      invalidate(medicationKeys.prn);
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export function useRecordPrnFollowUpApi(
  options?: ApiMutationOptions<PrnRecord, RecordPrnFollowUpVariables>,
): UseMutationResult<PrnRecord, Error, RecordPrnFollowUpVariables, unknown> {
  const invalidate = useInvalidateMedication();
  return useApiMutation<PrnRecord, RecordPrnFollowUpVariables>({
    mutationKey: recordPrnFollowUpKey,
    // MOCK: replace this line with apiClient.post(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, body, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    mutationFn: (variables) => recordPrnFollowUp(variables),
    showErrorToast: true,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      invalidate(medicationKeys.prn);
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
