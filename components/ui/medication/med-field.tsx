import { Label } from "@/components/ui";
import type { ReactNode } from "react";

interface MedFieldProps { label: string; htmlFor?: string; required?: boolean; error?: string; hint?: string; children: ReactNode }

export function MedField({ label, htmlFor, required, error, hint, children }: MedFieldProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <Label htmlFor={htmlFor} className="text-sm font-medium text-cf-ink">
          {label}{required && <span className="ml-0.5 text-error">*</span>}
        </Label>
      )}
      {children}
      {error ? <p role="alert" className="text-xs text-error">{error}</p> : hint ? <p className="text-xs text-cf-ink-60">{hint}</p> : null}
    </div>
  );
}
