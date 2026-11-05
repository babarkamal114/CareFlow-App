"use client";

import { Button, EmptyState, MedAlertRow, MedFilterPill, Skeleton } from "@/components/ui";
import type { useMedicationAlerts } from "hooks"
import { CheckCircle2 } from "lucide-react";
import type { MedAlert, MedAlertSeverity, MedTab } from "types";
import { ALERT_SEVERITY_CONFIG } from "utils";

type Alerts = ReturnType<typeof useMedicationAlerts>;
const FILTERS: (MedAlertSeverity | "all")[] = ["all", "urgent", "warning", "info"];

interface MedicationAlertsSectionProps { alerts: Alerts; onGoToTab: (tab: MedTab) => void }

/** Missed doses, omission escalation, interactions, medication changes, PRN checks and stock discrepancies. */
export function MedicationAlertsSection({ alerts: a, onGoToTab }: MedicationAlertsSectionProps) {
  if (a.isLoading) return <Skeleton className="h-64 w-full rounded-xl" />;
  const count = (s: MedAlertSeverity | "all") => (s === "all" ? a.alerts.length : a.alerts.filter((x) => x.severity === s).length);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter alerts">
          {FILTERS.map((f) => (
            <MedFilterPill key={f} label={f === "all" ? "All" : ALERT_SEVERITY_CONFIG[f].label} count={count(f)} active={a.severity === f}
              tone={f === "all" ? "success" : ALERT_SEVERITY_CONFIG[f].tone} onClick={() => a.setSeverity(f)} />
          ))}
        </div>
        {a.acknowledgedCount > 0 && <Button variant="ghost" size="sm" onClick={a.restoreAcknowledged}>Show {a.acknowledgedCount} acknowledged</Button>}
      </div>

      {a.visible.length === 0 ? (
        <EmptyState icon={<CheckCircle2 />} title="All clear" description="No open medication alerts. Missed doses, interactions and PRN checks appear here." />
      ) : (
        <div className="space-y-3">
          {a.visible.map((alert: MedAlert) => (
            <MedAlertRow key={alert.id} alert={alert} patientName={a.patientName(alert.patientId)} onAction={(x) => onGoToTab(x.targetTab)} onAcknowledge={a.acknowledge} />
          ))}
        </div>
      )}
    </div>
  );
}
