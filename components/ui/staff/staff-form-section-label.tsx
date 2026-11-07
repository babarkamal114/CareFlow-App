"use client";

import { Separator } from "@/components/ui";
import type { StaffFormSectionLabelProps } from "types";

export function StaffFormSectionLabel({
  children,
}: StaffFormSectionLabelProps) {
  return (
    <div className="space-y-2 pt-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {children}
      </p>
      <Separator />
    </div>
  );
}
