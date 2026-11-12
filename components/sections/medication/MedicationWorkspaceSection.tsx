"use client";

import { DiscontinueDialog } from "ui/medication/discontinue-dialog";
import { MedicationFormDialog } from "ui/medication/medication-form-dialog";
import { useMedicationAlerts } from "hooks";
import { useMedicationProfiles } from "hooks";
import { useRoundRows } from "hooks";
import { Suspense, useMemo, useState } from "react";
import type { MedTab } from "types";
import { summarizeRound } from "app-utils/medication";
import { MedicationDeepLink } from "./MedicationDeepLink";
import { MedicationHeaderSection } from "./MedicationHeaderSection";
import { MedicationStatsSection } from "./MedicationStatsSection";
import { MedicationTabsSection } from "./MedicationTabsSection";

export function MedicationWorkspaceSection() {
  const [tab, setTab] = useState<MedTab>("round");
  const { rows, isLoading } = useRoundRows();
  const alerts = useMedicationAlerts();
  const profiles = useMedicationProfiles();
  const summary = useMemo(() => summarizeRound(rows), [rows]);

  const handleDeepLink = (patientId: string, wantsAdd: boolean) => {
    setTab("profiles");
    profiles.focusPatient(patientId);
    if (wantsAdd) profiles.openAdd(patientId);
  };

  return (
    <>
      <Suspense fallback={null}>
        <MedicationDeepLink onLink={handleDeepLink} />
      </Suspense>

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