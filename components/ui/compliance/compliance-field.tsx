import { Label } from "@/components/ui";
import type { ReactNode } from "react";

interface ComplianceFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/** Label + control + error/hint row used by every compliance form. */
export function ComplianceField({ label, htmlFor, required, error, hint, children }: ComplianceFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-cf-ink">
        {label}
        {required && <span className="ml-0.5 text-error">*</span>}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-error">{error}</p>
      ) : hint ? (
        <p className="text-xs text-cf-ink-60">{hint}</p>
      ) : null}
    </div>
  );
}
