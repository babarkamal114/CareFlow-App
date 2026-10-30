"use client";

import {
  MEDICATION_CURRENT_USER, MEDICATION_MOCK_NOW, useGetControlledDataApi, useGetMedicationPatientsApi, useGetMedicationsApi,
  useRecordControlledEntryApi,
} from "lib";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { ControlledEntryFormData, ControlledItem } from "types";
import { buildControlledLedgerCsv, downloadMedicationFile, getStockDiscrepancy } from "utils";

export function useControlledDrugs() {
  const controlledQ = useGetControlledDataApi();
  const medsQ = useGetMedicationsApi();
  const patientsQ = useGetMedicationPatientsApi();
  const recordEntry = useRecordControlledEntryApi();
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

  const submit = (data: ControlledEntryFormData) => {
    if (!medicationId) return;
    recordEntry.mutate(
      { medicationId, data, recordedBy: MEDICATION_CURRENT_USER },
      {
        onSuccess: () => {
          setMedicationId(null);
          toast.success("Controlled drug entry recorded");
        },
      },
    );
  };

  const exportLedger = () => {
    downloadMedicationFile("controlled-drugs-ledger.csv", buildControlledLedgerCsv(entries, medications, patients, now));
    toast.success("Ledger exported");
  };

  return {
    items, entries: sortedEntries, medications, patients, now,
    isLoading: controlledQ.isLoading || medsQ.isLoading || patientsQ.isLoading,
    target, openEntry: (id: string) => setMedicationId(id), closeEntry: () => setMedicationId(null),
    submit, isSaving: recordEntry.isPending, currentUser: MEDICATION_CURRENT_USER,
    exportLedger,
  };
}
