"use client";

import { Button, Input } from "@/components/ui";
import { Plus } from "lucide-react";
import {
  StaffAvailabilitySlotFields,
  StaffFormErrorBanner,
  StaffFormFieldRow,
  StaffFormSectionLabel,
  StaffFormTagInput,
} from "@/components/ui";
import type { StaffFormErrors } from "types";
import {
  createStaffRecordId,
  DAY_OF_WEEK_OPTIONS,
  LANGUAGE_SUGGESTIONS,
  SKILL_SUGGESTIONS,
} from "types";
import type { AvailabilitySlot, StaffFormData } from "types";

interface Props {
  data: StaffFormData;
  errors: StaffFormErrors;
  onChange: (data: StaffFormData) => void;
}

export function SkillsAvailabilitySection({ data, errors, onChange }: Props) {
  const addSlot = () => {
    const used = new Set(data.availability.map((slot) => slot.day));
    const nextDay = DAY_OF_WEEK_OPTIONS.find((day) => !used.has(day));
    onChange({
      ...data,
      availability: [
        ...data.availability,
        {
          id: createStaffRecordId("availability"),
          day: nextDay ?? "mon",
          startTime: "09:00",
          endTime: "17:00",
        },
      ],
    });
  };

  const updateSlotAt = (index: number, slot: AvailabilitySlot) => {
    const availability = [...data.availability];
    availability[index] = slot;
    onChange({ ...data, availability });
  };

  const removeSlot = (index: number) => {
    onChange({
      ...data,
      availability: data.availability.filter(
        (_, position) => position !== index
      ),
    });
  };

  return (
    <div className="space-y-6">
      <StaffFormErrorBanner errors={errors} />

      <StaffFormSectionLabel>Languages</StaffFormSectionLabel>

      <StaffFormFieldRow
        label="Spoken Languages"
        required
        hint="Press Enter or comma to add a language."
        error={errors.languages}
        htmlFor="staffLanguages"
      >
        <StaffFormTagInput
          id="staffLanguages"
          values={data.languages}
          suggestions={LANGUAGE_SUGGESTIONS}
          placeholder="e.g. English"
          error={errors.languages}
          onChange={(languages) => onChange({ ...data, languages })}
        />
      </StaffFormFieldRow>

      <StaffFormSectionLabel>Skills</StaffFormSectionLabel>

      <StaffFormFieldRow
        label="Core Skills"
        required
        hint="Used to match this staff member to the right visits."
        error={errors.skills}
        htmlFor="staffSkills"
      >
        <StaffFormTagInput
          id="staffSkills"
          values={data.skills}
          suggestions={SKILL_SUGGESTIONS}
          placeholder="e.g. Personal Care"
          error={errors.skills}
          onChange={(skills) => onChange({ ...data, skills })}
        />
      </StaffFormFieldRow>

      <StaffFormFieldRow
        label="Work Area Postcode"
        required
        hint="The centre of the area this staff member is willing to travel in."
        error={errors.workAreaPostcode}
        htmlFor="workAreaPostcode"
      >
        <Input
          id="workAreaPostcode"
          value={data.workAreaPostcode}
          onChange={(event) =>
            onChange({ ...data, workAreaPostcode: event.target.value })
          }
          placeholder="E14 5AB"
          className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
        />
      </StaffFormFieldRow>

      <StaffFormSectionLabel>Weekly Availability</StaffFormSectionLabel>

      <p className="text-sm text-muted-foreground">
        Set the recurring hours this staff member is normally available to be
        scheduled. One slot per day.
      </p>

      {errors.availability && (
        <p className="text-xs text-destructive">{errors.availability}</p>
      )}

      {data.availability.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No availability added yet.
        </p>
      )}

      <div className="space-y-4">
        {data.availability.map((slot, index) => (
          <StaffAvailabilitySlotFields
            key={slot.id}
            slot={slot}
            index={index}
            errors={errors}
            onChange={(next) => updateSlotAt(index, next)}
            onRemove={() => removeSlot(index)}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addSlot}
        disabled={data.availability.length >= DAY_OF_WEEK_OPTIONS.length}
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add Availability Slot
      </Button>
    </div>
  );
}
