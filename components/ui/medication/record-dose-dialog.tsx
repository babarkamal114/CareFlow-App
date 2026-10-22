"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Textarea } from "@/components/ui";
import { validateAdministration } from "lib";
import { ScanLine } from "lucide-react";
import { useState } from "react";
import type { AdministrationStatus, MedFormErrors, ReasonCode, RecordDoseFormData, RoundRow } from "types";
import { formatMedTime, getDrugLabel, isRecentlyChanged, OUTCOME_OPTIONS, REASON_OPTIONS } from "utils";
import { MedField } from "./med-field";
import { MedSelect } from "./med-select";

interface RecordDoseDialogProps {
  row: RoundRow | null; now: Date; recorder: string; isSaving: boolean; onClose: () => void; onSubmit: (data: RecordDoseFormData) => void;
}

export function RecordDoseDialog({ row, onClose, ...rest }: RecordDoseDialogProps) {
  return (
    <Dialog open={row !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg">{row && <RecordDoseForm row={row} onClose={onClose} {...rest} />}</DialogContent>
    </Dialog>
  );
}

function RecordDoseForm({ row, now, recorder, isSaving, onClose, onSubmit }: Omit<RecordDoseDialogProps, "row"> & { row: RoundRow }) {
  const m = row.medication;
  const [form, setForm] = useState<RecordDoseFormData>({ status: "administered", reasonCode: "", note: "", doseGiven: "", witness: "", barcode: "" });
  const [errors, setErrors] = useState<MedFormErrors>({});
  const update = <K extends keyof RecordDoseFormData>(k: K, v: RecordDoseFormData[K]) => setForm((p) => ({ ...p, [k]: v }));

  const needsReason = ["refused", "omitted", "not-available"].includes(form.status);
  const rules = { recorder, requiresWitness: m.type === "controlled", requiresDoseGiven: m.type === "variable-dose", expectedBarcode: m.barcode };

  const handleSubmit = () => {
    const next = validateAdministration(form, rules);
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">Record dose</DialogTitle>
        <DialogDescription>{row.patient.name} · {getDrugLabel(m)} · due {formatMedTime(row.dose.scheduledAt)}</DialogDescription>
      </DialogHeader>

      {(isRecentlyChanged(m, now) || row.patient.allergies.length > 0 || m.instructions) && (
        <div className="space-y-1.5 rounded-lg border border-cf-border-light bg-cf-surface-muted/50 p-3 text-xs text-cf-ink-80">
          {isRecentlyChanged(m, now) && <p><strong className="text-warning">Changed:</strong> {m.changeNote}</p>}
          {m.instructions && <p><strong>Instructions:</strong> {m.instructions}</p>}
          {row.patient.allergies.length > 0 && <p><strong className="text-error">Allergies:</strong> {row.patient.allergies.join(", ")}</p>}
        </div>
      )}

      <div className="space-y-4">
        <MedField label="Outcome" required htmlFor="dose-status" error={errors.status}>
          <MedSelect id="dose-status" value={form.status} options={OUTCOME_OPTIONS} onChange={(v: AdministrationStatus) => update("status", v)} invalid={Boolean(errors.status)} />
        </MedField>

        {needsReason && (
          <MedField label="Reason code" required htmlFor="dose-reason" error={errors.reasonCode}>
            <MedSelect id="dose-reason" value={form.reasonCode} options={REASON_OPTIONS} onChange={(v: ReasonCode) => update("reasonCode", v)} invalid={Boolean(errors.reasonCode)} placeholder="Choose a reason" />
          </MedField>
        )}

        {m.type === "variable-dose" && form.status === "administered" && (
          <MedField label="Dose given" required htmlFor="dose-given" error={errors.doseGiven} hint="e.g. 3mg or 6 units — this dose varies by INR / glucose">
            <Input id="dose-given" value={form.doseGiven} aria-invalid={Boolean(errors.doseGiven)} onChange={(e) => update("doseGiven", e.target.value)} />
          </MedField>
        )}

        {m.type === "controlled" && form.status === "administered" && (
          <MedField label="Second witness" required htmlFor="dose-witness" error={errors.witness} hint={`Controlled drug (schedule ${m.schedule}): a second person must witness. Recorded by ${recorder}.`}>
            <Input id="dose-witness" value={form.witness} placeholder="Witness full name" aria-invalid={Boolean(errors.witness)} onChange={(e) => update("witness", e.target.value)} />
          </MedField>
        )}

        <MedField label="Barcode check" htmlFor="dose-barcode" error={errors.barcode} hint="Scan or type the pack barcode to verify the right drug (optional).">
          <div className="flex gap-2">
            <Input id="dose-barcode" value={form.barcode} placeholder="e.g. 5012340000001" aria-invalid={Boolean(errors.barcode)} onChange={(e) => update("barcode", e.target.value)} />
            <Button type="button" variant="outline" onClick={() => update("barcode", m.barcode)}><ScanLine />Scan</Button>
          </div>
        </MedField>

        <MedField label="Note" htmlFor="dose-note" error={errors.note}>
          <Textarea id="dose-note" rows={2} value={form.note} placeholder="Optional — what the patient said or any concern" aria-invalid={Boolean(errors.note)} onChange={(e) => update("note", e.target.value)} />
        </MedField>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? "Saving…" : "Record dose"}</Button>
      </DialogFooter>
    </>
  );
}
