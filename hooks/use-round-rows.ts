"use client";

import { MEDICATION_MOCK_NOW, useGetMedicationPatientsApi, useGetMedicationsApi, useGetRoundDosesApi } from "lib";
import { useMemo } from "react";
import { buildRoundRows } from "utils";

export function useRoundRows() {
  const patientsQ = useGetMedicationPatientsApi();
  const medsQ = useGetMedicationsApi();
  const dosesQ = useGetRoundDosesApi();

  const rows = useMemo(
    () => buildRoundRows(dosesQ.data ?? [], medsQ.data ?? [], patientsQ.data ?? [], MEDICATION_MOCK_NOW),
    [dosesQ.data, medsQ.data, patientsQ.data],
  );

  return {
    rows,
    patients: patientsQ.data ?? [],
    medications: medsQ.data ?? [],
    now: MEDICATION_MOCK_NOW,
    isLoading: patientsQ.isLoading || medsQ.isLoading || dosesQ.isLoading,
  };
}
