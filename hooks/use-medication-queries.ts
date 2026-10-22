"use client";

import { useQuery } from "@tanstack/react-query";
import {
  MEDICATION_MOCK_NOW, getAuditReports, getControlledData, getHistoryDoses, getMedicationPatients, getMedications, getPrnRecords, getRoundDoses,
} from "lib";
import { useMemo } from "react";
import { buildRoundRows } from "utils";

export const medicationKeys = {
  patients: ["medication", "patients"] as const,
  medications: ["medication", "medications"] as const,
  round: ["medication", "round"] as const,
  history: ["medication", "history"] as const,
  prn: ["medication", "prn"] as const,
  controlled: ["medication", "controlled"] as const,
  reports: ["medication", "reports"] as const,
};

export const useMedicationPatientsQuery = () => useQuery({ queryKey: medicationKeys.patients, queryFn: getMedicationPatients, staleTime: Infinity });
export const useMedicationsQuery = () => useQuery({ queryKey: medicationKeys.medications, queryFn: getMedications });
export const useRoundDosesQuery = () => useQuery({ queryKey: medicationKeys.round, queryFn: getRoundDoses });
export const useHistoryQuery = () => useQuery({ queryKey: medicationKeys.history, queryFn: getHistoryDoses });
export const usePrnQuery = () => useQuery({ queryKey: medicationKeys.prn, queryFn: getPrnRecords });
export const useControlledQuery = () => useQuery({ queryKey: medicationKeys.controlled, queryFn: getControlledData });
export const useAuditReportsQuery = () => useQuery({ queryKey: medicationKeys.reports, queryFn: getAuditReports });

/** The joined round (dose + medication + patient + derived state), shared by the round, alerts and stats. */
export function useRoundRows() {
  const patientsQ = useMedicationPatientsQuery();
  const medsQ = useMedicationsQuery();
  const dosesQ = useRoundDosesQuery();
  const rows = useMemo(
    () => buildRoundRows(dosesQ.data ?? [], medsQ.data ?? [], patientsQ.data ?? [], MEDICATION_MOCK_NOW),
    [dosesQ.data, medsQ.data, patientsQ.data],
  );
  return {
    rows, patients: patientsQ.data ?? [], medications: medsQ.data ?? [], now: MEDICATION_MOCK_NOW,
    isLoading: patientsQ.isLoading || medsQ.isLoading || dosesQ.isLoading,
  };
}
