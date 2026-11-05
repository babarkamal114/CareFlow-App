"use client";

import { Button, PrnFollowUpDialog, PrnRecordDialog, PrnTable, Skeleton } from "@/components/ui";
import { usePrnProtocols } from "hooks"
import { Plus } from "lucide-react";

export function MedicationPrnSection() {
  const p = usePrnProtocols();
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-cf-ink">As-needed (PRN) doses</h2>
          <p className="text-xs text-cf-ink-60">Record why each dose was given, then check how effective it was 30–60 minutes later.</p>
        </div>
        <Button size="sm" onClick={() => p.setRecordOpen(true)} disabled={p.prnMeds.length === 0}><Plus />Record PRN dose</Button>
      </div>
      {p.isLoading ? <Skeleton className="h-56 w-full rounded-xl" /> : <PrnTable rows={p.rows} now={p.now} onFollowUp={p.openFollowUp} />}
      <PrnRecordDialog open={p.recordOpen} onOpenChange={p.setRecordOpen} prnMeds={p.prnMeds} patients={p.patients} now={p.now} getLimits={p.getLimits} isSaving={p.isSavingPrn} onSubmit={p.submitPrn} />
      <PrnFollowUpDialog row={p.followUpRow} now={p.now} isSaving={p.isSavingFollowUp} onClose={p.closeFollowUp} onSubmit={p.submitFollowUp} />
    </div>
  );
}
