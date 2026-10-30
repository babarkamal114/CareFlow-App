"use client";

import { type UseMutationResult } from "@tanstack/react-query";
import type { Medication, MedicationPatient } from "types";
import {
  discontinueMedication, getMedicationPatients, getMedications, saveMedication,
} from "lib";
import { medicationKeys, useInvalidateMedication, type ApiMutationOptions, type ApiQueryOptions } from "./medication-shared";
import { useApiMutation, useApiQuery } from "./use-api";


export type SaveMedicationVariables = Parameters<typeof saveMedication>[0];

const saveMedicationKey = [...medicationKeys.all, "save-medication"] as const;
const discontinueMedicationKey = [...medicationKeys.all, "discontinue-medication"] as const;

export function useGetMedicationPatientsApi(options?: ApiQueryOptions<MedicationPatient[]>) {
  return useApiQuery<MedicationPatient[]>(
    medicationKeys.patients,
    // MOCK: replace this line with apiClient.get(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    () => getMedicationPatients(),
    options,
  );
}

export function useGetMedicationsApi(options?: ApiQueryOptions<Medication[]>) {
  return useApiQuery<Medication[]>(
    medicationKeys.medications,
    // MOCK: replace this line with apiClient.get(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    () => getMedications(),
    options,
  );
}

export function useSaveMedicationApi(
  options?: ApiMutationOptions<Medication, SaveMedicationVariables>,
): UseMutationResult<Medication, Error, SaveMedicationVariables, unknown> {
  const invalidate = useInvalidateMedication();
  return useApiMutation<Medication, SaveMedicationVariables>({
    mutationKey: saveMedicationKey,
    // MOCK: replace this line with apiClient.post(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, body, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    mutationFn: (variables) => saveMedication(variables),
    showErrorToast: true,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      invalidate(medicationKeys.medications, medicationKeys.round, medicationKeys.controlled);
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export function useDiscontinueMedicationApi(
  options?: ApiMutationOptions<void, string>,
): UseMutationResult<void, Error, string, unknown> {
  const invalidate = useInvalidateMedication();
  return useApiMutation<void, string>({
    mutationKey: discontinueMedicationKey,
    // MOCK: replace this line with apiClient.post(`${env.NEXT_PUBLIC_API_URL}/<endpoint>`, body, { Authorization: `Bearer ${accessToken}` }) once the backend is ready
    mutationFn: (id) => discontinueMedication(id),
    showErrorToast: true,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      invalidate(medicationKeys.medications, medicationKeys.round, medicationKeys.controlled);
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
