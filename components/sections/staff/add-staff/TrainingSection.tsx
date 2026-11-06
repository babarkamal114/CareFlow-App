"use client";

import { Button } from "@/components/ui";
import {
  StaffFormErrorBanner,
  StaffFormSectionLabel,
  StaffQualificationFields,
  StaffTrainingRecordFields,
} from "@/components/ui";
import { Plus } from "lucide-react";
import { createStaffRecordId, MANDATORY_TRAINING_MODULES } from "types";
import type {
  Qualification,
  StaffFormData,
  StaffFormErrors,
  TrainingRecord,
} from "types";

interface Props {
  data: StaffFormData;
  errors: StaffFormErrors;
  onChange: (data: StaffFormData) => void;
}

export function TrainingSection({ data, errors, onChange }: Props) {
  const addQualification = () => {
    onChange({
      ...data,
      qualifications: [
        ...data.qualifications,
        { id: createStaffRecordId("qualification"), name: "", awardedDate: "" },
      ],
    });
  };

  const updateQualificationAt = (index: number, qualification: Qualification) => {
    const qualifications = [...data.qualifications];
    qualifications[index] = qualification;
    onChange({ ...data, qualifications });
  };

  const removeQualification = (index: number) => {
    onChange({
      ...data,
      qualifications: data.qualifications.filter(
        (_, position) => position !== index
      ),
    });
  };

  const addTrainingRecord = (module: TrainingRecord["module"] = "") => {
    onChange({
      ...data,
      mandatoryTraining: [
        ...data.mandatoryTraining,
        { id: createStaffRecordId("training"), module, status: "not_started" },
      ],
    });
  };

  const updateTrainingRecordAt = (index: number, record: TrainingRecord) => {
    const records = [...data.mandatoryTraining];
    records[index] = record;
    onChange({ ...data, mandatoryTraining: records });
  };

  const removeTrainingRecord = (index: number) => {
    onChange({
      ...data,
      mandatoryTraining: data.mandatoryTraining.filter(
        (_, position) => position !== index
      ),
    });
  };

  const availableModules = MANDATORY_TRAINING_MODULES.filter(
    (module) => !data.mandatoryTraining.some((record) => record.module === module)
  );

  return (
    <div className="space-y-6">
      <StaffFormErrorBanner errors={errors} />

      <StaffFormSectionLabel>Qualifications</StaffFormSectionLabel>

      {errors.qualifications && (
        <p className="text-xs text-destructive">{errors.qualifications}</p>
      )}

      {data.qualifications.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No qualifications recorded yet.
        </p>
      )}

      <div className="space-y-4">
        {data.qualifications.map((qualification, index) => (
          <StaffQualificationFields
            key={qualification.id}
            qualification={qualification}
            index={index}
            errors={errors}
            onChange={(next) => updateQualificationAt(index, next)}
            onRemove={() => removeQualification(index)}
          />
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addQualification}>
        <Plus className="mr-1.5 h-4 w-4" />
        Add Qualification
      </Button>

      <StaffFormSectionLabel>Mandatory Training</StaffFormSectionLabel>

      <p className="text-sm text-muted-foreground">
        Record the status of each required course. Staff cannot be scheduled
        onto visits until every mandatory module is completed.
      </p>

      {data.mandatoryTraining.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No training modules added yet.
        </p>
      )}

      <div className="space-y-4">
        {data.mandatoryTraining.map((record, index) => (
          <StaffTrainingRecordFields
            key={record.id}
            record={record}
            index={index}
            errors={errors}
            onChange={(next) => updateTrainingRecordAt(index, next)}
            onRemove={() => removeTrainingRecord(index)}
          />
        ))}
      </div>

      {availableModules.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {availableModules.map((module) => (
            <Button
              key={module}
              type="button"
              onClick={() => addTrainingRecord(module)}
              className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              + {module}
            </Button>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => addTrainingRecord("")}
        disabled={availableModules.length === 0}
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add Training Module
      </Button>
    </div>
  );
}
