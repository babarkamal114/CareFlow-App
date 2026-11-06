"use client";

import { Checkbox, Input } from "@/components/ui";
import {
  StaffAddressFields,
  StaffEmergencyContactFields,
  StaffFormErrorBanner,
  StaffFormFieldRow,
  StaffFormFileUpload,
  StaffFormSectionLabel,
} from "@/components/ui";
import type { StaffFormData, StaffFormErrors } from "types";

interface Props {
  data: StaffFormData;
  errors: StaffFormErrors;
  onChange: (data: StaffFormData) => void;
}

export function PersonalSection({ data, errors, onChange }: Props) {
  const setField = <K extends keyof StaffFormData>(key: K, value: StaffFormData[K]) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <StaffFormErrorBanner errors={errors} />

      <StaffFormSectionLabel>Personal Details</StaffFormSectionLabel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          id="firstName"
          label="First Name"
          required
          error={errors.firstName}
          value={data.firstName}
          placeholder="e.g. Sarah"
          onChange={(value) => setField("firstName", value)}
        />
        <TextField
          id="lastName"
          label="Last Name"
          required
          error={errors.lastName}
          value={data.lastName}
          placeholder="e.g. Johnson"
          onChange={(value) => setField("lastName", value)}
        />
      </div>

      <TextField
        id="preferredName"
        label="Preferred Name"
        optional
        hint="Used on rotas and in the family portal."
        value={data.preferredName ?? ""}
        placeholder="e.g. Sanjay"
        onChange={(value) => setField("preferredName", value)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          id="dateOfBirth"
          label="Date of Birth"
          required
          type="date"
          error={errors.dateOfBirth}
          value={data.dateOfBirth}
          onChange={(value) => setField("dateOfBirth", value)}
        />
        <TextField
          id="niNumber"
          label="National Insurance Number"
          required
          error={errors.nationalInsuranceNumber}
          value={data.nationalInsuranceNumber}
          placeholder="AB123456C"
          onChange={(value) => setField("nationalInsuranceNumber", value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          id="phone"
          label="Phone"
          required
          type="tel"
          error={errors.phone}
          value={data.phone}
          placeholder="07123 456789"
          onChange={(value) => setField("phone", value)}
        />
        <TextField
          id="email"
          label="Email"
          required
          type="email"
          error={errors.email}
          value={data.email}
          placeholder="sarah@example.com"
          onChange={(value) => setField("email", value)}
        />
      </div>

      <StaffFormSectionLabel>Address</StaffFormSectionLabel>
      <StaffAddressFields
        address={data.address}
        errors={errors}
        onChange={(address) => onChange({ ...data, address })}
      />

      <StaffFormSectionLabel>Emergency Contact</StaffFormSectionLabel>
      <StaffEmergencyContactFields
        contact={data.emergencyContact}
        errors={errors}
        onChange={(emergencyContact) => onChange({ ...data, emergencyContact })}
      />

      <StaffFormSectionLabel>Photo</StaffFormSectionLabel>

      <StaffFormFileUpload
        id="staffPhoto"
        label="Upload photo"
        hint="A clear head and shoulders photo. JPEG or PNG."
        url={data.photoUrl}
        onSelect={(file) => setField("photoUrl", URL.createObjectURL(file))}
        onClear={() => setField("photoUrl", "")}
      />

      <div className="flex items-start gap-3 rounded-lg border border-border bg-cf-surface-inset px-4 py-3">
        <Checkbox
          id="photoConsent"
          className="mt-0.5"
          checked={data.photoConsentForFamilyPortal}
          onCheckedChange={(checked) =>
            setField("photoConsentForFamilyPortal", checked === true)
          }
        />
        <label htmlFor="photoConsent" className="cursor-pointer text-sm text-cf-ink">
          Show this photo in the family portal
          <span className="mt-0.5 block text-xs text-muted-foreground">
            Relatives of the people this staff member supports will be able to
            see their photo alongside visit records.
          </span>
        </label>
      </div>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  required,
  optional,
  error,
  hint,
  placeholder,
  type = "text",
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <StaffFormFieldRow
      label={label}
      required={required}
      optional={optional}
      error={error}
      hint={hint}
      htmlFor={id}
    >
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
      />
    </StaffFormFieldRow>
  );
}
