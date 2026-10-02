"use client";

import { Separator } from "@/components/ui";

export function StaffFormSectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 pt-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </p>
      <Separator />
    </div>
  );
}
