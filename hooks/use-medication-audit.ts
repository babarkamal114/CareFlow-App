"use client";

import {
  MEDICATION_MOCK_NOW, useGenerateAuditReportApi, useGetAuditReportsApi, useGetMedicationHistoryApi, useGetMedicationPatientsApi,
  useGetMedicationsApi,
} from "lib";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  buildAuditSummary, buildDailyRates, buildMedicationAuditCsv, buildOmissionReasons, buildRefusalPatterns, downloadMedicationFile, findGaps,
} from "utils";

export function useMedicationAudit() {
  const historyQ = useGetMedicationHistoryApi();
  const medsQ = useGetMedicationsApi();
  const patientsQ = useGetMedicationPatientsApi();
  const reportsQ = useGetAuditReportsApi();
  const generateReport = useGenerateAuditReportApi();
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

  const generate = () => {
    generateReport.mutate(undefined, {
      onSuccess: () => {
        exportCsv();
        toast.success("Audit report generated");
      },
    });
  };

  return {
    summary, daily, reasons, patterns, gaps, reports: reportsQ.data ?? [], now,
    isLoading: historyQ.isLoading || medsQ.isLoading || patientsQ.isLoading,
    generate, isGenerating: generateReport.isPending, exportCsv,
    downloadReport: exportCsv,
  };
}
