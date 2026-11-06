"use client";

import { Badge, Button, Card, CardContent } from "@/components/ui";
import { AlertTriangle, ClipboardCheck } from "lucide-react";
import type { ControlledItem } from "types";
import { formatMedDateTime, getDrugLabel } from "utils";

interface ControlledStockCardProps { item: ControlledItem; now: Date; onRecord: (medicationId: string) => void }

export function ControlledStockCard({ item, now, onRecord }: ControlledStockCardProps) {
  const { stock, medication, patient, discrepancy } = item;
  return (
    <Card className="rounded-2xl border-cf-border-light shadow-cf-sm">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-cf-ink">{getDrugLabel(medication)}</p>
            <p className="text-xs text-cf-ink-60">{patient.name}</p>
          </div>
          <Badge variant="pastel-purple" shape="pill" badgeSize="sm">Schedule {medication.schedule}</Badge>
        </div>
        <div>
          <p className="font-heading text-3xl font-bold text-cf-ink">{stock.balance}<span className="ml-1 text-sm font-medium text-cf-ink-60">{stock.unit}</span></p>
          <p className="text-xs text-cf-ink-60">Recorded balance · last check {formatMedDateTime(stock.lastCheckedAt, now)} by {stock.lastCheckedBy}</p>
        </div>
        {discrepancy !== 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-error/20 bg-error-muted p-2.5 text-xs">
            <AlertTriangle className="mt-0.5 size-3.5 flex-shrink-0 text-error" />
            <span className="text-cf-ink"><strong className="text-error">Discrepancy:</strong> recorded {stock.balance}, counted {stock.lastPhysicalCount}. Investigate and reconcile.</span>
          </div>
        )}
        <Button variant="outline" size="sm" className="w-full" onClick={() => onRecord(medication.id)}><ClipboardCheck />Record entry</Button>
      </CardContent>
    </Card>
  );
}
