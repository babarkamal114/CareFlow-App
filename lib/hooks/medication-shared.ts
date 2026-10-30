"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { useApiMutation, useApiQuery } from "./use-api";

export type ApiQueryOptions<TData> = Parameters<typeof useApiQuery<TData>>[2];

export type ApiMutationOptions<TData, TVariables> = Partial<
  Omit<Parameters<typeof useApiMutation<TData, TVariables>>[0], "mutationKey" | "mutationFn">
>;

const root = ["medication"] as const;

export const medicationKeys = {
  all: root,
  patients: [...root, "patients"] as const,
  medications: [...root, "medications"] as const,
  round: [...root, "round"] as const,
  history: [...root, "history"] as const,
  prn: [...root, "prn"] as const,
  controlled: [...root, "controlled"] as const,
  reports: [...root, "reports"] as const,
};

export function useInvalidateMedication() {
  const queryClient = useQueryClient();
  return (...keys: ReadonlyArray<readonly unknown[]>) => {
    keys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
  };
}
