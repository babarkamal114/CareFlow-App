"use client";

import {
  Button, DatePicker, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui";
import { validateAssignAction } from "lib";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import type { AssignActionFormData, ComplianceFormErrors } from "types";
import { ComplianceField } from "./compliance-field";

interface AssignActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regulationLabel: string;
  owners: string[];
  onSubmit: (data: AssignActionFormData) => void;
}

export function AssignActionDialog({ open, onOpenChange, regulationLabel, owners, onSubmit }: AssignActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        {/* mounts only while open, so the form resets each time */}
        <AssignActionForm regulationLabel={regulationLabel} owners={owners} onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function AssignActionForm({ regulationLabel, owners, onSubmit, onCancel }: Omit<AssignActionDialogProps, "open" | "onOpenChange"> & { onCancel: () => void }) {
  const [form, setForm] = useState<AssignActionFormData>({ label: "", owner: "", dueDate: "" });
  const [errors, setErrors] = useState<ComplianceFormErrors>({});
  const update = <K extends keyof AssignActionFormData>(key: K, value: AssignActionFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    const next = validateAssignAction(form);
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">Assign action</DialogTitle>
        <DialogDescription>{regulationLabel}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <ComplianceField label="Action" required htmlFor="act-label" error={errors.label}>
          <Input id="act-label" value={form.label} placeholder="e.g. Complete overdue supervisions" aria-invalid={Boolean(errors.label)}
            onChange={(e) => update("label", e.target.value)} />
        </ComplianceField>

        <div className="grid grid-cols-2 gap-3">
          <ComplianceField label="Owner" required htmlFor="act-owner" error={errors.owner}>
            <Select value={form.owner || null} onValueChange={(v) => v && update("owner", v)}>
              <SelectTrigger id="act-owner" aria-invalid={Boolean(errors.owner)} className="w-full border-cf-border bg-cf-surface text-cf-ink">
                <SelectValue placeholder="Choose owner" />
              </SelectTrigger>
              <SelectContent className="border-cf-border bg-cf-surface">
                {owners.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </ComplianceField>
          <ComplianceField label="Due date" required htmlFor="act-due" error={errors.dueDate}>
            <DatePicker id="act-due" className="w-full min-w-0" value={form.dueDate ? parseISO(form.dueDate) : undefined}
              onChange={(d) => update("dueDate", d ? format(d, "yyyy-MM-dd") : "")} />
          </ComplianceField>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Assign action</Button>
      </DialogFooter>
    </>
  );
}
