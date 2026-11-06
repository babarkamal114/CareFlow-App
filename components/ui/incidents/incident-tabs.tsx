'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { Incident } from 'types';
import { getIncidentEvidenceCount, getIncidentInjuryCount, INCIDENT_TABS } from 'utils';
import { IncidentOverviewTab } from './incident-overview-tab';
import { IncidentInjuriesTab } from './incident-injuries-tab';
import { IncidentResponseTab } from './incident-response-tab';
import { IncidentInvestigationTab } from './incident-investigation-tab';
import { IncidentEvidenceTab } from './incident-evidence-tab';

interface IncidentTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  incident: Incident;
}

export function IncidentTabs({
  selectedTab,
  onTabChange,
  incident,
}: IncidentTabsProps) {
  const counts: Record<string, number> = {
    injuries: getIncidentInjuryCount(incident),
    evidence: getIncidentEvidenceCount(incident),
  };

  return (
    <Tabs value={selectedTab} onValueChange={onTabChange} className="h-full w-full">
      <div className="border-b border-cf-border px-6">
        <TabsList className="w-auto justify-start rounded-none bg-transparent">
          {INCIDENT_TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-brand-500"
            >
              {tab.label}
              {counts[tab.value] ? ` (${counts[tab.value]})` : ''}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="overview" className="p-6">
        <IncidentOverviewTab incident={incident} />
      </TabsContent>
      <TabsContent value="injuries" className="p-6">
        <IncidentInjuriesTab incident={incident} />
      </TabsContent>
      <TabsContent value="response" className="p-6">
        <IncidentResponseTab incident={incident} />
      </TabsContent>
      <TabsContent value="investigation" className="p-6">
        <IncidentInvestigationTab incident={incident} />
      </TabsContent>
      <TabsContent value="evidence" className="p-6">
        <IncidentEvidenceTab incident={incident} />
      </TabsContent>
    </Tabs>
  );
}