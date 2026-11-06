"use client";

import { Checkbox, Input } from "@/components/ui";
import { StaffFormFieldRow } from "./staff-form-field-row";
import type {
  InterimCertificate,
  StaffFormErrors,
} from "types";

export const EMPTY_INTERIM_CERTIFICATE: InterimCertificate = {
  certificateNumber: "",
  issueDate: "",
  updateServiceConsent: false,
  originalSeenInPerson: false,
  statusCheckResult: "current",
  statusCheckDate: "",
};

export function StaffInterimCertificateFields({
  value,
  errors,
  onChange,
}: {
  value: InterimCertificate;
  errors: StaffFormErrors;
  onChange: (value: InterimCertificate) => void;
}) {
  const set = <K extends keyof InterimCertificate>(
    key: K,
    next: InterimCertificate[K]
  ) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <div className="space-y-4 rounded-lg border border-cf-border bg-cf-surface-inset/60 p-4">
      <p className="text-sm font-semibold text-cf-ink">Interim Certificate</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StaffFormFieldRow
          label="Certificate Number"
          required
          error={errors["dbs.interimCertificate.certificateNumber"]}
          htmlFor="interimNumber"
        >
          <Input
            id="interimNumber"
            value={value.certificateNumber}
            onChange={(event) => set("certificateNumber", event.target.value)}
            className="border-cf-border bg-cf-surface text-cf-ink placeholder:text-cf-ink-40"
          />
        </StaffFormFieldRow>

        <StaffFormFieldRow
          label="Issue Date"
          required
          error={errors["dbs.interimCertificate.issueDate"]}
          htmlFor="interimIssue"
        >
          <Input
            id="interimIssue"
            type="date"
            value={value.issueDate}
            onChange={(event) => set("issueDate", event.target.value)}
            className="border-cf-border bg-cf-surface text-cf-ink"
          />
        </StaffFormFieldRow>
      </div>

      <StaffFormFieldRow
        label="Status Check Date"
        required
        error={errors["dbs.interimCertificate.statusCheckDate"]}
        htmlFor="interimStatusCheck"
      >
        <Input
          id="interimStatusCheck"
          type="date"
          value={value.statusCheckDate}
          onChange={(event) => set("statusCheckDate", event.target.value)}
          className="border-cf-border bg-cf-surface text-cf-ink"
        />
      </StaffFormFieldRow>

      <div className="space-y-2">
        <Checkbox
          id="interimConsent"
          checked={value.updateServiceConsent}
          onCheckedChange={(checked) =>
            set("updateServiceConsent", checked === true)
          }
        />
        <label
          htmlFor="interimConsent"
          className="cursor-pointer text-sm text-cf-ink"
        >
          Consent to register for DBS Update Service notifications
          {errors["dbs.interimCertificate.updateServiceConsent"] && (
            <span className="mt-0.5 block text-xs text-destructive">
              {errors["dbs.interimCertificate.updateServiceConsent"]}
            </span>
          )}
        </label>
      </div>

      <div className="space-y-2">
        <Checkbox
          id="interimOriginalSeen"
          checked={value.originalSeenInPerson}
          onCheckedChange={(checked) =>
            set("originalSeenInPerson", checked === true)
          }
        />
        <label
          htmlFor="interimOriginalSeen"
          className="cursor-pointer text-sm text-cf-ink"
        >
          Original document seen in person
        </label>
      </div>
    </div>
  );
}
