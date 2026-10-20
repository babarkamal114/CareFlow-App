"use client";

import { toast } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MEDICATION_MOCK_NOW, generateAuditReport } from "lib";
import { useMemo } from "react";
import {
  buildAuditSummary, buildDailyRates, buildMedicationAuditCsv, buildOmissionReasons, buildRefusalPatterns, downloadMedicationFile, findGaps,
} from "utils";
import { medicationKeys, useAuditReportsQuery, useHistoryQuery, useMedicationPatientsQuery, useMedicationsQuery } from "./use-medication-queries";

export function useMedicationAudit() {
  const qc = useQueryClient();
  const historyQ = useHistoryQuery();
  const medsQ = useMedicationsQuery();
  const patientsQ = useMedicationPatientsQuery();
  const reportsQ = useAuditReportsQuery();
  const now = MEDICATION_MOCK_NOW;

  const history = historyQ.data ?? [];
  const medications = medsQ.data ?? [];
  const patients = patientsQ.data ?? [];

  const summary = useMemo(() => buildAuditSummary(history), [history]);
  const daily = useMemo(() => buildDailyRates(history), [history]);
  const reasons = useMemo(() => buildOmissionReasons(history), [history]);
  const patterns = useMemo(() => buildRefusalPatterns(history, medications, patients), [history, medications, patients]);
  const gaps = useMemo(() => findGaps(history, medications, patients), [history, medications, patients]);

  const exportCsv = () => {
    downloadMedicationFile("mar-audit.csv", buildMedicationAuditCsv(summary, reasons, patterns, gaps, now));
    toast.success("MAR audit exported");
  };

  const generateMutation = useMutation({
    mutationFn: generateAuditReport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: medicationKeys.reports });
      exportCsv();
      toast.success("Audit report generated");
    },
    onError: () => toast.error("Could not generate the report."),
  });

  return {
    summary, daily, reasons, patterns, gaps, reports: reportsQ.data ?? [], now,
    isLoading: historyQ.isLoading || medsQ.isLoading || patientsQ.isLoading,
    generate: () => generateMutation.mutate(), isGenerating: generateMutation.isPending, exportCsv,
    downloadReport: () => exportCsv(),
  };
}
