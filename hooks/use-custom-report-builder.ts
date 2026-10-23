"use client";

import { toast } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReportTemplate, getReportDataset, saveReportTemplate } from "lib";
import { validateBuilderConfig } from "@/lib/validations/reports";
import { useMemo, useState } from "react";
import type { ReportBuilderConfig, ReportDataset, ReportExportFormat, ReportRole, ReportTemplate } from "types";
import { REPORT_DEFAULT_BUILDER_CONFIG, runCustomReport } from "utils";
import { useReportExport } from "./use-report-export";
import { reportKeys, useReportCatalogQuery, useReportDatasetQuery, useReportTemplatesQuery } from "./use-reports-queries";

export function useCustomReportBuilder(role: ReportRole) {
  const qc = useQueryClient();
  const catalogQ = useReportCatalogQuery();
  const templatesQ = useReportTemplatesQuery();
  const { exportReport } = useReportExport();
  const [config, setConfig] = useState<ReportBuilderConfig>(REPORT_DEFAULT_BUILDER_CONFIG);
  const [saveOpen, setSaveOpen] = useState(false);

  const sources = useMemo(() => (catalogQ.data ?? []).filter((d) => d.roles.includes(role)), [catalogQ.data, role]);
  const datasetQ = useReportDatasetQuery(config.datasetId || null);
  const dataset = datasetQ.data ?? null;
  const errors = useMemo(() => (dataset ? validateBuilderConfig(config, dataset.columns) : {}), [config, dataset]);
  const result = useMemo(() => (dataset && Object.keys(errors).length === 0 ? runCustomReport(dataset, config) : null), [dataset, config, errors]);
  const update = <K extends keyof ReportBuilderConfig>(key: K, value: ReportBuilderConfig[K]) => setConfig((p) => ({ ...p, [key]: value }));

  const chooseSource = (datasetId: string) => {
    setConfig({ ...REPORT_DEFAULT_BUILDER_CONFIG, datasetId });
    // pre-pick the first two columns so the preview shows something straight away
    qc.fetchQuery({ queryKey: reportKeys.dataset(datasetId), queryFn: () => getReportDataset(datasetId) })
      .then((ds) => setConfig((p) => (p.datasetId === datasetId ? { ...p, fields: ds.columns.slice(0, 2).map((c) => c.key) } : p)));
  };

  const toggleField = (key: string) => update("fields", config.fields.includes(key) ? config.fields.filter((k) => k !== key) : [...config.fields, key]);
  const moveField = (key: string, dir: -1 | 1) => {
    const i = config.fields.indexOf(key);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= config.fields.length) return;
    const next = [...config.fields];
    [next[i], next[j]] = [next[j], next[i]];
    update("fields", next);
  };

  const refreshTemplates = () => qc.invalidateQueries({ queryKey: reportKeys.templates });
  const saveMutation = useMutation({
    mutationFn: saveReportTemplate,
    onSuccess: () => { refreshTemplates(); qc.invalidateQueries({ queryKey: reportKeys.activity }); setSaveOpen(false); toast.success("Template saved"); },
    onError: () => toast.error("Could not save the template."),
  });
  const deleteMutation = useMutation({ mutationFn: deleteReportTemplate, onSuccess: () => { refreshTemplates(); toast.success("Template deleted"); } });

  const exportPreview = (format: ReportExportFormat) => {
    if (!dataset || !result) return;
    const custom: ReportDataset = { ...dataset, id: "custom", title: `Custom report: ${dataset.title}`, columns: result.columns, rows: result.rows, chart: result.chart };
    exportReport(format, custom.title, [custom]);
  };

  return {
    config, update, sources, dataset, isLoadingDataset: datasetQ.isLoading, errors, result, chooseSource, toggleField, moveField,
    reset: () => setConfig(REPORT_DEFAULT_BUILDER_CONFIG),
    templates: templatesQ.data ?? [], loadTemplate: (t: ReportTemplate) => { setConfig(t.config); toast.success(`Loaded "${t.name}"`); },
    deleteTemplate: (id: string) => deleteMutation.mutate(id),
    saveOpen, setSaveOpen, saveTemplate: (name: string) => saveMutation.mutate({ name, config }), isSaving: saveMutation.isPending, exportPreview,
  };
}
