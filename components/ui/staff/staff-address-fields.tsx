"use client";

import { Input } from "@/components/ui";
import { StaffFormFieldRow } from "./staff-form-field-row";
import type { Address, StaffFormErrors } from "types";

export function StaffAddressFields({
  address,
  errors,
  onChange,
}: {
  address: Address;
  errors: StaffFormErrors;
  onChange: (address: Address) => void;
}) {
  const set =
    (key: keyof Address) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...address, [key]: event.target.value });
    };

  return (
    <>
      <StaffFormFieldRow
        label="Address Line 1"
        required
        error={errors["address.line1"]}
        htmlFor="addressLine1"
      >
        <Input
          id="addressLine1"
          value={address.line1}
          onChange={set("line1")}
          placeholder="123 Main Street"
          className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
        />
      </StaffFormFieldRow>

      <StaffFormFieldRow label="Address Line 2" optional htmlFor="addressLine2">
        <Input
          id="addressLine2"
          value={address.line2 ?? ""}
          onChange={set("line2")}
          placeholder="Flat 2"
          className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
        />
      </StaffFormFieldRow>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StaffFormFieldRow
          label="City"
          required
          error={errors["address.city"]}
          htmlFor="addressCity"
        >
          <Input
            id="addressCity"
            value={address.city}
            onChange={set("city")}
            placeholder="London"
            className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
          />
        </StaffFormFieldRow>

        <StaffFormFieldRow
          label="Postcode"
          required
          error={errors["address.postcode"]}
          htmlFor="addressPostcode"
        >
          <Input
            id="addressPostcode"
            value={address.postcode}
            onChange={set("postcode")}
            placeholder="SW1A 1AA"
            className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
          />
        </StaffFormFieldRow>
      </div>
    </>
  );
}
