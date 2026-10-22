"use client";

import { toast } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MEDICATION_CURRENT_USER, MEDICATION_MOCK_NOW, recordControlledEntry } from "lib";
import { useMemo, useState } from "react";
import type { ControlledEntryFormData, ControlledItem } from "types";
import { buildControlledLedgerCsv, downloadMedicationFile, getStockDiscrepancy } from "utils";
import { medicationKeys, useControlledQuery, useMedicationPatientsQuery, useMedicationsQuery } from "./use-medication-queries";

export function useControlledDrugs() {
  const qc = useQueryClient();
  const controlledQ = useControlledQuery();
  const medsQ = useMedicationsQuery();
  const patientsQ = useMedicationPatientsQuery();
  const now = MEDICATION_MOCK_NOW;
  const [medicationId, setMedicationId] = useState<string | null>(null);

  const medications = medsQ.data ?? [];
  const patients = patientsQ.data ?? [];
  const entries = controlledQ.data?.entries ?? [];

  const items: ControlledItem[] = useMemo(() => {
    const medById = new Map(medications.map((m) => [m.id, m]));
    const patientById = new Map(patients.map((p) => [p.id, p]));
    return (controlledQ.data?.stock ?? []).flatMap((stock) => {
      const medication = medById.get(stock.medicationId);
      const patient = medication ? patientById.get(medication.patientId) : undefined;
      return medication?.active && patient ? [{ stock, medication, patient, discrepancy: getStockDiscrepancy(stock) }] : [];
    });
  }, [controlledQ.data, medications, patients]);

  const sortedEntries = useMemo(() => [...entries].sort((a, b) => b.at.getTime() - a.at.getTime()), [entries]);
  const target = items.find((i) => i.medication.id === medicationId) ?? null;

  const mutation = useMutation({
    mutationFn: recordControlledEntry,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: medicationKeys.controlled });
      setMedicationId(null);
      toast.success("Controlled drug entry recorded");
    },
    onError: () => toast.error("Could not record the entry."),
  });

  return {
    items, entries: sortedEntries, medications, patients, now, isLoading: controlledQ.isLoading || medsQ.isLoading || patientsQ.isLoading,
    target, openEntry: (id: string) => setMedicationId(id), closeEntry: () => setMedicationId(null),
    submit: (data: ControlledEntryFormData) => medicationId && mutation.mutate({ medicationId, data, recordedBy: MEDICATION_CURRENT_USER }),
    isSaving: mutation.isPending, currentUser: MEDICATION_CURRENT_USER,
    exportLedger: () => {
      downloadMedicationFile("controlled-drugs-ledger.csv", buildControlledLedgerCsv(entries, medications, patients, now));
      toast.success("Ledger exported");
    },
  };
}
