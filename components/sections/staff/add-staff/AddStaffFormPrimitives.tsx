"use client";

import { Label, Separator } from "ui-components";
import { cn } from "lib";

export function StepDots({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            n === current
              ? "w-5 bg-primary"
              : n < current
              ? "w-3 bg-primary/35"
              : "w-3 bg-border"
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
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-cf-ink">
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

export function ReviewItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="w-40 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-cf-ink">{value ?? "—"}</span>
    </div>
  );
}
