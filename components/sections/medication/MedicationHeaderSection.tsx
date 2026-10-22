"use client";

import { Badge, Button } from "@/components/ui";
import { BellRing, Plus } from "lucide-react";

interface MedicationHeaderSectionProps { urgentCount: number; onAdd: () => void; onViewAlerts: () => void }

export function MedicationHeaderSection({ urgentCount, onAdd, onViewAlerts }: MedicationHeaderSectionProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-cf-border-light pb-4">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-cf-ink md:text-4xl">Medications</h1>
        <p className="mt-1 text-sm text-cf-ink-60">Electronic medication administration record (eMAR)</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onViewAlerts}>
          <BellRing />
          Alerts
          {urgentCount > 0 && <Badge variant="softDanger" shape="pill" badgeSize="sm">{urgentCount}</Badge>}
        </Button>
        <Button onClick={onAdd}><Plus />Add medication</Button>
      </div>
    </div>
  );
}
