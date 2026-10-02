"use client";

import { Button, Input } from "@/components/ui";
import { Trash2 } from "lucide-react";
import { StaffFormFieldRow } from "./staff-form-field-row";
import { StaffFormFileUpload } from "./staff-form-file-upload";
import type {
  Qualification,
  StaffFormErrors,
} from "types";

export function StaffQualificationFields({
  qualification,
  index,
  errors,
  onChange,
  onRemove,
}: {
  qualification: Qualification;
  index: number;
  errors: StaffFormErrors;
  onChange: (qualification: Qualification) => void;
  onRemove: () => void;
}) {
  const set = <K extends keyof Qualification>(
    key: K,
    next: Qualification[K]
  ) => {
    onChange({ ...qualification, [key]: next });
  };

  const id = (field: string) => `qualification${field}-${index}`;
  const error = (field: string) => errors[`qualifications.${index}.${field}`];

  return (
    <div className="space-y-4 rounded-lg border border-cf-border bg-cf-surface-inset/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-cf-ink">
          Qualification {index + 1}
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

      <StaffFormFieldRow
        label="Name"
        required
        error={error("name")}
        htmlFor={id("Name")}
      >
        <Input
          id={id("Name")}
          value={qualification.name}
          onChange={(event) => set("name", event.target.value)}
          placeholder="e.g. NVQ Level 2 in Adult Care"
          className="border-cf-border bg-cf-surface text-cf-ink placeholder:text-cf-ink-40"
        />
      </StaffFormFieldRow>

      <StaffFormFieldRow
        label="Awarded Date"
        required
        error={error("awardedDate")}
        htmlFor={id("Awarded")}
      >
        <Input
          id={id("Awarded")}
          type="date"
          value={qualification.awardedDate}
          onChange={(event) => set("awardedDate", event.target.value)}
          className="border-cf-border bg-cf-surface text-cf-ink"
        />
      </StaffFormFieldRow>

      <StaffFormFieldRow label="Certificate" optional>
        <StaffFormFileUpload
          id={id("Cert")}
          label="Upload certificate"
          url={qualification.certificateUrl}
          onSelect={(file) =>
            set("certificateUrl", URL.createObjectURL(file))
          }
          onClear={() => set("certificateUrl", undefined)}
        />
      </StaffFormFieldRow>
    </div>
  );
}
