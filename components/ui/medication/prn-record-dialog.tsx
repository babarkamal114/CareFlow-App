"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input } from "@/components/ui";
import { validatePrn, type PrnLimits } from "lib";
import { useState } from "react";
import type { MedFormErrors, Medication, MedicationPatient, PrnFormData } from "types";
import { formatMedDateTime } from "utils";
import { MedField } from "./med-field";
import { MedFilterPill } from "./med-filter-pill";
import { MedSelect } from "./med-select";

const QUICK_REASONS = ["Pain", "Headache", "Anxiety / agitation", "Constipation", "Nausea"];

interface PrnRecordDialogProps {
  open: boolean; onOpenChange: (open: boolean) => void; prnMeds: Medication[]; patients: MedicationPatient[]; now: Date;
  getLimits: (medicationId: string) => PrnLimits; isSaving: boolean; onSubmit: (data: PrnFormData) => void;
}

export function PrnRecordDialog({ open, onOpenChange, ...rest }: PrnRecordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg"><PrnForm {...rest} onCancel={() => onOpenChange(false)} /></DialogContent>
    </Dialog>
  );
}

function PrnForm({ prnMeds, patients, now, getLimits, isSaving, onSubmit, onCancel }: Omit<PrnRecordDialogProps, "open" | "onOpenChange"> & { onCancel: () => void }) {
  const [form, setForm] = useState<PrnFormData>({ medicationId: "", reason: "", doseGiven: "" });
  const [errors, setErrors] = useState<MedFormErrors>({});
  const med = prnMeds.find((m) => m.id === form.medicationId);
  const limits = med ? getLimits(med.id) : null;
  const patientName = (id: string) => patients.find((p) => p.id === id)?.name ?? "";

  const chooseMedication = (id: string) => setForm((p) => ({ ...p, medicationId: id, doseGiven: prnMeds.find((m) => m.id === id)?.strength ?? "" }));
  const handleSubmit = () => {
    const next = validatePrn(form, limits ?? { minIntervalHours: 0, maxPer24h: 99, lastAdministeredAt: null, countLast24h: 0, now });
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">Record PRN dose</DialogTitle>
        <DialogDescription>As-needed medication: record why it was given. An effectiveness check follows in 30–60 minutes.</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <MedField label="Medication" required htmlFor="prn-med" error={errors.medicationId}>
          <MedSelect id="prn-med" value={form.medicationId} options={prnMeds.map((m) => ({ value: m.id, label: `${patientName(m.patientId)} — ${m.drugName} ${m.strength}` }))} onChange={chooseMedication} invalid={Boolean(errors.medicationId)} placeholder="Choose a PRN medication" />
        </MedField>

        {limits && med && (
          <div className="rounded-lg border border-cf-border-light bg-cf-surface-muted/50 p-3 text-xs text-cf-ink-80">
            Minimum {med.prnMinIntervalHours}h between doses · maximum {med.prnMaxPer24h} per 24h · {limits.countLast24h} given in the last 24h
            {limits.lastAdministeredAt ? ` · last given ${formatMedDateTime(limits.lastAdministeredAt, now)}` : ""}
          </div>
        )}
        {errors.form && <p role="alert" className="rounded-lg border border-error/20 bg-error-muted p-3 text-sm text-error">{errors.form}</p>}

        <MedField label="Reason for giving" required htmlFor="prn-reason" error={errors.reason}>
          <Input id="prn-reason" value={form.reason} placeholder="e.g. Hip pain after walking" aria-invalid={Boolean(errors.reason)} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {QUICK_REASONS.map((r) => <MedFilterPill key={r} label={r} active={form.reason === r} onClick={() => setForm((p) => ({ ...p, reason: r }))} />)}
          </div>
        </MedField>
        <MedField label="Dose given" required htmlFor="prn-dose" error={errors.doseGiven}>
          <Input id="prn-dose" value={form.doseGiven} placeholder="e.g. 500mg" aria-invalid={Boolean(errors.doseGiven)} onChange={(e) => setForm((p) => ({ ...p, doseGiven: e.target.value }))} />
        </MedField>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? "Saving…" : "Record dose"}</Button>
      </DialogFooter>
    </>
  );
}
