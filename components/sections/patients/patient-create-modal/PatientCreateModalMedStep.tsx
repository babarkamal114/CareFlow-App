'use client';

import { useState } from 'react';
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { X } from 'lucide-react';
import {
  EMPTY_MEDICATION_DRAFT,
  MEDICATION_DRAFT_NOTE_FIELDS,
  MEDICATION_DRAFT_OPTIONAL_FIELDS,
  MEDICATION_ROUTE_OPTIONS,
  MEDICATION_TYPE_OPTIONS,
  MEDICATION_WIZARD_REQUIRED_FIELDS,
  buildMedicationFromDraft,
  canAddMedicationDraft,
  getMedicationPrescribedParts,
  getMedicationSummaryParts,
  getMedicationTypeBadgeVariant,
  getMedicationTypeLabel,
  removeMedicationById,
  type MedicationDraft,
  type MedicationDraftFieldDef,
  type PatientFormData,
} from 'utils';
import { CompactInputField, CompactSelectField } from 'sections';
import { DotSeparated } from '../DotSeparated';

interface MedicationsStepProps {
  formData: PatientFormData;
  setFormData: (data: PatientFormData) => void;
}

export function MedicationsStep({
  formData,
  setFormData,
}: MedicationsStepProps) {
  const [newMedication, setNewMedication] = useState<MedicationDraft>({ ...EMPTY_MEDICATION_DRAFT });

  const updateDraft = (name: keyof MedicationDraft, value: string) => {
    setNewMedication((prev) => ({ ...prev, [name]: value }) as MedicationDraft);
  };

  const handleAddMedication = () => {
    if (!canAddMedicationDraft(newMedication)) return;

    setFormData({
      ...formData,
      medications: [...formData.medications, buildMedicationFromDraft(newMedication)],
    });
    setNewMedication({ ...EMPTY_MEDICATION_DRAFT });
  };

  const handleRemoveMedication = (id: string) => {
    setFormData({
      ...formData,
      medications: removeMedicationById(formData.medications, id),
    });
  };

  const renderDraftField = (field: MedicationDraftFieldDef) => (
    <CompactInputField
      key={field.id}
      id={field.id}
      label={field.label}
      placeholder={field.placeholder}
      type={field.type}
      value={newMedication[field.name]}
      onChange={(val) => updateDraft(field.name, val)}
    />
  );

  return (
    <div className="space-y-4 pb-4">
      <h3 className="text-lg font-semibold text-cf-ink">Medications</h3>
      <p className="text-sm text-cf-ink-60">
        Add medications for this patient (optional)
      </p>

      <Card className="border-cf-border p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {MEDICATION_WIZARD_REQUIRED_FIELDS.map(renderDraftField)}

          <CompactSelectField
            id="med-route"
            label="Route"
            value={newMedication.route}
            options={MEDICATION_ROUTE_OPTIONS}
            onChange={(val) => updateDraft('route', val)}
          />

          <CompactSelectField
            id="med-type"
            label="Medication Type"
            value={newMedication.medicationType}
            options={MEDICATION_TYPE_OPTIONS}
            onChange={(val) => updateDraft('medicationType', val)}
          />

          {MEDICATION_DRAFT_OPTIONAL_FIELDS.map(renderDraftField)}
        </div>

        {MEDICATION_DRAFT_NOTE_FIELDS.map(renderDraftField)}

        <Button
          onClick={handleAddMedication}
          variant="outline"
          size="sm"
          className="w-full border-cf-border hover:bg-cf-surface-muted text-xs"
        >
          Add Medication
        </Button>
      </Card>

      {formData.medications.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-cf-ink-60">
            Added Medications:
          </p>
          {formData.medications.map((med) => {
            const prescribedParts = getMedicationPrescribedParts(med);

            return (
              <Card key={med.id} className="border-cf-border p-3">
                <CardContent className="p-0 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-cf-ink">
                        {med.name}
                      </p>
                      {med.medicationType && (
                        <Badge
                          variant={getMedicationTypeBadgeVariant(med.medicationType)}
                          className="text-[10px]"
                          shape="pill"
                        >
                          {getMedicationTypeLabel(med.medicationType)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-cf-ink-60 mt-1 flex-wrap">
                      <DotSeparated parts={getMedicationSummaryParts(med)} />
                    </div>
                    {prescribedParts.length > 0 && (
                      <div className="flex items-center gap-2 text-[10px] text-cf-ink-40 mt-1">
                        <DotSeparated parts={prescribedParts} />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveMedication(med.id)}
                    className="text-cf-ink-40 hover:text-cf-ink transition-colors flex-shrink-0"
                    aria-label={`Remove ${med.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}