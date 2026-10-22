"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Switch, Textarea } from "@/components/ui";
import { validateControlledEntry } from "lib";
import { useState } from "react";
import type { ControlledEntryFormData, ControlledItem, MedFormErrors } from "types";
import { CONTROLLED_ENTRY_OPTIONS, getDrugLabel } from "utils";
import { MedField } from "./med-field";
import { MedSelect } from "./med-select";

interface ControlledEntryDialogProps { item: ControlledItem | null; recorder: string; isSaving: boolean; onClose: () => void; onSubmit: (data: ControlledEntryFormData) => void }

export function ControlledEntryDialog({ item, onClose, ...rest }: ControlledEntryDialogProps) {
  return (
    <Dialog open={item !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">{item && <EntryForm item={item} onClose={onClose} {...rest} />}</DialogContent>
    </Dialog>
  );
}

function EntryForm({ item, recorder, isSaving, onClose, onSubmit }: Omit<ControlledEntryDialogProps, "item"> & { item: ControlledItem }) {
  const [form, setForm] = useState<ControlledEntryFormData>({ kind: "", quantity: "", witness: "", note: "", adjustBalance: false });
  const [errors, setErrors] = useState<MedFormErrors>({});
  const update = <K extends keyof ControlledEntryFormData>(k: K, v: ControlledEntryFormData[K]) => setForm((p) => ({ ...p, [k]: v }));
  const handleSubmit = () => {
    const next = validateControlledEntry(form, { recorder, expectedBalance: item.stock.balance });
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  };
  const isCheck = form.kind === "stock-check";

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">Controlled drug entry</DialogTitle>
        <DialogDescription>{getDrugLabel(item.medication)} · {item.patient.name} · recorded balance {item.stock.balance} {item.stock.unit}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <MedField label="Entry type" required htmlFor="cd-kind" error={errors.kind}>
          <MedSelect id="cd-kind" value={form.kind} options={[...CONTROLLED_ENTRY_OPTIONS]} onChange={(v) => update("kind", v)} invalid={Boolean(errors.kind)} />
        </MedField>
        <MedField label={isCheck ? "Quantity counted" : "Quantity"} required htmlFor="cd-qty" error={errors.quantity}>
          <Input id="cd-qty" type="number" min="0" step="1" value={form.quantity} aria-invalid={Boolean(errors.quantity)} onChange={(e) => update("quantity", e.target.value === "" ? "" : Number(e.target.value))} />
        </MedField>
        <MedField label="Second witness" required htmlFor="cd-witness" error={errors.witness} hint={`Recorded by ${recorder}. The witness must be a different person.`}>
          <Input id="cd-witness" value={form.witness} placeholder="Witness full name" aria-invalid={Boolean(errors.witness)} onChange={(e) => update("witness", e.target.value)} />
        </MedField>
        <MedField label="Note" htmlFor="cd-note" error={errors.note}>
          <Textarea id="cd-note" rows={2} value={form.note} placeholder="Required if the count does not match" aria-invalid={Boolean(errors.note)} onChange={(e) => update("note", e.target.value)} />
        </MedField>
        {isCheck && (
          <div className="flex items-center justify-between rounded-lg border border-cf-border-light bg-cf-surface-muted/50 p-3">
            <div>
              <Label htmlFor="cd-adjust" className="text-sm">Adjust recorded balance to the count</Label>
              <p className="mt-1 text-xs text-cf-ink-60">Only after the discrepancy has been investigated.</p>
            </div>
            <Switch id="cd-adjust" checked={form.adjustBalance} onCheckedChange={(c) => update("adjustBalance", c)} />
          </div>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? "Saving…" : "Record entry"}</Button>
      </DialogFooter>
    </>
  );
}
