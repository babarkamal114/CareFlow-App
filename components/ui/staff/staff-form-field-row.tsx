"use client";

import { Label } from "@/components/ui";

export function StaffFormFieldRow({
  label,
  required,
  optional,
  hint,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-cf-ink">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
        {optional && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (Optional)
          </span>
        )}
      </Label>
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
