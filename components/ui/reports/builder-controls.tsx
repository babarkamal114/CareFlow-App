"use client";

import { DatePicker } from "@/components/ui";
import type { ReportBuilderAggregate, ReportChartKind, BuilderControlsProps } from "types";
import { parseReportDate, toIsoDate } from "utils";
import { REPORT_AGGREGATE_OPTIONS, REPORT_CHART_KIND_OPTIONS } from "config"
import { ReportField } from "./report-field";
import { ReportSelect } from "./report-select";

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
            <DatePicker id="b-from" className="w-full min-w-0" value={parseReportDate(config.from)} onChange={(d) => onChange("from", toIsoDate(d))} />
          </ReportField>
          <ReportField label="To date" htmlFor="b-to" error={errors.to}>
            <DatePicker id="b-to" className="w-full min-w-0" value={parseReportDate(config.to)} onChange={(d) => onChange("to", toIsoDate(d))} />
          </ReportField>
        </>
      )}
    </div>
  );
}
