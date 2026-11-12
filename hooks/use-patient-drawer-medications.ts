"use client";

import { MEDICATION_MOCK_NOW, useGetMedicationsApi } from "lib";
import { useMemo } from "react";
import { getDrawerMedicationSummary } from "app-utils/patient-medication-summary";

/** Medications for one patient, from the same source the Medications page uses. */
export function usePatientDrawerMedications(patientId: string | undefined) {
  const medsQ = useGetMedicationsApi();

  const summary = useMemo(
    () => getDrawerMedicationSummary((medsQ.data ?? []).filter((m) => m.patientId === patientId && m.active)),
    [medsQ.data, patientId],
  );

  return { ...summary, now: MEDICATION_MOCK_NOW, isLoading: medsQ.isLoading, isError: medsQ.isError };
}