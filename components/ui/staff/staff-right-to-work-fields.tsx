"use client";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { StaffFormFieldRow } from "./staff-form-field-row";
import { StaffFormFileUpload } from "./staff-form-file-upload";
import { RTW_CHECK_TYPE_LABELS } from "types";
import type {
  RtwCheckType,
  RtwSection,
  StaffFormErrors,
} from "types";

const DOCUMENT_TYPE_OPTIONS = [
  { value: "passport", label: "Passport" },
  { value: "share_code", label: "Share Code" },
  { value: "biometric_residence", label: "Biometric Residence Permit" },
  { value: "birth_certificate", label: "UK Birth Certificate" },
  { value: "immigration_document", label: "Immigration Document" },
  { value: "other", label: "Other" },
];

export function StaffRightToWorkFields({
  value,
  errors,
  onChange,
}: {
  value: RtwSection;
  errors: StaffFormErrors;
  onChange: (value: RtwSection) => void;
}) {
  const set = <K extends keyof RtwSection>(key: K, next: RtwSection[K]) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <>
      <StaffFormFieldRow
        label="Check Type"
        required
        error={errors["rightToWork.checkType"]}
        htmlFor="rtwCheckType"
      >
        <Select
          value={value.checkType}
          onValueChange={(next) =>
            set("checkType", (next ?? "") as RtwCheckType)
          }
        >
          <SelectTrigger
            id="rtwCheckType"
            className="w-full border-cf-border bg-cf-surface-inset text-cf-ink"
          >
            <SelectValue placeholder="How was the check carried out?" />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {(Object.entries(RTW_CHECK_TYPE_LABELS) as [
              RtwCheckType,
              string,
            ][]).map(([option, label]) => (
              <SelectItem key={option} value={option}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </StaffFormFieldRow>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StaffFormFieldRow
          label="Check Date"
          required
          error={errors["rightToWork.checkDate"]}
          htmlFor="rtwCheckDate"
        >
          <Input
            id="rtwCheckDate"
            type="date"
            value={value.checkDate}
            onChange={(event) => set("checkDate", event.target.value)}
            className="border-cf-border bg-cf-surface-inset text-cf-ink"
          />
        </StaffFormFieldRow>

        <StaffFormFieldRow
          label="Follow Up Check Date"
          optional
          hint="For time-limited permission, when the check must be repeated."
          htmlFor="rtwFollowUp"
        >
          <Input
            id="rtwFollowUp"
            type="date"
            value={value.followUpCheckDate ?? ""}
            onChange={(event) =>
              set("followUpCheckDate", event.target.value)
            }
            className="border-cf-border bg-cf-surface-inset text-cf-ink"
          />
        </StaffFormFieldRow>
      </div>

      <StaffFormFieldRow
        label="Document Type"
        required
        error={errors["rightToWork.documentType"]}
        htmlFor="rtwDocumentType"
      >
        <Select
          value={value.documentType}
          onValueChange={(next) => set("documentType", next ?? "")}
        >
          <SelectTrigger
            id="rtwDocumentType"
            className="w-full border-cf-border bg-cf-surface-inset text-cf-ink"
          >
            <SelectValue placeholder="Select document seen" />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {DOCUMENT_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </StaffFormFieldRow>

      {value.documentType === "passport" && (
        <StaffFormFieldRow
          label="Document Expiry Date"
          required
          error={errors["rightToWork.documentExpiryDate"]}
          htmlFor="rtwExpiry"
        >
          <Input
            id="rtwExpiry"
            type="date"
            value={value.documentExpiryDate ?? ""}
            onChange={(event) =>
              set("documentExpiryDate", event.target.value)
            }
            className="border-cf-border bg-cf-surface-inset text-cf-ink"
          />
        </StaffFormFieldRow>
      )}

      <StaffFormFieldRow label="Evidence" optional>
        <StaffFormFileUpload
          id="rtwEvidence"
          label="Upload evidence"
          hint="Photo or scan of the document checked."
          url={value.evidenceUrl}
          onSelect={(file) => set("evidenceUrl", URL.createObjectURL(file))}
          onClear={() => set("evidenceUrl", "")}
        />
      </StaffFormFieldRow>
    </>
  );
}
