"use client";

import { Button, Card, CardContent, CardHeader, CardTitle, ControlledEntryDialog, ControlledLedgerTable, ControlledStockCard, Skeleton } from "@/components/ui";
import { useControlledDrugs} from "hooks"
import { Download } from "lucide-react";

export function MedicationControlledSection() {
  const c = useControlledDrugs();
  if (c.isLoading) return <Skeleton className="h-72 w-full rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-cf-ink-60">Every administration, receipt, disposal and stock check needs a second witness.</p>
        <Button variant="outline" size="sm" onClick={c.exportLedger}><Download />Export ledger</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {c.items.map((item) => <ControlledStockCard key={item.medication.id} item={item} now={c.now} onRecord={c.openEntry} />)}
      </div>

      <Card className="rounded-2xl border-cf-border-light shadow-cf-sm">
        <CardHeader><CardTitle className="font-bold text-cf-ink">Ledger</CardTitle></CardHeader>
        <CardContent><ControlledLedgerTable entries={c.entries} medications={c.medications} patients={c.patients} now={c.now} /></CardContent>
      </Card>

      <ControlledEntryDialog item={c.target} recorder={c.currentUser} isSaving={c.isSaving} onClose={c.closeEntry} onSubmit={c.submit} />
    </div>
  );
}
