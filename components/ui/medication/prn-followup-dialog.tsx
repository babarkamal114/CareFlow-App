"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Textarea } from "@/components/ui";
import { validatePrnFollowUp } from "lib";
import { useState } from "react";
import type { MedFormErrors, PrnEffectiveness, PrnFollowUpFormData, PrnRow } from "types";
import { EFFECTIVENESS_OPTIONS, formatMedDateTime, getDrugLabel } from "utils";
import { MedField } from "./med-field";
import { MedSelect } from "./med-select";

interface PrnFollowUpDialogProps { row: PrnRow | null; now: Date; isSaving: boolean; onClose: () => void; onSubmit: (data: PrnFollowUpFormData) => void }

export function PrnFollowUpDialog({ row, onClose, ...rest }: PrnFollowUpDialogProps) {
  return (
    <Dialog open={row !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">{row && <FollowUpForm row={row} onClose={onClose} {...rest} />}</DialogContent>
    </Dialog>
  );
}

function FollowUpForm({ row, now, isSaving, onClose, onSubmit }: Omit<PrnFollowUpDialogProps, "row"> & { row: PrnRow }) {
  const [form, setForm] = useState<PrnFollowUpFormData>({ effectiveness: "", note: "" });
  const [errors, setErrors] = useState<MedFormErrors>({});
  const handleSubmit = () => {
    const next = validatePrnFollowUp(form);
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">Effectiveness check</DialogTitle>
        <DialogDescription>{row.patient.name} · {getDrugLabel(row.medication)} for {row.record.reason.toLowerCase()} · given {formatMedDateTime(row.record.administeredAt, now)}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <MedField label="Did it help?" required htmlFor="fu-eff" error={errors.effectiveness}>
          <MedSelect id="fu-eff" value={form.effectiveness} options={EFFECTIVENESS_OPTIONS} onChange={(v: PrnEffectiveness) => setForm((p) => ({ ...p, effectiveness: v }))} invalid={Boolean(errors.effectiveness)} />
        </MedField>
        <MedField label="Note" htmlFor="fu-note" error={errors.note}>
          <Textarea id="fu-note" rows={2} value={form.note} placeholder="Optional — what changed for the patient" onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
        </MedField>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? "Saving…" : "Save check"}</Button>
      </DialogFooter>
    </>
  );
}
