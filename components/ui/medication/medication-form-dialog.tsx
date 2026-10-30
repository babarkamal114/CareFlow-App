"use client";

import { Button, DatePicker, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Textarea } from "@/components/ui";
import { validateMedicationForm } from "lib";
import { format, parseISO } from "date-fns";
import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { InteractionRule, MedFormErrors, Medication, MedicationFormData, MedicationFrequency, MedicationPatient, MedicationType } from "types";
import { checkInteractions, FREQUENCY_DEFAULT_TIMES, FREQUENCY_OPTIONS, MEDICATION_TYPE_OPTIONS, ROUTE_OPTIONS } from "utils";
import { InteractionWarnings } from "./interaction-warnings";
import { MedField } from "./med-field";
import { MedSelect } from "./med-select";

interface MedicationFormDialogProps {
  open: boolean; onOpenChange: (open: boolean) => void; medication: Medication | null; initialPatientId: string | null;
  patients: MedicationPatient[]; medications: Medication[]; rules: InteractionRule[]; allergyAliases: Record<string, string[]>;
  isSaving: boolean; onSubmit: (data: MedicationFormData) => void;
}

export function MedicationFormDialog({ open, onOpenChange, ...rest }: MedicationFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        <MedicationForm {...rest} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

const iso = (d: Date | undefined) => (d ? format(d, "yyyy-MM-dd") : "");

function MedicationForm({ medication, initialPatientId, patients, medications, rules, allergyAliases, isSaving, onSubmit, onCancel }:
  Omit<MedicationFormDialogProps, "open" | "onOpenChange"> & { onCancel: () => void }) {
  const [form, setForm] = useState<MedicationFormData>({
    patientId: medication?.patientId ?? initialPatientId ?? "", drugName: medication?.drugName ?? "", strength: medication?.strength ?? "",
    route: medication?.route ?? "", type: medication?.type ?? "", frequency: medication?.frequency ?? "", times: medication?.times ?? [],
    prescriber: medication?.prescriber ?? "", startDate: iso(medication?.startDate) || iso(new Date()), endDate: iso(medication?.endDate),
    indication: medication?.indication ?? "", instructions: medication?.instructions ?? "", schedule: medication?.schedule ?? "",
    prnMinIntervalHours: medication?.prnMinIntervalHours ?? "", prnMaxPer24h: medication?.prnMaxPer24h ?? "",
  });
  const [errors, setErrors] = useState<MedFormErrors>({});
  const update = <K extends keyof MedicationFormData>(k: K, v: MedicationFormData[K]) => setForm((p) => ({ ...p, [k]: v }));

  const isPrn = form.type === "prn" || form.frequency === "as-required";
  const patient = patients.find((p) => p.id === form.patientId);
  const warnings = useMemo(
    () => (patient ? checkInteractions(form.drugName, medications.filter((m) => m.patientId === patient.id && m.id !== medication?.id), patient.allergies, rules, allergyAliases) : []),
    [form.drugName, patient, medications, medication?.id, rules, allergyAliases],
  );

  const setFrequency = (f: MedicationFrequency) => setForm((p) => ({ ...p, frequency: f, times: [...FREQUENCY_DEFAULT_TIMES[f]], type: f === "as-required" ? "prn" : p.type === "prn" ? "regular" : p.type }));
  const setType = (t: MedicationType) => setForm((p) => (t === "prn" ? { ...p, type: t, frequency: "as-required", times: [] } : { ...p, type: t, frequency: p.frequency === "as-required" ? "" : p.frequency }));
  const setTime = (i: number, v: string) => update("times", form.times.map((t, idx) => (idx === i ? v : t)));
  const num = (v: string) => (v === "" ? "" : Number(v));

  const handleSubmit = () => {
    const next = validateMedicationForm(form);
    setErrors(next);
    if (Object.keys(next).length === 0) onSubmit(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading text-lg text-cf-ink">{medication ? "Edit medication" : "Add medication"}</DialogTitle>
        <DialogDescription>{medication ? "Changes are highlighted for carers at their next visit." : "The full medication profile from the prescription."}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <MedField label="Patient" required htmlFor="med-patient" error={errors.patientId}>
          <MedSelect id="med-patient" value={form.patientId} options={patients.map((p) => ({ value: p.id, label: p.name }))} onChange={(v) => update("patientId", v)} disabled={Boolean(medication)} invalid={Boolean(errors.patientId)} placeholder="Choose a patient" />
        </MedField>

        <div className="grid grid-cols-2 gap-3">
          <MedField label="Drug name" required htmlFor="med-drug" error={errors.drugName}>
            <Input id="med-drug" value={form.drugName} placeholder="e.g. Amoxicillin" aria-invalid={Boolean(errors.drugName)} onChange={(e) => update("drugName", e.target.value)} />
          </MedField>
          <MedField label="Dose / strength" required htmlFor="med-strength" error={errors.strength}>
            <Input id="med-strength" value={form.strength} placeholder="e.g. 500mg" aria-invalid={Boolean(errors.strength)} onChange={(e) => update("strength", e.target.value)} />
          </MedField>
        </div>
        <InteractionWarnings warnings={warnings} />

        <div className="grid grid-cols-3 gap-3">
          <MedField label="Route" required htmlFor="med-route" error={errors.route}>
            <MedSelect id="med-route" value={form.route} options={ROUTE_OPTIONS} onChange={(v) => update("route", v)} invalid={Boolean(errors.route)} />
          </MedField>
          <MedField label="Type" required htmlFor="med-type" error={errors.type}>
            <MedSelect id="med-type" value={form.type} options={MEDICATION_TYPE_OPTIONS} onChange={setType} invalid={Boolean(errors.type)} />
          </MedField>
          <MedField label="Frequency" required htmlFor="med-freq" error={errors.frequency}>
            <MedSelect id="med-freq" value={form.frequency} options={FREQUENCY_OPTIONS} onChange={setFrequency} invalid={Boolean(errors.frequency)} />
          </MedField>
        </div>

        {!isPrn && (
          <MedField label="Administration times" required error={errors.times}>
            <div className="flex flex-wrap items-center gap-2">
              {form.times.map((t, i) => (
                <div key={i} className="flex items-center gap-1">
                  <Input type="time" value={t} aria-label={`Time ${i + 1}`} className="w-32" onChange={(e) => setTime(i, e.target.value)} />
                  <Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove time ${i + 1}`} onClick={() => update("times", form.times.filter((_, idx) => idx !== i))}><X /></Button>
                </div>
              ))}
              {form.times.length < 6 && <Button type="button" variant="outline" size="sm" onClick={() => update("times", [...form.times, "12:00"])}><Plus />Add time</Button>}
            </div>
          </MedField>
        )}

        {isPrn && (
          <div className="grid grid-cols-2 gap-3">
            <MedField label="Minimum hours between doses" required htmlFor="med-min" error={errors.prnMinIntervalHours}>
              <Input id="med-min" type="number" min="0" step="0.25" value={form.prnMinIntervalHours} onChange={(e) => update("prnMinIntervalHours", num(e.target.value))} />
            </MedField>
            <MedField label="Maximum doses in 24 hours" required htmlFor="med-max" error={errors.prnMaxPer24h}>
              <Input id="med-max" type="number" min="1" step="1" value={form.prnMaxPer24h} onChange={(e) => update("prnMaxPer24h", num(e.target.value))} />
            </MedField>
          </div>
        )}

        {form.type === "controlled" && (
          <MedField label="Controlled drug schedule" required htmlFor="med-sched" error={errors.schedule}>
            <MedSelect id="med-sched" value={form.schedule} options={[{ value: "2", label: "Schedule 2" }, { value: "3", label: "Schedule 3" }]} onChange={(v) => update("schedule", v)} invalid={Boolean(errors.schedule)} />
          </MedField>
        )}

        <div className="grid grid-cols-2 gap-3">
          <MedField label="Prescriber" required htmlFor="med-presc" error={errors.prescriber}>
            <Input id="med-presc" value={form.prescriber} placeholder="e.g. Dr Patel" aria-invalid={Boolean(errors.prescriber)} onChange={(e) => update("prescriber", e.target.value)} />
          </MedField>
          <MedField label="Indication" required htmlFor="med-ind" error={errors.indication}>
            <Input id="med-ind" value={form.indication} placeholder="e.g. Type 2 diabetes" aria-invalid={Boolean(errors.indication)} onChange={(e) => update("indication", e.target.value)} />
          </MedField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MedField label="Start date" required htmlFor="med-start" error={errors.startDate}>
            <DatePicker id="med-start" className="w-full min-w-0" value={form.startDate ? parseISO(form.startDate) : undefined} onChange={(d) => update("startDate", iso(d))} />
          </MedField>
          {form.type === "short-course" && (
            <MedField label="End date" required htmlFor="med-end" error={errors.endDate}>
              <DatePicker id="med-end" className="w-full min-w-0" value={form.endDate ? parseISO(form.endDate) : undefined} onChange={(d) => update("endDate", iso(d))} />
            </MedField>
          )}
        </div>

        <MedField label="Special instructions" htmlFor="med-instr" error={errors.instructions}>
          <Textarea id="med-instr" rows={2} value={form.instructions} placeholder="e.g. Give with food" onChange={(e) => update("instructions", e.target.value)} />
        </MedField>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? "Saving…" : medication ? "Save changes" : "Add medication"}</Button>
      </DialogFooter>
    </>
  );
}
