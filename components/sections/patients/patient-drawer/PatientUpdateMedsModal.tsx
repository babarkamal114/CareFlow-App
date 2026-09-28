'use client';

import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { X, Plus, Loader2 } from 'lucide-react';
import { useMedicationForm } from 'hooks';
import {
  MEDICATION_ROUTES,
  MEDICATION_TYPES,
  getMedicationTypeBadgeVariant,
  getMedicationTypeLabel,
  type MedicationType,
  type PatientMedication,
} from 'utils';

// Re-exported so `import { type Medication } from "sections"` keeps working.
export type Medication = PatientMedication;

interface EditMedicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medications: Medication[];
  onSave: (medications: Medication[]) => Promise<void>;
  patientName?: string;
}

interface DraftFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string | undefined;
}

/** Label + input + error for the "add medication" form. */
function DraftField({ id, label, value, onChange, placeholder = '', type = 'text', error }: DraftFieldProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs font-medium">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border-cf-border h-8 text-sm ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/** Compact input for editing a medication that is already on the list. */
function RowInput({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = 'flex-1',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <Input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`border-cf-border h-7 text-sm ${className}`}
    />
  );
}

export function EditMedicationModal({
  open,
  onOpenChange,
  medications,
  onSave,
  patientName,
}: EditMedicationModalProps) {
  const {
    meds,
    draft,
    draftErrors,
    incompleteIds,
    isLoading,
    isDirty,
    hasPendingDraft,
    updateDraft,
    addMedication,
    removeMedication,
    updateMedication,
    submit,
  } = useMedicationForm({
    open,
    medications,
    onSave,
    onClose: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Medications</DialogTitle>
          <DialogDescription>
            {patientName ? `Update medications for ${patientName}` : 'Add or remove medications'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card className="border-cf-border p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <DraftField id="med-name" label="Medication Name *" placeholder="Lisinopril" value={draft.name} error={draftErrors.name} onChange={(v) => updateDraft('name', v)} />
              <DraftField id="med-dosage" label="Dosage *" placeholder="10mg" value={draft.dosage} error={draftErrors.dosage} onChange={(v) => updateDraft('dosage', v)} />
              <DraftField id="med-frequency" label="Frequency *" placeholder="Once daily" value={draft.frequency} error={draftErrors.frequency} onChange={(v) => updateDraft('frequency', v)} />
              <DraftField id="med-timing" label="Timing *" placeholder="Morning" value={draft.timing} error={draftErrors.timing} onChange={(v) => updateDraft('timing', v)} />

              <div className="space-y-1">
                <Label htmlFor="med-route" className="text-xs font-medium">
                  Route
                </Label>
                <Select value={draft.route} onValueChange={(val) => updateDraft('route', val ?? 'Oral')}>
                  <SelectTrigger id="med-route" className="border-cf-border h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDICATION_ROUTES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="med-type" className="text-xs font-medium">
                  Medication Type
                </Label>
                <Select
                  value={draft.medicationType}
                  onValueChange={(val) => updateDraft('medicationType', (val ?? 'regular') as MedicationType)}
                >
                  <SelectTrigger id="med-type" className="border-cf-border h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDICATION_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DraftField id="med-prescriber" label="Prescriber" placeholder="Dr. Sarah Ahmed" value={draft.prescriber} onChange={(v) => updateDraft('prescriber', v)} />
              <DraftField id="med-start-date" label="Start Date" type="date" value={draft.startDate} onChange={(v) => updateDraft('startDate', v)} />
            </div>

            <DraftField id="med-indication" label="Indication (optional)" placeholder="Hypertension" value={draft.indication} onChange={(v) => updateDraft('indication', v)} />
            <DraftField id="med-instructions" label="Special Instructions (optional)" placeholder="Take with food, avoid grapefruit..." value={draft.instructions} onChange={(v) => updateDraft('instructions', v)} />

            <Button
              onClick={addMedication}
              variant="outline"
              size="sm"
              className="w-full border-cf-border hover:bg-cf-surface-muted text-xs gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Medication
            </Button>
            {hasPendingDraft && (
              <p className="text-xs text-cf-ink-60">
                Not added yet. Click Add Medication or it won&apos;t be saved.
              </p>
            )}
          </Card>

          {meds.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-cf-ink-60">Current Medications ({meds.length})</p>
              {meds.map((med) => {
                const incomplete = incompleteIds.includes(med.id);

                return (
                  <Card key={med.id} className={`border-cf-border p-3 ${incomplete ? 'border-red-500' : ''}`}>
                    <CardContent className="p-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <RowInput value={med.name} onChange={(v) => updateMedication(med.id, 'name', v)} />
                            <RowInput value={med.dosage} onChange={(v) => updateMedication(med.id, 'dosage', v)} placeholder="Dosage" className="w-20" />
                            {med.medicationType && (
                              <Badge
                                variant={getMedicationTypeBadgeVariant(med.medicationType)}
                                className="text-[10px] shrink-0"
                                shape="pill"
                              >
                                {getMedicationTypeLabel(med.medicationType)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <RowInput value={med.frequency} onChange={(v) => updateMedication(med.id, 'frequency', v)} placeholder="Frequency" />
                            <RowInput value={med.timing} onChange={(v) => updateMedication(med.id, 'timing', v)} placeholder="Timing" />
                            <RowInput value={med.route || ''} onChange={(v) => updateMedication(med.id, 'route', v)} placeholder="Route" />
                          </div>
                          <div className="flex items-center gap-2">
                            <RowInput value={med.prescriber || ''} onChange={(v) => updateMedication(med.id, 'prescriber', v)} placeholder="Prescriber" />
                            <RowInput type="date" value={med.startDate || ''} onChange={(v) => updateMedication(med.id, 'startDate', v)} />
                          </div>
                          <RowInput className="w-full" value={med.indication || ''} onChange={(v) => updateMedication(med.id, 'indication', v)} placeholder="Indication (optional)" />
                          <RowInput className="w-full" value={med.instructions || ''} onChange={(v) => updateMedication(med.id, 'instructions', v)} placeholder="Special instructions (optional)" />
                          {incomplete && (
                            <p className="text-xs text-red-500">
                              Name, dosage, frequency and timing are required.
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeMedication(med.id)}
                          className="text-cf-ink-40 hover:text-cf-error transition-colors flex-shrink-0 mt-1"
                          aria-label={`Remove ${med.name}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 border-cf-border hover:bg-cf-surface-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={submit}
            disabled={isLoading || !isDirty}
            className="flex-1 bg-cf-primary hover:bg-cf-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Medications'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}