"use client";

import { Button, MedicationRoundFilters, MedicationRoundTable, RecordDoseDialog, Skeleton } from "@/components/ui";
import { useMedicationRound } from "hooks"
import { Download } from "lucide-react";

export function MedicationRoundSection() {
  const r = useMedicationRound();
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <MedicationRoundFilters filters={r.filters} patients={r.patients} onChange={r.setFilters} onReset={r.resetFilters} />
        <Button variant="outline" size="sm" onClick={r.exportRound}><Download />Export</Button>
      </div>
      {r.isLoading ? <Skeleton className="h-72 w-full rounded-xl" /> : <MedicationRoundTable rows={r.filtered} now={r.now} onRecord={r.openRecord} />}
      <RecordDoseDialog row={r.target} now={r.now} recorder={r.currentUser} isSaving={r.isSaving} onClose={r.closeRecord} onSubmit={r.submit} />
    </div>
  );
}
