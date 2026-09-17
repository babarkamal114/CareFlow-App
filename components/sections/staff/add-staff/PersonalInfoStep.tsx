"use client";

import { Input } from "ui-components";
import { FieldRow } from "./AddStaffFormPrimitives";
import type { PersonalInfo } from "./types";

interface Props {
  data: PersonalInfo;
  onChange: (d: PersonalInfo) => void;
}

export function PersonalInfoStep({ data, onChange }: Props) {
  const set =
    (key: keyof PersonalInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...data, [key]: e.target.value });

  return (
    <div className="space-y-4">
      <FieldRow label="Full Name" required>
        <Input placeholder="e.g. Sarah Johnson" value={data.fullName} onChange={set("fullName")} />
      </FieldRow>

      <FieldRow label="Email" required>
        <Input type="email" placeholder="sarah@example.com" value={data.email} onChange={set("email")} />
      </FieldRow>

      <FieldRow label="Phone Number" required>
        <Input type="tel" placeholder="07123 456789" value={data.phone} onChange={set("phone")} />
      </FieldRow>

      <FieldRow label="Date of Birth" required>
        <Input type="date" value={data.dateOfBirth} onChange={set("dateOfBirth")} />
      </FieldRow>

      <FieldRow label="Address" required>
        <Input placeholder="123 Main St, London" value={data.address} onChange={set("address")} />
      </FieldRow>

      <FieldRow label="National Insurance Number" optional>
        <Input placeholder="AB 12 34 56 C" value={data.niNumber} onChange={set("niNumber")} />
      </FieldRow>

      <div className="grid grid-cols-2 gap-4">
        <FieldRow label="Emergency Contact Name" required>
          <Input
            placeholder="John Johnson"
            value={data.emergencyContactName}
            onChange={set("emergencyContactName")}
          />
        </FieldRow>
        <FieldRow label="Emergency Contact Phone" required>
          <Input
            type="tel"
            placeholder="07987 654321"
            value={data.emergencyContactPhone}
            onChange={set("emergencyContactPhone")}
          />
        </FieldRow>
      </div>
    </div>
  );
}
