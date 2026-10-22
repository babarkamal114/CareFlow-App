"use client";
import { toast } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MEDICATION_CURRENT_USER, recordDose } from "lib";
import { useMemo, useState } from "react";
import type { RecordDoseFormData, RoundFilters, RoundRow } from "types";
import { buildMedicationRoundCsv, downloadMedicationFile, filterRoundRows, summarizeRound } from "utils";
import { medicationKeys, useRoundRows } from "./use-medication-queries";

const INITIAL_FILTERS: RoundFilters = { search: "", status: "all", patientId: "all" };

export function useMedicationRound() {
  const qc = useQueryClient();
  const { rows, patients, now, isLoading } = useRoundRows();
  const [filters, setFilters] = useState<RoundFilters>(INITIAL_FILTERS);
  const [targetId, setTargetId] = useState<string | null>(null);

  const filtered = useMemo(() => filterRoundRows(rows, filters), [rows, filters]);
  const summary = useMemo(() => summarizeRound(rows), [rows]);
  const target = rows.find((r) => r.dose.id === targetId) ?? null;

  const mutation = useMutation({
    mutationFn: recordDose,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: medicationKeys.round });
      qc.invalidateQueries({ queryKey: medicationKeys.controlled }); // controlled drug stock moves on administration
      setTargetId(null);
      toast.success("Dose recorded");
    },
    onError: () => toast.error("Could not record the dose. Please try again."),
  });

  const submit = (data: RecordDoseFormData) => {
    if (target) mutation.mutate({ doseId: target.dose.id, data, recordedBy: MEDICATION_CURRENT_USER });
  };

  return {
    rows, filtered, summary, patients, now, isLoading, filters, setFilters, resetFilters: () => setFilters(INITIAL_FILTERS),
    target, openRecord: (row: RoundRow) => setTargetId(row.dose.id), closeRecord: () => setTargetId(null),
    submit, isSaving: mutation.isPending, currentUser: MEDICATION_CURRENT_USER,
    exportRound: () => {
      downloadMedicationFile("medication-round.csv", buildMedicationRoundCsv(filtered));
      toast.success(`${filtered.length} doses exported`);
    },
  };
}
