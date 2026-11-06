"use client";

import {
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { StaffFormFieldRow } from "./staff-form-field-row";
import { TRAVEL_MODE_LABELS } from "types";
import type {
  DrivingSection,
  StaffFormErrors,
  TravelMode,
} from "types";

export function StaffDrivingFields({
  value,
  errors,
  onChange,
}: {
  value: DrivingSection;
  errors: StaffFormErrors;
  onChange: (value: DrivingSection) => void;
}) {
  const set = <K extends keyof DrivingSection>(
    key: K,
    next: DrivingSection[K]
  ) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Checkbox
          id="hasLicence"
          checked={value.hasLicence}
          onCheckedChange={(checked) => set("hasLicence", checked === true)}
        />
        <label
          htmlFor="hasLicence"
          className="cursor-pointer text-sm font-medium text-cf-ink"
        >
          Holds a full UK driving licence
        </label>
      </div>

      {value.hasLicence && (
        <>
          <StaffFormFieldRow
            label="Licence Number"
            required
            error={errors["driving.licenceNumber"]}
            htmlFor="licenceNumber"
          >
            <Input
              id="licenceNumber"
              value={value.licenceNumber ?? ""}
              onChange={(event) => set("licenceNumber", event.target.value)}
              placeholder="e.g. JOHNS801234SM9XY"
              className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
            />
          </StaffFormFieldRow>

          <div className="flex items-center gap-3">
            <Checkbox
              id="drivesForWork"
              checked={value.drivesForWork}
              onCheckedChange={(checked) =>
                set("drivesForWork", checked === true)
              }
            />
            <label
              htmlFor="drivesForWork"
              className="cursor-pointer text-sm text-cf-ink"
            >
              Will drive for work between visits
            </label>
          </div>
        </>
      )}

      <StaffFormFieldRow
        label="Usual Travel Mode"
        required={value.hasLicence}
        error={errors["driving.travelMode"]}
        htmlFor="travelMode"
      >
        <Select
          value={value.travelMode}
          onValueChange={(next) =>
            set("travelMode", (next ?? "") as TravelMode)
          }
        >
          <SelectTrigger
            id="travelMode"
            className="w-full border-cf-border bg-cf-surface-inset text-cf-ink"
          >
            <SelectValue placeholder="How do they usually travel to visits?" />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {(Object.entries(TRAVEL_MODE_LABELS) as [TravelMode, string][]).map(
              ([option, label]) => (
                <SelectItem key={option} value={option}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </StaffFormFieldRow>
    </>
  );
}
