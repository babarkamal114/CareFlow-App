"use client";

import { MEDICATION_CURRENT_USER, useRecordDoseApi } from "lib";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { RecordDoseFormData, RoundFilters, RoundRow } from "types";
import { buildMedicationRoundCsv, downloadMedicationFile, filterRoundRows, summarizeRound } from "utils";
import { useRoundRows } from "./use-round-rows";

const INITIAL_FILTERS: RoundFilters = { search: "", status: "all", patientId: "all" };

export function useMedicationRound() {
  const { rows, patients, now, isLoading } = useRoundRows();
  const recordDose = useRecordDoseApi();
  const [filters, setFilters] = useState<RoundFilters>(INITIAL_FILTERS);
  const [targetId, setTargetId] = useState<string | null>(null);

  const filtered = useMemo(() => filterRoundRows(rows, filters), [rows, filters]);
  const summary = useMemo(() => summarizeRound(rows), [rows]);
  const target = rows.find((r) => r.dose.id === targetId) ?? null;

  const submit = (data: RecordDoseFormData) => {
    if (!target) return;
    recordDose.mutate(
      { doseId: target.dose.id, data, recordedBy: MEDICATION_CURRENT_USER },
      {
        onSuccess: () => {
          setTargetId(null);
          toast.success("Dose recorded");
        },
      },
    );
  };

  const exportRound = () => {
    downloadMedicationFile("medication-round.csv", buildMedicationRoundCsv(filtered));
    toast.success(`${filtered.length} doses exported`);
  };

  return {
    rows, filtered, summary, patients, now, isLoading,
    filters, setFilters, resetFilters: () => setFilters(INITIAL_FILTERS),
    target, openRecord: (row: RoundRow) => setTargetId(row.dose.id), closeRecord: () => setTargetId(null),
    submit, isSaving: recordDose.isPending, currentUser: MEDICATION_CURRENT_USER,
    exportRound,
  };
}
