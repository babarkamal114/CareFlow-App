"use client";

import { Badge, Button } from "@/components/ui";
import type { MedAlert } from "types";
import { ALERT_ACTION_LABEL, ALERT_KIND_LABEL, ALERT_SEVERITY_CONFIG, MED_TONE_PANEL } from "utils";

interface MedAlertRowProps { alert: MedAlert; patientName: string; onAction: (alert: MedAlert) => void; onAcknowledge: (id: string) => void }

export function MedAlertRow({ alert, patientName, onAction, onAcknowledge }: MedAlertRowProps) {
  const sev = ALERT_SEVERITY_CONFIG[alert.severity];
  return (
    <div className={`rounded-xl border p-4 ${MED_TONE_PANEL[sev.tone]}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge variant={sev.badge} shape="pill" badgeSize="sm">{sev.label}</Badge>
            <Badge variant="pastel-neutral" shape="pill" badgeSize="sm">{ALERT_KIND_LABEL[alert.kind]}</Badge>
          </div>
          <p className="text-sm font-semibold text-cf-ink">{alert.title}</p>
          <p className="mt-0.5 text-xs text-cf-ink-60">{alert.description}</p>
          <span className="sr-only">Patient: {patientName}</span>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Button size="sm" onClick={() => onAction(alert)}>{ALERT_ACTION_LABEL[alert.kind]}</Button>
          <Button size="sm" variant="outline" onClick={() => onAcknowledge(alert.id)}>Acknowledge</Button>
        </div>
      </div>
    </div>
  );
}
