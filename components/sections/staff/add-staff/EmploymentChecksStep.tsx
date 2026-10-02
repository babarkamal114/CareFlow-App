"use client";

import { Input, Label, Checkbox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ui-components";
import { Upload } from "lucide-react";
import { FieldRow, SectionLabel } from "./AddStaffFormPrimitives";
import { ROLE_LABELS, EMPLOYMENT_LABELS, REF_LABELS } from "./types";
import type { EmploymentInfo, StaffRole, EmploymentType, RefRelationship } from "./types";

interface Props {
  data: EmploymentInfo;
  onChange: (d: EmploymentInfo) => void;
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
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => onChange(e.target.files?.[0]?.name ?? "")}
      />
    </label>
  );
}

export function EmploymentChecksStep({ data, onChange }: Props) {
  const set =
    (key: keyof EmploymentInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...data, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <SectionLabel>Employment Details</SectionLabel>

      <div className="space-y-4">
        <FieldRow label="Role" required>
          <Select value={data.role} onValueChange={(v) => onChange({ ...data, role: v as StaffRole })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(ROLE_LABELS) as [StaffRole, string][]).map(([val, label]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>

        <FieldRow label="Start Date" required>
          <Input type="date" value={data.startDate} onChange={set("startDate")} />
        </FieldRow>

        <FieldRow label="Employment Type" required>
          <Select value={data.employmentType} onValueChange={(v) => onChange({ ...data, employmentType: v as EmploymentType })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(EMPLOYMENT_LABELS) as [EmploymentType, string][]).map(([val, label]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldRow>

        <FieldRow label="Hours per Week" optional>
          <Input type="number" min={0} max={168} placeholder="e.g. 40" value={data.hoursPerWeek} onChange={set("hoursPerWeek")} />
        </FieldRow>
      </div>

      <SectionLabel>Pre-Employment Checks</SectionLabel>

      <div className="space-y-4">
        <FieldRow label="Right to Work Documents" required hint="Passport / Visa / Settled Status">
          <div className="flex items-center gap-3">
            <FileUploadButton
              fileName={data.rightToWorkFileName}
              label="Upload Document"
              onChange={(name) => onChange({ ...data, rightToWorkFileName: name })}
            />
            <div className="flex items-center gap-2">
              <Checkbox
                checked={data.rightToWorkVerified}
                onCheckedChange={(checked) => onChange({ ...data, rightToWorkVerified: !!checked })}
              />
              <Label className="text-sm text-muted-foreground">Verified?</Label>
            </div>
          </div>
        </FieldRow>

        <FieldRow label="Overseas Worker?">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox checked={data.isOverseasWorker === true} onCheckedChange={() => onChange({ ...data, isOverseasWorker: true })} />
              <Label className="text-sm">Yes</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={data.isOverseasWorker === false} onCheckedChange={() => onChange({ ...data, isOverseasWorker: false })} />
              <Label className="text-sm">No</Label>
            </div>
          </div>
          {data.isOverseasWorker === true && (
            <div className="mt-3">
              <FileUploadButton
                fileName={data.goodConductFileName}
                label="Upload Good Conduct Certificate"
                onChange={(name) => onChange({ ...data, goodConductFileName: name })}
              />
            </div>
          )}
        </FieldRow>
      </div>

      <SectionLabel>References (Will be obtained during onboarding)</SectionLabel>

      <div className="space-y-4">
        {([1, 2] as const).map((n) => {
          const nameKey = `ref${n}Name` as const;
          const contactKey = `ref${n}Contact` as const;
          const relKey = `ref${n}Relationship` as const;
          return (
            <div key={n} className="rounded-lg border border-border p-4 space-y-3">
              <p className="text-xs font-semibold text-cf-ink">Reference {n}</p>
              <FieldRow label="Name" required>
                <Input placeholder={n === 1 ? "John Smith" : "Jane Doe"} value={data[nameKey]} onChange={set(nameKey)} />
              </FieldRow>
              <FieldRow label="Contact" required>
                <Input placeholder="Email or phone" value={data[contactKey]} onChange={set(contactKey)} />
              </FieldRow>
              <FieldRow label="Relationship" required>
                <Select value={data[relKey]} onValueChange={(v) => onChange({ ...data, [relKey]: v as RefRelationship })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(REF_LABELS) as [RefRelationship, string][]).map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldRow>
            </div>
          );
        })}
      </div>
    </div>
  );
}
