"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui";
import type { LiveActivityFilterKey, LiveActivityFilterTabsProps } from "types";

export function LiveActivityFilterTabs({ filters, value, onChange }: LiveActivityFilterTabsProps) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as LiveActivityFilterKey)}>
      <TabsList>
        {filters.map((f) => (
          <TabsTrigger key={f.key} value={f.key}>
            {f.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
