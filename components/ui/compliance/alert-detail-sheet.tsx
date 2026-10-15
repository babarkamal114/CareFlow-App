"use client";

import { Badge, Button, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui";
import { CheckCircle2, ExternalLink } from "lucide-react";
import type { ComplianceAlert } from "types";
import { ALERT_SEVERITY_CONFIG, ALERT_TYPE_LABEL } from "utils";

interface AlertDetailSheetProps {
  alert: ComplianceAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: (id: string) => void;
  onGoTo: (alert: ComplianceAlert) => void;
}

export function AlertDetailSheet({ alert, open, onOpenChange, onResolve, onGoTo }: AlertDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 p-0 sm:max-w-md">
        {alert && (
          <>
            <SheetHeader className="border-b border-cf-border-light px-6 py-5">
              <div className="flex items-center gap-2 pr-8">
                <SheetTitle className="text-base font-bold text-cf-ink">{alert.title}</SheetTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={ALERT_SEVERITY_CONFIG[alert.severity].badge} shape="pill" badgeSize="sm">
                  {ALERT_SEVERITY_CONFIG[alert.severity].label}
                </Badge>
                <Badge variant="pastel-neutral" shape="pill" badgeSize="sm">{ALERT_TYPE_LABEL[alert.type]}</Badge>
              </div>
              <SheetDescription className="text-cf-ink-60">{alert.description}</SheetDescription>
            </SheetHeader>

            <dl className="flex-1 space-y-4 px-6 py-5">
              {alert.assignedTo && <Row label="Assigned to" value={alert.assignedTo} />}
              {alert.dueLabel && <Row label="Due" value={alert.dueLabel} />}
              <Row label="Where to fix it" value="Open the related page to action this alert, then mark it resolved." />
            </dl>

            <div className="flex gap-2 border-t border-cf-border-light p-4">
              <Button variant="outline" className="flex-1" onClick={() => onGoTo(alert)}><ExternalLink />Go to page</Button>
              <Button className="flex-1" onClick={() => onResolve(alert.id)}><CheckCircle2 />Mark resolved</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-bold tracking-[0.06em] text-cf-ink-40 uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm text-cf-ink">{value}</dd>
    </div>
  );
}
