"use client";

import {
  Input,
  Label,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { cn } from "lib";
import {
  ADD_STAFF_STEP_NUMBERS,
  getStepDotClass,
  type AddStaffField,
} from "utils";

export function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {ADD_STAFF_STEP_NUMBERS.map((n) => (
        <div
          key={n}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            getStepDotClass(n, current),
          )}
        />
      ))}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-2 pt-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </p>
      <Separator />
    </div>
  );
}

export function FieldRow({
  label,
  required,
  optional,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
        {optional && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">(Optional)</span>
        )}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ConfigField<K extends string>({
  field,
  value,
  onChange,
}: {
  field: AddStaffField<K>;
  value: string;
  onChange: (key: K, value: string) => void;
}) {
  const inputId = `add-staff-${field.key}`;

  return (
    <FieldRow
      label={field.label}
      required={field.required}
      optional={field.optional}
      hint={field.hint}
      htmlFor={field.kind === "input" ? inputId : undefined}
    >
      {field.kind === "select" ? (
        <Select value={value} onValueChange={(v) => onChange(field.key, v as string)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={inputId}
          type={field.type}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      )}
    </FieldRow>
  );
}

export function ReviewItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="w-40 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value ?? "—"}</span>
    </div>
  );
}