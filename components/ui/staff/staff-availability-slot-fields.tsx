"use client";

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Trash2 } from "lucide-react";
import { StaffFormFieldRow } from "./staff-form-field-row";
import { DAY_LABELS, DAY_OF_WEEK_OPTIONS } from "types";
import type {
  AvailabilitySlot,
  DayOfWeek,
  StaffFormErrors,
} from "types";

export function StaffAvailabilitySlotFields({
  slot,
  index,
  errors,
  onChange,
  onRemove,
}: {
  slot: AvailabilitySlot;
  index: number;
  errors: StaffFormErrors;
  onChange: (slot: AvailabilitySlot) => void;
  onRemove: () => void;
}) {
  const set = <K extends keyof AvailabilitySlot>(
    key: K,
    next: AvailabilitySlot[K]
  ) => {
    onChange({ ...slot, [key]: next });
  };

  const id = (field: string) => `slot${field}-${index}`;

  return (
    <div className="space-y-4 rounded-lg border border-cf-border bg-cf-surface-inset/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-cf-ink">
          {DAY_LABELS[slot.day]}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-7 text-xs text-destructive"
        >
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Remove
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StaffFormFieldRow
          label="Day"
          required
          error={errors[`availability.${index}.day`]}
          htmlFor={id("Day")}
        >
          <Select
            value={slot.day}
            onValueChange={(next) =>
              set("day", (next ?? "mon") as DayOfWeek)
            }
          >
            <SelectTrigger
              id={id("Day")}
              className="w-full border-cf-border bg-cf-surface text-cf-ink"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-cf-border bg-cf-surface">
              {DAY_OF_WEEK_OPTIONS.map((day) => (
                <SelectItem key={day} value={day}>
                  {DAY_LABELS[day]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </StaffFormFieldRow>

        <StaffFormFieldRow label="Start Time" required htmlFor={id("Start")}>
          <Input
            id={id("Start")}
            type="time"
            value={slot.startTime}
            onChange={(event) => set("startTime", event.target.value)}
            className="border-cf-border bg-cf-surface text-cf-ink"
          />
        </StaffFormFieldRow>

        <StaffFormFieldRow label="End Time" required htmlFor={id("End")}>
          <Input
            id={id("End")}
            type="time"
            value={slot.endTime}
            onChange={(event) => set("endTime", event.target.value)}
            className="border-cf-border bg-cf-surface text-cf-ink"
          />
        </StaffFormFieldRow>
      </div>

      {errors[`availability.${index}.times`] && (
        <p className="text-xs text-destructive">
          {errors[`availability.${index}.times`]}
        </p>
      )}
    </div>
  );
}
