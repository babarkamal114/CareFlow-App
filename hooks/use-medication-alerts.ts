"use client";

import {
  MEDICATION_MOCK_NOW, mockInteractionRules, useGetControlledDataApi, useGetMedicationHistoryApi, useGetPrnRecordsApi,
} from "lib";
import { useMemo, useState } from "react";
import type { MedAlertSeverity } from "types";
import { buildMedicationAlerts } from "utils";
import { useRoundRows } from "./use-round-rows";

export function useMedicationAlerts() {
  const { rows, patients, medications, isLoading: roundLoading } = useRoundRows();
  const historyQ = useGetMedicationHistoryApi();
  const prnQ = useGetPrnRecordsApi();
  const controlledQ = useGetControlledDataApi();
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());
  const [severity, setSeverity] = useState<MedAlertSeverity | "all">("all");

  const all = useMemo(
    () => buildMedicationAlerts({
      rows, history: historyQ.data ?? [], medications, patients, prn: prnQ.data ?? [], stock: controlledQ.data?.stock ?? [],
      rules: mockInteractionRules, now: MEDICATION_MOCK_NOW,
    }),
    [rows, historyQ.data, medications, patients, prnQ.data, controlledQ.data],
  );

  const open = useMemo(() => all.filter((a) => !acknowledged.has(a.id)), [all, acknowledged]);
  const visible = useMemo(() => open.filter((a) => severity === "all" || a.severity === severity), [open, severity]);
  const patientName = (id: string) => patients.find((p) => p.id === id)?.name ?? "Patient";

  return {
    alerts: open, visible, severity, setSeverity, patientName,
    urgentCount: open.filter((a) => a.severity === "urgent").length,
    escalationCount: open.filter((a) => a.kind === "omission-escalation").length,
    acknowledgedCount: acknowledged.size,
    isLoading: roundLoading || historyQ.isLoading || prnQ.isLoading || controlledQ.isLoading,
    acknowledge: (id: string) => setAcknowledged((prev) => new Set(prev).add(id)),
    restoreAcknowledged: () => setAcknowledged(new Set()),
  };
}
