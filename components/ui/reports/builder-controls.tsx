"use client";

import { DatePicker } from "@/components/ui";
import { format } from "date-fns";
import type { ReportBuilderAggregate, ReportBuilderConfig, ReportChartKind, ReportDataset, ReportFormErrors } from "types";
import { REPORT_AGGREGATE_OPTIONS, REPORT_CHART_KIND_OPTIONS, parseReportDate } from "utils";
import { ReportField } from "./report-field";
import { ReportSelect } from "./report-select";

interface BuilderControlsProps { dataset: ReportDataset; config: ReportBuilderConfig; errors: ReportFormErrors; onChange: <K extends keyof ReportBuilderConfig>(key: K, value: ReportBuilderConfig[K]) => void }

const iso = (d: Date | undefined) => (d ? format(d, "yyyy-MM-dd") : "");

export function BuilderControls({ dataset, config, errors, onChange }: BuilderControlsProps) {
  const groupable = [{ value: "none", label: "No grouping" }, ...dataset.columns.filter((c) => c.groupable).map((c) => ({ value: c.key, label: c.label }))];
  const hasDate = dataset.columns.some((c) => c.dateKey);
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <ReportField label="Group by" htmlFor="b-group" error={errors.groupBy}>
        <ReportSelect id="b-group" value={config.groupBy || "none"} options={groupable} onChange={(v) => onChange("groupBy", v === "none" ? "" : v)} />
      </ReportField>
      <ReportField label="Measure" htmlFor="b-agg" hint={config.groupBy ? undefined : "Applies when grouping"}>
        <ReportSelect id="b-agg" value={config.aggregate} options={REPORT_AGGREGATE_OPTIONS} onChange={(v: ReportBuilderAggregate) => onChange("aggregate", v)} disabled={!config.groupBy} />
      </ReportField>
      <ReportField label="Chart" htmlFor="b-chart">
        <ReportSelect id="b-chart" value={config.chart} options={REPORT_CHART_KIND_OPTIONS} onChange={(v: ReportChartKind) => onChange("chart", v)} />
      </ReportField>
      {hasDate && (
        <>
          <ReportField label="From date" htmlFor="b-from">
            <DatePicker id="b-from" className="w-full min-w-0" value={parseReportDate(config.from)} onChange={(d) => onChange("from", iso(d))} />
          </ReportField>
          <ReportField label="To date" htmlFor="b-to" error={errors.to}>
            <DatePicker id="b-to" className="w-full min-w-0" value={parseReportDate(config.to)} onChange={(d) => onChange("to", iso(d))} />
          </ReportField>
        </>
      )}
    </div>
  );
}
