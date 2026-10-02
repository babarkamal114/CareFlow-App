"use client";

import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import {
  StaffDbsFields,
  StaffDrivingFields,
  StaffFormErrorBanner,
  StaffFormSectionLabel,
  StaffRefereeFields,
  StaffRightToWorkFields,
} from "@/components/ui";
import { EMPTY_REFeree } from "types";
import type {
  Referee,
  StaffFormData,
  StaffFormErrors,
} from "types";

interface Props {
  data: StaffFormData;
  errors: StaffFormErrors;
  onChange: (data: StaffFormData) => void;
}

export function ComplianceSection({ data, errors, onChange }: Props) {
  const addReferee = () => {
    onChange({ ...data, referees: [...data.referees, { ...EMPTY_REFeree }] });
  };

  const updateRefereeAt = (index: number, referee: Referee) => {
    const referees = [...data.referees];
    referees[index] = referee;
    onChange({ ...data, referees });
  };

  const removeReferee = (index: number) => {
    onChange({
      ...data,
      referees: data.referees.filter((_, position) => position !== index),
    });
  };

  return (
    <div className="space-y-6">
      <StaffFormErrorBanner errors={errors} />

      <StaffFormSectionLabel>Right To Work</StaffFormSectionLabel>
      <StaffRightToWorkFields
        value={data.rightToWork}
        errors={errors}
        onChange={(rightToWork) => onChange({ ...data, rightToWork })}
      />

      <StaffFormSectionLabel>DBS</StaffFormSectionLabel>
      <StaffDbsFields
        value={data.dbs}
        errors={errors}
        onChange={(dbs) => onChange({ ...data, dbs })}
      />

      <StaffFormSectionLabel>Driving</StaffFormSectionLabel>
      <StaffDrivingFields
        value={data.driving}
        errors={errors}
        onChange={(driving) => onChange({ ...data, driving })}
      />

      <StaffFormSectionLabel>References</StaffFormSectionLabel>

      {errors.referees && (
        <p className="text-xs text-destructive">{errors.referees}</p>
      )}

      {data.referees.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No referees added yet. At least 2 are required before this staff
          member can be created.
        </p>
      )}

      <div className="space-y-4">
        {data.referees.map((referee, index) => (
          <StaffRefereeFields
            key={index}
            referee={referee}
            index={index}
            errors={errors}
            onChange={(next) => updateRefereeAt(index, next)}
            onRemove={() => removeReferee(index)}
          />
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addReferee}>
        <Plus className="mr-1.5 h-4 w-4" />
        Add Referee
      </Button>
    </div>
  );
}
