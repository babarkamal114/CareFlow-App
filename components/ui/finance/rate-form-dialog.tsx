"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  StaffFormFieldRow,
} from "@/components/ui";
import { validateRate } from "lib";
import { useState } from "react";
import type { DayType, FinanceFormErrors, RateCardEntry, RateFormData, VisitDuration } from "types";
import { DAY_TYPE_OPTIONS, formatCurrency, VISIT_DURATIONS } from "utils";
import { FinanceSelect } from "./finance-select";

const DURATION_OPTIONS = VISIT_DURATIONS.map((d) => ({ value: String(d), label: `${d} minutes` }));

interface RateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the dialog edits this entry (length + day type are locked). */
  entry?: RateCardEntry | null;
  onSubmit: (data: RateFormData) => void;
}

export function RateFormDialog({ open, onOpenChange, entry, onSubmit }: RateFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <RateForm entry={entry ?? null} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function RateForm({
  entry,
  onSubmit,
  onCancel,
}: Pick<RateFormDialogProps, "onSubmit"> & { entry: RateCardEntry | null; onCancel: () => void }) {
  const [form, setForm] = useState<RateFormData>({
    durationMins: entry?.durationMins ?? "",
    dayType: entry?.dayType ?? "",
    rate: entry?.rate ?? "",
  });
  const [errors, setErrors] = useState<FinanceFormErrors>({});

  const update = <K extends keyof RateFormData>(key: K, value: RateFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const hourly =
    typeof form.rate === "number" && typeof form.durationMins === "number"
      ? form.rate / (form.durationMins / 60)
      : null;

  const handleSubmit = () => {
    const next = validateRate(form);
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">{entry ? "Edit rate" : "Add rate"}</DialogTitle>
        <DialogDescription>Price charged per visit, by visit length and day type.</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <StaffFormFieldRow label="Visit length" required htmlFor="rate-length" error={errors.durationMins}>
            <FinanceSelect
              id="rate-length"
              value={form.durationMins === "" ? "" : String(form.durationMins)}
              options={DURATION_OPTIONS}
              onChange={(v) => update("durationMins", Number(v) as VisitDuration)}
              invalid={Boolean(errors.durationMins)}
            />
          </StaffFormFieldRow>
          <StaffFormFieldRow label="Day type" required htmlFor="rate-day" error={errors.dayType}>
            <FinanceSelect
              id="rate-day"
              value={form.dayType}
              options={DAY_TYPE_OPTIONS}
              onChange={(v: DayType) => update("dayType", v)}
              invalid={Boolean(errors.dayType)}
            />
          </StaffFormFieldRow>
        </div>

        <StaffFormFieldRow
          label="Rate per visit"
          required
          htmlFor="rate-amount"
          error={errors.rate}
          hint={hourly !== null ? `Equivalent to ${formatCurrency(hourly)} per hour` : undefined}
        >
          <InputGroup className="h-10">
            <InputGroupAddon>£</InputGroupAddon>
            <InputGroupInput
              id="rate-amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={form.rate}
              aria-invalid={Boolean(errors.rate)}
              onChange={(e) => update("rate", e.target.value === "" ? "" : Number(e.target.value))}
            />
          </InputGroup>
        </StaffFormFieldRow>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>{entry ? "Save rate" : "Add rate"}</Button>
      </DialogFooter>
    </>
  );
}