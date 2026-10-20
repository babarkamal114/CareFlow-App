"use client";

import { MEDICATION_MOCK_NOW, mockInteractionRules } from "lib";
import { useMemo, useState } from "react";
import type { MedAlertSeverity } from "types";
import { buildMedicationAlerts } from "utils";
import { useControlledQuery, useHistoryQuery, usePrnQuery, useRoundRows } from "./use-medication-queries";

export function useMedicationAlerts() {
  const { rows, patients, medications, isLoading: roundLoading } = useRoundRows();
  const historyQ = useHistoryQuery();
  const prnQ = usePrnQuery();
  const controlledQ = useControlledQuery();
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
