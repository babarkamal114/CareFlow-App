"use client";

import {
  BuilderControls, BuilderFieldPicker, Button, Card, CardContent, CardHeader, CardTitle, EmptyState, ReportDatasetView, ReportExportMenu, ReportField,
  ReportSelect, ReportTemplateList, SaveTemplateDialog, Skeleton,
} from "@/components/ui";
import { useCustomReportBuilder } from "hooks";
import { RotateCcw, Save, Wrench } from "lucide-react";
import type { ReportRole } from "types";
import { ReportsSectionHeading } from "./ReportsSectionHeading";

const CARD = "rounded-2xl border-cf-border-light shadow-cf-sm";

export function ReportsBuilderSection({ role }: { role: ReportRole }) {
  const b = useCustomReportBuilder(role);

  return (
    <section className="space-y-3">
      <ReportsSectionHeading title="Custom report builder" description="Build your own report from any dataset you can access, then save it as a template." />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className={`${CARD} xl:col-span-2`}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="font-bold text-cf-ink">Builder</CardTitle>
              {b.dataset && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={b.reset}><RotateCcw />Reset</Button>
                  <ReportExportMenu onSelect={b.exportPreview} disabled={!b.result} />
                  <Button size="sm" onClick={() => b.setSaveOpen(true)} disabled={!b.result}><Save />Save template</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReportField label="Data source" htmlFor="b-source">
              <ReportSelect id="b-source" value={b.config.datasetId} options={b.sources.map((s) => ({ value: s.id, label: s.title }))} onChange={b.chooseSource} placeholder="Choose a dataset" />
            </ReportField>

            {b.isLoadingDataset && <Skeleton className="h-40 w-full rounded-xl" />}
            {!b.config.datasetId && <EmptyState icon={<Wrench />} title="Pick a data source" description="Choose a dataset above, then add the fields you want." />}

            {b.dataset && (
              <>
                <BuilderFieldPicker columns={b.dataset.columns} fields={b.config.fields} error={b.errors.fields} onToggle={b.toggleField} onMove={b.moveField} />
                <BuilderControls dataset={b.dataset} config={b.config} errors={b.errors} onChange={b.update} />
                <div className="border-t border-cf-border-light pt-4">
                  <p className="mb-2 text-xs font-semibold text-cf-ink-60 uppercase">Preview</p>
                  {b.result ? <ReportDatasetView columns={b.result.columns} rows={b.result.rows} chart={b.result.chart} mode="both" /> : <p className="py-6 text-center text-sm text-cf-ink-40">Fix the highlighted options to see the preview.</p>}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className={CARD}>
          <CardHeader><CardTitle className="font-bold text-cf-ink">Saved templates</CardTitle></CardHeader>
          <CardContent><ReportTemplateList templates={b.templates} onLoad={b.loadTemplate} onDelete={b.deleteTemplate} /></CardContent>
        </Card>
      </div>
      <SaveTemplateDialog open={b.saveOpen} onOpenChange={b.setSaveOpen} isSaving={b.isSaving} onSubmit={b.saveTemplate} />
    </section>
  );
}
