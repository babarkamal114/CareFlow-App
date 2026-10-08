"use client";

import {
  Button,
  Checkbox,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  StaffFormFieldRow,
  Switch,
} from "@/components/ui";
import { validateGenerateInvoices } from "lib";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import type { BillingPeriodType, FinanceFormErrors, FundingSource, GenerateInvoicesFormData } from "types";
import { FUNDING_SOURCE_OPTIONS, PERIOD_TYPE_OPTIONS } from "utils";
import { FinanceSelect } from "./finance-select";

const PERIOD_DAYS: Record<BillingPeriodType, number> = { weekly: 7, fortnightly: 14, monthly: 30 };

function rangeFor(type: BillingPeriodType, asOf: Date) {
  const start = new Date(asOf);
  start.setDate(start.getDate() - (PERIOD_DAYS[type] - 1));
  return { periodStart: format(start, "yyyy-MM-dd"), periodEnd: format(asOf, "yyyy-MM-dd") };
}

const toIso = (d: Date | undefined) => (d ? format(d, "yyyy-MM-dd") : "");
const fromIso = (s: string) => (s ? parseISO(s) : undefined);

interface GenerateInvoicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asOf: Date;
  onSubmit: (data: GenerateInvoicesFormData) => void;
}

export function GenerateInvoicesDialog({ open, onOpenChange, asOf, onSubmit }: GenerateInvoicesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <GenerateInvoicesForm asOf={asOf} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function GenerateInvoicesForm({
  asOf,
  onSubmit,
  onCancel,
}: Pick<GenerateInvoicesDialogProps, "asOf" | "onSubmit"> & { onCancel: () => void }) {
  const [form, setForm] = useState<GenerateInvoicesFormData>({
    periodType: "fortnightly",
    ...rangeFor("fortnightly", asOf),
    fundingSources: ["private", "local-authority", "nhs-chc"],
    sendImmediately: false,
  });
  const [errors, setErrors] = useState<FinanceFormErrors>({});

  const update = <K extends keyof GenerateInvoicesFormData>(key: K, value: GenerateInvoicesFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePeriodType = (type: BillingPeriodType) =>
    setForm((prev) => ({ ...prev, periodType: type, ...rangeFor(type, asOf) }));

  const toggleFunding = (source: FundingSource, checked: boolean) =>
    update(
      "fundingSources",
      checked ? [...form.fundingSources, source] : form.fundingSources.filter((s) => s !== source),
    );

  const handleSubmit = () => {
    const next = validateGenerateInvoices(form);
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">Generate invoices</DialogTitle>
        <DialogDescription>
          Creates one invoice per patient and funder from confirmed visits in the period.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <StaffFormFieldRow label="Billing period" required htmlFor="gen-period" error={errors.periodType}>
          <FinanceSelect
            id="gen-period"
            value={form.periodType}
            options={PERIOD_TYPE_OPTIONS}
            onChange={handlePeriodType}
            invalid={Boolean(errors.periodType)}
          />
        </StaffFormFieldRow>

        <div className="grid grid-cols-2 gap-3">
          <StaffFormFieldRow label="From" required htmlFor="gen-start" error={errors.periodStart}>
            <DatePicker
              id="gen-start"
              className="w-full min-w-0"
              value={fromIso(form.periodStart)}
              onChange={(d) => update("periodStart", toIso(d))}
            />
          </StaffFormFieldRow>
          <StaffFormFieldRow label="To" required htmlFor="gen-end" error={errors.periodEnd}>
            <DatePicker
              id="gen-end"
              className="w-full min-w-0"
              value={fromIso(form.periodEnd)}
              onChange={(d) => update("periodEnd", toIso(d))}
            />
          </StaffFormFieldRow>
        </div>

        <StaffFormFieldRow label="Funding sources" required error={errors.fundingSources}>
          <div className="space-y-2">
            {FUNDING_SOURCE_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <Checkbox
                  id={`gen-fund-${option.value}`}
                  checked={form.fundingSources.includes(option.value)}
                  onCheckedChange={(checked) => toggleFunding(option.value, checked === true)}
                />
                <Label htmlFor={`gen-fund-${option.value}`} className="font-normal">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </StaffFormFieldRow>

        <div className="flex items-center justify-between rounded-lg border border-cf-border-light bg-cf-surface-muted/50 p-3">
          <div>
            <Label htmlFor="gen-send" className="text-sm">Send immediately</Label>
            <p className="mt-1 text-xs text-cf-ink-60">Otherwise invoices are saved as drafts for review.</p>
          </div>
          <Switch id="gen-send" checked={form.sendImmediately} onCheckedChange={(c) => update("sendImmediately", c)} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Generate invoices</Button>
      </DialogFooter>
    </>
  );
}