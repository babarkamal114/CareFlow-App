"use client";

import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Trash2 } from "lucide-react";
import { StaffFormFieldRow } from "./staff-form-field-row";
import { REFEREE_RELATIONSHIP_LABELS } from "types";
import type {
  Referee,
  RefereeRelationship,
  StaffFormErrors,
} from "types";

export function StaffRefereeFields({
  referee,
  index,
  errors,
  onChange,
  onRemove,
}: {
  referee: Referee;
  index: number;
  errors: StaffFormErrors;
  onChange: (referee: Referee) => void;
  onRemove: () => void;
}) {
  const set = <K extends keyof Referee>(key: K, next: Referee[K]) => {
    onChange({ ...referee, [key]: next });
  };

  const id = (field: string) => `referee${field}-${index}`;
  const error = (field: string) => errors[`referees.${index}.${field}`];

  return (
    <div className="space-y-4 rounded-lg border border-cf-border bg-cf-surface-inset/40 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-cf-ink">
          Referee {index + 1}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StaffFormFieldRow
          label="Name"
          required
          error={error("name")}
          htmlFor={id("Name")}
        >
          <Input
            id={id("Name")}
            value={referee.name}
            onChange={(event) => set("name", event.target.value)}
            className="border-cf-border bg-cf-surface text-cf-ink placeholder:text-cf-ink-40"
          />
        </StaffFormFieldRow>

        <StaffFormFieldRow
          label="Role"
          required
          error={error("role")}
          htmlFor={id("Role")}
        >
          <Input
            id={id("Role")}
            value={referee.role}
            onChange={(event) => set("role", event.target.value)}
            placeholder="e.g. Registered Manager"
            className="border-cf-border bg-cf-surface text-cf-ink placeholder:text-cf-ink-40"
          />
        </StaffFormFieldRow>
      </div>

      <StaffFormFieldRow
        label="Organisation"
        required
        error={error("organisation")}
        htmlFor={id("Org")}
      >
        <Input
          id={id("Org")}
          value={referee.organisation}
          onChange={(event) => set("organisation", event.target.value)}
          className="border-cf-border bg-cf-surface text-cf-ink placeholder:text-cf-ink-40"
        />
      </StaffFormFieldRow>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StaffFormFieldRow
          label="Phone"
          required
          error={error("phone")}
          htmlFor={id("Phone")}
        >
          <Input
            id={id("Phone")}
            type="tel"
            value={referee.phone}
            onChange={(event) => set("phone", event.target.value)}
            className="border-cf-border bg-cf-surface text-cf-ink placeholder:text-cf-ink-40"
          />
        </StaffFormFieldRow>

        <StaffFormFieldRow
          label="Email"
          required
          error={error("email")}
          htmlFor={id("Email")}
        >
          <Input
            id={id("Email")}
            type="email"
            value={referee.email}
            onChange={(event) => set("email", event.target.value)}
            className="border-cf-border bg-cf-surface text-cf-ink placeholder:text-cf-ink-40"
          />
        </StaffFormFieldRow>
      </div>

      <StaffFormFieldRow
        label="Relationship"
        required
        error={error("relationship")}
        htmlFor={id("Relationship")}
      >
        <Select
          value={referee.relationship}
          onValueChange={(next) =>
            set("relationship", (next ?? "other") as RefereeRelationship)
          }
        >
          <SelectTrigger
            id={id("Relationship")}
            className="w-full border-cf-border bg-cf-surface text-cf-ink"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {(Object.entries(REFEREE_RELATIONSHIP_LABELS) as [
              RefereeRelationship,
              string,
            ][]).map(([option, label]) => (
              <SelectItem key={option} value={option}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </StaffFormFieldRow>

      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Checkbox
            id={id("Received")}
            checked={referee.referenceReceived}
            onCheckedChange={(checked) =>
              set("referenceReceived", checked === true)
            }
          />
          <label
            htmlFor={id("Received")}
            className="cursor-pointer text-sm text-cf-ink"
          >
            Reference received and satisfactory
          </label>
        </div>
        {error("referenceReceived") && (
          <p className="pl-7 text-xs text-destructive">
            {error("referenceReceived")}
          </p>
        )}
      </div>
    </div>
  );
}
