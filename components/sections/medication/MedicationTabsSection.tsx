"use client";

import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import type { useMedicationAlerts } from "hooks"
import type { useMedicationProfiles } from "hooks"
import { BarChart3, BellRing, ClipboardList, Lock, Pill, Stethoscope } from "lucide-react";
import type { MedTab } from "types";
import { MedicationAlertsSection } from "./MedicationAlertsSection";
import { MedicationAuditSection } from "./MedicationAuditSection";
import { MedicationControlledSection } from "./MedicationControlledSection";
import { MedicationPrnSection } from "./MedicationPrnSection";
import { MedicationProfilesSection } from "./MedicationProfilesSection";
import { MedicationRoundSection } from "./MedicationRoundSection";

const TABS = [
  { id: "round", label: "Today's round", Icon: ClipboardList },
  { id: "profiles", label: "Profiles", Icon: Pill },
  { id: "prn", label: "PRN", Icon: Stethoscope },
  { id: "alerts", label: "Alerts", Icon: BellRing },
  { id: "audit", label: "Audit", Icon: BarChart3 },
  { id: "controlled", label: "Controlled drugs", Icon: Lock },
] as const;

interface MedicationTabsSectionProps {
  tab: MedTab; onTabChange: (tab: MedTab) => void; attentionCount: number;
  alerts: ReturnType<typeof useMedicationAlerts>; profiles: ReturnType<typeof useMedicationProfiles>;
}

export function MedicationTabsSection({ tab, onTabChange, attentionCount, alerts, profiles }: MedicationTabsSectionProps) {
  return (
    <Tabs value={tab} onValueChange={(v) => onTabChange(v as MedTab)} className="gap-4">
      <TabsList variant="line" className="w-full justify-start border-b border-cf-border-light pb-1">
        {TABS.map(({ id, label, Icon }) => (
          <TabsTrigger key={id} value={id} className="flex-none px-3">
            <Icon />{label}
            {id === "round" && attentionCount > 0 && <Badge variant="softDanger" shape="pill" badgeSize="sm">{attentionCount}</Badge>}
            {id === "alerts" && alerts.alerts.length > 0 && <Badge variant={alerts.urgentCount > 0 ? "softDanger" : "softWarning"} shape="pill" badgeSize="sm">{alerts.alerts.length}</Badge>}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="round"><MedicationRoundSection /></TabsContent>
      <TabsContent value="profiles"><MedicationProfilesSection profiles={profiles} /></TabsContent>
      <TabsContent value="prn"><MedicationPrnSection /></TabsContent>
      <TabsContent value="alerts"><MedicationAlertsSection alerts={alerts} onGoToTab={onTabChange} /></TabsContent>
      <TabsContent value="audit"><MedicationAuditSection /></TabsContent>
      <TabsContent value="controlled"><MedicationControlledSection /></TabsContent>
    </Tabs>
  );
}
