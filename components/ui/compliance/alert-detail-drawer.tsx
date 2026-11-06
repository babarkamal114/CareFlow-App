"use client";

import {
  Badge,
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui";
import { CheckCircle2, ExternalLink } from "lucide-react";
import type { ComplianceAlert } from "types";
import { ALERT_SEVERITY_CONFIG, ALERT_TYPE_LABEL } from "app-utils/compliance-display";

interface AlertDetailDrawerProps {
  alert: ComplianceAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: (id: string) => void;
  onGoTo: (alert: ComplianceAlert) => void;
}

export function AlertDetailDrawer({ alert, open, onOpenChange, onResolve, onGoTo }: AlertDetailDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent className="sm:mx-auto sm:max-w-md">
        {alert && (
          <>
            <DrawerHeader className="gap-2 border-b border-cf-border-light px-6 pt-2 pb-5 text-left">
              <DrawerTitle className="text-base font-bold text-cf-ink">{alert.title}</DrawerTitle>
              <div className="flex items-center gap-2">
                <Badge variant={ALERT_SEVERITY_CONFIG[alert.severity].badge} shape="pill" badgeSize="sm">
                  {ALERT_SEVERITY_CONFIG[alert.severity].label}
                </Badge>
                <Badge variant="pastel-neutral" shape="pill" badgeSize="sm">{ALERT_TYPE_LABEL[alert.type]}</Badge>
              </div>
              <DrawerDescription className="text-left text-cf-ink-60">{alert.description}</DrawerDescription>
            </DrawerHeader>

            {/* min-h-0 + flex-1 + overflow-y-auto is what makes the body scroll inside the drawer */}
            <dl className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-5">
              {alert.assignedTo && <Row label="Assigned to" value={alert.assignedTo} />}
              {alert.dueLabel && <Row label="Due" value={alert.dueLabel} />}
              <Row label="Where to fix it" value="Open the related page to action this alert, then mark it resolved." />
            </dl>

            <DrawerFooter className="flex-row gap-2 border-t border-cf-border-light pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button variant="outline" className="flex-1" onClick={() => onGoTo(alert)}>
                <ExternalLink />Go to page
              </Button>
              <Button className="flex-1" onClick={() => onResolve(alert.id)}>
                <CheckCircle2 />Mark resolved
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
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