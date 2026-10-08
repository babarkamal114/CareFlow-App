"use client";

import { Badge, Button } from "@/components/ui";
import { BellRing, FilePlus } from "lucide-react";

interface FinanceHeaderSectionProps {
  overdueCount: number;
  onGenerate: () => void;
  onSendReminders: () => void;
}

export function FinanceHeaderSection({ overdueCount, onGenerate, onSendReminders }: FinanceHeaderSectionProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-cf-border-light pb-4">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-cf-ink md:text-4xl">Finance</h1>
        <p className="mt-1 text-sm text-cf-ink-60">Invoicing, payments and profitability</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onSendReminders} disabled={overdueCount === 0}>
          <BellRing />
          Send reminders
          {overdueCount > 0 && (
            <Badge variant="softDanger" shape="pill" badgeSize="sm">
              {overdueCount}
            </Badge>
          )}
        </Button>
        <Button onClick={onGenerate}>
          <FilePlus />
          Generate invoices
        </Button>
      </div>
    </div>
  );
}