import { Label } from "@/components/ui";
import type { ReportFieldProps } from "types";

export function ReportField({ label, htmlFor, required, error, hint, children }: ReportFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-cf-ink">{label}{required && <span className="ml-0.5 text-error">*</span>}</Label>
      {children}
      {error ? <p role="alert" className="text-xs text-error">{error}</p> : hint ? <p className="text-xs text-cf-ink-60">{hint}</p> : null}
    </div>
  );
}
