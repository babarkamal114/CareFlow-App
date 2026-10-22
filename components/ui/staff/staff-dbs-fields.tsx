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
import { StaffFormFieldRow } from "./staff-form-field-row";
import { StaffFormFileUpload } from "./staff-form-file-upload";
import { StaffInterimCertificateFields } from "./staff-interim-certificate-fields";
import { EMPTY_INTERIM_CERTIFICATE } from "./staff-interim-certificate-fields";
import { DBS_PATH_LABELS, DBS_STATUS_LABELS } from "types";
import type {
  DbsPath,
  DbsSection,
  DbsStatus,
  StaffFormErrors,
} from "types";

export function StaffDbsFields({
  value,
  errors,
  onChange,
}: {
  value: DbsSection;
  errors: StaffFormErrors;
  onChange: (value: DbsSection) => void;
}) {
  const set = <K extends keyof DbsSection>(key: K, next: DbsSection[K]) => {
    onChange({ ...value, [key]: next });
  };

  const interim = value.interimCertificate ?? EMPTY_INTERIM_CERTIFICATE;

  return (
    <>
      <StaffFormFieldRow
        label="Route"
        required
        error={errors["dbs.path"]}
        htmlFor="dbsPath"
      >
        <Select
          value={value.path}
          onValueChange={(next) => set("path", (next ?? "") as DbsPath)}
        >
          <SelectTrigger
            id="dbsPath"
            className="w-full border-cf-border bg-cf-surface-inset text-cf-ink"
          >
            <SelectValue placeholder="New application or existing certificate" />
          </SelectTrigger>
          <SelectContent className="border-cf-border bg-cf-surface">
            {(Object.entries(DBS_PATH_LABELS) as [DbsPath, string][]).map(
              ([option, label]) => (
                <SelectItem key={option} value={option}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </StaffFormFieldRow>

      {value.path === "new_application" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StaffFormFieldRow
            label="Application Reference"
            required
            error={errors["dbs.applicationReference"]}
            htmlFor="dbsApplicationRef"
          >
            <Input
              id="dbsApplicationRef"
              value={value.applicationReference ?? ""}
              onChange={(event) =>
                set("applicationReference", event.target.value)
              }
              placeholder="e.g. 001622339231"
              className="border-cf-border bg-cf-surface-inset text-cf-ink placeholder:text-cf-ink-40"
            />
          </StaffFormFieldRow>

          <StaffFormFieldRow
            label="Submitted Date"
            required
            error={errors["dbs.submittedDate"]}
            htmlFor="dbsSubmitted"
          >
            <Input
              id="dbsSubmitted"
              type="date"
              value={value.submittedDate ?? ""}
              onChange={(event) => set("submittedDate", event.target.value)}
              className="border-cf-border bg-cf-surface-inset text-cf-ink"
            />
          </StaffFormFieldRow>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StaffFormFieldRow
          label="Status"
          required
          error={errors["dbs.status"]}
          htmlFor="dbsStatus"
        >
          <Select
            value={value.status}
            onValueChange={(next) =>
              set("status", (next ?? "") as DbsStatus)
            }
          >
            <SelectTrigger
              id="dbsStatus"
              className="w-full border-cf-border bg-cf-surface-inset text-cf-ink"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="border-cf-border bg-cf-surface">
              {(Object.entries(DBS_STATUS_LABELS) as [DbsStatus, string][]).map(
                ([option, label]) => (
                  <SelectItem key={option} value={option}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </StaffFormFieldRow>

        <StaffFormFieldRow
          label="Certificate Expiry Date"
          required={value.path === "existing_certificate"}
          error={errors["dbs.expiryDate"]}
          htmlFor="dbsExpiry"
        >
          <Input
            id="dbsExpiry"
            type="date"
            value={value.expiryDate}
            onChange={(event) => set("expiryDate", event.target.value)}
            className="border-cf-border bg-cf-surface-inset text-cf-ink"
          />
        </StaffFormFieldRow>
      </div>

      {value.status === "temporarily_verified" &&
        (value.interimCertificate ? (
          <StaffInterimCertificateFields
            value={value.interimCertificate}
            errors={errors}
            onChange={(next) => set("interimCertificate", next)}
          />
        ) : (
          <StaffFormFieldRow
            label="Interim Certificate"
            required
            error={errors["dbs.interimCertificate"]}
          >
            <Button
              type="button"
              onClick={() => set("interimCertificate", { ...interim })}
              className="rounded-lg border border-dashed border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              + Add interim certificate details
            </Button>
          </StaffFormFieldRow>
        ))}

      <StaffFormFieldRow label="Certificate" optional>
        <StaffFormFileUpload
          id="dbsCertificate"
          label="Upload certificate"
          url={value.certificateUrl}
          onSelect={(file) => set("certificateUrl", URL.createObjectURL(file))}
          onClear={() => set("certificateUrl", "")}
        />
      </StaffFormFieldRow>
    </>
  );
}
