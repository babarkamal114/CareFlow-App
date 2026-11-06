"use client";

import { Input } from "@/components/ui";
import { StaffFormFieldRow } from "./staff-form-field-row";
import type {
  EmergencyContact,
  StaffFormErrors,
} from "types";

export function StaffEmergencyContactFields({
  contact,
  errors,
  onChange,
}: {
  contact: EmergencyContact;
  errors: StaffFormErrors;
  onChange: (contact: EmergencyContact) => void;
}) {
  const set =
    (key: keyof EmergencyContact) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...contact, [key]: event.target.value });
    };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StaffFormFieldRow
          label="Name"
          required
          error={errors["emergencyContact.name"]}
          htmlFor="emergencyName"
        >
          <Input
            id="emergencyName"
            value={contact.name}
            onChange={set("name")}
            placeholder="John Johnson"
            className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
          />
        </StaffFormFieldRow>

        <StaffFormFieldRow
          label="Relationship"
          required
          error={errors["emergencyContact.relationship"]}
          htmlFor="emergencyRelationship"
        >
          <Input
            id="emergencyRelationship"
            value={contact.relationship}
            onChange={set("relationship")}
            placeholder="Partner"
            className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
          />
        </StaffFormFieldRow>
      </div>

      <StaffFormFieldRow
        label="Phone"
        required
        error={errors["emergencyContact.phone"]}
        htmlFor="emergencyPhone"
      >
        <Input
          id="emergencyPhone"
          type="tel"
          value={contact.phone}
          onChange={set("phone")}
          placeholder="07987 654321"
          className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
        />
      </StaffFormFieldRow>
    </>
  );
}
