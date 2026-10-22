"use client";

import { toast } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MEDICATION_CURRENT_USER, MEDICATION_MOCK_NOW, recordPrn, recordPrnFollowUp } from "lib";
import { useMemo, useState } from "react";
import type { PrnFollowUpFormData, PrnFormData, PrnRow } from "types";
import { getPrnFollowUpState, getPrnUsage } from "utils";
import { medicationKeys, useMedicationPatientsQuery, useMedicationsQuery, usePrnQuery } from "./use-medication-queries";

export function usePrnProtocols() {
  const qc = useQueryClient();
  const patientsQ = useMedicationPatientsQuery();
  const medsQ = useMedicationsQuery();
  const prnQ = usePrnQuery();
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

  /** Limits the zod schema enforces for the chosen PRN medication. */
  const getLimits = (medicationId: string) => {
    const med = medications.find((m) => m.id === medicationId);
    const usage = getPrnUsage(records, medicationId, now);
    return { minIntervalHours: med?.prnMinIntervalHours ?? 0, maxPer24h: med?.prnMaxPer24h ?? 99, ...usage, now };
  };

  const recordMutation = useMutation({
    mutationFn: recordPrn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: medicationKeys.prn });
      setRecordOpen(false);
      toast.success("PRN dose recorded — effectiveness check due in 30–60 minutes");
    },
    onError: () => toast.error("Could not record the PRN dose."),
  });

  const followUpMutation = useMutation({
    mutationFn: recordPrnFollowUp,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: medicationKeys.prn });
      setFollowUpId(null);
      toast.success("Effectiveness check recorded");
    },
    onError: () => toast.error("Could not save the check."),
  });

  return {
    rows, prnMeds, patients, medications, now, isLoading: patientsQ.isLoading || medsQ.isLoading || prnQ.isLoading,
    recordOpen, setRecordOpen, getLimits,
    submitPrn: (data: PrnFormData) => recordMutation.mutate({ data, recordedBy: MEDICATION_CURRENT_USER }),
    isSavingPrn: recordMutation.isPending,
    followUpRow, openFollowUp: (id: string) => setFollowUpId(id), closeFollowUp: () => setFollowUpId(null),
    submitFollowUp: (data: PrnFollowUpFormData) => followUpId && followUpMutation.mutate({ id: followUpId, data, recordedBy: MEDICATION_CURRENT_USER }),
    isSavingFollowUp: followUpMutation.isPending,
  };
}
