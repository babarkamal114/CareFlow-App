"use client";

import { Label, Checkbox } from "@/components/ui";
import { Upload } from "lucide-react";
import { ConfigField, FieldRow, SectionLabel } from "./AddStaffFormPrimitives";
import {
  ADD_STAFF_OVERSEAS_OPTIONS,
  ADD_STAFF_UPLOAD_ACCEPT,
  EMPLOYMENT_CHECKS_COPY,
  EMPLOYMENT_DETAIL_FIELDS,
  EMPLOYMENT_SECTION_TITLES,
  REFERENCE_SLOTS,
  getReferenceFields,
  setAddStaffTextField,
  type AddStaffEmploymentInfo,
  type AddStaffEmploymentTextKey,
} from "utils";

interface Props {
  data: AddStaffEmploymentInfo;
  onChange: (d: AddStaffEmploymentInfo) => void;
}

function FileUploadButton({
  fileName,
  label,
  onChange,
}: {
  fileName: string;
  label: string;
  onChange: (name: string) => void;
}) {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted">
      <Upload className="h-4 w-4" />
      {fileName || label}
      <input
        type="file"
        className="sr-only"
        accept={ADD_STAFF_UPLOAD_ACCEPT}
        onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
      />
    </label>
  );
}

export function EmploymentChecksStep({ data, onChange }: Props) {
  const handleFieldChange = (key: AddStaffEmploymentTextKey, value: string) =>
    onChange(setAddStaffTextField(data, key, value));

  const { rightToWork, overseas } = EMPLOYMENT_CHECKS_COPY;

  return (
    <div className="space-y-6">
      <SectionLabel>{EMPLOYMENT_SECTION_TITLES.details}</SectionLabel>

      <div className="space-y-4">
        {EMPLOYMENT_DETAIL_FIELDS.map((field) => (
          <ConfigField
            key={field.key}
            field={field}
            value={data[field.key]}
            onChange={handleFieldChange}
          />
        ))}
      </div>

      <SectionLabel>{EMPLOYMENT_SECTION_TITLES.checks}</SectionLabel>

      <div className="space-y-4">
        <FieldRow label={rightToWork.label} required hint={rightToWork.hint}>
          <div className="flex items-center gap-3">
            <FileUploadButton
              fileName={data.rightToWorkFileName}
              label={rightToWork.uploadLabel}
              onChange={(name) => onChange({ ...data, rightToWorkFileName: name })}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                checked={data.rightToWorkVerified}
                onCheckedChange={(checked) => onChange({ ...data, rightToWorkVerified: !!checked })}
              />
              <Label className="text-sm text-muted-foreground">{rightToWork.verifiedLabel}</Label>
            </div>
          </div>
        </FieldRow>

        <FieldRow label={overseas.label}>
          <div className="flex items-center gap-6">
            {ADD_STAFF_OVERSEAS_OPTIONS.map((option) => (
              <div key={option.label} className="flex items-center gap-2">
                <Checkbox
                  checked={data.isOverseasWorker === option.value}
                  onCheckedChange={() => onChange({ ...data, isOverseasWorker: option.value })}
                />
                <Label className="text-sm">{option.label}</Label>
              </div>
            ))}
          </div>
          {data.isOverseasWorker === true && (
            <div className="mt-3">
              <FileUploadButton
                fileName={data.goodConductFileName}
                label={overseas.uploadLabel}
                onChange={(name) => onChange({ ...data, goodConductFileName: name })}
              />
            </div>
          )}
        </FieldRow>
      </div>

      <SectionLabel>{EMPLOYMENT_SECTION_TITLES.references}</SectionLabel>

      <div className="space-y-4">
        {REFERENCE_SLOTS.map((slot) => (
          <div key={slot} className="space-y-3 rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-foreground">Reference {slot}</p>
            {getReferenceFields(slot).map((field) => (
              <ConfigField
                key={field.key}
                field={field}
                value={data[field.key]}
                onChange={handleFieldChange}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}