"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Textarea } from "@/components/ui";
import { parseRecipients, validateSchedule } from "lib";
import { useState } from "react";
import type { LibraryReport, ReportFormErrors, ReportSchedule, ReportScheduleFormData, ReportScheduleFrequency } from "types";
import { computeReportNextRun, formatReportRun, REPORT_FREQUENCY_OPTIONS, REPORT_WEEKDAY_OPTIONS } from "utils";
import { ReportField } from "./report-field";
import { ReportSelect } from "./report-select";

interface ReportScheduleDialogProps {
  open: boolean; onOpenChange: (open: boolean) => void; reports: LibraryReport[]; initialReportId: string | null;
  schedule: ReportSchedule | null; now: Date; isSaving: boolean; onSubmit: (data: ReportScheduleFormData) => void;
}

export function ReportScheduleDialog({ open, onOpenChange, ...rest }: ReportScheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg"><ScheduleForm {...rest} onCancel={() => onOpenChange(false)} /></DialogContent>
    </Dialog>
  );
}

function ScheduleForm({ reports, initialReportId, schedule, now, isSaving, onSubmit, onCancel }: Omit<ReportScheduleDialogProps, "open" | "onOpenChange"> & { onCancel: () => void }) {
  const [form, setForm] = useState<ReportScheduleFormData>({
    reportId: schedule?.reportId ?? initialReportId ?? "", frequency: schedule?.frequency ?? "monthly", time: schedule?.time ?? "07:00",
    dayOfWeek: schedule?.dayOfWeek ?? 1, dayOfMonth: schedule?.dayOfMonth ?? 1, recipients: schedule?.recipients.join(", ") ?? "",
  });
  const [errors, setErrors] = useState<ReportFormErrors>({});
  const update = <K extends keyof ReportScheduleFormData>(k: K, v: ReportScheduleFormData[K]) => setForm((p) => ({ ...p, [k]: v }));

  const next = form.frequency && /^\d{2}:\d{2}$/.test(form.time)
    ? computeReportNextRun(form.frequency as ReportScheduleFrequency, form.time, form.dayOfWeek === "" ? undefined : form.dayOfWeek, form.dayOfMonth === "" ? undefined : form.dayOfMonth, now)
    : null;

  const handleSubmit = () => {
    const found = validateSchedule(form);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">{schedule ? "Edit schedule" : "Schedule a report"}</DialogTitle>
        <DialogDescription>The report runs automatically and is emailed to the recipients.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <ReportField label="Report" required htmlFor="sch-report" error={errors.reportId}>
          <ReportSelect id="sch-report" value={form.reportId} options={reports.map((r) => ({ value: r.id, label: r.title }))} onChange={(v) => update("reportId", v)} invalid={Boolean(errors.reportId)} placeholder="Choose a report" />
        </ReportField>

        <div className="grid grid-cols-3 gap-3">
          <ReportField label="How often" required htmlFor="sch-freq" error={errors.frequency}>
            <ReportSelect id="sch-freq" value={form.frequency} options={REPORT_FREQUENCY_OPTIONS} onChange={(v) => update("frequency", v)} invalid={Boolean(errors.frequency)} />
          </ReportField>
          {form.frequency === "weekly" && (
            <ReportField label="Day" required htmlFor="sch-dow" error={errors.dayOfWeek}>
              <ReportSelect id="sch-dow" value={form.dayOfWeek === "" ? "" : String(form.dayOfWeek)} options={REPORT_WEEKDAY_OPTIONS} onChange={(v) => update("dayOfWeek", Number(v))} invalid={Boolean(errors.dayOfWeek)} />
            </ReportField>
          )}
          {form.frequency === "monthly" && (
            <ReportField label="Day of month" required htmlFor="sch-dom" error={errors.dayOfMonth}>
              <Input id="sch-dom" type="number" min="1" max="28" value={form.dayOfMonth} aria-invalid={Boolean(errors.dayOfMonth)} onChange={(e) => update("dayOfMonth", e.target.value === "" ? "" : Number(e.target.value))} />
            </ReportField>
          )}
          <ReportField label="Time" required htmlFor="sch-time" error={errors.time}>
            <Input id="sch-time" type="time" value={form.time} aria-invalid={Boolean(errors.time)} onChange={(e) => update("time", e.target.value)} />
          </ReportField>
        </div>

        <ReportField label="Recipients" required htmlFor="sch-to" error={errors.recipients} hint={`${parseRecipients(form.recipients).length} recipient(s) · separate email addresses with commas`}>
          <Textarea id="sch-to" rows={2} value={form.recipients} placeholder="manager@careflow.dev, owner@careflow.dev" aria-invalid={Boolean(errors.recipients)} onChange={(e) => update("recipients", e.target.value)} />
        </ReportField>
        {next && <p className="rounded-lg border border-cf-border-light bg-cf-surface-muted/50 p-3 text-xs text-cf-ink-80">Next run: <strong>{formatReportRun(next)}</strong></p>}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? "Saving…" : schedule ? "Save changes" : "Schedule report"}</Button>
      </DialogFooter>
    </>
  );
}
