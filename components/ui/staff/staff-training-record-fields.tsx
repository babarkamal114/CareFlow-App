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
import { StaffFormFileUpload } from "./staff-form-file-upload";
import {
  MANDATORY_TRAINING_MODULES,
  TRAINING_STATUS_LABELS,
} from "types";
import type {
  StaffFormErrors,
  TrainingRecord,
  TrainingStatus,
} from "types";

export function StaffTrainingRecordFields({
  record,
  index,
  errors,
  onChange,
  onRemove,
}: {
  record: TrainingRecord;
  index: number;
  errors: StaffFormErrors;
  onChange: (record: TrainingRecord) => void;
  onRemove: () => void;
}) {
  const set = <K extends keyof TrainingRecord>(
    key: K,
    next: TrainingRecord[K]
  ) => {
    onChange({ ...record, [key]: next });
  };

  const id = (field: string) => `training${field}-${index}`;
  const error = (field: string) => errors[`mandatoryTraining.${index}.${field}`];

  return (
    <div className="space-y-4 rounded-lg border border-cf-border bg-cf-surface-inset/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-cf-ink">
          Module {index + 1}
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
        label="Module"
        required
        error={error("module")}
        htmlFor={id("Module")}
      >
        <Select
          value={record.module}
          onValueChange={(next) => set("module", next ?? "")}
        >
          <SelectTrigger
            id={id("Module")}
            className="w-full border-cf-border bg-cf-surface text-cf-ink"
          >
            <SelectValue placeholder="Select module" />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {MANDATORY_TRAINING_MODULES.map((module) => (
              <SelectItem key={module} value={module}>
                {module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </StaffFormFieldRow>

      <StaffFormFieldRow
        label="Status"
        required
        error={error("status")}
        htmlFor={id("Status")}
      >
        <Select
          value={record.status}
          onValueChange={(next) =>
            set("status", (next ?? "not_started") as TrainingStatus)
          }
        >
          <SelectTrigger
            id={id("Status")}
            className="w-full border-cf-border bg-cf-surface text-cf-ink"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {(Object.entries(TRAINING_STATUS_LABELS) as [
              TrainingStatus,
              string,
            ][]).map(([option, label]) => (
              <SelectItem key={option} value={option}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </StaffFormFieldRow>

      {record.status === "completed" && (
        <StaffFormFieldRow
          label="Completed Date"
          required
          error={error("completedDate")}
          htmlFor={id("Completed")}
        >
          <Input
            id={id("Completed")}
            type="date"
            value={record.completedDate ?? ""}
            onChange={(event) => set("completedDate", event.target.value)}
            className="border-cf-border bg-cf-surface text-cf-ink"
          />
        </StaffFormFieldRow>
      )}

      <StaffFormFieldRow
        label="Expiry Date"
        optional
        hint="Leave blank if the certificate does not expire."
        htmlFor={id("Expiry")}
      >
        <Input
          id={id("Expiry")}
          type="date"
          value={record.expiryDate ?? ""}
          onChange={(event) => set("expiryDate", event.target.value)}
          className="border-cf-border bg-cf-surface text-cf-ink"
        />
      </StaffFormFieldRow>

      <StaffFormFieldRow label="Certificate" optional>
        <StaffFormFileUpload
          id={id("Cert")}
          label="Upload certificate"
          url={record.certificateUrl}
          onSelect={(file) => set("certificateUrl", URL.createObjectURL(file))}
          onClear={() => set("certificateUrl", undefined)}
        />
      </StaffFormFieldRow>
    </div>
  );
}
