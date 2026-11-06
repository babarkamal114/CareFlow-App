"use client";

import { useGetAllRolesApi, mapRolesToDisplay } from "lib";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import {
  StaffFormErrorBanner,
  StaffFormFieldRow,
  StaffFormSectionLabel,
} from "@/components/ui";
import type { StaffFormErrors } from "types";
import {
  EMPLOYMENT_TYPE_LABELS,
  PAY_RATE_TYPE_LABELS,
  STAFF_ROLE_LABELS,
  STAFF_ROLE_OPTIONS,
} from "types";
import type {
  EmploymentType,
  PayRateType,
  StaffFormData,
  StaffRole,
} from "types";

interface Props {
  data: StaffFormData;
  errors: StaffFormErrors;
  onChange: (data: StaffFormData) => void;
}

export function EmploymentSection({ data, errors, onChange }: Props) {
  const { data: rolesData, isLoading: rolesLoading } = useGetAllRolesApi();
  const roles = mapRolesToDisplay(rolesData?.roles);

  const setNumberField =
    (key: "contractedHoursPerWeek" | "payRatePerHour") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value;
      onChange({
        ...data,
        [key]: raw === "" ? "" : Number(raw),
      });
    };

  return (
    <div className="space-y-6">
      <StaffFormErrorBanner errors={errors} />

      <StaffFormSectionLabel>Employment Details</StaffFormSectionLabel>

      <StaffFormFieldRow label="Role" required error={errors.role} htmlFor="staffRole">
        <Select
          value={data.role}
          onValueChange={(value) =>
            onChange({ ...data, role: value as StaffRole })
          }
        >
          <SelectTrigger
            id="staffRole"
            className="w-full border-cf-border bg-cf-surface-inset text-cf-ink"
          >
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {STAFF_ROLE_OPTIONS.map((role) => (
              <SelectItem key={role} value={role}>
                {STAFF_ROLE_LABELS[role]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </StaffFormFieldRow>

      <StaffFormFieldRow
        label="Employment Type"
        required
        error={errors.employmentType}
        htmlFor="employmentType"
      >
        <Select
          value={data.employmentType}
          onValueChange={(value) =>
            onChange({ ...data, employmentType: value as EmploymentType })
          }
        >
          <SelectTrigger
            id="employmentType"
            className="w-full border-cf-border bg-cf-surface-inset text-cf-ink"
          >
            <SelectValue placeholder="Select employment type" />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {(Object.entries(EMPLOYMENT_TYPE_LABELS) as [
              EmploymentType,
              string,
            ][]).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </StaffFormFieldRow>

      <StaffFormFieldRow
        label="Start Date"
        required
        error={errors.startDate}
        htmlFor="startDate"
      >
        <Input
          id="startDate"
          type="date"
          value={data.startDate}
          onChange={(event) =>
            onChange({ ...data, startDate: event.target.value })
          }
          className="border-cf-border bg-cf-surface-inset text-cf-ink"
        />
      </StaffFormFieldRow>

      <StaffFormFieldRow
        label="Reporting Manager"
        optional
        error={errors.managerId}
        hint="Who is responsible for supervising and signing off this staff member's practice."
        htmlFor="managerId"
      >
        <Select
          value={data.managerId ?? ""}
          onValueChange={(value) =>
            onChange({ ...data, managerId: value ?? "" })
          }
        >
          <SelectTrigger
            id="managerId"
            className="w-full border-cf-border bg-cf-surface-inset text-cf-ink"
          >
            <SelectValue placeholder="Select a manager" />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {rolesLoading ? (
              <div className="p-2 text-sm text-cf-ink-60">Loading roles...</div>
            ) : roles.length === 0 ? (
              <div className="p-2 text-sm text-cf-ink-60">No roles available</div>
            ) : (
              roles.map((role) => (
                <SelectItem key={role.id} value={role.id ?? ""}>
                  {role.displayName || role.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </StaffFormFieldRow>

      <StaffFormSectionLabel>Contract & Pay</StaffFormSectionLabel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StaffFormFieldRow
          label="Contracted Hours Per Week"
          required
          error={errors.contractedHoursPerWeek}
          htmlFor="contractedHours"
        >
          <Input
            id="contractedHours"
            type="number"
            min={0}
            max={168}
            step={0.5}
            value={data.contractedHoursPerWeek}
            onChange={setNumberField("contractedHoursPerWeek")}
            placeholder="e.g. 37.5"
            className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
          />
        </StaffFormFieldRow>

        <StaffFormFieldRow
          label="Pay Rate Per Hour"
          required
          error={errors.payRatePerHour}
          htmlFor="payRate"
        >
          <Input
            id="payRate"
            type="number"
            min={0}
            step={0.01}
            value={data.payRatePerHour}
            onChange={setNumberField("payRatePerHour")}
            placeholder="e.g. 13.50"
            className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
          />
        </StaffFormFieldRow>
      </div>

      <StaffFormFieldRow
        label="Pay Rate Type"
        required
        error={errors.payRateType}
        hint="Which rate this hourly pay figure represents."
        htmlFor="payRateType"
      >
        <Select
          value={data.payRateType}
          onValueChange={(value) =>
            onChange({ ...data, payRateType: value as PayRateType })
          }
        >
          <SelectTrigger
            id="payRateType"
            className="w-full border-cf-border bg-cf-surface-inset text-cf-ink"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {(Object.entries(PAY_RATE_TYPE_LABELS) as [
              PayRateType,
              string,
            ][]).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </StaffFormFieldRow>
    </div>
  );
}
