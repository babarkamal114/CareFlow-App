"use client";

import { DiscontinueDialog, MedicationFormDialog } from "@/components/ui";
import { useMedicationAlerts } from "hooks"
import { useMedicationProfiles } from "hooks"
import { useRoundRows } from "hooks"
import { useMemo, useState } from "react";
import type { MedTab } from "types";
import { summarizeRound } from "utils";
import { MedicationHeaderSection } from "./MedicationHeaderSection";
import { MedicationStatsSection } from "./MedicationStatsSection";
import { MedicationTabsSection } from "./MedicationTabsSection";

export function MedicationWorkspaceSection() {
  const [tab, setTab] = useState<MedTab>("round");
  const { rows, isLoading } = useRoundRows();
  const alerts = useMedicationAlerts();
  const profiles = useMedicationProfiles();
  const summary = useMemo(() => summarizeRound(rows), [rows]);

  return (
    <>
      <MedicationHeaderSection
        urgentCount={alerts.urgentCount}
        onAdd={() => { setTab("profiles"); profiles.openAdd(); }}
        onViewAlerts={() => setTab("alerts")}
      />
      <MedicationStatsSection summary={summary} escalationCount={alerts.escalationCount} isLoading={isLoading} />
      <MedicationTabsSection tab={tab} onTabChange={setTab} attentionCount={summary.missed + summary.due} alerts={alerts} profiles={profiles} />

      <MedicationFormDialog
        open={profiles.form.open} onOpenChange={(open) => !open && profiles.closeForm()} medication={profiles.form.medication}
        initialPatientId={profiles.form.patientId} patients={profiles.patients} medications={profiles.medications} rules={profiles.rules}
        allergyAliases={profiles.allergyAliases} isSaving={profiles.isSaving} onSubmit={profiles.save}
      />
      <DiscontinueDialog medication={profiles.discontinueTarget} isLoading={profiles.isDiscontinuing} onClose={() => profiles.askDiscontinue(null)} onConfirm={profiles.confirmDiscontinue} />
    </>
  );
}
