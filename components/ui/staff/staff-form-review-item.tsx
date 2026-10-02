"use client";

export function StaffFormReviewItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="w-44 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-cf-ink">
        {value ?? "—"}
      </span>
    </div>
  );
}
