import type { ReactNode } from "react";

export function ReportsSectionHeading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="font-heading text-xl font-semibold text-cf-ink">{title}</h2>
        <p className="text-sm text-cf-ink-60">{description}</p>
      </div>
      {action}
    </div>
  );
}
