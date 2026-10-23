"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input } from "@/components/ui";
import { validateTemplate } from "lib";
import { useState } from "react";
import type { ReportFormErrors } from "types";
import { ReportField } from "./report-field";

interface SaveTemplateDialogProps { open: boolean; onOpenChange: (open: boolean) => void; isSaving: boolean; onSubmit: (name: string) => void }

export function SaveTemplateDialog({ open, onOpenChange, ...rest }: SaveTemplateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md"><TemplateForm {...rest} onCancel={() => onOpenChange(false)} /></DialogContent>
    </Dialog>
  );
}

function TemplateForm({ isSaving, onSubmit, onCancel }: Omit<SaveTemplateDialogProps, "open" | "onOpenChange"> & { onCancel: () => void }) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<ReportFormErrors>({});
  const handleSubmit = () => {
    const found = validateTemplate({ name });
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(name);
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">Save as template</DialogTitle>
        <DialogDescription>Reuse this report layout any time from the template list.</DialogDescription>
      </DialogHeader>
      <ReportField label="Template name" required htmlFor="tpl-name" error={errors.name}>
        <Input id="tpl-name" value={name} placeholder="e.g. Falls by carer, last quarter" aria-invalid={Boolean(errors.name)} onChange={(e) => setName(e.target.value)} />
      </ReportField>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? "Saving…" : "Save template"}</Button>
      </DialogFooter>
    </>
  );
}
