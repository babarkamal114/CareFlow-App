"use client";

import { Button, Checkbox, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Label } from "@/components/ui";
import { validateInspectionPack } from "lib";
import { CheckCircle2, Download } from "lucide-react";
import { useState } from "react";
import type { ComplianceFormErrors, InspectionPackFormData, PackSection, PackSectionId, PackStage } from "types";
import { sumPackPages } from "utils";
import { ComplianceField } from "./compliance-field";
import { FilterPill } from "./filter-pill";
import { StatusProgressBar } from "./status-progress-bar";

interface InspectionPackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: PackSection[];
  stage: PackStage;
  progress: number;
  stepLabel: string;
  onGenerate: (data: InspectionPackFormData) => void;
  onDownloadAgain: () => void;
}

export function InspectionPackDialog({ open, onOpenChange, ...rest }: InspectionPackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <PackForm {...rest} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function PackForm({ sections, stage, progress, stepLabel, onGenerate, onDownloadAgain, onClose }: Omit<InspectionPackDialogProps, "open" | "onOpenChange"> & { onClose: () => void }) {
  const [form, setForm] = useState<InspectionPackFormData>({ sections: sections.map((s) => s.id), patientScope: "all" });
  const [errors, setErrors] = useState<ComplianceFormErrors>({});

  const toggle = (id: PackSectionId, checked: boolean) =>
    setForm((prev) => ({ ...prev, sections: checked ? [...prev.sections, id] : prev.sections.filter((s) => s !== id) }));

  const handleGenerate = () => {
    const next = validateInspectionPack(form);
    setErrors(next);
    if (Object.keys(next).length === 0) onGenerate(form);
  };

  if (stage !== "idle") {
    const done = stage === "done";
    return (
      <>
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-cf-ink">{done ? "Inspection pack ready" : "Generating inspection pack"}</DialogTitle>
          <DialogDescription>{done ? "Your evidence summary has been downloaded." : "Compiling evidence from across CareFlow…"}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <StatusProgressBar value={progress} tone="success" className="h-2" />
          <p className="flex items-center gap-2 text-sm text-cf-ink-60" aria-live="polite">
            {done && <CheckCircle2 className="size-4 text-success" />}
            {done ? "All selected sections compiled" : stepLabel}
          </p>
        </div>
        <DialogFooter>
          {done && <Button variant="outline" onClick={onDownloadAgain}><Download />Download again</Button>}
          <Button variant={done ? "default" : "outline"} onClick={onClose}>{done ? "Done" : "Cancel"}</Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">Generate CQC inspection pack</DialogTitle>
        <DialogDescription>Choose what to include. Roughly {sumPackPages(sections, form.sections)} pages.</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <ComplianceField label="Include" required error={errors.sections}>
          <div className="space-y-2">
            {sections.map((s) => (
              <div key={s.id} className="flex items-start gap-3 rounded-lg border border-cf-border-light p-3">
                <Checkbox id={`pack-${s.id}`} className="mt-0.5" checked={form.sections.includes(s.id)} onCheckedChange={(c) => toggle(s.id, c === true)} />
                <Label htmlFor={`pack-${s.id}`} className="flex-1 flex-col items-start gap-0 font-normal">
                  <span className="text-sm font-medium text-cf-ink">{s.label}</span>
                  <span className="text-xs text-cf-ink-60">{s.description} · {s.pages} pages</span>
                </Label>
              </div>
            ))}
          </div>
        </ComplianceField>

        <ComplianceField label="Patient files">
          <div className="flex gap-2">
            <FilterPill label="All patients" active={form.patientScope === "all"} onClick={() => setForm((p) => ({ ...p, patientScope: "all" }))} />
            <FilterPill label="Selected patients" active={form.patientScope === "selected"} onClick={() => setForm((p) => ({ ...p, patientScope: "selected" }))} />
          </div>
        </ComplianceField>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleGenerate}><Download />Generate pack</Button>
      </DialogFooter>
    </>
  );
}
