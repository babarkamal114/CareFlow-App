"use client";

import {
  MEDICATION_CURRENT_USER, MEDICATION_MOCK_NOW, useGetMedicationPatientsApi, useGetMedicationsApi, useGetPrnRecordsApi,
  useRecordPrnApi, useRecordPrnFollowUpApi,
} from "lib";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { PrnFollowUpFormData, PrnFormData, PrnRow } from "types";
import { getPrnFollowUpState, getPrnUsage } from "utils";

export function usePrnProtocols() {
  const patientsQ = useGetMedicationPatientsApi();
  const medsQ = useGetMedicationsApi();
  const prnQ = useGetPrnRecordsApi();
  const recordPrn = useRecordPrnApi();
  const recordFollowUp = useRecordPrnFollowUpApi();
  const now = MEDICATION_MOCK_NOW;

  const [recordOpen, setRecordOpen] = useState(false);
  const [followUpId, setFollowUpId] = useState<string | null>(null);

  const patients = patientsQ.data ?? [];
  const medications = medsQ.data ?? [];
  const records = prnQ.data ?? [];
  const prnMeds = useMemo(() => medications.filter((m) => m.type === "prn" && m.active), [medications]);

  const rows: PrnRow[] = useMemo(() => {
    const medById = new Map(medications.map((m) => [m.id, m]));
    const patientById = new Map(patients.map((p) => [p.id, p]));
    return records
      .flatMap((record) => {
        const medication = medById.get(record.medicationId);
        const patient = patientById.get(record.patientId);
        return medication && patient ? [{ record, medication, patient, state: getPrnFollowUpState(record, now) }] : [];
      })
      .sort((a, b) => b.record.administeredAt.getTime() - a.record.administeredAt.getTime());
  }, [records, medications, patients, now]);

  const followUpRow = rows.find((r) => r.record.id === followUpId) ?? null;

  const getLimits = (medicationId: string) => {
    const med = medications.find((m) => m.id === medicationId);
    const usage = getPrnUsage(records, medicationId, now);
    return { minIntervalHours: med?.prnMinIntervalHours ?? 0, maxPer24h: med?.prnMaxPer24h ?? 99, ...usage, now };
  };

  const submitPrn = (data: PrnFormData) => {
    recordPrn.mutate(
      { data, recordedBy: MEDICATION_CURRENT_USER },
      {
        onSuccess: () => {
          setRecordOpen(false);
          toast.success("PRN dose recorded — effectiveness check due in 30–60 minutes");
        },
      },
    );
  };

  const submitFollowUp = (data: PrnFollowUpFormData) => {
    if (!followUpId) return;
    recordFollowUp.mutate(
      { id: followUpId, data, recordedBy: MEDICATION_CURRENT_USER },
      {
        onSuccess: () => {
          setFollowUpId(null);
          toast.success("Effectiveness check recorded");
        },
      },
    );
  };

  return {
    rows, prnMeds, patients, medications, now,
    isLoading: patientsQ.isLoading || medsQ.isLoading || prnQ.isLoading,
    recordOpen, setRecordOpen, getLimits,
    submitPrn, isSavingPrn: recordPrn.isPending,
    followUpRow, openFollowUp: (id: string) => setFollowUpId(id), closeFollowUp: () => setFollowUpId(null),
    submitFollowUp, isSavingFollowUp: recordFollowUp.isPending,
  };
}